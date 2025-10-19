/**
 * Conditional logger utility
 * Logs messages only in development mode to keep production console clean
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },

  /**
   * Log error messages (always logs, even in production)
   */
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
};
