import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'font-body font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:opacity-90 focus:ring-brand-primary disabled:bg-gray-400',
    secondary: 'bg-brand-accent text-white hover:opacity-90 focus:ring-brand-accent disabled:bg-gray-400',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary disabled:border-gray-400 disabled:text-gray-400',
    ghost: 'text-brand-primary hover:bg-brand-muted focus:ring-brand-primary disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:bg-gray-400',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
