/**
 * Course API Hooks - Manages course data and operations
 * Handles fetching, creating, updating courses
 */

"use client";

import { useState, useCallback } from "react";
import { courseApi, Course, CourseDetail, CreateCourseData } from "@/lib/api";

interface UseCourseState {
  courses: Course[];
  course: CourseDetail | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: UseCourseState = {
  courses: [],
  course: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

/**
 * Hook to list and search courses
 */
export function useCourses() {
  const [state, setState] = useState<UseCourseState>(initialState);

  const listCourses = useCallback(
    async (params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      difficulty?: string;
    } = {}) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await courseApi.listCourses(params);
        setState({
          courses: response.data,
          totalPages: response.pagination.pages,
          currentPage: response.pagination.page,
          isLoading: false,
          error: null,
          course: null,
        });
        return response;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || "Failed to fetch courses",
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const getCourse = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const course = await courseApi.getCourse(id);
      setState((prev) => ({
        ...prev,
        course,
        isLoading: false,
        error: null,
      }));
      return course;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch course",
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const createCourse = useCallback(async (data: CreateCourseData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const newCourse = await courseApi.createCourse(data);
      setState((prev) => ({
        ...prev,
        courses: [newCourse, ...prev.courses],
        isLoading: false,
        error: null,
      }));
      return newCourse;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to create course",
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const updateCourse = useCallback(
    async (id: string, data: Partial<CreateCourseData>) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const updated = await courseApi.updateCourse(id, data);
        setState((prev) => ({
          ...prev,
          courses: prev.courses.map((c) => (c.id === id ? updated : c)),
          course: prev.course?.id === id ? (updated as any) : prev.course,
          isLoading: false,
          error: null,
        }));
        return updated;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || "Failed to update course",
          isLoading: false,
        }));
        throw error;
      }
    },
    []
  );

  const deleteCourse = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await courseApi.deleteCourse(id);
      setState((prev) => ({
        ...prev,
        courses: prev.courses.filter((c) => c.id !== id),
        course: prev.course?.id === id ? null : prev.course,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to delete course",
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    listCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
