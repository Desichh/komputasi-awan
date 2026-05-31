export interface Activity {
  id: string;
  task_name: string;
  planned_time: string; // format: "HH:mm" or "YYYY-MM-DD HH:mm"
  actual_time: string;  // format: "HH:mm" or "YYYY-MM-DD HH:mm"
  delay_minutes: number;
  difficulty: "High" | "Medium" | "Low";
  category: string;     // e.g., "Koding", "Tugas Kuliah", "Balas Chat/Email", "Berbenah", etc.
  completed: boolean;
  excuse?: string;      // The classic funny procrastination excuse
  day?: string;         // 'Senin', 'Selasa', etc.
}

export interface AnalysisResponse {
  ringkasanUtama: string;
  rataRataDelayMenit: number;
  waktuPalingSering: string;
  hubunganKesulitan: string;
  insightPerilaku: string;
  prediksiSederhana: string;
  tipeProcrastinator: "Avoider" | "Perfectionist" | "Mood-based";
  alasanTipe: string;
  saranKecil: string;
  rencana15Menit: string;
}

export interface MicroChallenge {
  id: string;
  title: string;
  description: string;
  durationSeconds: number; // 5 minutes standard = 300
  instructions: string[];
}
