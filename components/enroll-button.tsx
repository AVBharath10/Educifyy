"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { courseApi } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  courseTitle?: string;
  onEnrollSuccess?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function EnrollButton({
  courseId,
  courseTitle = "Course Enrollment",
  onEnrollSuccess,
  className = "",
  variant = "primary",
}: EnrollButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnrollClick = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/course/${courseId}`);
      return;
    }

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
      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
      : "bg-[#1A1916] text-[#FDFBF7] hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20",
    secondary: isEnrolled
      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200"
      : "bg-transparent border border-[#1A1916] text-[#1A1916] hover:bg-neutral-50 hover:scale-[1.02] active:scale-[0.98]",
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleEnrollClick}
        disabled={isEnrolling || isEnrolled}
        className={`
          px-6 py-3 rounded-xl font-medium transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
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

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
