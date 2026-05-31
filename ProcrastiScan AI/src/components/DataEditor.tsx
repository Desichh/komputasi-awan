import React, { useState } from "react";
import { Activity } from "../types";
import { SCENARIOS } from "../scenarios";
import { Plus, Trash, RotateCcw, Copy, Code, Check, AlertCircle, Sparkles, Sliders, CalendarDays, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion } from "motion/react";

interface DataEditorProps {
  userName: string;
  activities: Activity[];
  onChange: (newActivities: Activity[]) => void;
  onClearAll: () => void;
  onLoadSample: () => void;
  theme: "dark" | "light";
}

export default function DataEditor({ userName, activities, onChange, onClearAll, onLoadSample, theme }: DataEditorProps) {
  // Custom new task form state
  const [newTaskName, setNewTaskName] = useState("");
  const [newPlanned, setNewPlanned] = useState("09:00");
  const [newActual, setNewActual] = useState("11:30");
  const [newDifficulty, setNewDifficulty] = useState<"High" | "Medium" | "Low">("Medium");
  const [newCategory, setNewCategory] = useState("Pendidikan");
  const [newExcuse, setNewExcuse] = useState("");
  const [newDay, setNewDay] = useState<string>("Senin");

  // States for search, dynamic filtering and pagination to keep UI clean and compact
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDayFilter, setSelectedDayFilter] = useState("Semua");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Semua"); // "Semua" | "Selesai" | "Belum Selesai"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Helper sync
  const updateActivities = (next: Activity[]) => {
    onChange(next);
  };

  // Compute delay from HH:mm planned to actual
  const calculateDelayMinutes = (planned: string, actual: string): number => {
    try {
      const [p_h, p_m] = planned.split(":").map(Number);
      const [a_h, a_m] = actual.split(":").map(Number);
      
      let p_total = p_h * 60 + p_m;
      let a_total = a_h * 60 + a_m;

      if (a_total < p_total) {
        // Assume next-day cross-over
        a_total += 24 * 60;
      }
      return Math.max(0, a_total - p_total);
    } catch (e) {
      return 60; // default backup fallback
    }
  };

  const handleAddField = () => {
    if (!newTaskName.trim()) return;

    const delay = calculateDelayMinutes(newPlanned, newActual);
    const newAct: Activity = {
      id: "custom_" + Date.now(),
      task_name: newTaskName,
      planned_time: newPlanned,
      actual_time: newActual,
      delay_minutes: delay,
      difficulty: newDifficulty,
      category: newCategory,
      completed: true,
      excuse: newExcuse.trim() || undefined,
      day: newDay
    };

    const next = [...activities, newAct];
    updateActivities(next);
    
    // reset form
    setNewTaskName("");
    setNewExcuse("");
  };

  const handleDeleteField = (id: string) => {
    const next = activities.filter((a) => a.id !== id);
    updateActivities(next);
  };

  const handleToggleComplete = (id: string) => {
    const next = activities.map((a) => {
      if (a.id === id) {
        return { ...a, completed: !a.completed };
      }
      return a;
    });
    updateActivities(next);
  };

  const handleUpdateExcuse = (id: string, excuseVal: string) => {
    const next = activities.map((a) => {
      if (a.id === id) {
        return { ...a, excuse: excuseVal };
      }
      return a;
    });
    updateActivities(next);
  };

  // Dynamic filter and pagination calculations based on real-time search & filters
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.excuse || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDay =
      selectedDayFilter === "Semua" || (act.day || "Senin") === selectedDayFilter;

    const matchesStatus =
      selectedStatusFilter === "Semua" ||
      (selectedStatusFilter === "Selesai" && act.completed) ||
      (selectedStatusFilter === "Belum Selesai" && !act.completed);

    return matchesSearch && matchesDay && matchesStatus;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage) || 1;
  const validatedCurrentPage = Math.min(currentPage, totalPages) || 1;
  const startIndex = (validatedCurrentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  // Math metrics summary on client side
  const avgDelay = activities.length > 0 
    ? Math.round(activities.reduce((acc, curr) => acc + curr.delay_minutes, 0) / activities.length)
    : 0;

  return (
    <div id="data-editor-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-sans font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-400" />
            Buku Catatan Penundaan {userName}
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">Kelola riwayat rencana dan realisasi tugas harian Anda</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            id="preset-load-sample"
            onClick={onLoadSample}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border bg-slate-800 text-teal-400 border-slate-700 hover:bg-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
          >
            📋 Isi Contoh Tugas
          </button>
          <button 
            id="preset-clear-all"
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border bg-slate-950 text-rose-400 border-slate-800 hover:bg-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            🗑️ Bersihkan Semua
          </button>
        </div>
      </div>

      {/* Dynamic profile message info */}
      <div className="px-4 py-3.5 bg-slate-950 rounded-xl border border-slate-800/85 mb-6 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          Halo <strong className="text-teal-400">{userName}</strong>! Ini adalah log personal Anda. Tambahkan tugas-tugas riil atau contoh yang ingin Anda evaluasi di tabel bawah. Tuliskan jam rencana mulai, jam aktual dimulai, beserta <strong className="text-amber-400">alasan konyol</strong> Anda menundanya! Setelah itu, mari jalankan evaluasi AI di tombol analisis bawah.
        </span>
      </div>

      {/* Mode toggle and Filter Controls */}
      <div className="flex flex-col gap-4 mb-5 pb-4 border-b border-slate-800/60 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            Daftar Aktivitas ({filteredActivities.length} terfilter / Total {activities.length})
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tugas, kategori, atau alasan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-3 py-1.5 w-full bg-slate-950 text-xs border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Status Select Filter */}
            <div className="md:col-span-3 w-full">
              <select
                value={selectedStatusFilter}
                onChange={(e) => {
                  setSelectedStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Semua">Semua Status</option>
                <option value="Belum Selesai">⏳ Belum Selesai (Aktif)</option>
                <option value="Selesai">✅ Selesai (Arsip Histori)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="md:col-span-4 flex justify-end">
              {(searchQuery !== "" || selectedDayFilter !== "Semua" || selectedStatusFilter !== "Semua") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDayFilter("Semua");
                    setSelectedStatusFilter("Semua");
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 text-[11px] font-mono text-amber-400 hover:text-amber-300 border border-amber-900/40 bg-amber-950/20 hover:bg-amber-950/40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Mulai Ulang Filter
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-t border-slate-900 pt-2 bg-slate-950/20 p-2 rounded-xl">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5 select-none pl-1">
              Filter Hari Kerja:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((day) => {
                const isSelected = selectedDayFilter === day;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDayFilter(day);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-teal-500/10 text-teal-400 border-teal-500/40 font-extrabold"
                        : "bg-slate-950 text-slate-400 border-slate-900 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
      </div>

      <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full border-collapse text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Selesai</th>
                  <th className="p-3">Nama Aktivitas &amp; Excuse Relasi</th>
                  <th className="p-3 text-center">Rencana</th>
                  <th className="p-3 text-center">Aktual</th>
                  <th className="p-3 text-center">Delay</th>
                  <th className="p-3 text-center">Kesulitan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {paginatedActivities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 italic font-mono text-xs">
                      ⚠️ Tidak ada catatan yang sesuai dengan filter atau pencarian Anda. Silakan cari kata kunci lain atau ubah filter hari.
                    </td>
                  </tr>
                ) : (
                  paginatedActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="p-3 text-center w-12">
                        <input
                          type="checkbox"
                          checked={act.completed}
                          onChange={() => handleToggleComplete(act.id)}
                          className="w-4.5 h-4.5 cursor-pointer rounded border-slate-700 text-teal-500 focus:ring-teal-600 bg-slate-950 accent-teal-500"
                          title="Tandai status selesai"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-100">{act.task_name}</div>
                        <div className="text-[11px] text-teal-400 font-mono mt-0.5 flex items-center gap-2">
                          <span>{act.category}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-amber-400 font-semibold">{act.day || "Senin"}</span>
                        </div>
                        
                        {/* Interactive Excuse writing field */}
                        <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded font-mono text-amber-400">Alasan:</span>
                          <input
                            type="text"
                            value={act.excuse || ""}
                            placeholder="Tulis alasan menunda yang konyol di sini..."
                            onChange={(e) => handleUpdateExcuse(act.id, e.target.value)}
                            className="bg-transparent text-slate-300 text-[11px] italic placeholder-slate-600 border-b border-dashed border-slate-700 focus:border-amber-400 focus:outline-none flex-1 min-w-[120px]"
                          />
                          {act.excuse && (
                            <span className={`px-2 py-0.5 text-[9px] font-mono rounded border scale-95 transition-all ${
                              act.excuse.toLowerCase().match(/tiktok|youtube|reels|ig|instagram|hp|sosmed|kucing|game|nonton|scroll|feed/)
                                ? "text-rose-400 border-rose-900 bg-rose-950/40"
                                : act.excuse.toLowerCase().match(/lelah|pusing|rehat|tidur|malas|mood|suasana|mager|ngantuk|capek|makan/)
                                ? "text-amber-400 border-amber-900 bg-amber-950/40"
                                : act.excuse.toLowerCase().match(/sulit|paham|dokumentasi|error|takut|bingung|rumit|baca|stuck/)
                                ? "text-teal-400 border-teal-900 bg-teal-950/40"
                                : "text-slate-400 border-slate-800 bg-slate-950"
                            }`}>
                              {
                                act.excuse.toLowerCase().match(/tiktok|youtube|reels|ig|instagram|hp|sosmed|kucing|game|nonton|scroll|feed/) ? "📱 Dopamine Trap" :
                                act.excuse.toLowerCase().match(/lelah|pusing|rehat|tidur|malas|mood|suasana|mager|ngantuk|capek|makan/) ? "🌊 Mood Defense" :
                                act.excuse.toLowerCase().match(/sulit|paham|dokumentasi|error|takut|bingung|rumit|baca|stuck/) ? "🧠 Cognitive Block" :
                                "☕ Classic Alibi"
                              }
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono font-medium whitespace-nowrap">{act.planned_time}</td>
                      <td className="p-3 text-center font-mono font-medium whitespace-nowrap text-slate-400">{act.actual_time}</td>
                      <td className="p-3 text-center font-mono font-bold whitespace-nowrap">
                        <span className={act.delay_minutes > 120 ? "text-rose-400" : act.delay_minutes > 30 ? "text-amber-400" : "text-emerald-400"}>
                          {act.delay_minutes} m
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          act.difficulty === "High" ? "bg-rose-950/60 text-rose-400 border border-rose-900/50" :
                          act.difficulty === "Medium" ? "bg-amber-950/60 text-amber-400 border border-amber-900/50" :
                          "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
                        }`}>
                          {act.difficulty}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          title="Hapus aktivitas"
                          onClick={() => handleDeleteField(act.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition-all cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Dynamic Pagination Controls to avoid long-tail clutter */}
          {filteredActivities.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-950/40 border border-slate-850/60 rounded-xl font-mono text-[11px] text-slate-400">
              <span className="font-medium text-center sm:text-left">
                Menampilkan <strong className="text-slate-200">{startIndex + 1}</strong> hingga{" "}
                <strong className="text-slate-200">{Math.min(startIndex + itemsPerPage, filteredActivities.length)}</strong>{" "}
                dari <strong className="text-teal-400">{filteredActivities.length}</strong> catatan
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  disabled={validatedCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none rounded hover:text-teal-400 hover:border-teal-400/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>
                
                <span className="text-slate-400 font-bold select-none">
                  Hal {validatedCurrentPage} / {totalPages}
                </span>
                
                <button
                  disabled={validatedCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none rounded hover:text-teal-400 hover:border-teal-400/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  Selanjutnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Form to insert new activity log quickly */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-mono text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-400" />
              Tambah Catatan Log Aktivitas Baru
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nama Aktivitas / Rencana Tugas:</label>
                <input
                  type="text"
                  placeholder="Misal: Kerjain revisi draf skripsi bab 1"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Excuse Relasi (Wajib Kocak &amp; Jujur):</label>
                <input
                  type="text"
                  placeholder="Misal: Scroll reels IG cari filter kucing lucuuu sekali..."
                  value={newExcuse}
                  onChange={(e) => setNewExcuse(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Hari:</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Rencana Jam:</label>
                  <input
                    type="text"
                    placeholder="08:00"
                    value={newPlanned}
                    onChange={(e) => setNewPlanned(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-center text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Mulai Jam:</label>
                  <input
                    type="text"
                    placeholder="11:30"
                    value={newActual}
                    onChange={(e) => setNewActual(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-center text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Kesulitan:</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Kategori Tugas:</label>
                <input
                  type="text"
                  placeholder="Pendidikan, Koding, Berbenah, Keuangan, dsb."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                id="add-custom-task"
                onClick={handleAddField}
                disabled={!newTaskName.trim()}
                className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 text-slate-950 font-sans font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-teal-500/10 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah ke Log
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
