// @/components/ChatForm.tsx
import { Icon } from "@iconify/react";
import React from "react";

interface ChatFormProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
}
const ChatForm: React.FC<ChatFormProps> = ({
  input,
  setInput,
  handleSend,
  isLoading,
}) => {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) handleSend();
    }
  };

  return (
    <div className="w-full bg-black/5 backdrop-blur border border-white/15 rounded-3xl">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Masukan pesan disini"
        className="bg-transparent text-white/50 rounded-3xl w-full h-20 sm:h-32 p-5 resize-none focus:outline-none"
        disabled={isLoading}
      />

      <div className="flex justify-between items-center border-t border-white/15 p-3 rounded-3xl">
        <p className="text-xs text-white/50">
          ꦠꦏꦺꦴꦁ ꦲꦶꦁꦏꦁ ꦱꦤ꧀ꦠꦸꦤ꧀, Jangan tanya hal2 jomok le, NGUAWORRRR, TAK DUPAK
          RAIMU SISAN!!!!!
        </p>
        <button
          onClick={handleSend}
          className={`p-5 w-[64px] font-semibold rounded-full transition ${
            isLoading
              ? "bg-white/5 text-white cursor-not-allowed"
              : "bg-white/5 text-white"
          }`}
          disabled={isLoading}
        >
          <Icon
            icon={
              isLoading
                ? "line-md:loading-twotone-loop"
                : "line-md:arrow-small-right"
            }
            width="24"
            height="24"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatForm;
