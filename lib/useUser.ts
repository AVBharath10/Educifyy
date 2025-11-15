/**
 * User API Hooks - Manages user profile, preferences, and dashboard data
 */

"use client";

import { useState, useCallback } from "react";
import {
  userApi,
  UserProfile,
  UserPreferences,
  UserStatistics,
  DashboardData,
} from "@/lib/api";

interface UseUserState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  statistics: UserStatistics | null;
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UseUserState = {
  profile: null,
  preferences: null,
  statistics: null,
  dashboard: null,
  isLoading: false,
  error: null,
};

/**
 * Hook to manage user profile and data
 */
export function useUser(userId: string | null) {
  const [state, setState] = useState<UseUserState>(initialState);

  const getProfile = useCallback(async () => {
    if (!userId) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const profile = await userApi.getProfile(userId);
      setState((prev) => ({
        ...prev,
        profile,
        isLoading: false,
        error: null,
      }));
      return profile;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch profile",
        isLoading: false,
      }));
      throw error;
    }
  }, [userId]);

  const updateProfile = useCallback(
    async (data: FormData | Partial<UserProfile>) => {
      if (!userId) return;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const updated = await userApi.updateProfile(userId, data);
        setState((prev) => ({
          ...prev,
          profile: updated,
          isLoading: false,
          error: null,
        }));
        return updated;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || "Failed to update profile",
          isLoading: false,
        }));
        throw error;
      }
    },
    [userId]
  );

  const getPreferences = useCallback(async () => {
    if (!userId) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const preferences = await userApi.getPreferences(userId);
      setState((prev) => ({
        ...prev,
        preferences,
        isLoading: false,
        error: null,
      }));
      return preferences;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch preferences",
        isLoading: false,
      }));
      throw error;
    }
  }, [userId]);

  const updatePreferences = useCallback(
    async (data: UserPreferences) => {
      if (!userId) return;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const updated = await userApi.updatePreferences(userId, data);
        setState((prev) => ({
          ...prev,
          preferences: updated,
          isLoading: false,
          error: null,
        }));
        return updated;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || "Failed to update preferences",
          isLoading: false,
        }));
        throw error;
      }
    },
    [userId]
  );

  const getStatistics = useCallback(async () => {
    if (!userId) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const statistics = await userApi.getStatistics(userId);
      setState((prev) => ({
        ...prev,
        statistics,
        isLoading: false,
        error: null,
      }));
      return statistics;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch statistics",
        isLoading: false,
      }));
      throw error;
    }
  }, [userId]);

  const getDashboard = useCallback(async () => {
    if (!userId) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const dashboard = await userApi.getDashboard(userId);
      setState((prev) => ({
        ...prev,
        dashboard,
        isLoading: false,
        error: null,
      }));
      return dashboard;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch dashboard",
        isLoading: false,
      }));
      throw error;
    }
  }, [userId]);

  return {
    ...state,
    getProfile,
    updateProfile,
    getPreferences,
    updatePreferences,
    getStatistics,
    getDashboard,
  };
}
