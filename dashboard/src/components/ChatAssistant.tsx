import React, { useState } from 'react';
import { MessageSquare, X, Minimize2, Maximize2, Send } from 'lucide-react';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatAssistant() {
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

    // Simulate AI response
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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed left-6 ${isMinimized ? 'bottom-6' : 'bottom-6'} transition-all duration-200`}>
      <div className="bg-white rounded-lg shadow-xl w-[380px] max-w-[calc(100vw-3rem)]">
        <div className="p-4 border-b flex justify-between items-center bg-indigo-600 text-white rounded-t-lg">
          <h3 className="font-semibold">AI Assistant</h3>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
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