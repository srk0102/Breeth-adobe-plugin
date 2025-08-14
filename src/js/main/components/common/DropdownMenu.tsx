import React, { useState } from 'react';

interface DropdownItem {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  menuClassName?: string;
  position?: 'left' | 'right';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  className = '',
  menuClassName = '',
  position = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const positionClasses = position === 'right' ? 'right-0' : 'left-0';
  
  return (
    <div className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute ${positionClasses} top-full mt-2 bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl rounded-xl shadow-2xl border border-white/15 min-w-48 overflow-hidden z-[9999] ${menuClassName}`}>
          <div className="p-2">
            {items.map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-brand-primary/10 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-left"
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
