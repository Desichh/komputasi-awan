import React, { useState, useEffect, useRef } from "react";
import { MICRO_CHALLENGES } from "../scenarios";
import { MicroChallenge } from "../types";
import { 
  Flame, 
  ShieldAlert, 
  Zap, 
  Timer, 
  CheckCircle, 
  RefreshCw, 
  Volume2, 
  ShieldCheck, 
  Play, 
  Pause,
  Smartphone,
  Brain,
  Coffee,
  AlertOctagon,
  Dribbble,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Cohesive tailored challenges mapping to typical silly excuses
const EXCUSE_CHALLENGES = [
  {
    key: "phone",
    label: "📱 Main HP / Scroll Sosmed",
    title: "Penjinak Berhala Smartphone 📱💥",
    description: "Handphone miring sedikit saja bisa menyerap setengah ruang fokus kerja prefrontal korteksmu. Mari kita karantina perangkat ini!",
    icon: Smartphone,
    durationSeconds: 300,
    instructions: [
      "Ambil smartphone kesayanganmu sekarang juga tanpa ditunda.",
      "Aktifkan mode 'Do Not Disturb' atau silent total agar tidak bergetar sama sekali.",
      "Letakkan handphone di tempat terjauh yang tidak bisa dijangkau tangan tanpa berdiri (di lemari, di bawah kasur, atau laci seberang).",
      "Hadap kembali ke monitor dan ketik draf tugas termudahmu selama 5 menit tanpa interupsi bel media sosial."
    ],
    color: "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30 text-purple-300 ring-purple-500/20 hover:ring-purple-500/35"
  },
  {
    key: "focus",
    label: "🧠 Kurang Fokus / Melamun",
    title: "Mekanika Sirkuit Fokus Balik 🧠⚡",
    description: "Pikiran melayang atau melamun membosankan pertanda saraf mata Anda jenuh. Mari kalibrasi retina dan atensi visual!",
    icon: Brain,
    durationSeconds: 300,
    instructions: [
      "Tarik napas sedalam mungkin selama 4 detik, tahan 4 detik, embuskan selama 4 detik (metode Box Breathing).",
      "Sudutkan mata untuk mencari satu titik fisik di mejamu (ujung pena, sudut keyboard) lalu tatap tajam selama 15 detik berturut-turut.",
      "Buka dokumen atau draf kode utama Anda, minimalkan seluruh tab hiburan lain tanpa penyesalan.",
      "Genggam mouse dan keyboard, ketik SATU baris, satu kata, atau satu angka apa saja secara acak untuk memecat status diam otak!"
    ],
    color: "from-teal-500/10 to-emerald-500/10 hover:from-teal-500/20 hover:to-emerald-500/20 border-teal-500/30 text-teal-300 ring-teal-500/20 hover:ring-teal-500/35"
  },
  {
    key: "lazy",
    label: "😴 Mager Parah / Mengantuk",
    title: "Pemicu Aliran Somatik Dingin 🔋🔥",
    description: "Mengantuk dan mager parah biasanya disebabkan tersumbatnya kadar karbondioksida di paru-paru dan posisi tubuh yang layu.",
    icon: Coffee,
    durationSeconds: 300,
    instructions: [
      "Berdiri tegak dari kursi Anda sekarang juga! Tolak gravitasi kasur magnetik Anda santai-santai.",
      "Lakukan stretching tangan ke atas setinggi-tingginya, silangkan jemari, gerakkan kepala ke kiri dan ke kanan.",
      "Minum setengah gelas air putih dingin segar untuk merangsang reseptor usus bawah agar organ tubuh terjaga seketika.",
      "Kembalilah ke depan layar dengan sikap duduk yang tegap, aktifkan sound Binaural Hum di atas, dan mulailah mengetik baris pertama!"
    ],
    color: "from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/30 text-amber-300 ring-amber-500/20 hover:ring-amber-500/35"
  },
  {
    key: "fear",
    label: "😰 Takut Salah / Overthinking",
    title: "Terapi Coretan Sampah Saja! 🗑️✨",
    description: "Otak mengalami kelumpuhan analisis karena terlalu perfeksionis memikirkan draf terbaik pertama. Mari sengaja membuat dokumen terburuk dahulu!",
    icon: AlertOctagon,
    durationSeconds: 300,
    instructions: [
      "Pejamkan mata selama 5 detik, bisikkan pelan: 'Saya diizinkan sepenuhnya membuat draf paling buruk dan sampah hari ini'.",
      "Buka lembar kerja/IDE koding pekerjaan Anda.",
      "Tulis kalimat/kode asal-asalan, hantam keyboard secara berantakan, dan lupakan tata bahasa selama 1 menit penuh.",
      "Simpan draf berantakan itu! Beban kognitif untuk memperbaiki draf jelek jauh lebih ringan 90% dibanding memulai di atas kanvas kosong."
    ],
    color: "from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20 border-rose-500/30 text-rose-300 ring-rose-500/20 hover:ring-rose-500/35"
  }
];

// Web Audio API helper for dynamic haptic/retro audio hints without external audio packages
const playBeep = (type: "start" | "tick" | "success" | "warning") => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "start") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "tick") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === "warning") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (err) {
    // Ignore context failure if browser audio is blocked initially
  }
};

interface FocusTrackerProps {
  theme: "dark" | "light";
}

export default function FocusTracker({ theme }: FocusTrackerProps) {
  const [focusLevel, setFocusLevel] = useState<number>(85); // percentage Representing current focus
  const [activeChallenge, setActiveChallenge] = useState<MicroChallenge | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [idleAlertShow, setIdleAlertShow] = useState<boolean>(false);
  const [challengesCompleted, setChallengesCompleted] = useState<number>(0);
  const [streakMinutes, setStreakMinutes] = useState<number>(0);

  // Spin Wheel states
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [showWheelMode, setShowWheelMode] = useState<boolean>(true); // Mode Spin Wheel aktif default

  // Binaural sound nodes
  const [binauralActive, setBinauralActive] = useState<boolean>(false);
  const audioNodesRef = useRef<{ ctx: AudioContext | null; osc1: OscillatorNode | null; osc2: OscillatorNode | null; gain: GainNode | null }>({
    ctx: null, osc1: null, osc2: null, gain: null
  });

  const idleTimeoutRef = useRef<any>(null);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioNodesRef.current.osc1) {
        try { audioNodesRef.current.osc1.stop(); } catch(e){}
        audioNodesRef.current.osc1.disconnect();
      }
      if (audioNodesRef.current.osc2) {
        try { audioNodesRef.current.osc2.stop(); } catch(e){}
        audioNodesRef.current.osc2.disconnect();
      }
      if (audioNodesRef.current.gain) {
        audioNodesRef.current.gain.disconnect();
      }
    };
  }, []);

  const toggleBinauralSound = () => {
    try {
      if (binauralActive) {
        if (audioNodesRef.current.osc1) {
          try { audioNodesRef.current.osc1.stop(); } catch(e){}
          audioNodesRef.current.osc1.disconnect();
        }
        if (audioNodesRef.current.osc2) {
          try { audioNodesRef.current.osc2.stop(); } catch(e){}
          audioNodesRef.current.osc2.disconnect();
        }
        if (audioNodesRef.current.gain) {
          audioNodesRef.current.gain.disconnect();
        }
        audioNodesRef.current = { ctx: null, osc1: null, osc2: null, gain: null };
        setBinauralActive(false);
      } else {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // 220Hz and 226Hz are low, warm, and highly audible on standard laptop speakers
        // while perfectly maintaining the relaxing 6Hz Theta frequency gap.
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(220, ctx.currentTime); 
        
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(226, ctx.currentTime); 

        gain.gain.setValueAtTime(0.08, ctx.currentTime); // High enough to be audible, low enough to remain ambient

        // Standard robust mixing: connect both oscs to gain and gain to speaker destination
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        // Explicitly resume the audio context to bypass browser autoplay safety restrictions
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        osc1.start();
        osc2.start();

        audioNodesRef.current = { ctx, osc1, osc2, gain };
        setBinauralActive(true);
      }
    } catch (err) {
      console.error("Audio generation failed: ", err);
    }
  };

  // Monitor Idle state
  useEffect(() => {
    const handleActivity = () => {
      if (idleAlertShow) return;
      // Reset idle timer
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      
      // Simulate focus drop detection on idle (35s)
      idleTimeoutRef.current = setTimeout(() => {
        // Drop focus slowly
        setFocusLevel((prev) => {
          const next = Math.max(prev - 25, 10);
          if (next <= 40 && !activeChallenge) {
            triggerFocusCrash();
          }
          return next;
        });
      }, 35000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [activeChallenge, idleAlertShow]);

  // Main countdown worker
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            handleChallengeSuccess();
            return 0;
          }
          // gentle pulse beep on every minute
          if (prev % 60 === 0) {
            playBeep("tick");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Increment some virtual streak
  useEffect(() => {
    let streakInterval: any = null;
    streakInterval = setInterval(() => {
      setStreakMinutes((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(streakInterval);
  }, []);

  const triggerFocusCrash = () => {
    playBeep("warning");
    setIdleAlertShow(true);
    setActiveChallenge(null);
    setTimerSeconds(0);
    setTimerRunning(false);
    setPausedAt(null);
  };

  const handleSelectExcuse = (excuseKey: string) => {
    const excObj = EXCUSE_CHALLENGES.find((item) => item.key === excuseKey);
    if (!excObj) return;

    playBeep("start");
    setActiveChallenge({
      id: excObj.key,
      title: excObj.title,
      description: excObj.description,
      durationSeconds: excObj.durationSeconds,
      instructions: excObj.instructions
    });
    setCompletedSteps(new Array(excObj.instructions.length).fill(false));
    setTimerSeconds(excObj.durationSeconds);
    setTimerRunning(false);
    setPausedAt(null);
  };

  const triggerSpinTicks = () => {
    let tickCount = 0;
    const maxTicks = 22;
    const playNextTick = () => {
      if (tickCount >= maxTicks) return;
      playBeep("tick");
      tickCount++;
      const nextDelay = 80 + Math.pow(tickCount, 2) * 12;
      setTimeout(playNextTick, nextDelay);
    };
    playNextTick();
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Choose a random excuse index (0-3)
    const randomIndex = Math.floor(Math.random() * EXCUSE_CHALLENGES.length);
    const selectedExcuse = EXCUSE_CHALLENGES[randomIndex];
    
    // Angle calculated to put this index precisely at the top visual position (12 o'clock)
    // Formula: 360 - (index * 90 + 45) turns selected wedge center to positive 12 o'clock position
    const targetAngleCenter = randomIndex * 90 + 45;
    const extraRotations = 6; // turns
    const totalRotationDegrees = (extraRotations * 360) + (360 - targetAngleCenter);
    
    const initialBase = Math.floor(wheelRotation / 360) * 360;
    const newRotation = initialBase + totalRotationDegrees;
    
    setWheelRotation(newRotation);
    triggerSpinTicks();
    
    // Wait for spin transition (3.2 seconds) to complete
    setTimeout(() => {
      setIsSpinning(false);
      playBeep("success");
      
      // Select the winning excuse challenge
      setActiveChallenge({
        id: selectedExcuse.key,
        title: selectedExcuse.title,
        description: selectedExcuse.description,
        durationSeconds: selectedExcuse.durationSeconds,
        instructions: selectedExcuse.instructions
      });
      setCompletedSteps(new Array(selectedExcuse.instructions.length).fill(false));
      setTimerSeconds(selectedExcuse.durationSeconds);
      setTimerRunning(false);
      setPausedAt(null);
    }, 3200);
  };

  const handleStartChallenge = () => {
    playBeep("start");
    if (pausedAt) {
      const elapsedSeconds = (Date.now() - pausedAt) / 1000;
      if (elapsedSeconds > 120) {
        // More than 2 minutes pause: Reset from scratch
        if (activeChallenge) {
          setTimerSeconds(activeChallenge.durationSeconds);
          setCompletedSteps(new Array(activeChallenge.instructions.length).fill(false));
          playBeep("warning");
          alert("Jeda melebihi 2 menit! Demi melatih disiplin fokus Anda, tantangan mikro ini diulang kembali dari awal.");
        }
      }
      setPausedAt(null);
    }
    setTimerRunning(true);
    setIdleAlertShow(false);
  };

  const handlePauseChallenge = () => {
    setTimerRunning(false);
    setPausedAt(Date.now());
  };

  const handleStepToggle = (index: number) => {
    const nextSteps = [...completedSteps];
    nextSteps[index] = !nextSteps[index];
    setCompletedSteps(nextSteps);
    playBeep("tick");
    
    // Boost focus slightly on step completion
    setFocusLevel((prev) => Math.min(prev + 5, 100));
  };

  const handleChallengeSuccess = () => {
    playBeep("success");
    setChallengesCompleted((prev) => prev + 1);
    setFocusLevel(100);
    alert("Kemenangan Mikro! Otakmu berhasil diselamatkan dari jajahan dopamin instan.");
    setActiveChallenge(null);
    setPausedAt(null);
  };

  const handleSkipChallenge = () => {
    setActiveChallenge(null);
    setTimerRunning(false);
    setFocusLevel(65);
    setIdleAlertShow(false);
    setPausedAt(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div id="focus-tracker-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative top pulse */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-sans font-semibold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            Sistem Pemicu Produktivitas
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">Focus drops and micro-challenge detection</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            Tantangan Selesai: <span className="text-teal-400 font-bold">{challengesCompleted}</span>
          </div>

          <div className="px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            Waktu Aktif: <span className="text-emerald-400 font-bold">{streakMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Focus Level Indicator bar */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/60 mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-mono text-slate-400">Level Fokus Terdeteksi:</label>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            focusLevel > 70 ? "text-teal-400 bg-teal-950/50" :
            focusLevel > 40 ? "text-amber-400 bg-amber-950/50" :
            "text-rose-400 bg-rose-950/50"
          }`}>
            {focusLevel}% — {focusLevel > 70 ? "OPTIMAL" : focusLevel > 40 ? "MENURUN" : "KRITIS"}
          </span>
        </div>

        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: "85%" }}
            animate={{ width: `${focusLevel}%` }}
            transition={{ type: "spring", stiffness: 60 }}
            className={`h-full rounded-full ${
              focusLevel > 70 ? "bg-gradient-to-r from-teal-500 to-emerald-400" :
              focusLevel > 40 ? "bg-gradient-to-r from-amber-500 to-yellow-400" :
              "bg-gradient-to-r from-rose-500 to-red-600"
            }`}
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-slate-500" />
            <span className="italic">AI memantau keaktifan tab Anda untuk mendeteksi pikiran melayang.</span>
          </p>

          <button 
            id="simulate-drop"
            onClick={triggerFocusCrash}
            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 hover:underline bg-rose-950/20 px-2 py-1 rounded border border-rose-900/40 transition-colors"
          >
            Simulasi Pikiran Melayang 🧠💥
          </button>
        </div>
      </div>

      {/* 🎧 Gelombang Binaural Focus Hum (Theta) */}
      <div className="bg-slate-950/55 rounded-xl p-4 border border-slate-850/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 transition-all hover:border-slate-800">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${binauralActive ? "bg-teal-950 text-teal-400" : "bg-slate-900 text-slate-500"} border border-slate-800`}>
            <Volume2 className={`w-5 h-5 ${binauralActive ? "animate-pulse" : ""}`} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block">🎧 Binaural Focus Soundtrack (Gelombang Theta 6Hz)</span>
            <span className="text-[10px] text-slate-400 block italic leading-relaxed mt-0.5 max-w-xl">
              Meminta web synthesizer menghasilkan nada dengung konstan (120Hz dan 126Hz). Selisih frekuensi 6Hz dipercaya merangsang gelombang theta otak untuk fokus menyerap materi rumit.
            </span>
          </div>
        </div>

        <button
          onClick={toggleBinauralSound}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer w-full sm:w-auto justify-center ${
            binauralActive 
              ? "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/10"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
          }`}
        >
          {binauralActive ? "● MATIKAN HUM" : "▶ MAINKAN HUM JALUR 6HZ"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!activeChallenge ? (
          <motion.div
            key="excuse-selector-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {idleAlertShow && (
              <div className="bg-amber-950/45 border border-amber-500/40 rounded-xl p-4 flex gap-3 text-amber-200 text-xs animate-pulse">
                <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-350">Deteksi Pikiran Melayang / Drop Fokus! 🧠💥</p>
                  <p className="mt-1 leading-relaxed">
                    Sistem mendeteksi jeda aktivitas yang mencurigakan. Jangan biarkan dopamin instan merusak harimu! Pilih alasan konyol Anda di bawah untuk mendapatkan pemulihan instan.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6">
              {/* Tab Selector Mode */}
              <div className="flex bg-slate-900/85 p-1 rounded-xl border border-slate-800/80 gap-1 mb-6">
                <button 
                  type="button"
                  onClick={() => setShowWheelMode(true)}
                  className={`flex-1 py-1.5 text-xs font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${showWheelMode ? "bg-slate-800 text-teal-400 border border-slate-700/60 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                >
                  🎰 Spin Wheel Alasan Konyol
                </button>
                <button 
                  type="button"
                  onClick={() => setShowWheelMode(false)}
                  className={`flex-1 py-1.5 text-xs font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${!showWheelMode ? "bg-slate-800 text-teal-400 border border-slate-700/60 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                >
                  📋 Pilih Alasan Manual
                </button>
              </div>

              {showWheelMode ? (
                /* Interactive Fortune Wheel Layout */
                <div className="flex flex-col items-center justify-center py-4 relative">
                  <div className="absolute top-0 left-0 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/40">
                    Silly Wheel Mode
                  </div>
                  
                  {/* Wheel pointer at top center */}
                  <div className="relative z-10 -mb-2">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-amber-400 filter drop-shadow-[0_4px_6px_rgba(251,191,36,0.5)] animate-pulse" />
                  </div>

                  {/* Circle layout outer glow */}
                  <div className="relative w-64 h-64 md:w-72 md:h-72 my-2 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center shadow-xl shadow-teal-500/5 hover:shadow-teal-500/10 transition-shadow">
                    <div className="absolute inset-1.5 rounded-full border border-slate-800" />
                    <div className="absolute -inset-1 rounded-full border border-teal-500/15 animate-pulse" />

                    {/* Core Spinning Wheel */}
                    <div 
                      className="w-full h-full rounded-full overflow-hidden"
                      style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: isSpinning ? 'transform 3.2s cubic-bezier(0.1, 0.8, 0.15, 1)' : 'transform 0.5s ease',
                      }}
                    >
                      <svg viewBox="0 0 200 200" className="w-full h-full select-none">
                        <defs>
                          <radialGradient id="purpleGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#4a044e" stopOpacity="0.8" />
                          </radialGradient>
                          <radialGradient id="tealGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#115e59" stopOpacity="0.8" />
                          </radialGradient>
                          <radialGradient id="amberGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#78350f" stopOpacity="0.8" />
                          </radialGradient>
                          <radialGradient id="roseGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#4c0519" stopOpacity="0.8" />
                          </radialGradient>
                        </defs>

                        {/* Pie segments with radius 90 */}
                        <path d="M 100 100 L 100 10 A 90 90 0 0 1 190 100 Z" fill="url(#purpleGrad)" stroke="#581c87" strokeWidth="1" />
                        <path d="M 100 100 L 190 100 A 90 90 0 0 1 100 190 Z" fill="url(#tealGrad)" stroke="#115e59" strokeWidth="1" />
                        <path d="M 100 100 L 100 190 A 90 90 0 0 1 10 100 Z" fill="url(#amberGrad)" stroke="#78350f" strokeWidth="1" />
                        <path d="M 100 100 L 10 100 A 90 90 0 0 1 100 10 Z" fill="url(#roseGrad)" stroke="#4c0519" strokeWidth="1" />

                        {/* Outer gold visual boundary dots */}
                        <circle cx="100" cy="11" r="2.5" className="fill-amber-400" />
                        <circle cx="189" cy="100" r="2.5" className="fill-amber-400" />
                        <circle cx="100" cy="189" r="2.5" className="fill-amber-400" />
                        <circle cx="11" cy="100" r="2.5" className="fill-amber-400" />

                        {/* Center aesthetic core */}
                        <circle cx="100" cy="100" r="18" className="fill-slate-900 stroke-slate-800" strokeWidth="2" />
                        <circle cx="100" cy="100" r="12" className="fill-slate-950 stroke-teal-500/20" strokeWidth="1" />
                        <circle cx="100" cy="100" r="5" className="fill-amber-400 animate-pulse" />

                        {/* Sector labeled details */}
                        {/* Slice 0: Main HP (Center angle 45°) */}
                        <g transform={`translate(${100 + 52 * Math.cos((45 * Math.PI)/180)}, ${100 - 52 * Math.sin((45 * Math.PI)/180)}) rotate(45)`}>
                          <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-purple-200 tracking-wide pointer-events-none drop-shadow">
                            📱 MAIN HP
                          </text>
                        </g>

                        {/* Slice 1: Kurang Fokus (Center angle 135°) */}
                        <g transform={`translate(${100 + 52 * Math.cos((-45 * Math.PI)/180)}, ${100 - 52 * Math.sin((-45 * Math.PI)/180)}) rotate(-45)`}>
                          <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-teal-200 tracking-wide pointer-events-none drop-shadow">
                            🧠 COGNITIVE
                          </text>
                        </g>

                        {/* Slice 2: Mager Parah (Center angle 225°) */}
                        <g transform={`translate(${100 + 52 * Math.cos((-135 * Math.PI)/180)}, ${100 - 52 * Math.sin((-135 * Math.PI)/180)}) rotate(45)`}>
                          <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-amber-200 tracking-wide pointer-events-none drop-shadow">
                            😴 MAGER
                          </text>
                        </g>

                        {/* Slice 3: Takut Salah (Center angle 315°) */}
                        <g transform={`translate(${100 + 52 * Math.cos((135 * Math.PI)/180)}, ${100 - 52 * Math.sin((135 * Math.PI)/180)}) rotate(-45)`}>
                          <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-rose-200 tracking-wide pointer-events-none drop-shadow">
                            😰 OVERTHINK
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Spin Trigger Button */}
                  <div className="mt-5 flex flex-col items-center gap-1.5 w-full max-w-xs">
                    <button
                      id="spin-wheel-btn"
                      type="button"
                      disabled={isSpinning}
                      onClick={handleSpinWheel}
                      className={`w-full py-3.5 px-6 rounded-xl font-sans font-bold text-xs tracking-wider transition-all shadow-lg active:scale-[0.98] ${
                        isSpinning
                          ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                          : "bg-teal-500 hover:bg-teal-400 text-slate-950 font-sans font-extrabold cursor-pointer hover:shadow-teal-500/20 hover:scale-[1.01]"
                      }`}
                    >
                      {isSpinning ? "🎰 SEDANG MEMUTAR TAKDIR KOGNITIF..." : "🎰 PUTAR RODA ALASAN KONYOL!"}
                    </button>
                    <p className="text-[10px] font-mono text-slate-400 text-center leading-relaxed max-w-[240px]">
                      {isSpinning 
                        ? "Sistem sedang menyeimbangkan bias otak Anda..." 
                        : "Klik tombol di atas untuk memilih krisis anti-prokrastinasi kustom Anda!"}
                    </p>
                  </div>
                </div>
              ) : (
                /* Classic Manual Selector Grid */
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-sans font-bold tracking-tight text-slate-200">
                      Pilih Alasan Menundamu Saat Ini (Alasan Konyol):
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Tantangan kustom akan disinkronkan secara ilmiah untuk menyembuhkan sumbatan kognitif Anda. Jadilah jujur pada diri sendiri!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {EXCUSE_CHALLENGES.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => handleSelectExcuse(item.key)}
                          className={`p-4 rounded-xl border bg-gradient-to-br ${item.color} text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 cursor-pointer ring-1 ring-inset`}
                        >
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 font-bold flex-shrink-0 shadow-inner">
                            <Icon className="w-5 h-5 text-teal-400" />
                          </div>
                          <div className="flex-1">
                            <span className="font-sans font-bold text-slate-100 text-sm block">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-1 leading-relaxed">
                              {item.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

          </motion.div>
        ) : (
          <motion.div
            key={activeChallenge.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-slate-950 rounded-xl border border-teal-500/30 p-5 mt-4 text-slate-100"
          >
            <div className="flex justify-between items-start gap-3 mb-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider bg-teal-950 text-teal-400 border border-teal-900 px-2 py-0.5 rounded font-mono font-bold">
                  ⚡ TANTANGAN MIKRO PENYELAMAT FOKUS
                </span>
                <h4 className="text-md font-bold text-teal-300 mt-1.5 flex items-center gap-1.5">
                  {activeChallenge.title}
                </h4>
              </div>

              {/* Countdown clock with custom typography */}
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">WAKTU AKTIF</span>
                <span className="font-mono text-xl font-bold text-amber-400 tracking-wider">
                  {formatTime(timerSeconds)}
                </span>
                {!timerRunning && pausedAt && (
                  <span className="text-[9px] font-mono text-rose-400 block mt-0.5 animate-pulse font-semibold">
                    ⏸️ JEDA (Maks 2m)
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 italic pl-3 border-l-2 border-amber-500">
              "{activeChallenge.description}"
            </p>

            <div className="space-y-2.5 mb-5">
              <label className="text-[11px] font-mono text-slate-400">LANGKAH REALISTIS (CENTANG SATU PER SATU):</label>
              {activeChallenge.instructions.map((inst, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleStepToggle(idx)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                    completedSteps[idx] 
                      ? "bg-teal-950/20 border-teal-800/80 text-teal-300" 
                      : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="mt-0.5">
                    {completedSteps[idx] ? (
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center font-mono text-[9px] text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">{inst}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end items-center text-xs">
              <button
                id="skip-challenge"
                onClick={handleSkipChallenge}
                className="text-slate-400 hover:text-slate-300 font-mono px-3 py-1.5 rounded hover:bg-slate-900 transition-colors"
              >
                Tunda Dulu (Menyerah)
              </button>

              {timerRunning ? (
                <button
                  id="pause-timer"
                  onClick={handlePauseChallenge}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Jeda Pomodoro
                </button>
              ) : (
                <button
                  id="start-timer"
                  onClick={handleStartChallenge}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all font-sans"
                >
                  <Play className="w-4 h-4" />
                  Terima &amp; Mulai 5 Menit!
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
