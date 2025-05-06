import { motion } from "framer-motion";
import { FiUpload, FiHelpCircle, FiFileText, FiList } from "react-icons/fi";

interface QuickActionsProps {
  fetchedActions?: string[];
  onSelect: (message: string) => void;
}

export function QuickActions({ onSelect, fetchedActions }: QuickActionsProps) {
  const actions = [
    { icon: <FiUpload />, text: "Upload documents", action: "upload_document" },
    {
      icon: <FiHelpCircle />,
      text: "Question & Answer",
      action: "question_answer",
    },
    { icon: <FiFileText />, text: "Summarize document", action: "summarizer" },
    {
      icon: <FiList />,
      text: "Generate questions",
      action: "generate_questions",
    },
    { icon: <FiList />, text: "Main Menu", action: "main_menu" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {fetchedActions && fetchedActions.length
        ? actions
            .filter((e) => fetchedActions.includes(e.action))
            .map((action, index) => (
              <motion.button
                key={action.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(action.action)}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-blue-500 text-xl">{action.icon}</span>
                <span className="font-medium">{action.text}</span>
              </motion.button>
            ))
        : null}
    </div>
  );
}
