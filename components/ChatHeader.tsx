// @/components/ChatHeader.tsx
"use client";
import React from "react";
import Image from "next/image";

const ChatHeader = () => {
  return (
    <div className="pl-5 pr-5 pb-5 bg-none">
      {/* Image */}
      <Image src="/favicon/icon.png" alt="Logo" width={256} height={256} />

      {/* Title */}
      <div className="flex items-end gap-2">
        <p className="text-3xl font-thin text-black">RupaGen</p>
        <p className="text-black/50 text-xs p-3 border border-black/15 w-fit rounded-r-2xl rounded-tl-2xl">
          Hi! I'm RupaGen, your friendly AI assistant. How can I assist you today?
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
