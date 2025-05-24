import TextareaAutosize from "react-textarea-autosize";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
  onSend: (message: string) => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  setInputMessage,
  inputMessage,
  disabled,
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSend(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <TextareaAutosize
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a question..."
        maxRows={4}
        className={`flex-1 resize-none rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3b4dd1] disabled:cursor-not-allowed disabled:focus:ring-0 disabled:bg-gray-200 disabled:text-gray-500`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        disabled={!disabled}
      />

      <button
        type="submit"
        disabled={!disabled}
        className={`p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          !disabled
            ? "bg-[#324095] text-white cursor-not-allowed opacity-70"
            : "bg-[#3b4dd1] text-white hover:bg-[#2f3ba6]"
        }`}
      >
        <FiSend className="w-5 h-5" />
      </button>
    </form>
  );
}
