'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Get current user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          // AuthSessionMissingError is expected when not logged in - don't treat as error
          if (error.name === 'AuthSessionMissingError') {
            setAuthState({ user: null, loading: false, error: null });
            return;
          }
          console.error('Error fetching user:', error);
          setAuthState({ user: null, loading: false, error: error.message });
          return;
        }

        setAuthState({ user, loading: false, error: null });
      } catch (err) {
        console.error('Error initializing auth:', err);
        setAuthState({
          user: null,
          loading: false,
          error: err instanceof Error ? err.message : 'An error occurred'
        });
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          loading: false,
          error: null,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth] Sign in error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
        return { success: false, error: error.message };
      }

      setAuthState({
        user: data.user,
        loading: false,
        error: null
      });

      return { success: true, error: null };
    } catch (err) {
      console.error('[useAuth] Sign in exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
        return { success: false, error: error.message };
      }

      setAuthState({
        user: null,
        loading: false,
        error: null
      });

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const getUser = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signOut,
    getUser,
  };
}
