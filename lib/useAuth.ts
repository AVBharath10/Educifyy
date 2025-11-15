/**
 * useAuth Hook - Manages authentication state and operations
 * Handles signup, login, logout, and current user context
 * 
 * FIXES:
 * - Validates user exists in database before restoring from localStorage
 * - Auto-logout if user record is deleted or doesn't exist
 * - NO auto-login without valid token + user in DB
 * - Properly clears auth state on logout
 * - Redirects to /auth/login on logout
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, AuthUser } from "@/lib/api";

interface UseAuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UseAuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

/**
 * Custom hook for authentication
 * Manages user state and provides auth methods
 */
export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<UseAuthState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage and validate user exists in DB
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = localStorage.getItem("auth-state");
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Only restore if both user and token exist
          if (parsed?.user && parsed?.token) {
            // Validate user still exists in database
            try {
              const userExists = await fetch(`/api/users/${parsed.user.id}/profile`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              }).then(r => r.ok);
              
              if (userExists) {
                // User is valid, restore state
                setState({
                  user: parsed.user,
                  token: parsed.token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
              } else {
                // User doesn't exist in DB, force logout
                localStorage.removeItem("auth-state");
                router.push("/auth/login");
              }
            } catch (validateError) {
              // Network error during validation, clear auth to be safe
              console.error("Failed to validate user:", validateError);
              localStorage.removeItem("auth-state");
              router.push("/auth/login");
            }
          } else {
            // Invalid stored state, clear it
            localStorage.removeItem("auth-state");
          }
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem("auth-state");
      }
      
      // Mark as initialized so components know auth check is complete
      setIsInitialized(true);
    };

    initializeAuth();
  }, [router]);

  // Persist state to localStorage (only if authenticated)
  useEffect(() => {
    if (isInitialized) {
      if (state.isAuthenticated && state.token && state.user) {
        localStorage.setItem("auth-state", JSON.stringify(state));
      } else {
        // If not authenticated, clear localStorage
        localStorage.removeItem("auth-state");
      }
    }
  }, [state, isInitialized]);

  const handleSignup = useCallback(
    async (data: {
      email: string;
      password: string;
      confirmPassword: string;
      fullName: string;
    }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await authApi.signup(data);
        setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (error: any) {
        const errorMessage = error.message || "Signup failed";
        setState((prev: any) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const handleLogin = useCallback(
    async (data: { email: string; password: string; rememberMe?: boolean }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await authApi.login(data);
        setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (error: any) {
        const errorMessage = error.message || "Login failed";
        setState((prev: any) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const handleLogout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authApi.logout();
      // Clear all auth state
      setState(initialState);
      // Clear localStorage
      localStorage.removeItem("auth-state");
      // Redirect to login
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if logout fails, clear state and redirect
      setState(initialState);
      localStorage.removeItem("auth-state");
      router.push("/auth/login");
    }
  }, [router]);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    isInitialized,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    setError,
    clearError,
  };
}
