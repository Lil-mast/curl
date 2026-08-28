"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { OpportunityKind, Lang } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Award,
  User,
  Users,
  Building,
  Volume2
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile, setLang } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<"so" | "en" | "both">("en");
  const [selectedGoal, setSelectedGoal] = useState<OpportunityKind>("job");
  const [location, setLocation] = useState<string>("Local Area");
  const [userRole, setUserRole] = useState<string>("For myself");
  const [voicePace, setVoicePace] = useState<string>("Standard Voice");
  const [email, setEmail] = useState<string>("");

  const handleFinish = () => {
    const langToSet: Lang = selectedLang === "both" ? "en" : selectedLang;
    setLang(langToSet);
    saveProfile({
      displayName: email ? email.split("@")[0] : "",
      language: langToSet,
      city: location,
      lookingFor: [selectedGoal],
      notes: `Role: ${userRole}. Pace: ${voicePace}. Email: ${email || "guest"}`,
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "maktab_onboarding_prefs",
          JSON.stringify({
            language: selectedLang,
            goal: selectedGoal,
            location,
            userRole,
            voicePace,
            email,
          })
        );
      } catch {
        // ignore
      }
    }

    router.push("/assistant");
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-stone-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between py-2">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? "Exit to Home" : "Back"}</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Step {step} of 5
        </span>

        <button
          type="button"
          onClick={handleFinish}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
        >
          Skip to Assistant
        </button>
      </header>

      {/* Main Questionnaire */}
      <main className="max-w-xl w-full mx-auto my-auto py-6">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-stone-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-emerald-800 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: LANGUAGE PREFERENCE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="eyebrow block mb-1">Language Selection</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Which language do you prefer to speak and hear?
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                Dooro luqadda aad doorbideyso inaad ku hadasho ama wax ku akhrisato.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "so", title: "Af-Soomaali (Somali)", desc: "Somali first with bilingual support" },
                { id: "en", title: "English", desc: "Clear English voice and text navigation" },
                { id: "both", title: "Bilingual (Labada Luqadood)", desc: "Automatic dual-language translation" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLang(item.id as "so" | "en" | "both")}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedLang === item.id
                      ? "border-emerald-800 bg-white shadow-sm ring-1 ring-emerald-800"
                      : "border-stone-300 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-emerald-800">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900">{item.title}</p>
                      <p className="text-xs text-stone-500">{item.desc}</p>
                    </div>
                  </div>
                  {selectedLang === item.id && <Check className="w-4 h-4 text-emerald-800" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PRIMARY GOAL */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="eyebrow block mb-1">Your Focus</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                What are you looking for help with today?
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                Maxaad doonaysaa in Maktab AI ay kaa caawiso maanta?
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: "job", icon: Briefcase, title: "Jobs & Employment", desc: "Warehouses, local hiring, shift work" },
                { id: "education", icon: GraduationCap, title: "Education & ESL Classes", desc: "Free adult English classes, GED, school aid" },
                { id: "service", icon: HeartHandshake, title: "Community & Food Aid", desc: "Food pantries, halal meals, housing help" },
                { id: "scholarship", icon: Award, title: "Scholarships & Grants", desc: "Education grants, vocational funding" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedGoal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedGoal(item.id as OpportunityKind)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-emerald-800 bg-white shadow-sm ring-1 ring-emerald-800"
                        : "border-stone-300 bg-white/60 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-emerald-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900">{item.title}</p>
                        <p className="text-xs text-stone-500">{item.desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="eyebrow block mb-1">Location</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Where are you located?
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                This helps us match local community centers and nearby opportunities.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city or neighborhood..."
                className="w-full p-3.5 rounded-2xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:border-emerald-800"
              />

              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Or pick a quick hub:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "Minneapolis / St. Paul",
                  "Seattle / King County",
                  "Columbus, OH",
                  "London / UK",
                  "Nairobi / Eastleigh",
                  "Local Area",
                ].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setLocation(city)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                      location === city
                        ? "border-emerald-800 bg-white font-bold text-emerald-950"
                        : "border-stone-200 bg-white/60 hover:bg-white text-stone-700"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BENEFICIARY */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="eyebrow block mb-1">Beneficiary</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Who are you seeking opportunities for?
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                Yaa u raadinaysaa fursadahan iyo adeegyadan?
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "For myself", icon: User, title: "For myself", desc: "Personal job search, classes, or grants" },
                { id: "For a family member", icon: Users, title: "For a family member or elder", desc: "Assisting a parent, sibling, or elder" },
                { id: "Caseworker / Helper", icon: Building, title: "I am a caseworker or community helper", desc: "Finding verified services for community clients" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = userRole === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUserRole(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-emerald-800 bg-white shadow-sm ring-1 ring-emerald-800"
                        : "border-stone-300 bg-white/60 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-emerald-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900">{item.title}</p>
                        <p className="text-xs text-stone-500">{item.desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: PREFERENCES & OPTIONAL ACCOUNT */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="eyebrow block mb-1">Preferences</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Voice pace & access preferences
              </h1>
              <p className="text-sm text-stone-600 mt-2">
                No sign-up is required. You can continue anonymously as a guest.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  Voice Speech Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Standard Voice", "Slower Pace", "Captions First"].map((pace) => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => setVoicePace(pace)}
                      className={`p-3 rounded-xl border text-xs font-medium text-center transition-colors ${
                        voicePace === pace
                          ? "border-emerald-800 bg-white font-bold text-emerald-950"
                          : "border-stone-200 bg-white/60 hover:bg-white text-stone-700"
                      }`}
                    >
                      <Volume2 className="w-4 h-4 mx-auto mb-1 opacity-70" />
                      <span>{pace}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  Optional: Save session by email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email if you wish to save your profile (optional)"
                  className="w-full p-3.5 rounded-2xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:border-emerald-800"
                />
                <p className="text-[11px] text-stone-500">
                  Zero voice recordings are saved. Your preferences stay on this device.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition-colors"
          >
            <span>{step === 5 ? "Start Talking with Maktab AI" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-xl w-full mx-auto text-center py-2 text-xs text-stone-400">
        <p>Maktab AI (مكتب) — Privacy First</p>
      </footer>
    </div>
  );
}
