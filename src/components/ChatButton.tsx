'use client';
import React, { useState } from 'react';
import ChatOverlay from './ChatOverlay';

interface ChatButtonProps {
  selectedBoard: string;
}

const ChatButton = ({ selectedBoard }: ChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 z-50 h-12 w-12 cursor-pointer rounded-full border-none bg-blue-500 text-white"
      >
        💬
      </button>
      {isOpen && (
        <ChatOverlay onClose={toggleChat} selectedBoard={selectedBoard} />
      )}
    </>
  );
};

export default ChatButton;
