'use client';

import { CheckCircleIcon, XCircleIcon, WarningIcon, InfoIcon } from '@/components/ui/icons';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}

export function Alert({ type, title, message, className = '' }: AlertProps) {
  const typeStyles = {
    success: 'bg-green-900/30 border-green-700 text-green-400',
    error: 'bg-red-900/30 border-red-700 text-red-400',
    warning: 'bg-yellow-900/30 border-yellow-700 text-yellow-400',
    info: 'bg-blue-900/30 border-blue-700 text-blue-400',
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />,
    error: <XCircleIcon className="w-5 h-5 flex-shrink-0" />,
    warning: <WarningIcon className="w-5 h-5 flex-shrink-0" />,
    info: <InfoIcon className="w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div className={`border rounded-lg p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex gap-3">
        {icons[type]}
        <div className="flex-1">
          {title && <div className="font-medium mb-1">{title}</div>}
          <div className={title ? 'text-sm' : ''}>{message}</div>
        </div>
      </div>
    </div>
  );
}
