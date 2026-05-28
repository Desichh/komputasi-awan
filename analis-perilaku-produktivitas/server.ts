import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

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
