import { useEffect, useRef, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ThemeToggle } from "./components/ThemeToggle";
import { QuickActions } from "./components/QuickActions";
import axios from "axios";
// import useApi from './API/Apihandler';
import useAxios from "./API/Apihandler";
import { tr } from "framer-motion/client";
import Loader from "./components/Loader";

interface Message {
  text: string;
  isBot: boolean;
  id: number;
  isTyping?: boolean;
  isInfo: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `**Hello!** Welcome to **File Talk AI**, your intelligent document assistant.

How can I assist you in organizing, analyzing, or processing your documents today? Just ask away, and let’s make document management easier together!
### Please select one of the options below to begin your journey with  **File Talk AI**.
`,
      isBot: true,
      id: 1,
      isInfo: true,
    },
  ]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [fetchedActions, setFetchedActions] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const { request, loading, error } = useAxios();
  const [showInputMessage, setShowInputMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFileUploadeLoading, setIsFileUploadeLoading] = useState(false);

  const fetchOptions = async () => {
    const data = await request("POST", "conversation/options/", {
      startedChatbot: localStorage.getItem("startedChatbot") ? true : false,
    });
    if (data) {
      // console.log('Fetched data:', data);
      setFetchedActions(data.options);
      setShowQuickActions(true);
    }
  };
  const selectedOptionHandler = async (paramsData: any) => {
    const data = await request("POST", "conversation/", {
      documenturl: localStorage.getItem("documenturl")
        ? localStorage.getItem("documenturl")
        : null,
      question: paramsData.question,
      action: paramsData.action,
    });
    if (data) {
      console.log("Fetched data:", data);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === "I'm processing your request 123..."
            ? {
                ...msg,
                isTyping: false,
                text: data.content,
                isBot: true,
                isInfo: true,
              }
            : msg
        )
      );
      fetchOptions();

      // setFetchedActions(data.options);
    }
  };
  useEffect(() => {
    localStorage.removeItem("startedChatbot");
    localStorage.removeItem("documenturl");

    fetchOptions();
  }, [request]);

  const handleSendMessage = (message: string) => {
    setShowQuickActions(false);
    setShowInputMessage(false);
    const botMessageId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { text: message, isBot: false, id: Date.now(), isInfo: false },
      {
        text: "I'm processing your request 123...",
        isBot: true,
        id: botMessageId,
        isTyping: true,
        isInfo: true,
      },
    ]);
    selectedOptionHandler({ question: message, action: "question_answer" });
    // Simulate bot response after 2 seconds
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (messagesEndRef.current && showQuickActions) {
      console.log("messagesEndRef.current", messagesEndRef.current);
      scrollToBottom();
    }
  }, [messages, showQuickActions]);
  // const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  const handleUpload = async (tempFile: any) => {
    console.log("tempFile", tempFile);
    setIsFileUploadeLoading(true);
    const formData = new FormData();
    formData.append("file", tempFile);
    formData.append("upload_preset", "NewDocGPT"); // Replace with your preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ddhrg2lvw/raw/upload",
        formData
      );
      const fileUrl = res.data.secure_url;
      localStorage.setItem("documenturl", fileUrl);
      localStorage.setItem("startedChatbot", "true");
      setMessages((prev) => [
        ...prev,
        {
          text: "Document uploaded successfully!",
          isBot: true,
          id: Date.now(),
          isInfo: true,
        },
      ]);
      fetchOptions();
      setIsFileUploadeLoading(false);

      setShowQuickActions(true);
    } catch (err) {
      console.error("Upload Error", err);
    }
  };

  const handleOptionSelect = (action: string) => {
    console.log("Selected action:", action);
    switch (action) {
      case "upload_document":
        setShowQuickActions(false);
        fileInputRef?.current?.click();
        break;
      case "question_answer":
        setShowQuickActions(false);
        // selectedOptionHandler({question:"",action:"question_answer"});
        setMessages((prev) => [
          ...prev,
          {
            text: `You've selected the **Question & Answer** option! 💬  
Just type your question in the input box, and I'll help you find the best answer. `,
            isBot: false,
            id: Date.now(),
            isInfo: false,
          },
        ]);
        setShowInputMessage(true);

        // handleSendMessage(inputMessage);

        break;
      case "summarizer":
        setShowQuickActions(false);
        setMessages((prev) => [
          ...prev,
          {
            text: `You've selected the **Summarizer** option! 📄✨  
I'm analyzing your uploaded document to provide a concise summary.
`,
            isBot: false,
            id: Date.now(),
            isInfo: false,
          },
          {
            text: "I'm processing your request 123...",
            isBot: true,
            id: Date.now() + 1,
            isTyping: true,
            isInfo: true,
          },
        ]);
        selectedOptionHandler({ action: "summarizer" });
        break;
      case "generate_questions":
        setShowQuickActions(false);
        setMessages((prev) => [
          ...prev,
          {
            text: `You've selected the **Generate Questions** option! ❓🧠  
I'm getting ready to create thoughtful questions based on your content.
`,
            isBot: false,
            id: Date.now(),
            isInfo: false,
          },
          {
            text: "I'm processing your request 123...",
            isBot: true,
            id: Date.now() + 1,
            isTyping: true,
            isInfo: true,
          },
        ]);
        selectedOptionHandler({ action: "generate_questions" });

        // selectedOptionHandler({question:"",action:"question_answer"});
        // setShowInputMessage(true);
        break;
      case "main_menu":
        setShowQuickActions(false);
        setShowInputMessage(false);
        setMessages([
          {
            text: "Hello! How can I help you today?",
            isBot: true,
            id: 1,
            isInfo: true,
          },
        ]);
        localStorage.removeItem("startedChatbot");
        localStorage.removeItem("documenturl");

        fetchOptions();

        break;
    }
  };
  return (
    <div className=" bg-gray-100 dark:bg-gray-900  pt-4 pb-4">
      <div className="h-[calc(100vh-32px)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
        <div className="h-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <header className="flex items-center w-full justify-between px-6 py-4 border-b dark:border-gray-700">
            <h1 className="text-xl font-semibold">File Talk AI</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e: any) => handleUpload(e.target.files[0])}
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  animate={message.isBot && message.isInfo === true}
                  isTyping={message.isTyping}
                />
              ))}
              {showQuickActions && (
                <QuickActions
                  onSelect={handleOptionSelect}
                  fetchedActions={fetchedActions}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t w-full dark:border-gray-700">
            <div className=" ">
              <ChatInput
                onSend={handleSendMessage}
                disabled={showInputMessage}
                setInputMessage={setInputMessage}
                inputMessage={inputMessage}
              />
            </div>
          </div>
        </div>
      </div>
      {isFileUploadeLoading && <Loader />}
    </div>
  );
}

export default App;
