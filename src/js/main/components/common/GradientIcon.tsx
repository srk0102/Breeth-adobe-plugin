import React from 'react';

interface GradientIconProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fromColor?: string;
  toColor?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
};

export const GradientIcon: React.FC<GradientIconProps> = ({
  children,
  size = 'md',
  className = '',
  fromColor = 'bg-brand-gradient',
  toColor = ''
}) => {
  return (
    <div className={`${fromColor} ${toColor} rounded-xl flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
