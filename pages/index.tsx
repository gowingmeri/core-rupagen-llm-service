// @/pages/index.ts
import React, { useState, useEffect } from "react";
import { requestToGroqAI } from "@/services/groqService";
import ChatHeader from "@/components/ChatHeader";
import ChatForm from "@/components/ChatForm";
import ChatHistory from "@/components/ChatHistory";
import ChatFloating from "@/components/ChatFloating";
import Splash from "@/components/Splash";
import Head from "next/head";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatAI: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasHistory, setHasHistory] = useState<boolean>(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      if (saved) {
        const parsedHistory: Message[] = JSON.parse(saved);
        if (Array.isArray(parsedHistory) && parsedHistory.length) {
          setChatHistory(parsedHistory);
          setHasHistory(true);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      setHasHistory(true);
    } else {
      localStorage.removeItem("chatHistory");
      setHasHistory(false);
    }
  }, [chatHistory]);

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || input.length > 500) return;

    const userMsg: Message = { role: "user", content: input };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const aiReply = await requestToGroqAI(updatedHistory);
      const aiMsg: Message = { role: "assistant", content: aiReply };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, an error occurred." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = (): void => setChatHistory([]);

  return (
    <div className="bg-[var(--color-background)] flex justify-center">
      {isSplashLoading ? (
        <Splash />
      ) : (
        <div>
          {/* Chat AI Container */}
          <div className="pt-20 w-full sm:w-[720px]">
            <div className="flex flex-col min-h-screen">
              {" "}
              {!hasHistory ? (
                <>
                  <ChatHeader />
                  <ChatForm
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    isLoading={isLoading}
                  />
                </>
              ) : (
                <ChatFloating
                  input={input}
                  setInput={setInput}
                  handleSend={handleSend}
                  isLoading={isLoading}
                />
              )}
              <ChatHistory
                chatHistory={chatHistory}
                isLoading={isLoading}
                handleClearHistory={handleClearHistory}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAI;
