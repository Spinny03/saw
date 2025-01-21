import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 transform rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {content}
      </div>
    </div>
  );
};
