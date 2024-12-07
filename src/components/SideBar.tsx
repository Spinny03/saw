import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

const Sidebar = () => {
  return (
    <div className="w-20 h-screen bg-gray-100 flex flex-col items-center p-4">
      <ToggleGroup.Root
        type="single"
        defaultValue="1"
        aria-label="Sidebar blocks"
        className="flex flex-col gap-4"
      >
        <ToggleGroup.Item
          value="1"
          aria-label="Block 1"
          className="w-12 h-12 bg-gray-700 text-white flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-600 active:ring-2 active:ring-offset-2 active:ring-gray-500"
        >
          1
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="2"
          aria-label="Block 2"
          className="w-12 h-12 bg-gray-700 text-white flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-600 active:ring-2 active:ring-offset-2 active:ring-gray-500"
        >
          2
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="3"
          aria-label="Block 3"
          className="w-12 h-12 bg-gray-700 text-white flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-600 active:ring-2 active:ring-offset-2 active:ring-gray-500"
        >
          3
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
};

export default Sidebar;
