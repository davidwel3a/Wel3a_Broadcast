import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'success' | 'discord';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
    md: 'h-10 px-4 text-sm rounded-md gap-2',
    lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white hover:brightness-110 active:scale-[0.98] shadow-md hover:shadow-glow',
    ghost: 'bg-surface/50 border border-border text-text hover:bg-surface-hover hover:border-accent active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-danger to-red-700 text-white hover:brightness-110 active:scale-[0.98] shadow-md',
    success: 'bg-gradient-to-r from-success to-emerald-700 text-white hover:brightness-110 active:scale-[0.98] shadow-md',
    discord: 'bg-gradient-to-r from-discord to-[#4752c4] text-white hover:brightness-110 active:scale-[0.98] shadow-md',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
