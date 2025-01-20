'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { getUserId } from '@/libs/userClient';
import { useSession } from 'next-auth/react';

interface ExtendedMessage extends Message {
  user?: {
    image: string;
  };
}
interface ChatOverlayProps {
  onClose: () => void;
  selectedBoard: string;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  onClose,
  selectedBoard,
}) => {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [session]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        //prendi selectedBoard da props
        const response = await fetch(`/api/board/${selectedBoard}/chat`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      try {
        const response = await fetch(`/api/board/${selectedBoard}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (response.ok) {
          const newMessage = await response.json();
          console.log('New Message:', newMessage);
          console.log(userId);
          setMessages([...messages, newMessage]);
          setInput('');
        } else {
          console.error('Error sending message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-5 z-50 h-96 w-96 overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="flex items-center justify-between bg-blue-500 p-2 text-white">
        <h4 className="m-0">Chat</h4>
        <button
          onClick={onClose}
          className="cursor-pointer border-none bg-none text-white"
        >
          ✖️
        </button>
      </div>
      <div className="h-[calc(100%-80px)] overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex items-start ${msg.userId == userId ? 'justify-end' : 'justify-start'}`}
          >
            {msg.userId !== userId && (
              <img
                src={msg.user?.image || '/default-avatar.png'}
                alt="avatar"
                className="mr-2 h-8 w-8 rounded-full"
              />
            )}
            <div
              className={`rounded p-2 ${msg.userId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {msg.message}
            </div>
            {msg.userId === userId && (
              <img
                src={msg.user?.image || '/default-avatar.png'}
                alt="avatar"
                className="ml-2 h-8 w-8 rounded-full"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center border-t bg-white p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow rounded border p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 rounded bg-blue-500 p-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatOverlay;
