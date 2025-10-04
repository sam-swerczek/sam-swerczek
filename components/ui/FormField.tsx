'use client';

interface FormFieldProps {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  helperText,
  error,
  required = false,
  children,
  className = ''
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-primary mb-2"
      >
        {label} {required && '*'}
        {helperText && (
          <span className="ml-2 text-xs text-text-secondary font-normal">
            {helperText}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
