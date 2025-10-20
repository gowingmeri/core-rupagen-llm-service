// @/components/ChatHeader.tsx
"use client";
import React from "react";
import ProtectedImage from "@/components/ProtectedImage";

const ChatHeader = () => {
  return (
    <div className="pl-5 pr-5 pb-5 bg-none">
      {/* Image */}
      <ProtectedImage
        src="/favicon/icon.png"
        alt="logo"
        className="h-24 mt-24 mb-3"
      />

      {/* Title */}
      <div className="flex items-end gap-2">
        <p className="text-3xl font-thin text-white">Dino</p>
        <p className="text-white/50 text-xs p-3 border border-white/15 w-fit rounded-r-2xl rounded-tl-2xl">
          Base code of JawirAI & GeekTakon, a community-driven project.
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
