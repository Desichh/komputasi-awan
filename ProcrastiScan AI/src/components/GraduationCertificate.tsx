import React, { useState, useEffect } from "react";
import { 
  Award, 
  Sparkles, 
  CheckCircle, 
  Printer, 
  Download, 
  Flame, 
  BookOpen, 
  ShieldAlert, 
  CheckSquare, 
  RotateCw, 
  HelpCircle,
  Clock,
  Compass,
  Zap,
  BookmarkCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GraduationCertificateProps {
  userName: string;
  theme: "dark" | "light";
  focusLevel?: number;
}

// Map the diagnostic types dynamically so users can see solutions specifically for their type or any type they want to master
const SOLUTION_PLAYBOOKS = {
  "A": {
    name: "Tipe A: Perfeksionis Estetika & Dekorasi",
    subtitle: "The Over-Prepared Aesthetician",
    color: "from-purple-500/10 via-indigo-500/5 to-slate-900 border-purple-500/30 text-purple-300",
    description: "Menolak mengerjakan tugas karena kondisi penunjang belum sempurna (meja berantakan, pencahayaan kurang estetik, playlist belum pas).",
    actions: [
      { id: "a_1", text: "Terapkan Aturan 'Draf Sampah'. Paksa menulis 10 baris terburuk dalam 3 menit pertama tanpa menyunting.", done: false },
      { id: "a_2", text: "Deklarasi 'Terapi Meja Berantakan'. Mulai bekerja tanpa merapikan satu pun barang di meja Anda.", done: false },
      { id: "a_3", text: "Matikan wewangian aromaterapi dan buang ilusi ritual harus tenang total sebelum bertindak.", done: false }
    ]
  },
  "B": {
    name: "Tipe B: Pencandu Dopamin Instan & Gerilya",
    subtitle: "The Dopamine Scroll-Maniac",
    color: "from-amber-500/10 via-orange-500/5 to-slate-900 border-amber-500/30 text-amber-300",
    description: "Saraf dikooptasi oleh media sosial durasi pendek, baru bisa bekerja panik saat tenggat waktu tersisa 2 jam.",
    actions: [
      { id: "b_1", text: "Karantina Berhala: Masukkan smartphone ke laci atau lempar ke tumpukan baju kotor di seberang ruangan.", done: false },
      { id: "b_2", text: "Batasi tab browser maksimal 3 buah saat memuat dokumen pekerjaan krusial.", done: false },
      { id: "b_3", text: "Gunakan roda putar tantangan mikro 5 menit untuk mendapatkan dopamin awal yang produktif.", done: false }
    ]
  },
  "C": {
    name: "Tipe C: Penguasa Gravitasi & Dewa Mager",
    subtitle: "The Comfy Couch & Snooze Emperor",
    color: "from-teal-500/10 via-cyan-500/5 to-slate-900 border-teal-500/30 text-teal-300",
    description: "Merambat cepat ke arah ranjang kasur ketika melihat tumpukan teks panjang, tubuh ditarik gravitasi berat.",
    actions: [
      { id: "c_1", text: "Regenerasi Aliran Somatik: Berdiri tegak, tolak ranjang, renggangkan tangan ke atas selama 35 detik.", done: false },
      { id: "c_2", text: "Teguk segelas air segar bersuhu dingin sebelum duduk untuk mengaktifkan stimulasi lambung.", done: false },
      { id: "c_3", text: "Nyalakan instrumen 'Theta Binaural Hum' atau 'Forest Rain' di Audio Lab untuk membilas kantuk.", done: false }
    ]
  },
  "D": {
    name: "Tipe D: Pemikir Kritis Kiamat Prematur",
    subtitle: "The Doomsday Overthinker",
    color: "from-rose-500/10 via-pink-500/5 to-slate-900 border-rose-500/30 text-rose-300",
    description: "Kelumpuhan analisis (Analysis Paralysis). Otak mensimulasikan kepunahan karir sebelum mulai menulis baris pertama.",
    actions: [
      { id: "d_1", text: "Ketik kalimat mantra: 'Pembuatan draf bernilai sampah sepenuhnya sah untuk melangkah maju.'", done: false },
      { id: "d_2", text: "Hantam tuts keyboard secara acak selama 20 detik tanpa makna untuk meruntuhkan trauma lembar kosong.", done: false },
      { id: "d_3", text: "Fokus sepenuhnya pada durasi super pendek (misalnya hanya berniat koding selama 5 menit saja).", done: false }
    ]
  }
};

export default function GraduationCertificate({ userName, theme, focusLevel = 85 }: GraduationCertificateProps) {
  const [userStreak, setUserStreak] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<"A" | "B" | "C" | "D">("A");
  const [playbookState, setPlaybookState] = useState<Record<string, boolean>>({});
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);
  const [certId, setCertId] = useState<string>("");
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Load current user's local streak data & diagnostics on mount
  useEffect(() => {
    if (!userName) return;

    // Load streak count
    const savedStreak = localStorage.getItem(`focus_streak_v1_${userName}`);
    if (savedStreak) {
      try {
        const parsed = JSON.parse(savedStreak);
        if (parsed && typeof parsed.count === "number") {
          setUserStreak(parsed.count);
        }
      } catch (e) {
        console.error("Gagal membaca streak", e);
      }
    }

    // Load dominant diagnostics if previously tested
    const savedDiagnosticType = localStorage.getItem(`procrastination_type_${userName}`);
    if (savedDiagnosticType && ["A", "B", "C", "D"].includes(savedDiagnosticType)) {
      setSelectedType(savedDiagnosticType as any);
    }

    // Set a unique certificate serial code
    let uniqueId = localStorage.getItem(`procrastination_cert_serial_${userName}`);
    if (!uniqueId) {
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      uniqueId = `PCS-AI-${randStr}`;
      localStorage.setItem(`procrastination_cert_serial_${userName}`, uniqueId);
    }
    setCertId(uniqueId);

    // Load checklist state
    const savedPlaybook = localStorage.getItem(`procrastination_action_checklist_${userName}`);
    if (savedPlaybook) {
      try {
        setPlaybookState(JSON.parse(savedPlaybook));
      } catch (e) {}
    }
  }, [userName]);

  // Handle checking a playbook item
  const handleToggleCheck = (actionId: string) => {
    const nextState = {
      ...playbookState,
      [actionId]: !playbookState[actionId]
    };
    setPlaybookState(nextState);
    localStorage.setItem(`procrastination_action_checklist_${userName}`, JSON.stringify(nextState));

    // Calculate if we've successfully implemented all strategies for the current playbook
    const currentActions = SOLUTION_PLAYBOOKS[selectedType].actions;
    const allCheckedBefore = currentActions.every(act => playbookState[act.id]);
    const allCheckedAfter = currentActions.every(act => nextState[act.id]);

    if (!allCheckedBefore && allCheckedAfter) {
      // Trigger a confetti celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClaimReward = () => {
    setRewardClaimed(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4500);
  };

  // Eligibility check: streak >= 7 AND focus level >= 80% harian
  const isEligible = userStreak >= 7 && focusLevel >= 80;

  // Progress metrics calculation
  const currentActions = SOLUTION_PLAYBOOKS[selectedType].actions;
  const doneCount = currentActions.filter(act => playbookState[act.id]).length;
  const progressPercent = Math.round((doneCount / currentActions.length) * 100);

  const formatGraduationDate = () => {
    const d = new Date();
    const indonesianMonths = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${d.getDate()} ${indonesianMonths[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* SECTION EXPLANATION BAR */}
      <div className={`p-6 rounded-2xl border text-left relative overflow-hidden transition-all duration-300 ${
        theme === "dark" 
          ? "bg-slate-900/60 border-slate-800 shadow-xl" 
          : "bg-white border-slate-200 shadow"
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-teal-900/50 text-teal-400 border border-teal-800 rounded font-bold">
                🎓 KELULUSAN PRODUKTIF
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Verified Solution Track</span>
            </div>
            <h3 className="text-md sm:text-lg font-sans font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400 animate-spin" style={{ animationDuration: "12s" }} />
              Meja Kelulusan Konsistensi &amp; Solusi ProcrastiScan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Perjalanan mengalahkan bias perilaku tidak cukup hanya mengukur kemalasan secara terus-menerus! Portal ini memberikan <strong>Skenario Hasil Akhir</strong> dan <strong>Sertifikat Konsistensi Digital</strong> setelah Anda membuktikan komitmen disiplin harian.
            </p>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-1 px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-900 shrink-0 select-none text-left md:text-right">
            <p className="text-[9px] font-mono text-slate-500 uppercase">STATUS INTEGRITAS ANDA</p>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-bold">{userStreak} Hari Beruntun</span>
            </div>
            <div className="text-[10px]">
              {isEligible ? (
                <span className="text-emerald-400 font-bold block mt-1">🏅 Syarat Kelulusan Terpenuhi!</span>
              ) : (
                <div className="space-y-1 mt-1 text-left md:text-right font-sans">
                  {userStreak < 7 ? (
                    <span className="text-amber-400 font-semibold block text-[10px]">⚠️ Streak: {userStreak}/7 Hari</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold block text-[10px]">✓ Streak: {userStreak}/7 Hari</span>
                  )}
                  {focusLevel < 80 ? (
                    <span className="text-rose-400 font-semibold block text-[10px]">⚠️ Fokus: {focusLevel}% / 80% Min</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold block text-[10px]">✓ Fokus: {focusLevel}% / 80% Min</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEligible ? (
        <React.Fragment>
          {/* THE OFFICIAL DOCK OF THE SPECIFIC CERTIFICATE */}
          <div className="print:p-0">
            
            {/* Action buttons before printing */}
            <div className="flex items-center justify-end gap-2.5 mb-4 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-xl text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                Cetak / Simpan PDF
              </button>
              
              <button
                disabled={rewardClaimed}
                onClick={handleClaimReward}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  rewardClaimed 
                    ? "bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed" 
                    : "bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold hover:brightness-110 active:scale-95 cursor-pointer shadow-lg shadow-teal-500/10"
                }`}
              >
                <Download className="w-3.5 h-3.5 animate-bounce" />
                {rewardClaimed ? "Reward Diklaim!" : "Ambil Reward Sukses"}
              </button>
            </div>

            {/* CLASSIC CERTIFICATE LAYOUT CONTAINER */}
            <div 
              id="printable-procrastiscan-certificate"
              className={`rounded-3xl border-8 p-6 sm:p-10 text-center relative overflow-hidden transition-all duration-300 select-none shadow-2xl ${
                theme === "dark"
                  ? "bg-slate-950 border-double border-teal-800/80 text-white"
                  : "bg-white border-double border-teal-700/60 text-slate-900"
              }`}
              style={{ minHeight: "520px" }}
            >
              {/* Background Classic Watermarks & Borders */}
              <div className="absolute inset-0 border-4 border-slate-900/10 dark:border-white/5 m-3 pointer-events-none rounded-2xl"></div>
              <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-radial-at-c from-teal-500/5 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-radial-at-c from-amber-500/5 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>

              {/* Top Seal / Crest */}
              <div className="flex justify-center mb-6 relative">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal-500/40 flex items-center justify-center p-1 font-mono">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-teal-500/40">
                    <Award className="w-7 h-7 text-teal-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Title Header */}
              <div className="space-y-1.5 mb-6 text-center">
                <span className="text-[10px] font-mono tracking-[0.25em] text-teal-400 uppercase font-bold">
                  Sertifikat Kelulusan Konsistensi &amp; Kebebasan Pikiran
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mt-1 text-white dark:text-white light:text-slate-900">
                  ProcrastiScan AI Coach
                </h1>
                <div className="h-[2px] w-36 bg-gradient-to-r from-teal-500/10 via-teal-400 to-teal-500/10 mx-auto mt-3"></div>
              </div>

              {/* Certificate Statement of Achievement */}
              <div className="max-w-2xl mx-auto space-y-4 text-center">
                <p className="text-xs italic text-slate-400 dark:text-slate-400 light:text-slate-500">
                  Sertifikat elektronik kognitif ini diterbitkan secara sah dan dinilai tuntas sebagai apresiasi atas integritas tindakan penolakan penundaan berkas pekerjaan:
                </p>

                <div className="py-4 my-2 text-center">
                  <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-widest">NAMA PENERIMA YANG TERVERIFIKASI</span>
                  <p className="text-xl sm:text-2xl font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-100 dark:from-teal-300 dark:via-emerald-200 dark:to-white light:from-slate-900 light:to-slate-800 drop-shadow mt-1">
                    {userName}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-2">
                    Telah melengkapi audit kognitif, menguasai setidaknya satu Rencana Strategis Aksi, serta mendirikan benteng kebiasaan produktif berkelanjutan.
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-slate-300 dark:text-slate-300 light:text-slate-700 max-w-xl mx-auto">
                  Melalui observasi database sinkronisasi secara berkala, yang bersangkutan terbukti gigih melatih ketahanan kognitifnya, mempertahankan streak harian, menembus batas kelumpuhan analisis kiamat prematur, dan siap memimpin kelompok sejawat di tingkat teras utama.
                </p>
              </div>

              {/* Bottom Authority Details & Stamp */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-center border-t border-slate-900/50 dark:border-white/5 pt-8 mt-10 text-left">
                
                {/* Left Metadata parameters */}
                <div className="space-y-1 text-left hidden md:block">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">KODE SISTEM DIKTI</p>
                  <p className="text-xs font-mono font-bold text-slate-400">{certId}</p>
                  <p className="text-[9px] font-mono text-slate-500">STATUS: <span className="text-emerald-400">VERIFIED / GENUINE</span></p>
                </div>

                {/* Middle Signature Stamp Seal */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-18 h-18 rounded-full bg-teal-500 text-slate-950 font-serif font-black flex flex-col items-center justify-center shrink-0 shadow-lg relative transform rotate-[-4deg]">
                    <div className="absolute inset-1 border border-dotted border-slate-950 rounded-full"></div>
                    <span className="text-[8px] tracking-tight font-extrabold uppercase font-mono">PASSED</span>
                    <Flame className="w-5 h-5 text-slate-950 my-0.5 animate-pulse" />
                    <span className="text-[8px] font-bold">2026</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">SEGEL DIGITAL RESMI</span>
                </div>

                {/* Right Signature Representative */}
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-mono text-slate-500 uppercase">TANGGAL KEDISIPLINAN</p>
                  <p className="text-xs font-mono font-bold text-teal-400 dark:text-teal-400 light:text-slate-800">{formatGraduationDate()}</p>
                  <div className="italic text-[10px] font-serif text-slate-400 dark:text-slate-400 light:text-slate-600 border-t border-slate-800/40 dark:border-white/5 pt-1 mt-1.5">
                    ProcrastiScan AI Coach
                  </div>
                </div>

              </div>

            </div>

            {/* IF SPECIAL REWARD CLAIMED MESSAGE */}
            <AnimatePresence>
              {rewardClaimed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-6 p-5 bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl text-left space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-sm font-bold text-white">🎁 HADIAH EXCLUSIVE: PANDUAN BEBAS PROKRASTINASI 2026</h4>
                  </div>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    Selamat! Selain meluncurkan hormon bahagia, tim kami menyertakan e-book ringkas psikologi kognitif untuk terus dibaca saat Anda merasa segan. Gunakan kode unik Anda <strong className="text-yellow-400">{certId}</strong> saat berdiskusi di grup koding/belajar lokal.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4 italic">
                    <li>Tip #1: Kerjakan tugas tersulit pada 20-menit awal bangun pagi di mana energi kortisol otak memuncak.</li>
                    <li>Tip #2: Batasi asupan kafein di atas jam 14:00 agar ritme tidur kognitif Anda tidak rusak yang berujung mager akut esok pagi.</li>
                    <li>Tip #3: Selalu apresiasi diri sendiri setidaknya 2 menit setelah menamatkan draf kasarmu.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* PLAYBOOK SECTION: INTERACTIVE ROADMAP SOLUTION */}
          <div className={`p-6 rounded-2xl border text-left space-y-4 transition-all duration-300 ${
            theme === "dark" ? "bg-slate-900/40 border-slate-850" : "bg-white border-slate-200"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/40">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">PLAYBOOK SOLUSI STRATEGIS</span>
                </div>
                <h4 className="text-sm font-sans font-extrabold text-white dark:text-white light:text-slate-800">
                  Pelatihan Kognitif &amp; Penerapan Solusi Perilaku Anda
                </h4>
              </div>

              {/* Selector Playbook depending on Procrastinator Type */}
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-900 shrink-0 select-none">
                {(["A", "B", "C", "D"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                    }}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-extrabold transition-all cursor-pointer ${
                      selectedType === type
                        ? "bg-teal-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title={SOLUTION_PLAYBOOKS[type].name}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selected Playbook Summary Card */}
            <div className={`p-4 rounded-xl border bg-slate-950/30 ${SOLUTION_PLAYBOOKS[selectedType].color}`}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h5 className="text-xs font-sans font-extrabold text-slate-205">
                  {SOLUTION_PLAYBOOKS[selectedType].name}
                </h5>
                <span className="text-[9.5px] font-mono text-slate-500 italic">
                  {SOLUTION_PLAYBOOKS[selectedType].subtitle}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400 mt-1">
                {SOLUTION_PLAYBOOKS[selectedType].description}
              </p>
            </div>

            {/* Checklist of actions */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-slate-400">
                PANTU TUGAS AKTIVITAS TINDAKAN (Tandai jika sudah dicoba hari ini):
              </p>

              <div className="space-y-2.5">
                {SOLUTION_PLAYBOOKS[selectedType].actions.map((act) => {
                  const isChecked = !!playbookState[act.id];
                  return (
                    <button
                      key={act.id}
                      onClick={() => handleToggleCheck(act.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs font-sans group cursor-pointer ${
                        isChecked
                          ? "bg-teal-950/20 border-teal-500/40 text-teal-300"
                          : "bg-slate-950/40 hover:bg-slate-950/80 border-slate-900 hover:border-slate-800 text-slate-350"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <CheckSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isChecked ? "text-teal-400" : "text-slate-600 group-hover:text-slate-400"
                        }`} />
                        <span className={isChecked ? "line-through opacity-75" : ""}>
                          {act.text}
                        </span>
                      </div>
                      
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider shrink-0 ${
                        isChecked 
                          ? "bg-teal-900 border border-teal-700 text-teal-200" 
                          : "bg-slate-900 text-slate-500 group-hover:text-slate-305"
                      }`}>
                        {isChecked ? "DITERAPKAN" : "MENUNGGU AKTIVITAS"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar of Solution Implementation */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">PROGRES IMPLEMENTASI SOLUSI PSIKOLOGIS:</span>
                <span className={`font-bold ${progressPercent === 100 ? "text-teal-400 font-black animate-pulse" : "text-slate-300"}`}>
                  {progressPercent}% {progressPercent === 100 ? "✓ SEMUA TELAH DITERAPKAN!" : ""}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent === 100 && (
                    <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                  )}
                </div>
              </div>
              {progressPercent === 100 && (
                <p className="text-[10px] text-center text-teal-400 font-mono animate-bounce mt-1.5">
                  🎉 Luar biasa! Seluruh resep solusi kognitif hari ini telah Anda laksanakan. Pertahankan integritas produktivitas Anda!
                </p>
              )}
            </div>

          </div>

        </React.Fragment>
      ) : (
        /* BLOCKING SCREEN IF THEY HAVE NOT REACHED THE STREAK */
        <div className={`p-8 sm:p-12 text-center rounded-2xl border ${
          theme === "dark" ? "bg-slate-950/60 border-slate-850" : "bg-white border-slate-200"
        } space-y-4`}>
          <div className="relative mb-4 flex items-center justify-center">
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center relative">
              <ShieldAlert className="w-6 h-6 text-orange-400 animate-pulse" />
            </div>
          </div>
          
          <h4 className="text-md sm:text-lg font-sans font-extrabold text-white dark:text-white light:text-slate-800">
            🏅 Portal Sertifikat Kelulusan Belum Terbuka
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Maaf, gerbang kelulusan baru akan terbuka ketika Anda sanggup mempertahankan <strong>Streak harian minimal 7 Hari berturut-turut</strong> dan level fokus Anda <strong>selalu di atas 80% setiap harinya</strong>. Tantang dirimu di Pemicu Produktivitas!
          </p>

          <p className="text-[10px] text-slate-500 font-mono align-middle self-center w-full">
            *Silakan catat data penundaan Anda secara konsisten di tab Catatan Harian, kemudian mainkan Rencana Aksi 15 Menit dan Roda Putar!
          </p>
        </div>
      )}

      {/* CONFETTI ANIMATION CELEBRATION FLOATER OVERLAY */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 z-50 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none"
          >
            <div className="relative mb-3 flex items-center justify-center">
              <span className="absolute animate-ping bg-teal-400/20 w-24 h-24 rounded-full"></span>
              <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 rounded-full flex items-center justify-center relative shadow-lg">
                <BookmarkCheck className="w-9 h-9 text-slate-950" />
              </div>
            </div>

            <h4 className="text-md sm:text-lg font-sans font-black text-white px-2">
              🏆 KUALITAS PSIKOLOGIS MENINGKAT!
            </h4>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed mt-2.5">
              Tindakan strategis berhasil dicoba dan dicatat. Kedisipilinan kognitif Anda memicu penolakan kelesuan secara proaktif! Tetap konsisten mengamankan draf aktivitas harian Anda.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
