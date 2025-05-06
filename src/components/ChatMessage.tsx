import { motion } from "framer-motion";
import { FiCopy, FiSmile } from "react-icons/fi";
import { TypingIndicator } from "./TypingIndicator";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useState } from "react";
// import TypingEffect from './TypingEffect';
import "./TypingEffect.css";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  animate?: boolean;
  isTyping?: boolean;
}

export function ChatMessage({
  message,
  isBot,
  animate = false,
  isTyping = false,
}: ChatMessageProps) {
  const [cleanHtml, setCleanHtml] = useState<string>("");
  useEffect(() => {
    const renderMarkdown = async () => {
      const rawHtml = await marked.parse(message); // Ensure it's awaited
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setCleanHtml(sanitizedHtml);
    };

    renderMarkdown();
  }, [message]);

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`relative group max-w-[80%] px-4 py-2 rounded-2xl ${
          isBot ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-500 text-white"
        }`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <div
            className="text"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          ></div>
        )}

        {/* <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={copyMessage}>
          <FiCopy className="w-4 h-4" />

          </button>
        </div> */}
      </div>
    </motion.div>
  );
}
