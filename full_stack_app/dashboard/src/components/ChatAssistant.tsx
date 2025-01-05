import React, { useState } from 'react';
import { MessageSquare, X, Minimize2, Maximize2, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatAssistant() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI assistant. Ask me anything about your business data.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      const aiResponse: Message = {
        content: "I'm analyzing your data. This is a placeholder response. Connect to your backend for real AI responses.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        aria-label="Open chat assistant"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`
          fixed bottom-6 right-6 bg-indigo-600 dark:bg-indigo-500 text-white p-4 
          rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 
          hover:scale-110 transition-all duration-300 z-50 group
          ${isMinimized ? 'animate-none' : 'animate-pulse hover:animate-none'}
        `}
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
      </button>
    );
  }

  return (
    <div 
      className={`
        fixed right-6 transition-all duration-300 ease-in-out z-50 
        ${isMinimized ? 'bottom-6' : 'bottom-6 sm:bottom-8'} 
        ${isOpen ? 'backdrop-blur-sm' : ''}
      `}
    >
      {/* Backdrop overlay */}
      {!isMinimized && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm 
            transition-opacity duration-300"
          onClick={() => setIsMinimized(true)}
        />
      )}

      <div className={`
        relative bg-white dark:bg-gray-800 rounded-lg shadow-xl 
        border border-gray-200 dark:border-gray-700
        transition-all duration-300 transform
        ${isMinimized 
          ? 'w-auto' 
          : 'w-[calc(100vw-3rem)] sm:w-[420px] max-w-lg'
        }
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center 
          bg-indigo-600 dark:bg-indigo-500 text-white rounded-t-lg">
          <h3 className="font-semibold">AI Assistant</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin 
              scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-75 mt-1 block dark:text-gray-300">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                    placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-lg 
                    hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}