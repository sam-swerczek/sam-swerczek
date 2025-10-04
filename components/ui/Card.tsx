import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClasses = hover
    ? 'transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/10'
    : '';

  return (
    <div
      className={`bg-background-secondary rounded-lg border border-gray-800 overflow-hidden ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-background-primary/50 border-t border-gray-800 ${className}`}>
      {children}
    </div>
  );
}
