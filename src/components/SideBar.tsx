import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

const Sidebar = () => {
  const [selectedBlock, setSelectedBlock] = React.useState('1');
  const handleValueChange = (value: string) => {
    setSelectedBlock(value);
  };

  const blocks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="w-20 h-screen bg-gray-100 flex flex-col items-center p-4 overflow-y-auto">
      <ToggleGroup.Root
        type="single"
        defaultValue="1"
        aria-label="Sidebar blocks"
        className="flex flex-col gap-4"
        onValueChange={handleValueChange}
      >
        {blocks.map((block) => (
          <ToggleGroup.Item
            key={block}
            value={block.toString()}
            aria-label={`Block ${block}`}
            className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer hover:bg-blue-700 active:ring-2 active:ring-offset-2 active:ring-gray-500 ${
              selectedBlock === block.toString()
                ? 'bg-blue-700 text-white'
                : 'bg-gray-700 text-white'
            }`}
          >
            {block}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
};

export default Sidebar;
