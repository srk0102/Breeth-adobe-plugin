import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const sizeClasses = {
  sm: 'w-[min(100%,400px)]',
  md: 'w-[min(100%,500px)]',
  lg: 'w-[min(100%,700px)]',
  xl: 'w-[min(100%,900px)]'
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnBackdropClick = true
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-xl grid place-items-center z-[2147483647] p-4"
      onClick={handleBackdropClick}
    >
      <div className={`gradient-border ${sizeClasses[size]} ${className}`}>
        <div className="gradient-border-inner flex flex-col max-h-[90vh]">
          {(title || showCloseButton) && (
            <div className="flex w-full justify-between items-center p-6 border-b border-white/10 gap-4">
              {title && (
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto text-white hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 flex items-center justify-center w-8 h-8"
                  title="Close"
                >
                  <X className="w-5 h-5" color="white" />
                </button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
