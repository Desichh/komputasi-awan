import { Activity, MicroChallenge } from "./types";

export const SCENARIOS = {
  PERFECTIONIST: {
    name: "Silvi (Si Perfectionist Panikan)",
    description: "Menunda eksekusi karena ingin semuanya sempurna sejak langkah pertama, berujung pada research tiada akhir dan eksekusi menit-menit berdarah.",
    activities: [
      {
        id: "p1",
        task_name: "Inisialisasi Project & Desain Folder Modular",
        planned_time: "09:00",
        actual_time: "14:15",
        delay_minutes: 315,
        difficulty: "High",
        category: "Koding",
        completed: true,
        excuse: "Mencari template setup folder terbersih di Github, nonton 3 video YouTube 'Best React Project Structures' agar aesthetic, tapi akhirnya pusing sendiri & malah ketiduran."
      },
      {
        id: "p2",
        task_name: "Memilih Palette Warna UI & Tipografi Web",
        planned_time: "13:00",
        actual_time: "17:45",
        delay_minutes: 285,
        difficulty: "Medium",
        category: "Aesthetic Design",
        completed: true,
        excuse: "Scroll Pinterest & Google Fonts selama 4 jam mencari font yang mengekspresikan jati diri, lalu tersesat di thread reddit tentang keyboard mekanikal."
      },
      {
        id: "p3",
        task_name: "Push Code Pertama ke Repositori Git",
        planned_time: "18:00",
        actual_time: "18:05",
        delay_minutes: 5,
        difficulty: "Low",
        category: "Administrasi",
        completed: true,
        excuse: "Sudah hafal di luar kepala, tinggal salin commit message, tidak seseram harus mendesain arsitektur database."
      },
      {
        id: "p4",
        task_name: "Refactor Fungsi Filter-Sorting Kompleks",
        planned_time: "19:30",
        actual_time: "23:45",
        delay_minutes: 255,
        difficulty: "High",
        category: "Koding",
        completed: true,
        excuse: "Gemetar karena takut kodenya tidak 'clean'. Refleks mencuci piring & merapikan rak buku demi mengulur waktu berpikir."
      }
    ] as Activity[]
  },

  MOOD_BASED: {
    name: "Rian (Si Mood-based 'Night Owl')",
    description: "Hanya bergerak sesuai panggilan hati dan insting. Menolak tugas di siang hari karena 'tidak bersemangat', lalu kebut semalam sampai kram otak murni.",
    activities: [
      {
        id: "m1",
        task_name: "Olahraga Pagi & Jogging Santai",
        planned_time: "06:30",
        actual_time: "20:00",
        delay_minutes: 810,
        difficulty: "Medium",
        category: "Kesehatan",
        completed: true,
        excuse: "Hujan gerimis tipis jam 6 pagi, kasur rasanya magnetik. Sore mendung kelabu. Akhirnya cuma jalan cepat keliling komplek jam 8 malam sambil dengerin lagu galau."
      },
      {
        id: "m2",
        task_name: "Koding Endpoint API Transaksi",
        planned_time: "10:00",
        actual_time: "01:15",
        delay_minutes: 915,
        difficulty: "High",
        category: "Koding",
        completed: true,
        excuse: "Nunggu 'wahyu' koding sepi sunyi tengah malam. Siang hari terlalu bising dengan deru tetangga memotong rumput & chat group whatsapp yang tiada henti."
      },
      {
        id: "m3",
        task_name: "Membayar Tagihan Listrik & WiFi",
        planned_time: "14:00",
        actual_time: "18:30",
        delay_minutes: 270,
        difficulty: "Low",
        category: "Keuangan",
        completed: true,
        excuse: "Sangat mudah, tapi nominal tagihan bikin mood jelek. Jadi saya tunda saja sampai diingatkan operator via WhatsApp otomatis."
      },
      {
        id: "m4",
        task_name: "Mempersiapkan Slide Demo Klien",
        planned_time: "16:00",
        actual_time: "22:10",
        delay_minutes: 370,
        difficulty: "Medium",
        category: "Presentasi",
        completed: true,
        excuse: "Butuh ide kreatif. Tergiur menonton review makanan jajanan SD 2 jam di TikTok dulu untuk menaikkan kadar dopamin di otak."
      }
    ] as Activity[]
  },

  AVOIDER: {
    name: "Budi (Si Avoider Tugas Raksasa)",
    description: "Sangat rajin mengerjakan tugas-tugas remeh seperti berbenah kamar, menyapu, asal tidak perlu berhadapan langsung dengan tugas utama yang menakutkan.",
    activities: [
      {
        id: "a1",
        task_name: "Mengerjakan Skripsi Bab 3 (Metodologi)",
        planned_time: "08:30",
        actual_time: "17:45",
        delay_minutes: 555,
        difficulty: "High",
        category: "Pendidikan",
        completed: true,
        excuse: "Layar laptop kosong serasa menghakimi saya. Langsung merasa ada kebutuhan darurat untuk membongkar dan mencuci kipas angin langit-langit."
      },
      {
        id: "a2",
        task_name: "Mengumpulkan Jurnal Pendukung Penelitian",
        planned_time: "10:00",
        actual_time: "19:00",
        delay_minutes: 540,
        difficulty: "High",
        category: "Pendidikan",
        completed: false,
        excuse: "Sempat masuk Google Scholar, membaca abstrak sosiologi yang sama sekali tidak berhubungan dengan topik saya selama 2 jam, lalu menyerah karena pusing."
      },
      {
        id: "a3",
        task_name: "Membuang Sampah & Menyapu Kamar",
        planned_time: "11:00",
        actual_time: "11:05",
        delay_minutes: 5,
        difficulty: "Low",
        category: "Berbenah",
        completed: true,
        excuse: "Hanya butuh 5 menit dan terasa instan mendapatkan self-reward 'Ternyata hari ini saya produktif juga ya!' padahal tugas skripsi masih tersentuh debu."
      },
      {
        id: "a4",
        task_name: "Membeli Makan Siang Warteg Terdekat",
        planned_time: "12:00",
        actual_time: "12:10",
        delay_minutes: 10,
        difficulty: "Low",
        category: "Kebutuhan",
        completed: true,
        excuse: "Perut lapar tidak bisa ditunda, tetapi saya sengaja memilih warteg yang berjarak 1 kilometer berjalan kaki demi memperpanjang masa 'kabur' dari skripsi."
      }
    ] as Activity[]
  }
};

export const MICRO_CHALLENGES: MicroChallenge[] = [
  {
    id: "mc1",
    title: "Trik 5 Detik Meluncur!",
    description: "Dideteksi pikiran melayang! Lawan resistensi kognitif otakmu dengan countdown mekanik.",
    durationSeconds: 300,
    instructions: [
      "Tarik napas sedalam-dalamnya secara perlahan selama 4 detik.",
      "Hitung mundur keras-keras: 5... 4... 3... 2... 1...",
      "Buka dokumen atau IDE kerja utama, taruh jari di keyboard.",
      "Tulis SATU baris kode, SATU kata, atau SATU aksi terkecil secara acak. Tidak usah memikirkan kebenaran atau estetika, hanya coret layar sekarang juga!"
    ]
  },
  {
    id: "mc2",
    title: "Singkirkan Berhala Handphone-mu!",
    description: "Handphone miring 15 derajat pun bisa menyerap setengah fokus prefrontal korteksmu.",
    durationSeconds: 300,
    instructions: [
      "Ambil smartphone kesayanganmu sekarang juga tanpa ditunda.",
      "Matikan semua notifikasi atau aktifkan mode 'Do Not Disturb / Silent'.",
      "Letakkan handphone di bawah kasur, di dalam laci terjauh, atau lempar halus ke kasur di seberang ruangan.",
      "Kembalikan pandangan matamu ke layar monitor. Kamu punya waktu 5 menit untuk mengetik tanpa interupsi bel darurat media sosial."
    ]
  },
  {
    id: "mc3",
    title: "Spam Satu Kalimat Busuk!",
    description: "Hanya kesempurnaan imajiner yang menahan jemarimu. Mari buat mahakarya sampah.",
    durationSeconds: 300,
    instructions: [
      "Buka tab pekerjaan terbengkalai kamu.",
      "Tulis draf kalimat pertama sejelek, sesampah, dan se-berantakan mungkin.",
      "Contoh: 'Ini paragraf awal metodologi yang penting tapi nanti aja dibagusin mumpung pusing.' atau '// bikin fungsi API asal asalan dulu yang penting return JSON'.",
      "Tekan save! Otakmu sekarang menyadari mengedit sampah jauh lebih menyenangkan secara kognitif daripada menatap kanvas kosong."
    ]
  },
  {
    id: "mc4",
    title: "Minum Air Dingin & Singkirkan Tab YouTube!",
    description: "Detoksifikasi glukosa darah dan matikan tab pembunuh fokusmu.",
    durationSeconds: 300,
    instructions: [
      "Tenggak segelas air putih dingin sekarang juga.",
      "Identifikasi 1 tab browser hiburan (YouTube/Sosmed/Meme) yang sedang menyamar di browser kerjamu.",
      "Tutup tab tersebut tanpa perasaan bersalah dengan menekan ikon silang (X).",
      "Genggam mouse-mu, arahkan ke target tugas termudah selama 5 menit berturut-turut."
    ]
  }
];
