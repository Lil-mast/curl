"use client";

import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 transition-colors text-stone-700 hover:text-stone-900"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Account & Preferences
          </span>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
