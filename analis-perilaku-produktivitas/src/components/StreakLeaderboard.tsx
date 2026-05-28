import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Award, 
  Sparkles, 
  Users, 
  Calendar, 
  ThumbsUp, 
  ChevronRight, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  Share2, 
  HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StreakData {
  count: number;
  lastCheckInDate: string; // YYYY-MM-DD
  allTimeHigh: number;
  unlockedBadges: string[];
}

interface LeaderboardItem {
  name: string;
  role: string;
  streak: number;
  claps: number;
  isCurrentUser?: boolean;
}

interface StreakLeaderboardProps {
  userName: string;
  theme: "dark" | "light";
}

export default function StreakLeaderboard({ userName, theme }: StreakLeaderboardProps) {
  // ---------------- STREAK DATA PERSISTENCE ----------------
  const [streak, setStreak] = useState<StreakData>({
    count: 1,
    lastCheckInDate: "",
    allTimeHigh: 1,
    unlockedBadges: ["Pelopor Aksi"]
  });

  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [clapAnims, setClapAnims] = useState<{ id: number; x: number; y: number }[]>([]);
  const [animIdCounter, setAnimIdCounter] = useState<number>(0);

  // ---------------- SIMULATED PEERS LEADERBOARD ----------------
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  // Get date string (indonesia local time YYYY-MM-DD)
  const getTodayString = () => {
    const d = new Date();
    // Use simple ISO format local offset
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Safe load streak and leaderboard data on mount
  useEffect(() => {
    if (!userName) return;

    // Load streak data
    const savedStreak = localStorage.getItem(`focus_streak_v1_${userName}`);
    const todayStr = getTodayString();
    const yesterdayStr = getYesterdayString();

    let currentStreakObj: StreakData = {
      count: 1,
      lastCheckInDate: "",
      allTimeHigh: 1,
      unlockedBadges: ["Pelopor Aksi"]
    };

    if (savedStreak) {
      try {
        const parsed = JSON.parse(savedStreak) as StreakData;
        
        // Evaluate if streak broke (if last checkin was before yesterday)
        if (parsed.lastCheckInDate !== todayStr && parsed.lastCheckInDate !== yesterdayStr && parsed.lastCheckInDate !== "") {
          // Streak broke! Reset to 1, but keep allTimeHigh
          currentStreakObj = {
            count: 1,
            lastCheckInDate: parsed.lastCheckInDate, // preserve last date to prevent immediately re-triggering checkin increments
            allTimeHigh: Math.max(parsed.allTimeHigh || 1, 1),
            unlockedBadges: parsed.unlockedBadges || ["Pelopor Aksi"]
          };
        } else {
          currentStreakObj = parsed;
        }
      } catch (e) {
        console.error("Error loading streak data", e);
      }
    } else {
      // New user default streak setup
      currentStreakObj = {
        count: 1,
        lastCheckInDate: yesterdayStr, // Let them check in today for instant gratification!
        allTimeHigh: 1,
        unlockedBadges: ["Pelopor Aksi"]
      };
    }

    setStreak(currentStreakObj);
    setHasCheckedInToday(currentStreakObj.lastCheckInDate === todayStr);

    // Load leaderboard claps & items
    const savedClapsMap = localStorage.getItem("procrastination_leaderboard_claps");
    let clapsMap: Record<string, number> = {};
    if (savedClapsMap) {
      try { clapsMap = JSON.parse(savedClapsMap); } catch(err) {}
    }

    // Determine user streak display
    const currentStreakValue = currentStreakObj.count;

    // Build leaderboard with 4 authentic characters
    const defaultPeers: LeaderboardItem[] = [
      { name: "Desi Nofitasari", role: "Active Builder (You)", streak: currentStreakValue, claps: clapsMap["Desi Nofitasari"] || 24, isCurrentUser: true },
      { name: "Budi Sanjaya", role: "Software Engineer", streak: 12, claps: clapsMap["Budi Sanjaya"] || 18 },
      { name: "Siti Rahma", role: "Mahasiswa Akhir", streak: 8, claps: clapsMap["Siti Rahma"] || 11 },
      { name: "Rian si Writer", role: "Creative Storyteller", streak: 5, claps: clapsMap["Rian si Writer"] || 9 },
      { name: "Nia Desiana", role: "UX Designer", streak: 3, claps: clapsMap["Nia Desiana"] || 14 }
    ];

    // Replace the name if the current logged-in user isn't 'Desi Nofitasari' or existing
    const isUserListed = defaultPeers.some(p => p.name.toLowerCase() === userName.toLowerCase());
    
    let refinedPeers = [...defaultPeers];
    if (!isUserListed) {
      refinedPeers[0] = {
        name: userName,
        role: "Evaluator Hebat (You)",
        streak: currentStreakValue,
        claps: clapsMap[userName] || 5,
        isCurrentUser: true
      };
    } else {
      // Sync streak for list item if matching
      refinedPeers = refinedPeers.map(peer => {
        if (peer.name.toLowerCase() === userName.toLowerCase()) {
          return { ...peer, streak: currentStreakValue, isCurrentUser: true };
        }
        return peer;
      });
    }

    // Sort leaderboard by streak value descending
    refinedPeers.sort((a, b) => b.streak - a.streak);
    setLeaderboard(refinedPeers);

  }, [userName]);

  // Handle Action Trigger Check-In click
  const handleCheckInNow = () => {
    if (hasCheckedInToday) return;

    const todayStr = getTodayString();
    const nextStreakCount = streak.count + 1;
    const nextHigh = Math.max(streak.allTimeHigh, nextStreakCount);
    
    // Badge unlocking triggers depending on streak counters
    const badges = [...streak.unlockedBadges];
    if (nextStreakCount >= 3 && !badges.includes("Pemutus Batas")) {
      badges.push("Pemutus Batas");
    }
    if (nextStreakCount >= 7 && !badges.includes("Dewa Disiplin")) {
      badges.push("Dewa Disiplin");
    }

    const updatedStreak: StreakData = {
      count: nextStreakCount,
      lastCheckInDate: todayStr,
      allTimeHigh: nextHigh,
      unlockedBadges: badges
    };

    // Save to local storage
    localStorage.setItem(`focus_streak_v1_${userName}`, JSON.stringify(updatedStreak));
    setStreak(updatedStreak);
    setHasCheckedInToday(true);
    setShowCelebration(true);

    // Update current user item inside state leaderboard
    setLeaderboard(prev => {
      const nextList = prev.map(p => {
        if (p.isCurrentUser) {
          return { ...p, streak: nextStreakCount };
        }
        return p;
      });
      return nextList.sort((a, b) => b.streak - a.streak);
    });

    // Hide celebration banner after 4.5 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  };

  // Cheer up / clap increment trigger on peer leaderboard
  const handleClapPeer = (peerName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    // Increment clap count
    setLeaderboard(prev => {
      const updated = prev.map(p => {
        if (p.name === peerName) {
          return { ...p, claps: p.claps + 1 };
        }
        return p;
      });
      
      // Save claps to localStorage
      const clapsMap: Record<string, number> = {};
      updated.forEach(item => {
        clapsMap[item.name] = item.claps;
      });
      localStorage.setItem("procrastination_leaderboard_claps", JSON.stringify(clapsMap));

      return updated;
    });

    // Generate neat cursor relative floating claps elements
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const newAnimId = animIdCounter;
    setClapAnims(prev => [...prev, { id: newAnimId, x: clickX, y: clickY }]);
    setAnimIdCounter(prev => prev + 1);

    // Clean up animation elements
    setTimeout(() => {
      setClapAnims(prev => prev.filter(a => a.id !== newAnimId));
    }, 1000);
  };

  return (
    <div className={`rounded-2xl border text-left p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${
      theme === "dark" 
        ? "bg-slate-950/70 border-slate-850/80 shadow-2xl" 
        : "bg-white border-slate-200/90 shadow-lg"
    }`}>
      
      {/* Visual background accents */}
      <div className="absolute top-0 right-[-20px] w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10px] left-[-10px] w-36 h-36 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/40 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 font-bold">
              🔥 SINKRONISASI STREAK SOSIAL AKTIF
            </span>
          </div>
          <h3 className="text-sm font-sans font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-800 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal-400" />
            Pemberantas Prokrastinasi (Streak &amp; Leaderboard)
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
            Sistem pengingat psikologis lokal. Pertahankan <strong>Streak Beruntun</strong> harian Anda dengan menekan stamp check-in agar disiplin terus terbakar dan geser peringkat rekan sejawat Anda!
          </p>
        </div>

        {/* Dynamic Badge Display Widget */}
        <div className="flex flex-wrap gap-1.5">
          {streak.unlockedBadges.map((badge, idx) => (
            <span 
              key={idx} 
              className="py-1 px-2 text-[9px] font-mono tracking-tight font-extrabold bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-800/60 text-teal-300 rounded-lg flex items-center gap-1 shadow-sm"
              title="Lencana pencapaian fokus dirimu"
            >
              <Award className="w-3 h-3 text-yellow-400 animate-pulse" />
              🏅 {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: ACTIVE USER STREAK CARDS */}
        <div className="md:col-span-5 flex flex-col justify-between bg-slate-900/40 dark:bg-slate-900/30 light:bg-slate-50/80 border border-slate-850/70 rounded-xl p-4 relative overflow-hidden">
          
          <div className="space-y-3.5">
            
            {/* Fire visualization */}
            <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-lg border border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-orange-950/40 border border-orange-800/35 flex items-center justify-center relative">
                  <Flame className={`w-6 h-6 text-orange-400 ${hasCheckedInToday ? "animate-bounce" : ""}`} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">STREAK AKTIF ANDA</p>
                  <p className="text-lg font-sans font-black text-slate-100 flex items-baseline gap-1">
                    <span className="text-2xl text-orange-400 font-extrabold">{streak.count}</span> Hari Beruntun
                  </p>
                </div>
              </div>

              <div className="text-right border-l border-slate-800 pl-3">
                <p className="text-[9px] font-mono text-slate-400 uppercase">ALL-TIME HIGH</p>
                <p className="text-sm font-sans font-extrabold text-teal-400">{streak.allTimeHigh} Hari</p>
              </div>
            </div>

            {/* Check-In Progress Box / Prompt */}
            <div className="space-y-1.5 text-left">
              <p className="text-[10.5px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>MEJA STAMP HARIAN:</span>
              </p>
              
              {hasCheckedInToday ? (
                <div className="bg-emerald-950/25 border border-emerald-800/40 rounded-lg p-2.5 text-center flex items-center gap-2 justify-center text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                  <span className="text-[11px] font-medium">Laporan Berhasil Diamankan Hari Ini!</span>
                </div>
              ) : (
                <div className="bg-orange-950/20 border border-orange-900/30 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-orange-300 font-medium leading-relaxed">
                    ⚠️ <strong>Awas pecah streak-mu!</strong> Jika kamu tidak menekan stamp check-in hari ini, streak-mu akan ter-reset besok.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Large Action Check-In Stamp Button */}
          <div className="mt-4">
            <button
              id="streak-checkin-btn"
              disabled={hasCheckedInToday}
              onClick={handleCheckInNow}
              className={`w-full py-3 px-4 rounded-xl font-sans font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                hasCheckedInToday
                  ? "bg-slate-850 border border-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-tr from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-orange-500/10 cursor-pointer hover:shadow-orange-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${hasCheckedInToday ? "" : "animate-spin"}`} />
              {hasCheckedInToday ? "Laporan Harian Tersimpan" : "STAMP CHECK-IN SEKARANG"}
            </button>
            <p className="text-[9px] text-center text-slate-500 font-mono mt-1.5">
              *Tekan check-in tiap 24 jam sekali untuk mengamankan data dan menghindari stress menunda.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: PEERS SOCIAL LEADERBOARD */}
        <div className="md:col-span-7 bg-slate-900/20 rounded-xl p-3 border border-slate-850/50">
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              RANGKING STREAK PROKRASTINASI LOKAL:
            </p>
            <span className="text-[9px] font-mono text-slate-500 italic">5 Orang Aktif</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((peer, rank) => {
              const rankColor = rank === 0 ? "text-yellow-400" : rank === 1 ? "text-slate-350" : rank === 2 ? "text-amber-600" : "text-slate-500";
              const rankBg = rank === 0 ? "bg-yellow-950/30 border-yellow-800/40" : "bg-slate-950/20 border-slate-900";
              
              return (
                <div 
                  key={peer.name}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                    peer.isCurrentUser 
                      ? "bg-teal-950/15 border-teal-500/30 shadow shadow-teal-500/5" 
                      : "bg-slate-950/40 border-slate-900"
                  }`}
                >
                  {/* Left: Rank, Avatar Icon, Peer metadata */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 font-mono text-xs font-black text-center ${rankColor}`}>
                      #{rank + 1}
                    </span>
                    
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-sans font-bold ${
                      peer.isCurrentUser 
                        ? "bg-teal-900 text-teal-300 border-teal-700" 
                        : "bg-slate-900 text-slate-300 border-slate-800"
                    }`}>
                      {peer.name.charAt(0)}
                    </div>

                    <div className="min-w-0 text-left">
                      <p className={`text-xs font-sans font-bold truncate flex items-center gap-1 ${
                        peer.isCurrentUser ? "text-teal-300" : "text-slate-250"
                      }`}>
                        {peer.name}
                        {peer.isCurrentUser && (
                          <span className="text-[8px] tracking-tight bg-teal-900/80 border border-teal-850 text-teal-400 font-mono font-bold px-1 rounded uppercase">
                            KAMU
                          </span>
                        )}
                      </p>
                      <p className="text-[9px] font-mono text-slate-500 truncate">
                        {peer.role}
                      </p>
                    </div>
                  </div>

                  {/* Right: Streak status badge & dynamic Clap Cheering System */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 py-1 px-2.5 rounded-lg shrink-0">
                      <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                      <span className="text-xs font-mono font-extrabold text-slate-200">{peer.streak} d</span>
                    </div>

                    {/* Clap button */}
                    <button
                      type="button"
                      onClick={(e) => handleClapPeer(peer.name, e)}
                      className="px-2 py-1.5 hover:bg-slate-850 rounded-lg text-[10px] font-mono font-bold text-slate-400 hover:text-pink-400 transition-all flex items-center gap-1 border border-transparent hover:border-slate-800 cursor-pointer shrink-0 relative"
                      title="Beri tepuk tangan pemberi semangat"
                    >
                      <ThumbsUp className="w-3 h-3 text-pink-500" />
                      <span>{peer.claps}</span>

                      {/* Floating animation particle trigger */}
                      <AnimatePresence>
                        {clapAnims.map(anim => (
                          <motion.span
                            key={anim.id}
                            initial={{ opacity: 1, scale: 0.8, y: 0 }}
                            animate={{ opacity: 0, scale: 1.4, y: -25, x: (Math.random() - 0.5) * 15 }}
                            exit={{ opacity: 0 }}
                            className="absolute pointer-events-none text-pink-400 select-none text-[12px] font-sans"
                            style={{ left: anim.x, top: anim.y }}
                          >
                            💖
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Dynamic Slide-in Overlay Celebration Trigger screen */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="relative mb-3 flex items-center justify-center">
              <span className="absolute animate-ping bg-orange-400/20 w-24 h-24 rounded-full"></span>
              <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-yellow-400 p-0.5 rounded-full flex items-center justify-center relative shadow-lg">
                <Flame className="w-9 h-9 text-slate-950 animate-bounce" />
              </div>
            </div>

            <h4 className="text-md sm:text-lg font-sans font-black text-white px-2">
              🔥 STREAK CHECK-IN HARI INI SECURED!
            </h4>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed mt-2.5">
              Refleksi keberanianmu mengalahkan kemalasan dan ketakutan telah tercatat di memori lokal. Streak harianmu sekarang berada di tingkat <strong className="text-orange-400">{streak.count} hari</strong>! Rekan-rekan belajarmu di leaderboard melihat kedisiplinan barumu!
            </p>

            <button
              onClick={() => setShowCelebration(false)}
              className="mt-5 px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-sans font-extrabold text-xs tracking-wider uppercase rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              Lanjutkan Aksi Nyata 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
