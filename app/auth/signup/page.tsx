"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, GraduationCap, School } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuth();

  // Default to STUDENT
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
    clearError();
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setValidationError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationError("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Pass role along with other data
      await signup({ ...formData, role });
      // Signup successful - redirect to dashboard (or teacher dashboard if relevant)
      router.push("/dashboard");
    } catch (err) {
      // Error is already set in the auth state
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md pt-10 pb-20"> {/* Added padding to account for fixed header if needed */}
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A1916] text-[#FDFBF7] mb-6 shadow-lg shadow-black/10">
            <span className="text-xl font-bold">E</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-[#1A1916] mb-2">Join Educify</h1>
          <p className="text-neutral-500">Create your account to start your journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#EBE8DF] rounded-xl shadow-sm p-8 mb-6">

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div
              className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'STUDENT' ? 'border-black bg-neutral-50' : 'border-transparent bg-neutral-100 hover:bg-neutral-200 opacity-60'}`}
              onClick={() => setRole("STUDENT")}
            >
              <div className={`p-2 rounded-full ${role === 'STUDENT' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                <GraduationCap size={20} />
              </div>
              <span className={`font-medium text-sm ${role === 'STUDENT' ? 'text-black' : 'text-neutral-500'}`}>I want to Learn</span>
            </div>

            <div
              className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'INSTRUCTOR' ? 'border-black bg-neutral-50' : 'border-transparent bg-neutral-100 hover:bg-neutral-200 opacity-60'}`}
              onClick={() => setRole("INSTRUCTOR")}
            >
              <div className={`p-2 rounded-full ${role === 'INSTRUCTOR' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                <School size={20} />
              </div>
              <span className={`font-medium text-sm ${role === 'INSTRUCTOR' ? 'text-black' : 'text-neutral-500'}`}>I want to Teach</span>
            </div>
          </div>

          {/* Error Messages */}
          {(error || validationError) && (
            <Alert variant={error?.toLowerCase().includes('already') ? 'default' : 'destructive'} className={`mb-4 ${error?.toLowerCase().includes('already') ? 'bg-amber-50 border-amber-200 text-amber-900' : ''}`}>
              {error?.toLowerCase().includes('already') ? (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Account already exists</span>
                  <div className="text-sm">
                    It looks like an account with this email already exists.
                    <Link href="/auth/login" className="font-bold underline ml-1 hover:text-black">
                      Log in here
                    </Link>
                    {' '}to access your dashboard.
                  </div>
                </div>
              ) : (
                <AlertDescription>{error || validationError}</AlertDescription>
              )}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-6 bg-[#1A1916] hover:bg-[#1A1916]/90 text-[#FDFBF7] font-medium rounded-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                `Create ${role === 'STUDENT' ? 'Student' : 'Instructor'} Account`
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
