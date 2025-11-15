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
        setProfile(data as ProfileResponse);
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
      <div className="p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and learning preferences</p>
        </div>

        <div className="mb-8 p-8 rounded-lg border border-border bg-card">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center pb-8 border-b border-border mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-card flex items-center justify-center text-4xl font-bold overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name || "avatar"} className="w-full h-full object-cover" />
                ) : (
                  <span>{(profile.name || profile.email).charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{profile.name || profile.email}</h2>
              <p className="text-muted-foreground mb-4">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary mb-1">{profile.stats.activeCourses}</p>
              <p className="text-xs text-muted-foreground">Active Courses</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-accent mb-1">{profile.stats.completedCourses}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-secondary mb-1">—</p>
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold">About</h3>
            <p className="text-foreground/80 leading-relaxed mt-2">{profile.bio || "No bio provided."}</p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">Email</label>
              <p>{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
