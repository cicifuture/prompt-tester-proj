import React, { useState } from "react";
import { useChat } from "ai/react";
import ChatInput from "../../ui/chat/chat-input";
import ChatMessages from "../../ui/chat/chat-messages";
import { Textarea } from "../../ui/chat/chat-textarea";
import { Input } from "@/components/ui/input"
import { Tooltip } from 'react-tooltip'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function ChatSection() {
  const [text, setText] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);

  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      systemPrompt: text,
      temperature,
      max_tokens: maxTokens,
    },
    onError: (error: unknown) => {
      console.log(error);
      if (!(error instanceof Error)) throw error;
      const message = JSON.parse(error.message);
      alert(message.detail);
    },
  });

  return (
    <div className="flex h-full w-full px-4">
      <div className="flex md:flex-row flex-col w-full h-full space-x-2">
        {/* First Column */}
        <div className="flex md:flex-col flex-row py-6 h-full  md:w-2/12 w-full">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="System Prompt"
          />
        </div>
        {/* Second Column */}
        <div className="flex flex-col space-y-4 py-6 h-full md:w-7/12 w-full  ">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
          />
          <ChatInput
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            multiModal={true}
          />
        </div>
        {/* Third Column */}
        <div className="flex flex-col md:py-6 h-full space-y-4 py-16  ">
          <div className="mt-4 mb-8 ml-4">
          <a className="my-anchor-element">‿◕</a>
          <Tooltip anchorSelect=".my-anchor-element" place="top">Controls the randomness of the model's output. Lower values make the output more focused and deterministic.</Tooltip>
            <label htmlFor="temperature">Temperature:</label>
            <Input
              type="range"
              id="temperature"
              min="0"
              max="1"
              step="0.01"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />
            <span >{temperature}</span>
            <Tooltip  />
          </div>
          <div className="mt-4 mb-8 ml-4">
          <a className="my-tokens">◕‿</a>
         
            <label htmlFor="maxTokens">Max Tokens:</label>
            <Tooltip anchorSelect=".my-tokens" place="top">The maximum number of tokens to generate. Higher values allow longer responses.</Tooltip>
            <Input
              type="number"
              id="maxTokens"
              min="1"
              max="4096"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-full "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
