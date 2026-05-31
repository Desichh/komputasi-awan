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
  HelpCircle,
  Award,
  CheckSquare,
  ClipboardList,
  Compass,
  ListTodo,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Clock
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

const PROCRUSTINATION_DAILY_MISSIONS = {
  "A": [
    { id: "a_dm1", text: "Lakukan menulis/koding kasar 5 menit pertama tanpa membenahi meja belajar sama sekali." },
    { id: "a_dm2", text: "Tulis draf mentah dan sengaja buat 5 baris berkualitas rendah tanpa mengedit sama sekali (break perfeksionisme)." },
    { id: "a_dm3", text: "Mulai sesi utama koding/kerja hari ini tanpa menyalakan lilin, aromaterapi atau lagu pembuka (langsung aksi)." }
  ],
  "B": [
    { id: "b_dm1", text: "Matikan HP Anda sekarang, masukkan ke laci kamar sebelah atau lemari terjauh." },
    { id: "b_dm2", text: "Tutup seluruh tab sosmed luar, sisakan maksimal hanya 3 tab terbuka terkait tugas utama Anda." },
    { id: "b_dm3", text: "Selesaikan setidaknya 1 sesi pemicu pemicu mikro 5 menit (misal putar roda tantangan di bawah)." }
  ],
  "C": [
    { id: "c_dm1", text: "Berdiri tegak dari tempat duduk dan lakukan renggangan tangan ke atas penuh selama 45 detik." },
    { id: "c_dm2", text: "Minum segelas air putih bersuhu dingin untuk mengaktifkan stimulasi lambung melawan mager." },
    { id: "c_dm3", text: "Mainkan instrumen Theta Hum 6 Hz di panel bawah setidaknya selama 5 menit tanpa jeda." }
  ],
  "D": [
    { id: "d_dm1", text: "Ketik kognitif mantra: 'Membuat draf bernilai sampah hari ini adalah pondasi rilis sukses esok hari'." },
    { id: "d_dm2", text: "Hantam tuts keyboard secara acak selama 15 detik penuh untuk meluluhkan rasa takut lembar kosong." },
    { id: "d_dm3", text: "Setel niat fokus durasi sangat pendek (5 menit), putuskan bahwa Anda tidak peduli kualitas draf pertama." }
  ]
};

const DEFAULT_15_MIN_PLANS = {
  "A": {
    phase1: "Fase 1 (Menit 1-5): Pengosongan Ekspektasi Berkelas",
    phase1Text: "Buka draf baru. Tulis kalimat apa saja. Jangan rapikan barang dekoratif di sekeliling Anda.",
    phase2: "Fase 2 (Menit 6-10): Penulisan Kasar Non-Stop",
    phase2Text: "Matikan tombol sunting/edit dari tempurung otak. Terus saja ketik tugas Anda tanpa menoleh balik.",
    phase3: "Fase 3 (Menit 11-15): Pemantapan & Sinkronisasi",
    phase3Text: "Sekarang setelah halaman telah terisi draf kasar, rapikan pelan-pelan. Anda resmi bertindak!"
  },
  "B": {
    phase1: "Fase 1 (Menit 1-5): Karantina Dopaminergi",
    phase1Text: "Matikan handphone, simpan di laci terdalam seberang kelas Anda. Tutup tab Youtube, Twitter, Tiktok.",
    phase2: "Fase 2 (Menit 6-10): Fokus Gerilya Sesi Pendek",
    phase2Text: "Tentukan satu elemen sub-judul terkecil. Selesaikan pengerat draf itu dalam 5 menit penuh tanpa diganggu.",
    phase3: "Fase 3 (Menit 11-15): Peledakan Dopamin Alami",
    phase3Text: "Nikmati kemajuan kecil Anda! Selesaikan baris tugas ini demi kepuasan biokimia orisinil dari otak Anda."
  },
  "C": {
    phase1: "Fase 1 (Menit 1-5): Guncangan Somatik",
    phase1Text: "Berdiri tegak dari kursi! Lakukan stretching lengan vertikal setinggi mungkin untuk memompa sirkulasi.",
    phase2: "Fase 2 (Menit 6-10): Hidrasi Prefrontal",
    phase2Text: "Teguk segelas air es segar. Aktifkan audio binaural beat Theta 6Hz di panel bawah untuk membilas kantuk.",
    phase3: "Fase 3 (Menit 11-15): Eksekusi Modul Tunggal",
    phase3Text: "Duduk tegap berwibawa, letakkan telapak tangan ke keyboard, mulailah mengetik tanpa malas-malasan."
  },
  "D": {
    phase1: "Fase 1 (Menit 1-5): Deaktivasi Overthinking",
    phase1Text: "Tulis/rasakan mantra: 'Saya diizinkan sepenuhnya berbuat salah hari ini'. Hantam keyboard acak 15 detik.",
    phase2: "Fase 2 (Menit 6-10): Dekonstruksi Atomik",
    phase2Text: "Pecah tugas raksasa menjadi 3 langkah super konyol berdurasi 2 menit saja. Mulai langkah pertama sekarang.",
    phase3: "Fase 3 (Menit 11-15): Keberanian Berbuat Kasar",
    phase3Text: "Selesaikan draf kasar Anda tanpa menghiraukan bayangan kegagalan karir masa depan. Selesai luar biasa!"
  },
  "none": {
    phase1: "Fase 1 (Menit 1-5): Pemutusan Alur Doom-Scrolling",
    phase1Text: "Singkirkan HP dari pandangan mata. Tutup seluruh tab browser hiburan tanpa penyesalan.",
    phase2: "Fase 2 (Menit 6-10): Pemilihan Aksi Terkecil",
    phase2Text: "Tarik napas dalam, pejamkan mata 3 detik, pilih elemen tugas teringan yang paling gampang dimulai.",
    phase3: "Fase 3 (Menit 11-15): Akselerasi Tanpa Beban",
    phase3Text: "Jalankan pengetikan tanpa mencemaskan apakah hasilnya istimewa atau biasa saja. Berbuatlah!"
  }
};

function getProcrastinatorTypeInfo(typeCode: string) {
  switch(typeCode) {
    case "A": return { code: "A" as const, name: "Tipe A: Perfeksionis Estetika & Dekorasi", subtitle: "The Over-Prepared Aesthetician" };
    case "B": return { code: "B" as const, name: "Tipe B: Pencandu Dopamin Instan & Gerilya", subtitle: "The Dopamine Scroll-Maniac" };
    case "C": return { code: "C" as const, name: "Tipe C: Penguasa Gravitasi & Dewa Mager", subtitle: "The Comfy Couch & Snooze Emperor" };
    case "D": return { code: "D" as const, name: "Tipe D: Pemikir Kritis Kiamat Prematur", subtitle: "The Doomsday Overthinker" };
    default: return { code: "none" as const, name: "Tipe Belum Terdiagnosa", subtitle: "Klinik Diagnostik Belum Selesai" };
  }
}

interface FocusTrackerProps {
  theme: "dark" | "light";
  userName: string;
  activities: any[];
  onChangeActivities: (acts: any[]) => void;
  focusSessionActive: boolean;
  setFocusSessionActive: (active: boolean) => void;
  focusLevel: number;
  setFocusLevel: any;
  activeTab: string;
}

export default function FocusTracker({ 
  theme, 
  userName, 
  activities, 
  onChangeActivities, 
  focusSessionActive, 
  setFocusSessionActive, 
  focusLevel, 
  setFocusLevel,
  activeTab
}: FocusTrackerProps) {
  const [activeChallenge, setActiveChallenge] = useState<MicroChallenge | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [idleAlertShow, setIdleAlertShow] = useState<boolean>(false);
  const [challengesCompleted, setChallengesCompleted] = useState<number>(0);
  const [streakMinutes, setStreakMinutes] = useState<number>(0);

  // Consolidated Systems Tabs - Default: 15-Minute tool (innerTab instead of activeTab to avoid collision)
  const [innerTab, setInnerTab] = useState<"15min" | "wheel">("15min");

  // Dynamic customized excuse challenges state to keep actions highly varied on load & match user's note logs
  const [excuseChallenges, setExcuseChallenges] = useState(EXCUSE_CHALLENGES);

  useEffect(() => {
    // Generate different and unique instructions on first load / task changes
    const userTasks = activities && activities.length > 0 
      ? activities.filter(a => !a?.completed).map(a => a?.task_name) 
      : [];
    
    const taskKeyword = userTasks.length > 0 
      ? userTasks[Math.floor(Math.random() * userTasks.length)]
      : "lembar kerja utama Anda";

    // Dynamic phrase pools to ensure uniqueness on every load
    const verbs = {
      phone: [
        "Singkirkan rasa gentar,",
        "Lalui tantangan dengan sigap,",
        "Pusatkan kesadaran penuh,",
        "Fokuskan energi produktif Anda,"
      ],
      focus: [
        "Latih atensi retina Anda,",
        "Nyalakan kembali sirkuit konsentrasi,",
        "Tenangkan kabut pikiran,",
        "Bilas kebosanan visual Anda,"
      ],
      lazy: [
        "Lawan hisapan gravitasi nyaman,",
        "Bangun dari kondisi layu,",
        "Aktifkan dinamika motorik tubuh,",
        "Guncang otot penat Anda,"
      ],
      fear: [
        "Hancurkan bisikan perfeksionisme,",
        "Sengaja buat kesalahan pertama Anda,",
        "Maafkan draf buruk awal Anda,",
        "Dobrak hambatan mental Anda,"
      ]
    };

    const actionPools = {
      phone: [
        `Tutup tab browser hiburan. Fokus khusus pada: "${taskKeyword}".`,
        `Ambil smartphone, matikan daya atau nyalakan mode senyap total sekarang.`,
        `Alihkan perhatian 100% menghadap monitor. Letakkan gawai di ruang sebelah atau laci terdalam.`,
        `Buka aplikasi kerja utama Anda, lupakan media sosial selama 5 menit ke depan.`
      ],
      focus: [
        `Bernapas dalam (metode Kotak 4-4-4) untuk menjernihkan prefrontal korteks Anda.`,
        `Pilih satu objek kecil di keyboard atau layar, tatap tajam tanpa berkedip selama 12 detik.`,
        `Sebutkan 3 benda fisik berwarna hijau di sekitar Anda untuk memicu kesadaran spasial harian.`,
        `Buka program kontribusi kerja Anda untuk tugas "${taskKeyword}" tanpa penolakan.`
      ],
      lazy: [
        `Berdiri segera dari kursi Anda, regangkan pinggang dan bahu ke atas setinggi mungkin.`,
        `Teguk segelas air dingin bersih guna mengaktifkan detektor metabolisme melawan penat.`,
        `Lakukan gerakan kepalan tangan berulang kali selama 15 detik demi memicu adrenalin alami.`,
        `Duduk kembali dengan tegap, gunakan musik bising putih, koding/tulis tugas "${taskKeyword}".`
      ],
      fear: [
        `Ketik satu baris kalimat sampah/acak pada dokumen "${taskKeyword}" tanpa memikirkan tata bahasa.`,
        `Bisikkan mantra: "Karya terburuk pertamaku jauh lebih berharga daripada angan-angan sempurna".`,
        `Coretlah coretan berantakan di notepad Anda selama 20 detik untuk menghapus trauma lembar kosong.`,
        `Lakukan aksi pengetikan draf tercepat secara membabi buta demi meluluhkan ketakutan kognitif Anda.`
      ]
    };

    // Shuffler helper
    const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

    const randomizedChallenges = EXCUSE_CHALLENGES.map((challenge) => {
      const charKey = challenge.key as "phone" | "focus" | "lazy" | "fear";
      // Pick dynamic introductory title
      const intro = verbs[charKey][Math.floor(Math.random() * verbs[charKey].length)];
      const sampledActions = shuffleArray(actionPools[charKey]).slice(0, 4);
      
      // Customize instructions
      const customizedInstructions = [
        `${intro} bersiaplah bertindak nyata sekarang juga!`,
        ...sampledActions
      ];

      return {
        ...challenge,
        instructions: customizedInstructions
      };
    });

    setExcuseChallenges(randomizedChallenges);
  }, [activities, userName]);

  // Sync with App activeTab changes and trigger resets
  useEffect(() => {
    if (activeTab !== "pemicu-tantangan") {
      setPlannerRunning(false);
      setPlanSeconds(15 * 60);
      setActivePlanPhase(1);
      setPlannerPausedAt(null);
      
      if (focusSessionActive) {
        setFocusSessionActive(false);
      }

      setTimerRunning(false);
      setTimerSeconds(0);
      setPausedAt(null);
      setActiveChallenge(null);
      setIdleAlertShow(false);
    }
  }, [activeTab, focusSessionActive, setFocusSessionActive]);

  // Daily Tasks State
  const [typeInfo, setTypeInfo] = useState<{ code: "A" | "B" | "C" | "D" | "none"; name: string; subtitle: string }>(() => {
    const savedType = localStorage.getItem(`procrastination_type_${userName}`) || "none";
    return getProcrastinatorTypeInfo(savedType);
  });
  const [dailyMissions, setDailyMissions] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);

  // 15-Minute Action Planner States
  const [plannerRunning, setPlannerRunning] = useState<boolean>(false);
  const [planSeconds, setPlanSeconds] = useState<number>(15 * 60); // 15 mins
  const [activePlanPhase, setActivePlanPhase] = useState<1 | 2 | 3>(1);
  const [plannerPausedAt, setPlannerPausedAt] = useState<number | null>(null);
  const [completedPhases, setCompletedPhases] = useState<boolean[]>([false, false, false]);
  const [custom15MinPlan, setCustom15MinPlan] = useState<string | null>(null);

  // Custom Guard Modal states for 15-Min Action active warning
  const [showCustomGuardModal, setShowCustomGuardModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<{ type: "spin" } | { type: "selectExcuse"; excuseKey: string } | null>(null);

  const parsePlansRobust = (rawText: string) => {
    const cleanText = rawText.replace(/[*#_]|(###)/g, "").trim();
    
    let p1 = "";
    let p2 = "";
    let p3 = "";
    
    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    
    lines.forEach(line => {
      const cleanLine = line.replace(/^[\s*\-•\d\.\)]+/g, "").replace(/[*#_]|(###)/g, "").trim();
      if (!cleanLine) return;
      
      const lower = line.toLowerCase();
      if (lower.includes("1-5") || lower.includes("1 - 5") || lower.includes("fase 1") || lower.includes("fase pertama")) {
        const parts = cleanLine.split(/:\s*(.*)/s);
        p1 = parts[1] || parts[0];
      } else if (lower.includes("6-10") || lower.includes("6 - 10") || lower.includes("fase 2") || lower.includes("fase kedua")) {
        const parts = cleanLine.split(/:\s*(.*)/s);
        p2 = parts[1] || parts[0];
      } else if (lower.includes("11-15") || lower.includes("11 - 15") || lower.includes("fase 3") || lower.includes("fase ketiga")) {
        const parts = cleanLine.split(/:\s*(.*)/s);
        p3 = parts[1] || parts[0];
      }
    });

    if (!p1 || !p2 || !p3) {
      const sentences = cleanText
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 2);
      
      if (sentences.length >= 3) {
        p1 = sentences.slice(0, Math.ceil(sentences.length / 3)).join(". ") + ".";
        p2 = sentences.slice(Math.ceil(sentences.length / 3), Math.ceil(2 * sentences.length / 3)).join(". ") + ".";
        p3 = sentences.slice(Math.ceil(2 * sentences.length / 3)).join(". ") + ".";
      } else {
        p1 = cleanText || "Jauhkan ponsel ke ruangan lain dan singkirkan gangguan.";
        p2 = "Buka file tugas atau dokumen kerja kosong secara perlahan.";
        p3 = "Atur timer 5 menit dan mulailah mengetik apa saja tanpa peduli hasilnya.";
      }
    }

    const cleanPrefix = (str: string) => {
      return str
        .replace(/^(menit|fase|langkah)\s*\d+[\s\-\:\;\.,]*/i, "")
        .replace(/^[\s\-\:\;\.,]+/g, "")
        .trim();
    };

    return [
      { title: "MENIT 1-5 (Persiapan)", content: cleanPrefix(p1) },
      { title: "MENIT 6-10 (Bongkar Gangguan)", content: cleanPrefix(p2) },
      { title: "MENIT 11-15 (Aksi Fokus)", content: cleanPrefix(p3) }
    ];
  };

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

  // Synthesize and sync focusSessionActive prop state
  useEffect(() => {
    const isCurrentActive = plannerRunning || timerRunning;
    if (setFocusSessionActive && focusSessionActive !== isCurrentActive) {
      setFocusSessionActive(isCurrentActive);
    }
  }, [plannerRunning, timerRunning, focusSessionActive, setFocusSessionActive]);

  // Load and sync procrastination-rooted daily missions & 15-minute plans
  useEffect(() => {
    if (!userName) return;

    // Detect type
    const savedType = localStorage.getItem(`procrastination_type_${userName}`) || "none";
    const info = getProcrastinatorTypeInfo(savedType);
    setTypeInfo(info);

    // Load actual AI analysis plans if present
    const savedAnalysis = localStorage.getItem(`procrastination_analysis_${userName}`);
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        if (parsed && typeof parsed.rencana15Menit === "string") {
          setCustom15MinPlan(parsed.rencana15Menit);
        } else {
          setCustom15MinPlan(null);
        }
      } catch (e) {
        setCustom15MinPlan(null);
      }
    } else {
      setCustom15MinPlan(null);
    }

    // Determine checklist status for today
    const todayStr = new Date().toISOString().split("T")[0];
    const isClaimed = localStorage.getItem(`daily_missions_claimed_${userName}_${todayStr}`) === "true";
    setClaimedToday(isClaimed);
  }, [userName]);

  // Sync dailyMissions of FocusTracker directly with activities & user type Code
  useEffect(() => {
    const savedType = localStorage.getItem(`procrastination_type_${userName}`) || "none";
    const info = getProcrastinatorTypeInfo(savedType);
    
    if (activities && activities.length > 0) {
      // Map activities to customized challenges
      const mappedMissions = activities.map((activity) => {
        let customActionText = "";
        if (info.code === "A") {
          customActionText = `🔥 [Perfeksionis] Buka draft tugas "${activity.task_name}" & mulai mengetik draf kasar dalam 5 menit pertama tanpa membenahi meja belajar.`;
        } else if (info.code === "B") {
          customActionText = `🔥 [Dopamin] Sembunyikan smartphone Anda, sisa tab maks 3, lalu kencang fokus penuh tugas "${activity.task_name}" selama 10 menit!`;
        } else if (info.code === "C") {
          customActionText = `🔥 [Mager] Berdiri, teguk segelas air dingin bersuhu es, lalu selesaikan bagian terkecil darinya: "${activity.task_name}".`;
        } else if (info.code === "D") {
          customActionText = `🔥 [Anxious] Coret ketakutan analisis, bisikkan mantra 'saya boleh melakukan kesalahan', mulailah "${activity.task_name}" sekarang!`;
        } else {
          customActionText = `🔥 Tuntaskan draf aktivitas "${activity.task_name}" hari ini demi membentengi daya produktivitas kognitif Anda.`;
        }
        
        return {
          id: activity.id,
          text: customActionText,
          completed: !!activity.completed
        };
      });
      setDailyMissions(mappedMissions);
    } else {
      // If empty, generate 3 default helpful therapeutic tasks depending on their procrastinator type
      const templates = PROCRUSTINATION_DAILY_MISSIONS[info.code] || [];
      const defaultMissions = templates.map((t) => ({
        id: t.id,
        text: t.text + " (Buka tab Catatan Harian 📝 untuk menambahkan tugas tertunda spesifik!)",
        completed: false
      }));
      setDailyMissions(defaultMissions);
    }
  }, [activities, userName]);

  const handleToggleDailyMission = (id: string) => {
    const matchingActivity = activities.find(a => a.id === id);
    if (matchingActivity) {
      const updatedActs = activities.map(act => {
        if (act.id === id) {
          const nextCompleted = !act.completed;
          return { ...act, completed: nextCompleted };
        }
        return act;
      });
      onChangeActivities(updatedActs);
      playBeep("success");
    } else {
      // Toggle local default missions
      const updated = dailyMissions.map((m) => {
        if (m.id === id) {
          return { ...m, completed: !m.completed };
        }
        return m;
      });
      setDailyMissions(updated);

      const todayStr = new Date().toISOString().split("T")[0];
      localStorage.setItem(`daily_missions_state_${userName}_${todayStr}`, JSON.stringify(updated));
      playBeep("tick");
    }
  };

  const handleClaimStreakFromMissions = () => {
    if (claimedToday) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const savedStreak = localStorage.getItem(`focus_streak_v1_${userName}`);
    let currentStreakObj = {
      count: 1,
      lastCheckInDate: "",
      allTimeHigh: 1,
      unlockedBadges: ["Pelopor Aksi"]
    };

    if (savedStreak) {
      try {
        currentStreakObj = JSON.parse(savedStreak);
      } catch (e) {}
    }

    const isAlreadyCheckedInToday = currentStreakObj.lastCheckInDate === todayStr;
    let nextStreakCount = currentStreakObj.count;
    if (!isAlreadyCheckedInToday) {
      nextStreakCount += 1;
    }

    const nextHigh = Math.max(currentStreakObj.allTimeHigh || 1, nextStreakCount);
    const badges = [...(currentStreakObj.unlockedBadges || [])];
    if (nextStreakCount >= 3 && !badges.includes("Pemutus Batas")) {
      badges.push("Pemutus Batas");
    }
    if (nextStreakCount >= 7 && !badges.includes("Dewa Disiplin")) {
      badges.push("Dewa Disiplin");
    }

    const updatedStreak = {
      count: nextStreakCount,
      lastCheckInDate: todayStr,
      allTimeHigh: nextHigh,
      unlockedBadges: badges
    };

    localStorage.setItem(`focus_streak_v1_${userName}`, JSON.stringify(updatedStreak));
    localStorage.setItem(`daily_missions_claimed_${userName}_${todayStr}`, "true");
    setClaimedToday(true);
    playBeep("success");

    // Force React sync via storage broadcasting
    window.dispatchEvent(new Event("storage"));

    // Push harian sync update to backend
    try {
      const role = userName === "Desi Nofitasari" ? "Active Builder (You)" : "Evaluator Hebat (You)";
      fetch("/api/leaderboard/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, streak: nextStreakCount, role })
      });
    } catch (e) {}

    alert(`Misi Kognitif Berhasil! Streak Anda kini diperbarui menjadi ${nextStreakCount} Hari Beruntun harian. Keren!`);
  };

  // 15-Minute Action Planner Countdown timer interval
  useEffect(() => {
    let interval: any = null;
    if (plannerRunning) {
      interval = setInterval(() => {
        setPlanSeconds((prev) => {
          if (prev <= 1) {
            setPlannerRunning(false);
            playBeep("success");
            alert("Selamat! Pelatihan Aksi 15 Menit Anda Selesai Sempurna!");
            return 0;
          }
          const nextSecs = prev - 1;
          const minsRemaining = Math.ceil(nextSecs / 60);
          if (minsRemaining > 10) {
            setActivePlanPhase(1);
          } else if (minsRemaining > 5) {
            setActivePlanPhase(2);
          } else {
            setActivePlanPhase(3);
          }
          return nextSecs;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [plannerRunning]);

  const handleStartPlanTimer = () => {
    playBeep("start");
    if (plannerPausedAt) {
      const elapsedSeconds = (Date.now() - plannerPausedAt) / 1000;
      if (elapsedSeconds > 120) {
        setPlanSeconds(15 * 60);
        setActivePlanPhase(1);
        playBeep("warning");
        alert("Jeda melebihi 2 menit! Demi melatih kedisiplinan kognitif, rencana aksi ini disetel ulang dari awal.");
      }
      setPlannerPausedAt(null);
    } else if (planSeconds === 0) {
      setPlanSeconds(15 * 60);
      setActivePlanPhase(1);
    }
    setPlannerRunning(true);
  };

  const handlePausePlanTimer = () => {
    setPlannerRunning(false);
    setPlannerPausedAt(Date.now());
  };

  const formatPlanTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
    if (plannerRunning) {
      setPendingAction({ type: "selectExcuse", excuseKey });
      setShowCustomGuardModal(true);
      return;
    }
    executeSelectExcuse(excuseKey);
  };

  const executeSelectExcuse = (excuseKey: string) => {
    const excObj = excuseChallenges.find((item) => item.key === excuseKey);
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
    if (plannerRunning) {
      setPendingAction({ type: "spin" });
      setShowCustomGuardModal(true);
      return;
    }
    executeSpin();
  };

  const executeSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Choose a random excuse index (0-3)
    const randomIndex = Math.floor(Math.random() * excuseChallenges.length);
    const selectedExcuse = excuseChallenges[randomIndex];
    
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

  const handleConfirmSurrender = () => {
    setPlannerRunning(false);
    setPlannerPausedAt(Date.now());

    if (focusLevel < 80) {
      setFocusLevel(40);
      alert("⚠️ Level fokus Anda direstart kembali ke 40% karena menyerah sebelum mencapai target minimal 80% untuk kelulusan!");
    } else {
      const targetLevelValue = Math.max(0, focusLevel - 15);
      setFocusLevel(targetLevelValue);
    }

    if (pendingAction) {
      if (pendingAction.type === "spin") {
        executeSpin();
      } else if (pendingAction.type === "selectExcuse") {
        executeSelectExcuse(pendingAction.excuseKey);
      }
    }

    setShowCustomGuardModal(false);
    setPendingAction(null);
  };

  const handleCancelSurrender = () => {
    setShowCustomGuardModal(false);
    setPendingAction(null);
  };

  const handleStartChallenge = () => {
    if (plannerRunning) {
      const confirmSwitch = window.confirm(
        "⚠️ Pelatihan Aksi 15 Menit Anda sedang berjalan!\n\nJika Anda memulai aksi Pomodoro 5 menit ini, Pelatihan Aksi 15 Menit akan dijeda secara otomatis agar Anda dapat menyelesaikan tantangan mikro terlebih dahulu.\n\nApakah Anda ingin melanjutkan?"
      );
      if (!confirmSwitch) return;
      
      // Auto-pause 15-minute planner
      setPlannerRunning(false);
      setPlannerPausedAt(Date.now());
    }

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
      alert("▶️ Melanjutkan kembali sesi Aksi Pomodoro 5 Menit!");
    } else {
      alert("🚀 Sesi Aksi Pomodoro 5 Menit diaktifkan! Fokuskan seluruh konsentrasi Anda dan selesaikan rangkaian langkah taktis di layar.");
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
            key="consolidated-dashboard-triggers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {idleAlertShow && (
              <div className="bg-amber-950/45 border border-amber-500/40 rounded-xl p-4 flex gap-3 text-amber-200 text-xs animate-pulse mb-2">
                <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-350">Deteksi Pikiran Melayang / Drop Fokus! 🧠💥</p>
                  <p className="mt-1 leading-relaxed">
                    Sistem mendeteksi jeda aktivitas yang mencurigakan. Jangan biarkan dopamin instan merusak harimu! Pilih terapi harian, rencana aksi 15 menit, atau putar roda pemicu mikro di bawah.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-6">
              {/* Core Nested Tabs inside Productivity Trigger Suit */}
              <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800/80 gap-1.5 mb-6">
                <button 
                  type="button"
                  onClick={() => {
                    setInnerTab("15min");
                    playBeep("tick");
                  }}
                  className={`flex-1 py-2 text-[11px] sm:text-xs font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                    innerTab === "15min" 
                      ? "bg-slate-800 text-teal-400 border border-slate-700/60 shadow-md" 
                      : "text-slate-400 hover:text-slate-205"
                  }`}
                >
                  ⏱️ Rencana Aksi 15 Menit
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setInnerTab("wheel");
                    playBeep("tick");
                  }}
                  className={`flex-1 py-2 text-[11px] sm:text-xs font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    innerTab === "wheel" 
                      ? "bg-slate-800 text-teal-400 border border-slate-700/60 shadow-md" 
                      : "text-slate-400 hover:text-slate-205"
                  }`}
                >
                  ⚡ Pemicu Spin Wheel
                </button>
              </div>

              <AnimatePresence mode="wait">
                {innerTab === "15min" && (
                  <motion.div
                    key="15min-tab-panel"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Clock className="w-24 h-24 text-teal-400" />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
                        <div className="space-y-0.5 max-w-md">
                          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-extrabold pb-1">INTERAKTIF TRAINING ACTION</span>
                          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-sans">
                            <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                            Pelatihan Aksi 15 Menit Pembongkar Penundaan
                          </h4>
                        </div>
                        
                        <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-lg font-bold text-teal-400 flex flex-col items-center justify-center shadow-inner tracking-widest self-stretch sm:self-auto">
                          <span>{formatPlanTime(planSeconds)}</span>
                          {plannerRunning && (
                            <span className="text-[8px] font-mono text-teal-400 block mt-0.5 animate-pulse font-extrabold tracking-normal">
                              ⚡ BERJALAN
                            </span>
                          )}
                          {!plannerRunning && plannerPausedAt && (
                            <span className="text-[8px] font-mono text-amber-500 block mt-0.5 animate-pulse font-bold tracking-normal">
                              ⏸️ JEDA (Maks 2m)
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                        {custom15MinPlan 
                          ? "Rencana instan di bawah diekstrak langsung dari saran spiritual AI Coach Anda yang barusan terbit dari log harian Anda:"
                          : "Tindakan atomik jangka pendek orisinil yang terbagi dalam 3 fase pemicu aktivitas berdasarkan profil kognitif prokrastinasi Anda saat ini:"
                        }
                      </p>

                      <div className="space-y-3 mb-6">
                        {(() => {
                          const text = custom15MinPlan || "";
                          const parsePlans = (rawText: string) => {
                            const cleanText = rawText.replace(/[*#_]|(###)/g, "").trim();
                            const markerRegex = /(menit\s*1\s*-\s*5|menit\s*6\s*-\s*10|menit\s*11\s*-\s*15|fase\s*1|fase\s*2|fase\s*3)/gi;
                            const partsByMarker = cleanText.split(markerRegex);
                            
                            if (partsByMarker.length > 2) {
                              const list: { title: string; content: string }[] = [];
                              for (let i = 1; i < partsByMarker.length; i += 2) {
                                const phaseTitle = partsByMarker[i].trim();
                                const phaseBody = (partsByMarker[i + 1] || "").replace(/^[\s\:\;\-\.,\n\r]+/, "").trim();
                                if (phaseBody) {
                                  list.push({ title: phaseTitle.toUpperCase(), content: phaseBody });
                                }
                              }
                              if (list.length >= 2) {
                                return list.slice(0, 3);
                              }
                            }

                            // Fallback to line-by-line parsing if no strong markers found
                            const list: { title: string; content: string }[] = [];
                            const rawLines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
                            
                            if (rawLines.length > 1) {
                              let activeTitle = "";
                              let activeContent: string[] = [];
                              
                              rawLines.forEach((line) => {
                                const lower = line.toLowerCase();
                                const isTimeBlockHeader = 
                                  lower.includes("menit 1") || lower.includes("menit 6") || lower.includes("menit 11") ||
                                  lower.includes("fase") || lower.includes("langkah") ||
                                  /^(menit|fase|langkah)\s*\d+/i.test(line);
                                
                                if (isTimeBlockHeader) {
                                  if (activeContent.length > 0) {
                                    list.push({
                                      title: activeTitle || "Instruksi Aksi",
                                      content: activeContent.join(" ")
                                    });
                                  }
                                  activeTitle = line.replace(/^[\s*\-•]+/g, "").replace(/[*#_]|(###)/g, "").trim();
                                  activeContent = [];
                                } else {
                                  activeContent.push(line);
                                }
                              });
                              
                              if (activeTitle || activeContent.length > 0) {
                                list.push({
                                  title: activeTitle || "Langkah Terakhir",
                                  content: activeContent.join(" ") || "Lanjutkan aksimu dengan keteguhan hati penuh!"
                                });
                              }
                            }

                            const filteredList = list.filter(item => 
                              item.title !== "Instruksi Aksi" && item.title !== "Langkah Terakhir"
                            );

                            if (filteredList.length >= 2) {
                              return filteredList.slice(0, 3);
                            }

                            // Fallback to sentence split
                            const fallbackList: { title: string; content: string }[] = [];
                            const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 2);
                            if (sentences.length >= 3) {
                              fallbackList.push({ title: "MENIT 1-5 (Persiapan)", content: sentences.slice(0, Math.ceil(sentences.length / 3)).join(". ") + "." });
                              fallbackList.push({ title: "MENIT 6-10 (Bongkar Gangguan)", content: sentences.slice(Math.ceil(sentences.length / 3), Math.ceil(2 * sentences.length / 3)).join(". ") + "." });
                              fallbackList.push({ title: "MENIT 11-15 (Aksi Fokus)", content: sentences.slice(Math.ceil(2 * sentences.length / 3)).join(". ") + "." });
                            } else {
                              fallbackList.push({ title: "MENIT 1-15 (Rencana Cepat AI)", content: cleanText || "Buka draf koding/kerja kosong sekarang juga secara bertahap." });
                            }
                            return fallbackList.slice(0, 3).map(item => ({ ...item, title: item.title.toUpperCase() }));
                          };

                          const steps = text ? parsePlansRobust(text) : [
                            { title: "Menit 1-5 (Fase 1)", content: DEFAULT_15_MIN_PLANS[typeInfo.code]?.phase1Text || DEFAULT_15_MIN_PLANS.none.phase1Text },
                            { title: "Menit 6-10 (Fase 2)", content: DEFAULT_15_MIN_PLANS[typeInfo.code]?.phase2Text || DEFAULT_15_MIN_PLANS.none.phase2Text },
                            { title: "Menit 11-15 (Fase 3)", content: DEFAULT_15_MIN_PLANS[typeInfo.code]?.phase3Text || DEFAULT_15_MIN_PLANS.none.phase3Text }
                          ];

                          return steps.map((step, idx) => {
                            let phaseBadgeColor = "bg-teal-950 text-teal-400 border-teal-500/30";
                            if (idx === 1) phaseBadgeColor = "bg-amber-955 text-amber-400 border-amber-500/30";
                            if (idx === 2) phaseBadgeColor = "bg-indigo-950 text-indigo-400 border-indigo-505/30";
                            
                            return (
                              <div
                                key={idx}
                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start gap-4 transition-all ${
                                  activePlanPhase === (idx + 1) && plannerRunning
                                    ? "bg-slate-950 border-teal-500/60 shadow-md shadow-teal-500/5 scale-[1.01]"
                                    : "bg-slate-950 border-slate-850 text-slate-355"
                                }`}
                              >
                                <div className={`sm:w-36 flex-shrink-0 flex items-center justify-center py-1 px-2.5 rounded-lg border text-center font-mono font-bold text-[10px] uppercase tracking-tight select-none ${phaseBadgeColor}`}>
                                  ⏱️ {step.title}
                                </div>
                                <p className="text-xs leading-relaxed transition-colors font-sans">
                                  {step.content}
                                </p>
                              </div>
                            );
                          });
                        })()}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 italic leading-relaxed">
                          {plannerRunning 
                            ? "⏱️ Hitung mundur aksi 15 menit Anda secara real-time..." 
                            : (planSeconds < 15 * 60 
                                ? "⏸️ Perencanaan terjeda seketika. Klik lanjutkan!" 
                                : "Gunakan waktu singkat ini untuk mendobrak kebiasaan malas Anda."
                              )
                          }
                        </span>

                        <div className="flex gap-2">
                          {plannerRunning ? (
                            <button 
                              onClick={handlePausePlanTimer}
                              className="text-amber-400 hover:text-amber-305 font-mono text-xs px-3.5 py-2.5 rounded-xl bg-amber-955/20 hover:bg-amber-955/30 border border-amber-900/40 transition-colors cursor-pointer"
                            >
                              Jeda Latihan
                            </button>
                          ) : (
                            <button
                              onClick={handleStartPlanTimer}
                              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-slate-950" />
                              {planSeconds < 15 * 60 ? "Lanjutkan Latihan" : "Mulai Rencana 15 Menit!"}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {innerTab === "wheel" && (
                  <motion.div
                    key="wheel-tab-panel"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    className="space-y-4 animate-fadeIn"
                  >
                    {/* Tab Selector Mode (Nested Inside Spin tab) */}
                    <div className="flex bg-slate-900/85 p-1 rounded-xl border border-slate-800/80 gap-1 mb-6">
                      <button 
                        type="button"
                        onClick={() => setShowWheelMode(true)}
                        className={`flex-1 py-1.5 text-[11px] sm:text-xs font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${showWheelMode ? "bg-slate-800 text-teal-400 border border-slate-700/60 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        🎰 Spin Wheel Alasan Konyol
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowWheelMode(false)}
                        className={`flex-1 py-1.5 text-[11px] sm:text-xs font-sans font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${!showWheelMode ? "bg-slate-800 text-teal-400 border border-slate-700/60 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        📋 Pilih Alasan Manual
                      </button>
                    </div>

                    {showWheelMode ? (
                      /* Interactive Fortune Wheel Layout (Original svg-spin setup preserved intact!) */
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
                                <radialGradient id="purpleGrad2" cx="50%" cy="50%" r="50%">
                                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.15" />
                                  <stop offset="100%" stopColor="#4a044e" stopOpacity="0.8" />
                                </radialGradient>
                                <radialGradient id="tealGrad2" cx="50%" cy="50%" r="50%">
                                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.15" />
                                  <stop offset="100%" stopColor="#115e59" stopOpacity="0.8" />
                                </radialGradient>
                                <radialGradient id="amberGrad2" cx="50%" cy="50%" r="50%">
                                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
                                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.8" />
                                </radialGradient>
                                <radialGradient id="roseGrad2" cx="50%" cy="55%" r="50%">
                                  <stop offset="0%" stopColor="#fb7185" stopOpacity="0.15" />
                                  <stop offset="100%" stopColor="#4c0519" stopOpacity="0.8" />
                                </radialGradient>
                              </defs>

                              {/* Pie segments with radius 90 */}
                              <path d="M 100 100 L 100 10 A 90 90 0 0 1 190 100 Z" fill="url(#purpleGrad2)" stroke="#581c87" strokeWidth="1" />
                              <path d="M 100 100 L 190 100 A 90 90 0 0 1 100 190 Z" fill="url(#tealGrad2)" stroke="#115e59" strokeWidth="1" />
                              <path d="M 100 100 L 100 190 A 90 90 0 0 1 10 100 Z" fill="url(#amberGrad2)" stroke="#78350f" strokeWidth="1" />
                              <path d="M 100 100 L 10 100 A 90 90 0 0 1 100 10 Z" fill="url(#roseGrad2)" stroke="#4c0519" strokeWidth="1" />

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
                              <g transform={`translate(${100 + 52 * Math.cos((45 * Math.PI)/180)}, ${100 - 52 * Math.sin((45 * Math.PI)/180)}) rotate(45)`}>
                                <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-purple-200 tracking-wide pointer-events-none drop-shadow">
                                  📱 MAIN HP
                                </text>
                              </g>
                              <g transform={`translate(${100 + 52 * Math.cos((-45 * Math.PI)/180)}, ${100 - 52 * Math.sin((-135 * Math.PI)/180)}) rotate(-45)`}>
                                <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-teal-200 tracking-wide pointer-events-none drop-shadow">
                                  🧠 COGNITIVE
                                </text>
                              </g>
                              <g transform={`translate(${100 + 52 * Math.cos((-135 * Math.PI)/185)}, ${100 - 52 * Math.sin((-135 * Math.PI)/180)}) rotate(45)`}>
                                <text textAnchor="middle" dominantBaseline="middle" className="font-sans font-extrabold text-[8px] md:text-[9px] fill-amber-200 tracking-wide pointer-events-none drop-shadow">
                                  😴 MAGER
                                </text>
                              </g>
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
                            className={`w-full py-3.5 px-6 rounded-xl font-sans font-extrabold text-xs tracking-wider transition-all shadow-lg active:scale-[0.98] ${
                              isSpinning
                                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                                : "bg-teal-500 hover:bg-teal-400 text-slate-950 cursor-pointer hover:shadow-teal-500/20 hover:scale-[1.01]"
                            }`}
                          >
                            {isSpinning ? "🎰 SEDANG MEMUTAR TAKDIR..." : "🎰 PUTAR RODA ALASAN MENUNDA!"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Classic Manual Selector Grid */
                      <div className="space-y-4 font-sans">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-teal-400 animate-bounce" />
                          <h4 className="text-sm font-sans font-bold tracking-tight text-slate-200">
                            Pilih Alasan Menundamu Secara Manual:
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {excuseChallenges.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.key}
                                onClick={() => handleSelectExcuse(item.key)}
                                className={`p-4 rounded-xl border bg-gradient-to-br ${item.color} text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 cursor-pointer ring-1 ring-inset`}
                              >
                                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-750 font-bold flex-shrink-0 shadow-inner">
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
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* Custom Guard Modal overlay inside FocusTracker when clicking Spin/Choice while 15m is active */}
      {showCustomGuardModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-left animate-fadeIn">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600"></div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 flex-shrink-0 animate-pulse">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-sans font-extrabold text-white">
                  Sesi Fokus Aktif Sedang Berjalan! 🛑
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Hai {userName}, Anda sedang berada dalam sesi latihan meningkatkan fokus mental (Rencana Aksi 15 Menit / Sesi 5 Menit). 
                  Meninggalkan halaman ini sekarang dianggap sebagai <strong>Menyerah (Surrender)</strong>!
                  
                  {focusLevel < 80 ? (
                    <span className="text-amber-500 block mt-1.5 font-semibold">
                      ⚠️ Tingkat fokus Anda ({focusLevel}%) saat ini masih di bawah 80%. Jika Anda nekat menyerah, LEVEL FOKUS ANDA AKAN DI-RESTART kembali dari level pemula (40%)! Selesaikan misi atau level fokus direstart.
                    </span>
                  ) : (
                    <span className="text-slate-400 block mt-1.5">
                      Tingkat fokus Anda ({focusLevel}%) saat ini di atas 80%. Menyerah sekarang akan memberi penalti pengurangan level fokus sebesar -15%.
                    </span>
                  )}
                </p>
                <div className="mt-3.5 p-2.5 bg-slate-950/60 rounded-lg border border-slate-850 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="text-[11px] font-mono text-slate-300">Level Fokus Saat Ini: {focusLevel}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2.5 mt-6 justify-end text-sm">
              <button
                type="button"
                onClick={handleConfirmSurrender}
                className="py-2 px-4 rounded-xl bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-500/20 transition-all text-xs font-bold cursor-pointer"
              >
                {focusLevel < 80 ? "Menyerah & Restart Level Fokus" : "Menyerah & Kurangi -15%"}
              </button>
              <button
                type="button"
                onClick={handleCancelSurrender}
                className="py-2 px-4 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all text-xs font-bold cursor-pointer font-sans"
              >
                Selesaikan Misi &amp; Fokus!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
