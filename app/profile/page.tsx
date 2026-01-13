"use client"

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { useAuth } from "@/lib/useAuth";
import { userApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ProfileResponse {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  joinDate: string;
  stats: {
    activeCourses: number;
    completedCourses: number;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        const data = await userApi.getProfile(user.id);

        // Map API response to component state shape
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || null,
          bio: data.bio || null,
          joinDate: data.joinDate,
          stats: {
            activeCourses: data.coursesEnrolled || 0,
            completedCourses: data.certificatesEarned || 0
          }
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, isAuthenticated]);

  if (loading) {
    return (
      <PageLayout>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="p-8">
          <p className="text-muted-foreground">No profile available.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6 md:p-12 max-w-4xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-medium tracking-tight mb-2 text-[#1A1916]">My Profile</h1>
          <p className="text-neutral-500">Manage your account and learning preferences</p>
        </div>

        <div className="mb-8 p-8 rounded-2xl border border-[#EBE8DF] bg-white shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start pb-8 border-b border-[#EBE8DF] mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#FDFBF7] border border-[#EBE8DF] flex items-center justify-center text-4xl font-bold overflow-hidden text-[#1A1916]">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name || "avatar"} className="w-full h-full object-cover" />
                ) : (
                  <span>{(profile.name || profile.email).charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-medium mb-2 text-[#1A1916]">{profile.name || profile.email}</h2>
              <p className="text-neutral-500 mb-4 font-mono text-sm">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                Student
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6 rounded-xl bg-[#FDFBF7] border border-[#EBE8DF]">
              <p className="text-3xl font-semibold text-[#1A1916] mb-1">{profile.stats.activeCourses}</p>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Active Courses</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#FDFBF7] border border-[#EBE8DF]">
              <p className="text-3xl font-semibold text-[#1A1916] mb-1">{profile.stats.completedCourses}</p>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Completed</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#FDFBF7] border border-[#EBE8DF]">
              <p className="text-3xl font-semibold text-[#1A1916] mb-1">—</p>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Total Hours</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-medium mb-3 text-[#1A1916]">About</h3>
            <p className="text-neutral-600 leading-relaxed">{profile.bio || "No bio provided."}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-3 text-[#1A1916]">Contact Information</h3>
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#EBE8DF]">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">Email Address</label>
              <p className="text-[#1A1916] font-medium">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
