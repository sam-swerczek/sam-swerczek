import { useState } from 'react';

interface UseFormSubmitOptions {
  onSuccess?: () => void;
  successDuration?: number;
}

interface UseFormSubmitReturn<T> {
  handleSubmit: (submitFn: () => Promise<T>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

/**
 * Custom hook to manage form submission state
 * @param options - Configuration options
 * @returns Form submission state and handlers
 */
export function useFormSubmit<T = unknown>(
  options: UseFormSubmitOptions = {}
): UseFormSubmitReturn<T> {
  const { onSuccess, successDuration = 3000 } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  const handleSubmit = async (submitFn: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitFn();
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }

      // Auto-reset success state after duration
      setTimeout(() => {
        setSuccess(false);
      }, successDuration);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
    success,
    resetState,
  };
}
