import { motion } from "framer-motion";
import { TypingIndicator } from "./TypingIndicator";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useState } from "react";

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
      </div>
    </motion.div>
  );
}
