import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PORT = 3000;

// Initialize Gemini SDK with named parameters & telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // API route first: proxy to Gemini for procrastination behavior analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { activities } = req.body;

      if (!activities || !Array.isArray(activities) || activities.length === 0) {
        return res.status(400).json({ error: "Data aktivitas tidak boleh kosong dan harus berupa array." });
      }

      const activitiesStr = JSON.stringify(activities, null, 2);

      const systemInstruction = `Kamu adalah seorang AI analis perilaku produktivitas (productivity coach) yang sangat jeli, manusiawi, dan reflektif.
Gaya bicaramu natural seperti coach personal: cerdas, bersahabat, sedikit "nusuk" atau menyentil ego pengguna jika mereka banyak menunda, tetapi tetap memotivasi dan tidak kasar.
Hindari kalimat motivasi klise, kata-kata kosong seperti "Semangat terus!", atau saran umum yang membosankan. Tunjukkan pola konkret dari data yang mereka miliki.

Analisis data aktivitas pengguna yang diberikan (mencakup waktu yang direncanakan/planned_time, waktu aktual dikerjakan/actual_time, tingkat kesulitan, kategori, dan status penundaan).

Berikan tanggapan dalam bahasa Indonesia dengan format JSON terstruktur yang ketat sebagai berikut:
{
  "ringkasanUtama": "1-2 kalimat kuat dan tajam yang menggambarkan perilaku penundaan pengguna (berikan sindiran halus namun cerdas tentang kebiasaan mereka berdasarkan pola delay).",
  "rataRataDelayMenit": <angka rata-rata delay dalam menit secara keseluruhan>,
  "waktuPalingSering": "Penjelasan waktu puncak paling sering menunda (misalnya: 'Malam hari setelah jam 20:00')",
  "hubunganKesulitan": "Penjelasan spesifik dan tajam tentang relasi tingkat kesulitan tugas (Tinggi, Sedang, Rendah) dengan lamanya delay",
  "insightPerilaku": "Analisis psikologis psikologi ringan yang spesifik pada diri pengguna (misalnya ketakutan akan kegagalan, dopamine seeking, atau menyembunyikan tugas sulit di balik tugas-tugas kecil yang mudah). Jangan gunakan penjelasan umum.",
  "prediksiSederhana": "Kapan/tugas apa kemungkinan pengguna akan kembali menunda di masa depan beserta alasan psikologis singkatnya.",
  "tipeProcrastinator": "Avoider" | "Perfectionist" | "Mood-based",
  "alasanTipe": "Satu alasan kuat mengapa pengguna dikategorikan ke dalam tipe ini berdasarkan data konkret.",
  "saranKecil": "Satu atau dua kalimat saran aksi yang sangat realistis, sederhana, dan instan untuk dicoba (bukan kata motivasi saja).",
  "rencana15Menit": "Rencana langkah konkret 15 menit ke depan yang wajib dipisahkan dengan baris baru (newline) untuk masing-masing fase, dengan format persis seperti ini:\nMenit 1-5: [Tulis instruksi langkah pertama di sini]\nMenit 6-10: [Tulis instruksi langkah kedua di sini]\nMenit 11-15: [Tulis instruksi langkah ketiga di sini]"
}`;

      const prompt = `Analisis data aktivitas pengguna berikut dan berikan hasil analisis sesuai format JSON yang ditentukan:
${activitiesStr}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "ringkasanUtama",
              "rataRataDelayMenit",
              "waktuPalingSering",
              "hubunganKesulitan",
              "insightPerilaku",
              "prediksiSederhana",
              "tipeProcrastinator",
              "alasanTipe",
              "saranKecil",
              "rencana15Menit"
            ],
            properties: {
              ringkasanUtama: { type: Type.STRING },
              rataRataDelayMenit: { type: Type.NUMBER },
              waktuPalingSering: { type: Type.STRING },
              hubunganKesulitan: { type: Type.STRING },
              insightPerilaku: { type: Type.STRING },
              prediksiSederhana: { type: Type.STRING },
              tipeProcrastinator: { type: Type.STRING },
              alasanTipe: { type: Type.STRING },
              saranKecil: { type: Type.STRING },
              rencana15Menit: { type: Type.STRING }
            }
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Error analyzing procrastination data:", error);
      return res.status(500).json({ error: error.message || "Terjadi kesalahan internal ketika menganalisis data." });
    }
  });

  // API route second: dynamic Productivity Oracle
  app.post("/api/oracle", async (req, res) => {
    try {
      const { userName, avgDelay, totalTasks } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Buat satu bait atau 2 kalimat 'Wahyu/Nasihat Produktivitas' yang menusuk ego sekaligus memotivasi dalam bahasa Indonesia untuk pengguna bernama ${userName}. Ia memiliki total tugas dilacak sebanyak ${totalTasks} tugas dengan rata-rata penundaan waktu ${avgDelay} menit. Gaya bahasa: super cerdas, menyindir dengan komedi/sarkasme hangat, menyadarkan bahwa rencana tanpa eksekusi adalah halunasi.`,
        config: {
          systemInstruction: "Kamu adalah AI Oracle Produktivitas sarkastik yang jenius dan penuh empati. Jawab langsung dalam 1-2 kalimat tanpa basa-basi pembuka, letakkan dalam format text mentah yang tajam, manusiawi, dan asyik dibaca."
        }
      });
      res.json({ oracleText: response.text?.trim() || "Wahyu tidak turun hari ini. Mungkin kamu terlalu sibuk menunda kueri ini." });
    } catch (error: any) {
      console.error("Error generating oracle:", error);
      res.json({ oracleText: "Ingat: Setiap menit yang kamu buang untuk membenci tugasmu adalah menit berharga yang dinikmati oleh pesaingmu." });
    }
  });

  // API route third: AI Procrastination Psychological Counselor
  app.post("/api/consult", async (req, res) => {
    try {
      const { message, history, userName } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      const contents: any[] = [];
      const systemInstruction = `Kamu adalah seorang AI Konselor Psikologi Khusus Penundaan (Procrastination Psychologist).
Nama panggilanmu adalah "Coach Amanda". Kamu ahli dalam Terapi Perilaku Kognitif (CBT) dan psikologi klinis terkait penundaan pekerjaan.
Gaya bicaramu sangat empati, bersahabat, penuh perhatian, mendengarkan secara aktif, tetapi tetap menantang pemikiran bias kognitif psikologis pengguna secara membangun.
Gunakan sapaan yang hangat ("Kamu", atau sebut nama mereka "${userName || "Teman Fokus"}"), berikan validasi perasaan mereka dlu (misalnya rasa cemas, takut gagal, jenuh), lalu bimbing mereka dengan pertanyaan-pertanyaan reflektif CBT yang membantu memecah siklus menunda mereka secara realistis.
Jangan pernah memberikan jawaban malas yang kaku atau bernada robotik. Jawab dalam bahasa Indonesia yang santai, suportif, dan profesional laksana psikolog asli di klinik.`;

      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }

      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "Maaf, pikiranku sedang melayang. Bisa ulangi pertanyaannya?";
      res.json({ reply: responseText });
    } catch (error: any) {
      console.error("Error in AI Coach consult:", error);
      res.status(500).json({ error: error.message || "Gagal berkonsultasi dengan Coach Amanda." });
    }
  });

  // Global leaderboard state backed by a local JSON file for real-time multiplayer durability
  const LEADERBOARD_FILE = path.join(process.cwd(), "leaderboard.json");
  let serverLeaderboard = [
    { name: "Desi Nofitasari", role: "Active Builder (You)", streak: 24, claps: 24 },
    { name: "Budi Sanjaya", role: "Software Engineer", streak: 12, claps: 18 },
    { name: "Siti Rahma", role: "Mahasiswa Akhir", streak: 8, claps: 11 },
    { name: "Rian si Writer", role: "Creative Storyteller", streak: 5, claps: 9 },
    { name: "Nia Desiana", role: "UX Designer", streak: 3, claps: 14 }
  ];

  try {
    if (fs.existsSync(LEADERBOARD_FILE)) {
      const data = fs.readFileSync(LEADERBOARD_FILE, "utf8");
      if (data.trim()) {
        serverLeaderboard = JSON.parse(data);
      }
    } else {
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(serverLeaderboard, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Gagal memuat file leaderboard, menggunakan default:", err);
  }

  const saveLeaderboard = () => {
    try {
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(serverLeaderboard, null, 2), "utf8");
    } catch (err) {
      console.error("Gagal menyimpan file leaderboard:", err);
    }
  };

  // Fetch current leaderboard
  app.get("/api/leaderboard", (req, res) => {
    res.json({ leaderboard: serverLeaderboard });
  });

  // Update or insert a user's streak & role
  app.post("/api/leaderboard/update", (req, res) => {
    try {
      const { name, role, streak } = req.body;
      if (!name) return res.status(400).json({ error: "Nama wajib diisi." });

      const resolvedStreak = typeof streak === "number" ? streak : 1;
      const existing = serverLeaderboard.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );

      if (existing) {
        existing.streak = resolvedStreak;
        if (role) {
          // Replace decorative " (You)" if incoming is high-grade
          existing.role = role;
        }
      } else {
        serverLeaderboard.push({
          name,
          role: role || "Evaluator Hebat (You)",
          streak: resolvedStreak,
          claps: 0,
        });
      }

      // Sort server-side as well
      serverLeaderboard.sort((a, b) => b.streak - a.streak);
      saveLeaderboard();
      res.json({ success: true, leaderboard: serverLeaderboard });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clap/Like user
  app.post("/api/leaderboard/clap", (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Nama wajib diisi." });

      const item = serverLeaderboard.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );

      if (item) {
        item.claps += 1;
        saveLeaderboard();
        res.json({ success: true, item });
      } else {
        res.status(404).json({ error: "Pengguna tidak ditemukan di leaderboard." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Setup Vite middleware in Development mode, serve static build files in Production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap full stack app server:", err);
});
