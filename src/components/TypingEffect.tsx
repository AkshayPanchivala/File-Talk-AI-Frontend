// TypingEffect.tsx
import { useEffect, useState } from "react";
import "./TypingEffect.css"; // Ensure this has your .typing-effect styles

interface TypingEffectProps {
  text: string;
  delay?: number;
}

export default function TypingEffect({ text, delay = 0 }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(typingInterval);
        setTimeout(() => setShowCursor(false), 500); // Hide cursor after typing
      }
    }, 30); // Adjust speed here

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <div
      className={`typing-effect ${!showCursor ? "no-cursor" : ""}`}
      dangerouslySetInnerHTML={{ __html: displayedText }}
    >
      {displayedText}
    </div>
  );
}
