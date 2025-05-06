import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-1 p-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.4,
            delay: dot * 0.1,
          }}
        />
      ))}
    </div>
  );
}
