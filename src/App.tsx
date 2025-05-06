import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { ThemeToggle } from "./components/ThemeToggle";
import { QuickActions } from "./components/QuickActions";
import axios from "axios";
import useAxios from "./API/Apihandler";
import Loader from "./components/Loader";
import {
  generateQuestionsMessage,
  initialMessage,
  processingMessage,
  questionAnswerMessage,
  summaryMessage,
} from "./constant";

interface Message {
  text: string;
  isBot: boolean;
  id: number;
  isTyping?: boolean;
  isInfo: boolean;
}

function App() {
  const fileInputRef = useRef<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: initialMessage,
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
      setFetchedActions(data.options);
      setShowQuickActions(true);
    }
  };

  useEffect(() => {
    localStorage.removeItem("startedChatbot");
    localStorage.removeItem("documenturl");

    fetchOptions();
  }, [request]);

  useEffect(() => {
    if (messagesEndRef.current && showQuickActions) {
      scrollToBottom();
    }
  }, [messages, showQuickActions]);

  const selectedOptionHandler = async (paramsData: any) => {
    const data = await request("POST", "conversation/", {
      documenturl: localStorage.getItem("documenturl")
        ? localStorage.getItem("documenturl")
        : null,
      question: paramsData.question,
      action: paramsData.action,
    });
    if (data) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === processingMessage
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
    }
  };

  const handleSendMessage = (message: string) => {
    setShowQuickActions(false);
    setShowInputMessage(false);
    const botMessageId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { text: message, isBot: false, id: Date.now(), isInfo: false },
      {
        text: processingMessage,
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

  const handleUpload = async (tempFile: any) => {
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
            text: questionAnswerMessage,
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
            text: summaryMessage,
            isBot: false,
            id: Date.now(),
            isInfo: false,
          },
          {
            text: processingMessage,
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
            text: generateQuestionsMessage,
            isBot: false,
            id: Date.now(),
            isInfo: false,
          },
          {
            text: processingMessage,
            isBot: true,
            id: Date.now() + 1,
            isTyping: true,
            isInfo: true,
          },
        ]);
        selectedOptionHandler({ action: "generate_questions" });
        break;
      case "main_menu":
        setShowQuickActions(false);
        setShowInputMessage(false);
        setMessages([
          {
            text: initialMessage,
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
