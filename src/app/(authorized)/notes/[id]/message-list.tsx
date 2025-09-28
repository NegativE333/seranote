'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = user?.id === message.sender.id;
        const isFirstMessage = index === 0 || messages[index - 1].sender.id !== message.sender.id;
        
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
              {!isOwnMessage && isFirstMessage && (
                <div className="text-xs text-gray-400 mb-1 px-3">
                  {message.sender.name || message.sender.email}
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  isOwnMessage
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 text-gray-200'
                } ${isFirstMessage ? 'rounded-tl-2xl' : 'rounded-tl-lg'} ${
                  isOwnMessage ? 'rounded-tr-lg' : 'rounded-tr-2xl'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
