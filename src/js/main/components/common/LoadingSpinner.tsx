import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16', 
  lg: 'w-24 h-24'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'border-brand-primary/30 border-t-brand-primary',
  className = '',
  text
}) => {
  return (
    <div className={`text-center text-gray-400 ${className}`}>
      <div className={`${sizeClasses[size]} border-4 ${color} rounded-full animate-spin mx-auto ${text ? 'mb-4' : ''}`}></div>
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
};
