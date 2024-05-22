import React, { useState } from "react";
import { Textarea } from "./chat/chat-textarea"; 

function ChatForm(value:any) {
  const [text, setText] = useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission
    console.log(text);
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="System Prompt"
      />
    </form>
  );
}

export default ChatForm;
