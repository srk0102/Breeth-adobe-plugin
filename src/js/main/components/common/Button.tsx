import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'white' | 'video' | 'audio' | 'image' | 'gradient' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const getVariantClasses = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-brand-gradient bg-brand-gradient-hover text-white shadow-lg hover:shadow-xl hover:shadow-brand-primary/30 transform';
    case 'white':
      return 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transform hover:scale-[1.02] active:scale-[0.98]';
    case 'video':
      return 'bg-video-gradient text-white shadow-md hover:shadow-lg hover:shadow-file-video/25 transform hover:scale-[1.02] active:scale-[0.98]';
    case 'audio':
      return 'bg-audio-gradient text-white shadow-md hover:shadow-lg hover:shadow-file-audio/25 transform hover:scale-[1.02] active:scale-[0.98]';
    case 'image':
      return 'bg-image-gradient text-white shadow-md hover:shadow-lg hover:shadow-file-image/25 transform hover:scale-[1.02] active:scale-[0.98]';
    case 'gradient':
      return 'bg-brand-gradient bg-brand-gradient-hover text-white shadow-lg hover:shadow-xl hover:shadow-brand-primary/40 transform hover:scale-[1.02] active:scale-[0.98]';
    case 'solid':
      return 'bg-brand-primary hover:bg-brand-secondary text-white shadow-md hover:shadow-lg hover:shadow-brand-primary/30 transform hover:scale-[1.02] active:scale-[0.98]';
    default:
      return 'bg-brand-primary hover:bg-brand-secondary text-white shadow-lg hover:shadow-xl hover:shadow-brand-primary/30 transform hover:scale-[1.02] active:scale-[0.98]';
  }
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl'
};

const disabledClasses = 'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none disabled:scale-100 disabled:bg-gray-500 disabled:from-gray-500 disabled:to-gray-500 disabled:hover:from-gray-500 disabled:hover:to-gray-500 disabled:hover:shadow-none disabled:hover:scale-100 disabled:border-gray-400 disabled:text-gray-300';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  fullWidth = false
}) => {
  const baseClasses = 'font-semibold ease-in-out group flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 focus:ring-offset-black relative overflow-hidden transition-colors-opacity';
  const widthClasses = fullWidth ? 'w-full' : '';
  const cursorClasses = disabled ? '' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${getVariantClasses(variant)} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${cursorClasses}`}
    >
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      )}
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </button>
  );
};
