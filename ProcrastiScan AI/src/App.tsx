import React, { useState, useEffect } from "react";
import { Activity, AnalysisResponse } from "./types";
import DataEditor from "./components/DataEditor";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import FocusTracker from "./components/FocusTracker";
import LoginScreen from "./components/LoginScreen";
import FocusAudioLab from "./components/FocusAudioLab";
import DiagnosticQuiz from "./components/DiagnosticQuiz";
import StreakLeaderboard from "./components/StreakLeaderboard";
import GraduationCertificate from "./components/GraduationCertificate";
import PsychConsultation from "./components/PsychConsultation";
import { Brain, LayoutDashboard, Target, Sparkles, LogOut, User, Sun, Moon, Award, Activity as PulseIcon, Music, Menu, X, BookOpen, ShieldAlert, Clock, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication status state (persist session under page refreshes)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("procrastination_is_logged_in") === "true";
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("procrastination_username") || "";
  });

  // Visual Theme Mode State
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Lifted focus state parameters for live session check & warning interceptors
  const [isFocusSessionActive, setIsFocusSessionActive] = useState<boolean>(false);
  const [currentFocusLevel, setFocusLevel] = useState<number>(() => {
    // We will initialize under the user namespace with 85% default initial target
    const savedLvl = localStorage.getItem(`procrastination_focus_level_${localStorage.getItem("procrastination_username") || "Guest"}`);
    return savedLvl ? parseFloat(savedLvl) : 85;
  });

  // Tab Selection State (Default: "klinik-tes" / Klinik Diagnostik)
  const [activeTab, setActiveTabInner] = useState<"klinik-tes" | "catatan-harian" | "pemicu-tantangan" | "musik-fokus" | "sertifikat" | "konsultasi-ai">(() => {
    const saved = localStorage.getItem("procrastination_active_tab");
    if (!saved || saved === "utama" || saved === "analisis") return "klinik-tes";
    if (saved === "produktivitas") return "pemicu-tantangan";
    return saved as any;
  });

  const setActiveTab = (tab: "klinik-tes" | "catatan-harian" | "pemicu-tantangan" | "musik-fokus" | "sertifikat" | "konsultasi-ai") => {
    setActiveTabInner(tab);
    localStorage.setItem("procrastination_active_tab", tab);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync focus level to localStorage whenever it is modified
  useEffect(() => {
    if (userName) {
      localStorage.setItem(`procrastination_focus_level_${userName}`, currentFocusLevel.toString());
    }
  }, [currentFocusLevel, userName]);

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

      // Restore AI analysis report specifically for this username
      const savedAnalysis = localStorage.getItem(`procrastination_analysis_${userName}`);
      if (savedAnalysis) {
        try {
          setAnalysis(JSON.parse(savedAnalysis));
        } catch (e) {
          setAnalysis(null);
        }
      } else {
        setAnalysis(null);
      }
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
      if (userName) {
        localStorage.setItem(`procrastination_analysis_${userName}`, JSON.stringify(data));
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal menghubungi AI Coach untuk mengevaluasi data.");
    } finally {
      setLoading(false);
    }
  };

  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState<boolean>(false);
  const [pendingTargetTab, setPendingTargetTab] = useState<"klinik-tes" | "catatan-harian" | "pemicu-tantangan" | "musik-fokus" | "sertifikat" | "konsultasi-ai" | "logout" | null>(null);

  const handleTabClick = (targetTab: "klinik-tes" | "catatan-harian" | "pemicu-tantangan" | "musik-fokus" | "sertifikat" | "konsultasi-ai") => {
    if (activeTab === targetTab) {
      setMobileMenuOpen(false);
      return;
    }

    if (isFocusSessionActive) {
      setPendingTargetTab(targetTab);
      setShowLeaveConfirmModal(true);
      setMobileMenuOpen(false);
    } else {
      setActiveTab(targetTab);
      setMobileMenuOpen(false);
    }
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    localStorage.setItem("procrastination_is_logged_in", "true");
    localStorage.setItem("procrastination_username", name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    localStorage.removeItem("procrastination_is_logged_in");
    localStorage.removeItem("procrastination_username");
    setAnalysis(null);
    setError(null);
  };

  const handleLogoutWithCheck = () => {
    if (isFocusSessionActive) {
      setPendingTargetTab("logout");
      setShowLeaveConfirmModal(true);
      setMobileMenuOpen(false);
    } else {
      handleLogout();
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
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
            {/* Mobile/Desktop menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 px-3 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-teal-400 hover:border-teal-500/20 transition-all flex items-center justify-center cursor-pointer gap-2"
              title="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4 text-teal-400" />}
              <span className="text-xs font-bold font-sans">Menu Navigasi</span>
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/10 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <h1 className="text-md font-sans font-bold tracking-tight flex items-center gap-1.5">
                ProcrastiScan AI
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
              onClick={handleLogoutWithCheck}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-rose-400 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Desktop Drawer Navigation Backdrop (Only visible on demand when clicked) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs"
            />
            {/* Slide menu panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="absolute top-0 bottom-0 left-0 w-72 bg-slate-950 border-r border-slate-900 p-6 flex flex-col gap-6 shadow-2xl z-55"
            >
              {/* Brand Logo inside Drawer */}
              <div className="flex items-center gap-3 border-b border-slate-900 pb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Brain className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">ProcrastiScan Nav</h3>
                  <p className="text-[9px] font-mono text-slate-400">AI Coach Workspace</p>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <nav className="flex-1 space-y-2.5 overflow-y-auto">
                {[
                  { id: "klinik-tes", label: "1. Klinik Diagnostik", icon: Brain, desc: "Cek Tipe Penunda & Resep AI" },
                  { id: "catatan-harian", label: "2. Catatan Harian & Analisis", icon: BookOpen, desc: "Catat Postpones & AI Oracle" },
                  { id: "pemicu-tantangan", label: "3. Pemicu Produktivitas", icon: Target, desc: "Aksi 15 Menit & Spin Wheel" },
                  { id: "musik-fokus", label: "4. Musik Ambient Fokus", icon: Music, desc: "Binaural Beat Theta Lab" },
                  { id: "sertifikat", label: "5. Kelulusan & Konsistensi", icon: Award, desc: "Sertifikat Disiplin Harian" },
                  { id: "konsultasi-ai", label: "6. Konsultasi Psikologis AI", icon: MessageSquare, desc: "Curhat & Intervensi CBT" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id as any)}
                      className={`w-full px-4 py-3 rounded-xl border text-left font-sans text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 text-teal-400 border-teal-500/30 shadow-md shadow-teal-500/5 font-extrabold"
                          : "border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                      <div>
                        <span className="block text-xs leading-none">{item.label}</span>
                        <span className="text-[9px] font-normal text-slate-400 block mt-1">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* User footer profile details */}
              <div className="border-t border-slate-900 pt-5 space-y-4">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/60 border border-slate-900 rounded-xl text-xs font-mono text-slate-300">
                  <User className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span className="truncate">{userName}</span>
                </div>
                <button
                  onClick={handleLogoutWithCheck}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 hover:text-rose-400 border border-slate-850 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout Dari Akun
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container Layout (Cinema style: full-width stretch of 100%) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full flex flex-col gap-8 z-10 relative">

        {/* Content Panel Area */}
        <div className="flex-1 min-w-0 space-y-8">
          
          {/* Welcome Board & Dynamic Header Greeting */}
          <div className="welcome-banner p-6 bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
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

          {/* Connected Tab Layout Views */}

          {/* tab 1: Halaman Catatan Harian (Catatan Harian & AI Oracle) */}
          <div className={activeTab === "catatan-harian" ? "space-y-8 animate-fadeIn block" : "hidden"}>
            {/* Catatan data editor list (User's personal area) */}
            <DataEditor
              userName={userName}
              activities={activities}
              onChange={setActivities}
              onClearAll={handleClearAll}
              onLoadSample={handleLoadSample}
              theme={theme}
            />
            
            {/* Unified AI Result panel + Recharts Visualizations */}
            <AnalyticsDashboard
              userName={userName}
              activities={activities}
              analysis={analysis}
              loading={loading}
              onRunAnalysis={handleRunAnalysis}
              error={error}
              theme={theme}
              onNavigateToTriggers={() => handleTabClick("pemicu-tantangan")}
            />
          </div>

          {/* tab 2: Klinik Diagnostik Tipe Penunda */}
          <div className={activeTab === "klinik-tes" ? "space-y-8 animate-fadeIn block" : "hidden"}>
            {/* Daily Progress Streak & Local Social Leaderboard board */}
            <StreakLeaderboard userName={userName} theme={theme} />

            {/* Personality Quiz Clinique */}
            <DiagnosticQuiz 
              userName={userName}
              onNavigateToCatatan={() => handleTabClick("catatan-harian")}
              onNavigateToTriggers={() => handleTabClick("pemicu-tantangan")}
            />
          </div>

          {/* tab 3: Sistem Pemicu Produktivitas & Tantangan */}
          <div className={activeTab === "pemicu-tantangan" ? "animate-fadeIn block" : "hidden"}>
            {/* Spin Wheel Focus Trigger board */}
            <FocusTracker 
              theme={theme} 
              userName={userName}
              activities={activities}
              onChangeActivities={setActivities}
              focusSessionActive={isFocusSessionActive}
              setFocusSessionActive={setIsFocusSessionActive}
              focusLevel={currentFocusLevel}
              setFocusLevel={setFocusLevel}
              activeTab={activeTab}
            />
          </div>

          {/* tab 4: Musik Ambient Fokus */}
          <div className={activeTab === "musik-fokus" ? "animate-fadeIn block" : "hidden"}>
            <FocusAudioLab />
          </div>

          {/* tab 5: Sertifikat Graduation */}
          <div className={activeTab === "sertifikat" ? "animate-fadeIn block" : "hidden"}>
            <GraduationCertificate 
              userName={userName}
              theme={theme}
              focusLevel={currentFocusLevel}
            />
          </div>

          {/* tab 4: Konsultasi Psikologis AI */}
          <div className={activeTab === "konsultasi-ai" ? "animate-fadeIn block" : "hidden"}>
            <PsychConsultation 
              userName={userName} 
              theme={theme} 
            />
          </div>

        </div>
      </main>

      {/* Focus Intercept Guard Action Modals Dialog */}
      {showLeaveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600"></div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 flex-shrink-0">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-sans font-extrabold text-white">
                  Sesi Fokus Aktif Sedang Berjalan! 🛑
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Hai {userName}, Anda sedang berada dalam sesi latihan meningkatkan fokus mental (Rencana Aksi 15 Menit / Sesi 5 Menit). 
                  Meninggalkan halaman ini sekarang dianggap sebagai <strong>Menyerah (Surrender)</strong>!
                  {currentFocusLevel < 80 ? (
                    <span className="text-amber-500 block mt-1.5 font-semibold">
                      ⚠️ Tingkat fokus Anda ({currentFocusLevel}%) saat ini masih di bawah 80%. Jika Anda nekat menyerah, LEVEL FOKUS ANDA AKAN DI-RESTART kembali dari level pemula (40%)! Selesaikan misi atau level fokus direstart.
                    </span>
                  ) : (
                    <span className="text-slate-400 block mt-1.5">
                      Tingkat fokus Anda ({currentFocusLevel}%) saat ini di atas 80%. Menyerah sekarang akan memberi penalti pengurangan level fokus sebesar -15%.
                    </span>
                  )}
                </p>
                <div className="mt-3.5 p-2.5 bg-slate-950/60 rounded-lg border border-slate-850 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="text-[11px] font-mono text-slate-300">Level Fokus Saat Ini: {currentFocusLevel}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2.5 mt-6 justify-end text-sm">
              <button
                type="button"
                onClick={() => {
                  // Surrender penalty: restart to 40% if under 80%, otherwise decrease by 15%
                  if (currentFocusLevel < 80) {
                    setFocusLevel(40);
                    alert("⚠️ Level fokus Anda direstart kembali ke 40% karena menyerah sebelum mencapai target minimal 80% untuk kelulusan!");
                  } else {
                    const targetLevelValue = Math.max(0, currentFocusLevel - 15);
                    setFocusLevel(targetLevelValue);
                  }
                  setIsFocusSessionActive(false);
                  setShowLeaveConfirmModal(false);
                  if (pendingTargetTab === "logout") {
                    handleLogout();
                  } else if (pendingTargetTab) {
                    setActiveTab(pendingTargetTab);
                  }
                  setPendingTargetTab(null);
                }}
                className="py-2 px-4 rounded-xl bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-500/20 transition-all text-xs font-bold cursor-pointer"
              >
                {currentFocusLevel < 80 ? "Menyerah & Restart Level Fokus" : "Menyerah & Kurangi -15%"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveConfirmModal(false);
                  setPendingTargetTab(null);
                }}
                className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-teal-500/10"
              >
                Selesaikan Misi &amp; Fokus!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-6 border-t border-slate-900 text-center text-[11px] font-mono text-slate-500 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 ProcrastiScan AI Coach — Mengurangi rasa segan, memicu aksi realistis.</p>
        <p className="flex items-center gap-1 text-slate-450 hover:text-slate-300 transition-colors">
          Ditenagai oleh <Sparkles className="w-3.5 h-3.5 text-teal-400 inline" /> Gemini 3.5-Flash
        </p>
      </footer>

    </div>
  );
}
