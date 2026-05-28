import React, { useState, useEffect } from "react";
import { Activity, AnalysisResponse } from "./types";
import DataEditor from "./components/DataEditor";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import FocusTracker from "./components/FocusTracker";
import LoginScreen from "./components/LoginScreen";
import FocusAudioLab from "./components/FocusAudioLab";
import DiagnosticQuiz from "./components/DiagnosticQuiz";
import StreakLeaderboard from "./components/StreakLeaderboard";
import { Brain, LayoutDashboard, Target, Sparkles, LogOut, User, Sun, Moon, Activity as PulseIcon } from "lucide-react";

export default function App() {
  // Authentication status state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  // Visual Theme Mode State
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Tab Selection State ("analisis" for workspace, "produktivitas" for productivity triggers, "klinik-tes" for the procrastinator type test quiz)
  const [activeTab, setActiveTab] = useState<"analisis" | "produktivitas" | "klinik-tes">("klinik-tes");

  // Sync body class with theme selection dynamically
  useEffect(() => {
    if (theme === "light") {
      document.body.className = "light-theme bg-slate-50 text-slate-900";
    } else {
      document.body.className = "bg-slate-950 text-slate-100";
    }
  }, [theme]);

  // State representation for the active task table data
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // AI analysis response state
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user-specific activities dynamically from localStorage on login
  useEffect(() => {
    if (isLoggedIn && userName) {
      const saved = localStorage.getItem(`procrastination_activities_${userName}`);
      if (saved) {
        try {
          setActivities(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing user activities", e);
        }
      } else {
        // Initialize brand-new users with nice initial templates or empty state
        if (
          userName === "Pengguna Umum" || 
          userName === "Guest" || 
          userName.startsWith("Pelajar") || 
          userName.startsWith("Pengguna Kreatif") ||
          userName === "Desi Nofitasari"
        ) {
          handleLoadSample();
        } else {
          // Empty or minimal welcoming task for registered users
          setActivities([
            {
              id: "welcome_1",
              task_name: `Tulis aktivitas harian tertundamu di bawah, ${userName}!`,
              planned_time: "09:00",
              actual_time: "10:30",
              delay_minutes: 90,
              difficulty: "Medium",
              category: "Umum",
              completed: false,
              excuse: "Membiasakan diri dengan buku catatan perilaku tertunda ini.",
              day: "Senin"
            }
          ]);
        }
      }
      setAnalysis(null);
      setError(null);
    }
  }, [isLoggedIn, userName]);

  // Persist activities whenever they change under the specific username namespace
  useEffect(() => {
    if (isLoggedIn && userName && activities.length > 0) {
      localStorage.setItem(`procrastination_activities_${userName}`, JSON.stringify(activities));
    }
  }, [activities, isLoggedIn, userName]);

  const handleClearAll = () => {
    setActivities([]);
    setAnalysis(null);
    setError(null);
  };

  const handleLoadSample = () => {
    const sampleLogs: Activity[] = [
      {
        id: "sample_usr_1",
        task_name: "Berbenah meja belajar & menyusun berkas",
        planned_time: "08:00",
        actual_time: "08:45",
        delay_minutes: 45,
        difficulty: "Low",
        category: "Berbenah",
        completed: true,
        excuse: "Refleks merapikan charger yang melilit kusam biar estetik.",
        day: "Senin"
      },
      {
        id: "sample_usr_2",
        task_name: "Kerjakan laporan keuangan bulanan",
        planned_time: "09:30",
        actual_time: "11:50",
        delay_minutes: 140,
        difficulty: "High",
        category: "Keuangan",
        completed: true,
        excuse: "Butuh suasana kondusif, jadi merebus mie telor setengah matang dulu.",
        day: "Selasa"
      },
      {
        id: "sample_usr_3",
        task_name: "Review email masuk dari klien",
        planned_time: "13:00",
        actual_time: "13:10",
        delay_minutes: 10,
        difficulty: "Low",
        category: "Komunikasi",
        completed: true,
        excuse: "Cepat diselesaikan mumpung ringan.",
        day: "Rabu"
      },
      {
        id: "sample_usr_4",
        task_name: "Koding integrasi SDK payment gateway",
        planned_time: "14:00",
        actual_time: "18:30",
        delay_minutes: 270,
        difficulty: "High",
        category: "Koding",
        completed: false,
        excuse: "Membaca dokumentasi serasa membaca inkripsi kuno, akhirnya beralih nonton ulasan game.",
        day: "Kamis"
      }
    ];
    setActivities(sampleLogs);
    setAnalysis(null);
    setError(null);
  };

  const handleRunAnalysis = async () => {
    if (activities.length === 0) {
      setError("Silakan tambahkan minimal 1 aktivitas di tabel sebelum menjalankan analisis.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ activities })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal menghubungi AI Coach untuk mengevaluasi data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAnalysis(null);
    setError(null);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(name) => { setUserName(name); setIsLoggedIn(true); }} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-12 selection:bg-teal-500 selection:text-slate-950 relative transition-colors duration-300 ${
      theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900 light-theme"
    }`}>
      
      {/* Decorative top ambient shadow */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-radial-at-t from-slate-900/25 via-transparent to-transparent pointer-events-none"></div>

      {/* Header section with spacious alignment */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/10 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <h1 className="text-md font-sans font-bold tracking-tight flex items-center gap-1.5">
                Analis Perilaku Produktivitas
                <span className="text-[10px] uppercase tracking-wider bg-slate-900 border border-slate-800 text-teal-400 font-mono font-bold px-1.5 py-0.5 rounded">
                  AI Coach
                </span>
              </h1>
              <p className="text-[10px] font-mono text-slate-400">Procrastination, excuse &amp; cognitive behavior analyst</p>
            </div>
          </div>

          {/* User profile actions, theme toggle & logout */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-teal-400 transition-all flex items-center justify-center cursor-pointer"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-850 rounded-xl text-xs font-mono text-slate-300">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>{userName}</span>
            </div>
            <button
              id="user-logout-btn"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-rose-400 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full space-y-8 z-10">
        
        {/* Welcome Board & Dynamic Header Greeting */}
        <div className="welcome-banner p-6 bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-40 h-40 text-teal-400 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping"></span>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Portal Evaluasi Personal</span>
            </div>
            <h2 className="text-xl font-sans font-extrabold text-white">
              Selamat Datang Kembali, {userName}! 👋
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ini adalah portal harian unik Anda untuk mengevaluasi bias psikologis di balik kebiasaan menunda pekerjaan. Kelola draf catatan Anda di bawah, rancang excuses paling jujur, lalu undang AI Coach untuk menggambar grafik kustom dan membongkar hambatan perilaku Anda!
            </p>
          </div>
        </div>

        {/* Daily Progress Streak & Local Social Leaderboard board */}
        <StreakLeaderboard userName={userName} theme={theme} />

        {/* Navigation Tabs Selector */}
        <div className="flex flex-wrap border-b border-slate-800/80 gap-2 sm:gap-6 font-sans text-sm pb-1 select-none">
          <button
            onClick={() => setActiveTab("klinik-tes")}
            className={`pb-3 px-2.5 transition-all relative flex items-center gap-2 font-semibold cursor-pointer ${
              activeTab === "klinik-tes"
                ? "text-teal-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            🩺 Klinik Diagnostik Tipe Penunda (Tes &amp; Sertifikat)
            {activeTab === "klinik-tes" && (
              <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2.5px] bg-teal-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("analisis")}
            className={`pb-3 px-2.5 transition-all relative flex items-center gap-2 font-semibold cursor-pointer ${
              activeTab === "analisis"
                ? "text-teal-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Catatan Harian &amp; Analisis AI
            {activeTab === "analisis" && (
              <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2.5px] bg-teal-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("produktivitas")}
            className={`pb-3 px-2.5 transition-all relative flex items-center gap-2 font-semibold cursor-pointer ${
              activeTab === "produktivitas"
                ? "text-teal-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Target className="w-4 h-4 text-rose-500 animate-bounce" />
            Sistem Pemicu Produktivitas (Suara &amp; Tantangan)
            {activeTab === "produktivitas" && (
              <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2.5px] bg-teal-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Dynamic Connected Layout depending on activeTab with background audio persistence */}
        <div className={activeTab === "analisis" ? "space-y-8 animate-fadeIn block" : "hidden"}>
          {/* 1. Catatan data editor list (User's personal area) */}
          <DataEditor
            userName={userName}
            activities={activities}
            onChange={setActivities}
            onClearAll={handleClearAll}
            onLoadSample={handleLoadSample}
            theme={theme}
          />

          {/* 2. Unified AI Result panel + Recharts Visualizations */}
          <AnalyticsDashboard
            userName={userName}
            activities={activities}
            analysis={analysis}
            loading={loading}
            onRunAnalysis={handleRunAnalysis}
            error={error}
            theme={theme}
          />
        </div>

        <div className={activeTab === "produktivitas" ? "space-y-8 max-w-4xl mx-auto animate-fadeIn block" : "hidden"}>
          {/* Ambient synthesizer sound mixer board */}
          <FocusAudioLab />
          
          {/* Spin Wheel Focus Trigger board */}
          <FocusTracker theme={theme} />
        </div>

        <div className={activeTab === "klinik-tes" ? "max-w-4xl mx-auto animate-fadeIn block" : "hidden"}>
          {/* Personality Quiz Clinique */}
          <DiagnosticQuiz 
            userName={userName}
            onNavigateToAudio={() => setActiveTab("produktivitas")}
            onNavigateToTriggers={() => setActiveTab("produktivitas")}
          />
        </div>

      </main>

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-6 border-t border-slate-900 text-center text-[11px] font-mono text-slate-500 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 AI Coach Perilaku Produktivitas — Mengurangi rasa segan, memicu aksi realistis.</p>
        <p className="flex items-center gap-1 text-slate-450 hover:text-slate-300 transition-colors">
          Ditenagai oleh <Sparkles className="w-3.5 h-3.5 text-teal-400 inline" /> Gemini 3.5-Flash
        </p>
      </footer>

    </div>
  );
}
