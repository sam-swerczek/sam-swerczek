'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';

export default function AdminLogin() {
  const router = useRouter();
  const { signIn, loading } = useAuthContext();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { success, error: signInError } = await signIn(
        formState.email,
        formState.password
      );

      if (success) {
        // Give Supabase a moment to set the session cookie
        await new Promise(resolve => setTimeout(resolve, 100));

        // Force a hard redirect to ensure middleware sees the new session
        window.location.href = '/admin';
      } else {
        setError(signInError || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const isFormValid = formState.email.trim() !== '' && formState.password.trim() !== '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Admin Login
          </h1>
          <p className="text-text-secondary">
            Sign in to access the admin dashboard
          </p>
        </div>

        <div className="bg-background-secondary rounded-lg shadow-lg p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formState.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@example.com"
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formState.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                id="error-message"
                role="alert"
                className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-md text-sm"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || loading}
              className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-secondary"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary">
          Need help? Contact the site administrator.
        </p>
      </div>
    </div>
  );
}
