import os
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any, Dict, Optional, Tuple
import openai
import json
import instructor
from aiostream import stream

# Models for request and response
class _Message(BaseModel):
    role: str
    content: str

class _ChatData(BaseModel):
    messages: List[_Message]

class _SourceNodes(BaseModel):
    id: str
    metadata: Dict[str, Any]
    score: Optional[float]
    text: str

    @classmethod
    def from_source_node(cls, source_node):
        return cls(
            id=source_node.node_id,
            metadata=source_node.metadata,
            score=source_node.score,
            text=source_node.text,
        )

    @classmethod
    def from_source_nodes(cls, source_nodes):
        return [cls.from_source_node(node) for node in source_nodes]

# Load the environment variables
try:
    from dotenv import load_dotenv, find_dotenv
    load_dotenv(find_dotenv())
    openai_api_key = os.getenv("NEXT_PUBLIC_API_KEY")
except:
    openai_api_key = os.environ.get('NEXT_PUBLIC_API_KEY')

# Define OpenAI models
model_4o = "gpt-3.5-turbo-0613"

# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Patch the OpenAI client with instructor
aclient = instructor.patch(openai.AsyncClient(api_key=openai_api_key), mode=instructor.Mode.FUNCTIONS)

# Healthcheck endpoint
@app.get("/")
async def root():
    return {"message": "healthcheck"}

async def parse_chat_data(data: _ChatData) -> Tuple[str, List[_Message]]:
    if len(data.messages) == 0:
        raise HTTPException(status_code=400, detail="No messages provided")

    last_message = data.messages.pop()
    if last_message.role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from user")

    return last_message.content, data.messages

# Chat endpoint
@app.post("/api/chat")
async def chat(request: Request, data: _ChatData):
    last_message_content, messages = await parse_chat_data(data)
    requestJSON = await request.json()
    
    system_prompt = requestJSON.get("systemPrompt", "")
    temperature = requestJSON.get("temperature", 0.7)
    max_tokens = requestJSON.get("max_tokens", 150)
    
    print(system_prompt)
    print(temperature)
    print(max_tokens)

    try:
        system_instruction = system_prompt

        chat_messages = [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": last_message_content},
        ]

        print(chat_messages)

        chat_response = await aclient.chat.completions.create(
            model=model_4o,
            stream=True,
            messages=chat_messages,
            temperature=temperature,
            max_tokens=max_tokens
        )

        async def content_generator():
            try:
                # Yield the text response
                collected_text = ""
                print("chat_response:", chat_response, '\n\n')
                async for chunk in chat_response:
                    print("Received chunk:", chunk, '\n\n')
                    if chunk.choices[0].delta and chunk.choices[0].delta.content:
                        collected_text += chunk.choices[0].delta.content
                        yield VercelStreamResponse.convert_text(chunk.choices[0].delta.content)

                # Indicate end of stream
                yield VercelStreamResponse.convert_data({"type": "done"})
            except Exception as e:
                error_message = {
                    "type": "error",
                    "data": {"message": str(e)}
                }
                yield VercelStreamResponse.convert_data(error_message)

        return StreamingResponse(content_generator(), media_type="text/event-stream")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

class VercelStreamResponse(StreamingResponse):
    """
    Class to convert the response from the chat engine to the streaming format expected by Vercel
    """

    TEXT_PREFIX = "0:"
    DATA_PREFIX = "8:"

    @classmethod
    def convert_text(cls, token: str):
        # Escape newlines and double quotes to avoid breaking the stream
        token = json.dumps(token)
        return f"{cls.TEXT_PREFIX}{token}\n"

    @classmethod
    def convert_data(cls, data: dict):
        data_str = json.dumps(data)
        return f"{cls.DATA_PREFIX}[{data_str}]\n"
