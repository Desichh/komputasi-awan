import React, { useState, useEffect } from "react";
import { Brain, Sparkles, LogIn, Lock, UserCheck, UserPlus, HelpCircle, ArrowRight, ShieldCheck, User } from "lucide-react";
import { motion } from "motion/react";

interface LoginScreenProps {
  onLogin: (userName: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  // Navigation: "pribadi" (Personal account login/register) vs "umum" (Guest login)
  const [authType, setAuthType] = useState<"pribadi" | "umum">("pribadi");
  
  // Under "pribadi", state can be "masuk" (Login) or "daftar" (Register)
  const [personalAction, setPersonalAction] = useState<"masuk" | "daftar">("masuk");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize a mock local user DB in LocalStorage for persistence representation
  useEffect(() => {
    const existingUsers = localStorage.getItem("procrastination_registered_users");
    if (!existingUsers) {
      // Seed a default admin/user for demonstration
      const initialUsers = {
        "desi": "cepat2026",
        "demo": "demo123"
      };
      localStorage.setItem("procrastination_registered_users", JSON.stringify(initialUsers));
    }
  }, []);

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedUser = username.trim();
    const trimmedPass = password;

    if (!trimmedUser) {
      setErrorMsg("Nama pengguna tidak boleh kosong!");
      return;
    }
    if (trimmedUser.length < 3) {
      setErrorMsg("Nama pengguna minimal 3 karakter!");
      return;
    }
    if (!trimmedPass) {
      setErrorMsg("Kata sandi tidak boleh kosong!");
      return;
    }

    const savedUsersStr = localStorage.getItem("procrastination_registered_users");
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : {};

    if (personalAction === "daftar") {
      // Registration Logic
      if (trimmedPass.length < 4) {
        setErrorMsg("Kata sandi terlalu pendek! Minimal 4 karakter.");
        return;
      }
      if (trimmedPass !== confirmPassword) {
        setErrorMsg("Konfirmasi kata sandi tidak cocok!");
        return;
      }

      // Check if username is taken (case insensitive lookup for user safety)
      const isTaken = Object.keys(savedUsers).some(
        (u) => u.toLowerCase() === trimmedUser.toLowerCase()
      );

      if (isTaken) {
        setErrorMsg("Nama pengguna tersebut sudah terdaftar! Gunakan nama lain.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        // Save user
        savedUsers[trimmedUser] = trimmedPass;
        localStorage.setItem("procrastination_registered_users", JSON.stringify(savedUsers));
        
        setIsLoading(false);
        setSuccessMsg("Pendaftaran berhasil! Mengarahkan Anda ke dashboard...");
        
        // Log in automatically after a brief delay for realistic premium feedback
        setTimeout(() => {
          onLogin(trimmedUser);
        }, 1200);
      }, 1000);

    } else {
      // Login Logic
      const matchedKey = Object.keys(savedUsers).find(
        (u) => u.toLowerCase() === trimmedUser.toLowerCase()
      );

      if (!matchedKey || savedUsers[matchedKey] !== trimmedPass) {
        setErrorMsg("Nama pengguna tidak ditemukan atau kata sandi salah!");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(matchedKey); // Logs in with the original registered case formatting
      }, 900);
    }
  };

  const handleGuestLogin = (guestProfileName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin(guestProfileName);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Ambient gradient backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial-at-c from-teal-500/10 via-transparent to-transparent filter blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-radial-at-c from-indigo-500/5 via-transparent to-transparent filter blur-3xl rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand identity header */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-400 p-0.5 shadow-xl shadow-teal-500/10 mx-auto flex items-center justify-center mb-3"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-7 h-7 text-teal-400 animate-pulse" />
            </div>
          </motion.div>
          
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Analis Perilaku Produktivitas
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
            AI Procrastination &amp; Cognitive Coach
          </p>
        </div>

        {/* Auth Type Switcher Header */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4 font-mono text-xs font-bold">
          <button
            onClick={() => {
              setAuthType("pribadi");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authType === "pribadi"
                ? "bg-slate-800 text-teal-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Akun Pribadi (Simpan)
          </button>
          
          <button
            onClick={() => {
              setAuthType("umum");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authType === "umum"
                ? "bg-slate-800 text-teal-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Pengguna Umum (Tamu)
          </button>
        </div>

        {/* Central Card Form panel */}
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/95 border border-slate-850/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
          {/* Top aesthetic color bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-amber-400 to-indigo-500"></div>

          {authType === "pribadi" ? (
            <div>
              {/* Login vs Register Switcher */}
              <div className="flex justify-center gap-4 border-b border-slate-850 pb-3.5 mb-5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setPersonalAction("masuk");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`pb-1 px-1 transition-all relative cursor-pointer ${
                    personalAction === "masuk" ? "text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Masuk Akun Pribadi
                  {personalAction === "masuk" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-teal-400"></span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPersonalAction("daftar");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`pb-1 px-1 transition-all relative cursor-pointer ${
                    personalAction === "daftar" ? "text-teal-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Daftar Akun Baru
                  {personalAction === "daftar" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-teal-400"></span>
                  )}
                </button>
              </div>

              <div className="text-center mb-4">
                <p className="text-[11px] text-slate-400">
                  {personalAction === "masuk" 
                    ? "Gunakan akun Anda untuk memuat catatan aktivitas dan data yang telah tersimpan." 
                    : "Buat akun unik Anda secara instan untuk melacak riwayat kegiatan secara pribadi."}
                </p>
              </div>

              <form onSubmit={handlePersonalSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    NAMA PENGGUNA (USERNAME):
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: desinofitasari"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    KATA SANDI:
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                    />
                  </div>
                </div>

                {personalAction === "daftar" && (
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      ULANGI KATA SANDI:
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang password..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                      />
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-xs font-mono text-rose-400 bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-900/30">
                    ⚠️ {errorMsg}
                  </p>
                )}

                {successMsg && (
                  <p className="text-xs font-mono text-emerald-400 bg-emerald-950/25 px-3 py-2 rounded-lg border border-emerald-900/30">
                    🎉 {successMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      {personalAction === "masuk" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {personalAction === "masuk" ? "Masuk ke Akun Saya" : "Daftar Akun Baru & Masuk"}
                    </>
                  )}
                </button>
              </form>

              {personalAction === "masuk" && (
                <div className="mt-4 pt-3 border-t border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Uji coba? Username: <strong className="text-slate-400">desi</strong> | Password: <strong className="text-slate-400">cepat2026</strong>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wide">
                  Masuk Instan (Tamu / Umum)
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Ingin langsung mencoba tanpa mendaftar akun? Data Anda akan disimpan secara lokal di browser ini khusus untuk profil tamu.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleGuestLogin("Pengguna Umum")}
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-teal-400" />
                      Masuk sebagai Pengguna Umum
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </motion.div>

        {/* Footnote quote with high readability */}
        <p className="text-center text-[10px] font-mono text-slate-650 mt-6 leading-relaxed max-w-xs mx-auto">
          "Pikiran yang menunda adalah pikiran yang mencintai imajinasi masa depan yang sempurna daripada kerja nyata sekarang juga."
        </p>

      </div>
    </div>
  );
}
