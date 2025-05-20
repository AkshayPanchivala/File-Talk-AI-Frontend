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
         className={`
          flex-1 resize-none rounded-2xl px-4 py-2
          bg-gray-100 dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:focus:ring-0
          disabled:bg-gray-200 dark:disabled:bg-gray-700
          disabled:text-gray-500 dark:disabled:text-gray-400
          disabled:placeholder-gray-400 dark:disabled:placeholder-gray-500
          disabled:opacity-60 disabled:grayscale
        `}
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
          className={`
          p-3 rounded-full transition-colors
          bg-blue-500 text-white hover:bg-blue-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:bg-gray-300 dark:disabled:bg-gray-600
          disabled:text-gray-500 dark:disabled:text-gray-400
          disabled:cursor-not-allowed disabled:opacity-60 disabled:grayscale
        `}
      >
        <FiSend className="w-5 h-5" />
      </button>
    </form>
  );
}
