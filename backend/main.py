import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Iterable
import instructor
import openai

# Load the environment variables
try:
    from dotenv import load_dotenv, find_dotenv
    load_dotenv(find_dotenv())
    openai_api_key = os.getenv("OPENAI_API_KEY")
except:
    openai_api_key = os.environ.get('OPENAI_API_KEY')

# Define OpenAI models
model_35 = "gpt-3.5-turbo-1106"
model_4 = "gpt-4-0613"
model_4_preview = "gpt-4-1106-preview"
model_4o = "gpt-4o"

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
print("openapikey")
# Define a data model for chat messages
class ChatMessage(BaseModel):
    message: str

# Healthcheck endpoint
@app.get("/")
async def root():
    return {"message": "healthcheck"}

# Chat endpoint
@app.post("/api/chat")
async def chat(message1: ChatMessage):
    if not message1.message:
        raise HTTPException(status_code=400, detail="Invalid input")

    try:
        system_instruction = """
        You are a helpful assistant. Answer the user's questions and provide assistance as needed.
        """

        user_message = message1.message
        #print(user_message,openai_api_key)

        chat_messages = [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_message},
        ]
        print('chat_messages',chat_messages)

        chat_response = await aclient.chat.completions.create(
            model=model_4o,
            stream=True,
            messages=chat_messages,
        )

        async def generate():
                async for chunk in chat_response:
                    print("Received chunk:", chunk)
                 
                    if chunk.choices[0].delta.content:
                        yield f"data: {chunk.choices[0].delta.content}\n\n"

                yield "data: [DONE]\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        print(e)
        return {"message": "Error"}
