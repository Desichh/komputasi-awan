import React, { useState, useEffect } from "react";
import { Activity, AnalysisResponse } from "../types";
import { 
  TrendingUp, Clock, AlertTriangle, Brain, Target, Compass, Sparkles, ClipboardList, Gauge, Play, RefreshCw, BarChart2, PieChart as PieChartIcon, ArrowRight, CheckCircle2
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, PieChart, Pie 
} from "recharts";

interface AnalyticsDashboardProps {
  userName: string;
  activities: Activity[];
  analysis: AnalysisResponse | null;
  loading: boolean;
  onRunAnalysis: () => void;
  error: string | null;
  theme: "dark" | "light";
  onNavigateToTriggers?: () => void;
}

export default function AnalyticsDashboard({ 
  userName,
  activities, 
  analysis, 
  loading, 
  onRunAnalysis, 
  error,
  theme,
  onNavigateToTriggers
}: AnalyticsDashboardProps) {
  
  // Custom interactive Oracle states
  const [oracleQuote, setOracleQuote] = useState<string>("Sambut harimu dengan tindakan jujur. Klik tombol di kanan untuk meminta 'Wahyu Produktivitas' kustom spiritual khusus dari AI Coach Anda!");
  const [oracleLoading, setOracleLoading] = useState<boolean>(false);

  // Interactive Weekly Delay & Financial Cost States
  const [hourlyRate, setHourlyRate] = useState<number>(55000); // Default Rp 55,000 / hour



  const [funnyLoadingTag, setFunnyLoadingTag] = useState("Menimbang alasan-alasan konyolmu...");

  const loadingMessages = [
    "Menimbang alasan-alasan konyolmu...",
    "Menganalisis kadar kecanduan doom-scrolling...",
    "Menghitung selisih waktu tidur vs waktu koding...",
    "AI Sedang geleng-geleng kepala melihat data delay Tinggi...",
    "Merajut masa depan tanpa penundaan (semoga)...",
    "Melacak kapan wahyu produktivitas biasanya turun..."
  ];

  useEffect(() => {
    let interval: any = null;
    if (loading) {
      interval = setInterval(() => {
        const randomMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        setFunnyLoadingTag(randomMsg);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);



  const fetchOracle = async () => {
    setOracleLoading(true);
    try {
      const resp = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, avgDelay, totalTasks })
      });
      const data = await resp.json();
      if (data.oracleText) {
        setOracleQuote(data.oracleText);
      }
    } catch (err) {
      setOracleQuote("Pikiran yang matang siap menghadapi tugas sulit sekarang juga, bukan jam ganjil berikutnya.");
    } finally {
      setOracleLoading(false);
    }
  };

  // Direct client-side stat analysis based on the current active list
  const totalTasks = activities.length;
  const completedTasks = activities.filter(a => a.completed).length;
  const avgDelay = totalTasks > 0 
    ? Math.round(activities.reduce((sum, a) => sum + a.delay_minutes, 0) / totalTasks)
    : 0;

  // Breakdown delay by difficulty
  const highDiffTasks = activities.filter(a => a.difficulty === "High");
  const medDiffTasks = activities.filter(a => a.difficulty === "Medium");
  const lowDiffTasks = activities.filter(a => a.difficulty === "Low");

  const getAvgDelaySub = (subset: Activity[]) => {
    if (subset.length === 0) return 0;
    return Math.round(subset.reduce((sum, a) => sum + a.delay_minutes, 0) / subset.length);
  };

  const avgHighDelay = getAvgDelaySub(highDiffTasks);
  const avgMedDelay = getAvgDelaySub(medDiffTasks);
  const avgLowDelay = getAvgDelaySub(lowDiffTasks);

  // Consistency score
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  let consistencyLevel = "CRITICAL 🚨";
  let ratingColor = "text-rose-400";
  if (completionRate > 80 && avgDelay < 45) {
    consistencyLevel = "OPTIMAL (DEWA PRODUKTIVITAS) 👑";
    ratingColor = "text-teal-400";
  } else if (completionRate > 50 && avgDelay < 180) {
    consistencyLevel = "MODERAT (USAHA BAGUS) ⚖️";
    ratingColor = "text-amber-400";
  }

  // Interactive weekly stats for cost calculation dynamically computed from real user activities
  const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const dynamicWeeklyDelays = daysOfWeek.map(day => {
    return activities
      .filter(act => (act.day || "Senin") === day)
      .reduce((sum, act) => sum + act.delay_minutes, 0);
  });

  const totalWeeklyMinutes = dynamicWeeklyDelays.reduce((sum, val) => sum + val, 0);
  const totalWeeklyHours = Math.round((totalWeeklyMinutes / 60) * 10) / 10;
  const weeklyLossRupiah = Math.round(totalWeeklyHours * hourlyRate);
  const monthlyLossRupiah = Math.round(weeklyLossRupiah * 4.3);
  const yearlyLossRupiah = Math.round(monthlyLossRupiah * 12);

  const indomiePrice = 3500;
  const indomieEquivalent = Math.floor(weeklyLossRupiah / indomiePrice);
  const coffeePrice = 28000;
  const coffeeEquivalent = Math.floor(weeklyLossRupiah / coffeePrice);
  const electricityPrice = 50000;
  const electricityEquivalent = Math.floor(weeklyLossRupiah / electricityPrice);

  const weeklyChartData = daysOfWeek.map((day, idx) => ({
    name: day,
    "Menit Delay": dynamicWeeklyDelays[idx],
    "Kerugian (Rp)": Math.round((dynamicWeeklyDelays[idx] / 60) * hourlyRate),
  }));

  // Prep Recharts Data
  const taskChartData = activities.map((act) => ({
    name: act.task_name.length > 20 ? act.task_name.substring(0, 18) + "..." : act.task_name,
    "Menit Delay": act.delay_minutes,
    difficulty: act.difficulty,
  }));

  const difficultyChartData = [
    { name: "🔴 Tinggi (High)", "Rerata Delay (Menit)": avgHighDelay, color: "#f87171" },
    { name: "🟡 Sedang (Medium)", "Rerata Delay (Menit)": avgMedDelay, color: "#fbbf24" },
    { name: "🟢 Rendah (Low)", "Rerata Delay (Menit)": avgLowDelay, color: "#34d399" },
  ];

  return (
    <div id="analytics-dashboard-panel" className="space-y-8">

      {/* 🔮 Kotak Wahyu Produktivitas AI Coach */}
      <div className="bg-gradient-to-r from-purple-950/20 via-slate-900 to-indigo-950/25 border border-purple-900/30 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-purple-500/5">
        <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
          <Sparkles className="w-16 h-16 text-purple-400/30 animate-pulse" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              🔮 Wahyu Produktivitas AI Hari Ini
            </div>
            <p className="text-xs text-slate-200 leading-relaxed max-w-2xl italic font-serif">
              "{oracleQuote}"
            </p>
          </div>
          
          <button
            onClick={fetchOracle}
            disabled={oracleLoading}
            className="flex-shrink-0 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-600 text-slate-100 rounded-xl text-xs font-mono font-bold shadow-lg shadow-purple-500/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {oracleLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Mencari wahyu kognitif...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                Buka Wahyu Kuno AI
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Client-Side Quick Stats Cards (Always present) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-teal-950/50 rounded-lg text-teal-400 border border-teal-900/40">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">Total Tugas Terlacak</span>
            <span className="text-2xl font-bold font-mono text-teal-400">{totalTasks}</span>
            <span className="text-[10px] text-slate-550 block">Selesai: {completedTasks} / {totalTasks} ({completionRate}%)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-950/50 rounded-lg text-rose-400 border border-rose-900/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">Rerata Keterlambatan</span>
            <span className="text-2xl font-bold font-mono text-rose-400">{avgDelay} <span className="text-xs">menit</span></span>
            <span className="text-[10px] text-slate-555 block">Setara {Math.round((avgDelay / 60) * 10) / 10} jam terbuang</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-950/50 rounded-lg text-amber-400 border border-amber-900/40">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">Delay Tugas Sulit (High)</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{avgHighDelay} <span className="text-xs">menit</span></span>
            <span className="text-[10px] text-slate-555 block">Rendah: {avgLowDelay}m | Sedang: {avgMedDelay}m</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-slate-950 rounded-lg text-slate-400 border border-slate-800">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">Status Konsistensi</span>
            <span className={`text-xs font-bold font-mono block mt-1.5 ${ratingColor}`}>{consistencyLevel}</span>
            <span className="text-[10px] text-slate-555 block">Terhitung dari % selesai</span>
          </div>
        </div>

      </div>

      {/* ⏱️ Laporan Mingguan Kerugian Waktu & Finansial */}
      <div id="weekly-loss-report-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 relative overflow-hidden">
        {/* Ambient shadow gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-900/40">
              Evaluasi Finansial &amp; Kebiasaan 💸📉
            </span>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mt-2">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              Laporan Mingguan Kerugian Waktu &amp; Rupiah (Berdasarkan Buku Catatan)
            </h3>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Dihitung langsung dari total durasi waktu tunda tugas nyata di log harian Anda. Sesuaikan tarif produktif per jam Anda untuk mengalkulasi setara fisik sanksi finansialnya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          
          {/* Kolom Kiri: Rincian Hari Otomatis */}
          <div className="lg:col-span-4 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-850/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <h4 className="text-[11px] font-mono font-bold text-slate-350 uppercase">
                  Akumulasi Delay Per Hari (Sesuai Buku Catatan)
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase animate-pulse">Live</span>
              </div>

              <div className="space-y-2.5 mt-3">
                {daysOfWeek.map((day, idx) => {
                  const dayDelay = dynamicWeeklyDelays[idx];
                  return (
                    <div key={day} className="flex justify-between items-center text-xs font-mono py-1 border-b border-slate-850/40 last:border-0 last:pb-0">
                      <span className="text-slate-400">{day}</span>
                      <span className={`font-bold ${dayDelay > 120 ? "text-rose-450" : dayDelay > 30 ? "text-amber-500" : dayDelay > 0 ? "text-teal-400" : "text-slate-500"}`}>
                        {dayDelay} m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {totalWeeklyMinutes === 0 && (
              <p className="text-[10px] text-slate-500 leading-relaxed italic text-center mt-3 border-t border-slate-800/40 pt-2">
                *Belum ada data delay. Masukkan aktivitas di log atas dengan hari tertentu untuk melihat grafik kerugian Anda!
              </p>
            )}
          </div>

          {/* Kolom Tengah: Visualisasi Recharts & Harga Per Jam */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850/80 flex-1 flex flex-col justify-between">
              
              <div className="pb-2 border-b border-slate-800/80 space-y-3">
                <h4 className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                  Pola Distorsi Mingguan &amp; Tarif
                </h4>
                
                {/* Hour Rate Customizer */}
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <label className="text-[10px] uppercase font-mono text-slate-450 block mb-1 font-bold">
                    Tarif Harga Waktu Per Jam (Rp):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500">Rp</span>
                    <input
                      type="number"
                      step="5000"
                      min="5000"
                      max="1000000"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Math.max(5000, parseInt(e.target.value, 10) || 5000))}
                      className="bg-slate-950 px-2 py-1 rounded text-xs font-mono text-emerald-400 focus:outline-none border border-slate-800/80 flex-1"
                    />
                    <span className="text-[10px] font-mono text-slate-500">/ jam</span>
                  </div>
                </div>
              </div>

              <div className="h-40 w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} unit="m" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#facc15', fontSize: '10px' }}
                    />
                    <Bar dataKey="Menit Delay" radius={[2, 2, 0, 0]}>
                      {weeklyChartData.map((entry, index) => {
                        const value = entry["Menit Delay"];
                        const color = value > 180 ? "#f87171" : value > 90 ? "#fbbf24" : "#34d399";
                        return <Cell key={`cell-weekly-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="text-[9px] text-slate-500 text-center font-mono mt-1">
                *Detektor: Merah (&gt;3 jam), Kuning (1.5-3 jam), Hijau (&lt;1.5 jam)
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Rekapitulasi Finansial & Konversi Sindiran Kocak */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            
            {/* Total stats card */}
            <div className="bg-gradient-to-br from-rose-950/20 to-slate-900 border border-rose-900/30 rounded-xl p-4 space-y-2 relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="text-[10px] font-mono uppercase text-rose-450 font-bold block">
                Total Kerugian Waktu Mingguan
              </div>
              <div>
                <span className="text-xl font-extrabold font-mono text-rose-400 block tracking-tight">
                  Rp {weeklyLossRupiah.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">Menghambur {totalWeeklyHours} jam/minggu</span>
              </div>
              
              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Per Bulan:</span>
                  <span className="text-slate-200 font-bold">Rp {monthlyLossRupiah.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-450 text-[9px]">
                  <span>Satu Tahun:</span>
                  <span className="text-rose-500 font-bold">Rp {yearlyLossRupiah.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Equivalents table inside high-contrast wrapper */}
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-850/80 space-y-2.5">
              <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider font-bold">Setara Dengan:</span>
              
              <div className="space-y-1.5 font-mono text-[10.5px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>🍜 Indomie:</span>
                  <span className="font-bold text-amber-500">{indomieEquivalent} bungkus</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>☕ Kopi Kafe:</span>
                  <span className="font-bold text-teal-400">{coffeeEquivalent} gelas</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>⚡ PLN @50rb:</span>
                  <span className="font-bold text-purple-400">{electricityEquivalent} isi Token</span>
                </div>
              </div>
              
              <div className="border-t border-slate-850/80 pt-2 mt-2 text-[10px] text-slate-400 leading-normal italic text-slate-350">
                {
                  totalWeeklyHours > 20 ? "⚠️ Anda kuli prokrastinasi elit! Kerugian setara upah magang." :
                  totalWeeklyHours > 10 ? "💸 Kerugian Anda setara sewa kosan kucing estetik ber-AC." :
                  totalWeeklyHours > 4 ? "☕ Cukup banyak, mending waktu ini dipakai santai beneran." :
                  "👑 Hebat, rasio disiplin mengesankan! Kerugian sangat minimal."
                }
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Trigger AI Analysis button banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full filter blur-3xl -translate-y-1/2 pointer-events-none"></div>

        <div className="space-y-1.5 z-10 flex-1">
          <span className="text-[10px] font-mono font-bold text-teal-400 tracking-wider uppercase bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-900/50">
            Kekuatan AI Generative 🧠⚡
          </span>
          <h2 className="text-xl font-sans font-bold text-slate-100 flex items-center gap-1.5 mt-2">
            Jalankan Analisis Pola Penundaan AI
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Sistem AI akan menganalisis data aktivitas produktivitas Anda saat ini dan membentuk grafik kustom beserta solusi taktis yang dipersonalisasi penuh.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 z-10 font-sans">
          <button
            id="run-ai-analysis-btn"
            onClick={onRunAnalysis}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-sans font-extrabold rounded-xl shadow-xl shadow-teal-500/20 hover:shadow-teal-400/30 transition-all flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 disabled:shadow-none cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Membongkar Pola...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Mulai Analisis Reflektif!
              </>
            )}
          </button>
          <span className="text-[10px] font-mono text-slate-400">Bahasa Indonesia • Personalisasi Akurat</span>
        </div>
      </div>

      {/* Loading Block */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
            <Brain className="w-6 h-6 text-teal-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-100">AI Sedang Menyisir Pola Perilaku Produktivitasmu</h4>
            <p className="text-xs font-mono text-amber-400">{funnyLoadingTag}</p>
          </div>
          <p className="text-[11px] text-slate-550 max-w-md mx-auto italic">
            "Sesaat lagi, realita ketiadaan disiplinmu akan dibedah menjadi fakta angka yang presisi. Jangan panik."
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-900/60 rounded-xl flex items-center gap-3 text-rose-300 text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div>
            <p className="font-bold">Gagal Menganalisis Pola</p>
            <p className="text-slate-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Graphics and AI Results Display */}
      {analysis && !loading && (
        <div id="ai-results-block" className="space-y-8">
          
          {/* Section Heading */}
          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
            <h3 className="text-md font-sans font-extrabold text-teal-400 tracking-tight uppercase flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Hasil Riset Pola &amp; Visualisasi Grafik AI
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Kueri Terproses Sempurna</span>
          </div>

          {/* Interactive Recharts Graphics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Delay per Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-mono text-slate-300 uppercase font-semibold flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-teal-400" />
                  Grafik 1: Hambatan Waktu Menunda (Delay Menit) per Aktivitas
                </h4>
                <span className="text-[10px] text-slate-500">Makin tinggi makin kritis</span>
              </div>

              {activities.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">No data values to render.</div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="m" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                        labelStyle={{ color: '#f1f5f9', fontSize: '11px', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#2dd4bf', fontSize: '11px' }}
                      />
                      <Bar dataKey="Menit Delay" fill="url(#colorDelay)" radius={[4, 4, 0, 0]}>
                        {taskChartData.map((entry, index) => {
                          const diff = entry.difficulty;
                          const color = diff === "High" ? "#f87171" : diff === "Medium" ? "#fbbf24" : "#34d399";
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                      <defs>
                        <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="flex justify-center gap-4 text-[10.5px] font-mono pt-1 text-slate-400 border-t border-slate-800/40">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-400 inline-block"></span> High Difficulty</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span> Medium Difficulty</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block"></span> Low Difficulty</span>
              </div>
            </div>

            {/* Chart 2: Average Delay by Difficulty Category */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-xs font-mono text-slate-300 uppercase font-semibold flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-emerald-400" />
                  Grafik 2: Rerata Delay Berdasarkan Tingkat Kesulitan Tugas
                </h4>
                <span className="text-[10px] text-slate-500">Korelasi resistensi kognitif</span>
              </div>

              {activities.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500 italic">No data values to render.</div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={difficultyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="m" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                        labelStyle={{ color: '#f1f5f9', fontSize: '11px', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#facc15', fontSize: '11px' }}
                      />
                      <Bar dataKey="Rerata Delay (Menit)" radius={[4, 4, 0, 0]}>
                        {difficultyChartData.map((entry, index) => (
                          <Cell key={`cell-diff-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-[11px] text-slate-450 text-center leading-normal italic">
                *Analisis data menunjukkan seberapa segan Anda untuk memulai tugas yang dikategorikan sulit (High).
              </p>
            </div>

          </div>

          {/* Main Ringkasan Hero Panel */}
          <div className="bg-gradient-to-bl from-slate-900 to-slate-950 border-2 border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider ${
                analysis.tipeProcrastinator === "Avoider" ? "bg-rose-950/80 text-rose-400 border border-rose-900" :
                analysis.tipeProcrastinator === "Perfectionist" ? "bg-teal-950/80 text-teal-400 border border-teal-950" :
                "bg-amber-950/80 text-amber-400 border border-amber-900"
              }`}>
                KATEGORI: {analysis.tipeProcrastinator?.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-4 items-start max-w-3xl">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-amber-400 flex-shrink-0 mt-1">
                <Brain className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-amber-400 block tracking-wider uppercase font-bold">RINGKASAN UTAMA: SINDIRAN COACH ELIT</span>
                <p className="text-base text-slate-100 font-sans font-semibold italic leading-relaxed">
                  "{analysis.ringkasanUtama}"
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  <strong className="text-slate-300">Penilaian Tipe:</strong> {analysis.alasanTipe}
                </p>
              </div>
            </div>
          </div>

          {/* Bento grid breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Box: Pola Penundaan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                Pola Penundaan Utama
              </h3>

              <div className="space-y-3 font-sans text-xs text-slate-300">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0 mt-1"></div>
                  <div>
                    <strong className="text-slate-100 block mb-0.5 font-mono text-[11px] uppercase tracking-wider">Rerata Keterlambatan</strong>
                    <span>Rata-rata Anda berjarak <strong className="text-rose-400">{analysis.rataRataDelayMenit} menit</strong> dari kesepakatan janji dengan diri sendiri.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1"></div>
                  <div>
                    <strong className="text-slate-100 block mb-0.5 font-mono text-[11px] uppercase tracking-wider">Jam Kerawanan Menunda</strong>
                    <span>Tingkat penundaan tertinggi Anda meletus pada <strong className="text-amber-400">{analysis.waktuPalingSering}</strong>.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0 mt-1"></div>
                  <div>
                    <strong className="text-slate-100 block mb-0.5 font-mono text-[11px] uppercase tracking-wider">Relasi Kesulitan &amp; Hambatan</strong>
                    <span>{analysis.hubunganKesulitan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Insight Psikologis & Prediksi */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  Insight Reflektif Perilaku
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                  "{analysis.insightPerilaku}"
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-300 pb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Ramalan Kerentanan Mundur
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.prediksiSederhana}
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-emerald-400 block font-mono uppercase text-[10px] tracking-wider mb-1">💡 SARAN NYATA INSTAN:</strong>
                {analysis.saranKecil}
              </div>

            </div>

          </div>



          {/* CTA Button to Productivity Trigger System */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-left space-y-1">
              <h5 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-sans">
                <Target className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                Sambut Pemicu Tindakan Nyata Seketika!
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-sans">
                Gunakan binaural beat, roda putar tantangan mikro, dan selesaikan Misi Psikologis Harian Anda di Sistem Pemicu Produktivitas untuk mengamankan streak kelulusan!
              </p>
            </div>
            {onNavigateToTriggers && (
              <button
                onClick={onNavigateToTriggers}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 via-amber-600 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs font-sans rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-900/10 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Letakkan Dalam Sistem Pemicu Produktivitas!
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Backup instructions panel when no response is active */}
      {!analysis && !loading && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <Brain className="w-10 h-10 text-slate-650 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-300">Belum Ada Analisis AI Aktif</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan periksa atau ubah data log aktivitas penundaan Anda di tabel atas, lalu klik tombol "Mulai Analisis Reflektif" untuk memicu grafik pola dan evaluasi AI Coach!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
