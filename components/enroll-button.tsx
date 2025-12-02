/**
 * EnrollButton Component
 * Handles course enrollment with loading state
 * Dispatches enrollment:created event on success
 * Disables button after successful enrollment
 */

"use client";

import { useState } from "react";
import { courseApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  onEnrollSuccess?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function EnrollButton({
  courseId,
  onEnrollSuccess,
  className = "",
  variant = "primary",
}: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      setError(null);
      await courseApi.enrollCourse(courseId);
      setIsEnrolled(true);
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
    } catch (err: any) {
      // Handle "Already enrolled" error gracefully
      if (err.status === 409) {
        setIsEnrolled(true);
        setError(null);
        if (onEnrollSuccess) {
          onEnrollSuccess();
        }
      } else {
        setError(err.message || "Failed to enroll");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const buttonStyles = {
    primary: isEnrolled
      ? "bg-green-600 text-white hover:bg-green-700"
      : "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: isEnrolled
      ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
      : "bg-transparent border border-primary text-primary hover:bg-primary/10",
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleEnroll}
        disabled={isEnrolling || isEnrolled}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          ${buttonStyles[variant]}
          ${className}
        `}
      >
        {isEnrolling ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enrolling...
          </>
        ) : isEnrolled ? (
          <>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Enrolled
          </>
        ) : (
          "Enroll Now"
        )}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
