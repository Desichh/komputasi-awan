import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  RotateCw, 
  Award, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Heart,
  BookOpen,
  ArrowRight,
  Flame,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Funny customized quiz questions based on typical daily procrastination excuses and behaviors
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Saat tugas dengan tenggat waktu ketat tiba-tiba dikirimkan ke Anda, apa respon pertama refleks sistem saraf Anda?",
    options: [
      {
        text: "A. Tiba-tiba melihat setumpuk kabel kusut di lantai atau debu di meja, merasa terpanggil takdir untuk membersihkannya secara presisi agar suasana kondusif.",
        type: "A" // Aesthetic / Perfectionist
      },
      {
        text: "B. Membuka browser dengan niat kuat riset dokumentasi, tapi jari secara otomatis mengetik 'y-o-u-t-u...' untuk menonton video review game konyol.",
        type: "B" // Dopamine Seeker
      },
      {
        text: "C. Merasa mengantuk luar biasa secara eksponensial seolah ditiup obat bius gajah. Kursi terasa senyaman sutra, badan meleleh di bantal.",
        type: "C" // Extreme Mager
      },
      {
        text: "D. Mulai menghitung statistik kepunahan karir di masa depan, menganalisis skenario terburuk jika gagal, dan melamun menatap awan dengan cemas.",
        type: "D" // Anxious Overthinker
      }
    ]
  },
  {
    id: 2,
    question: "Bagaimana proses pembuatan makanan/minuman (misal mie instan atau seduh kopi) menunda pengerjaan tugas Anda?",
    options: [
      {
        text: "A. Harus menyeduh kopi manual-brew dengan timbangan gramasi presisi, meletakkannya di coaster kayu estetika, dan memotretnya lebih dulu demi story Instagram.",
        type: "A"
      },
      {
        text: "B. Membawa kopi buru-buru ke meja, berniat tancap gas. Namun malah terkejut melihat notifikasi chat, akhirnya kopi mendingin sementara Anda sibuk berbalas pesan.",
        type: "B"
      },
      {
        text: "C. Mengambil teko air, tapi teringat kasur sekejap. Akhirnya berbaring 'sebentar' memeluk bantal sambil menunggu air mendidih. Alhasil terbangun 2 jam kemudian.",
        type: "C"
      },
      {
        text: "D. Perut sampai mulas karena cemas memikirkan tugas yang belum disentuh, namun anehnya tangan tetap kaku untuk mulai menekan keyboard.",
        type: "D"
      }
    ]
  },
  {
    id: 3,
    question: "Apa pembenaran kognitif (excuse) terhebat yang paling sering Anda bisikkan di depan cermin?",
    options: [
      {
        text: "A. 'Aku tidak bisa memicu draf koding/tulisan berkelas jika meja masih berantakan, lilin aromaterapi belum menyala, dan playlist lo-fi belum mengalir.'",
        type: "A"
      },
      {
        text: "B. 'Santai saja, kinerjaku justru 500x lipat lebih brilian, revolusioner, dan jenius jika berada di bawah tekanan ekstrem 2 jam sebelum serah-terima!'",
        type: "B"
      },
      {
        text: "C. 'Kesehatan mental di atas segalanya, tubuhku butuh regenerasi sel. Mari tidur siang 4 jam untuk mengobati rasa lelah membuka laptop.'",
        type: "C"
      },
      {
        text: "D. 'Tugas ini terlalu kompleks & sakral, mari kita nonton 15 seri video playlist dokumentasi tutorial dasarnya dulu (padahal tidak pernah ditonton).'",
        type: "D"
      }
    ]
  },
  {
    id: 4,
    question: "Ketika layar koding Anda kosong melompong tanpa satu baris pun tulisan:",
    options: [
      {
        text: "A. Menghabiskan 40 menit memikirkan konfigurasi font IDE, skema warna gelap (menguji Dracula vs Monokai), dan ukuran spasi tab yang paling pas.",
        type: "A"
      },
      {
        text: "B. Menulis dua patah kata, lalu meminimalkannya dalam 3 detik untuk menggeser feed Twitter karena takut tertinggal isu hangat hari ini.",
        type: "B"
      },
      {
        text: "C. Menguap begitu lebar sampai melepaskan air mata seolah pasokan oksigen di muka bumi mendadak habis ketika melihat dokumen tersebut.",
        type: "C"
      },
      {
        text: "D. Mengetik satu kalimat, menghapusnya karena tampak bodoh, mengetik lagi, menghapusnya lagi, lalu merenungkan kesalahan pilihan karir hidup.",
        type: "D"
      }
    ]
  },
  {
    id: 5,
    question: "Apa jenis video YouTube yang tiba-tiba terasa sangat mengedukasi dan krusial ditonton saat deadline mendekat?",
    options: [
      {
        text: "A. Video dokumenter sepanjang 2 jam mengenai teknik perawatan rumput stadion sepak bola di Swedia abad pertengahan.",
        type: "A"
      },
      {
        text: "B. Video kompilasi kucing menjerit, kambing teriak seperti manusia, atau ASMR memeras sabun batangan berwarna-warni.",
        type: "B"
      },
      {
        text: "C. Video siaran langsung Lofi Girl tertidur pulas yang membuat mata Anda ikut layu dalam kurun waktu 5 menit pertama.",
        type: "C"
      },
      {
        text: "D. Video seminar motivasi berdurasi 90 menit berjudul 'Cara Mengikis Kebiasaan Menunda Pekerjaan secara Instan dan Efektif'. (Ironi mutlak).",
        type: "D"
      }
    ]
  },
  {
    id: 6,
    question: "Saat alarm pagi berbunyi keras tanda Anda harus segera bangun menyelesaikan sisa tugas, apa respon refleks awal Anda?",
    options: [
      {
        text: "A. Mematikan alarm presisi, lalu duduk tegak merencanakan tata kelola berkas, tapi akhirnya draf rencana bertambah panjang tanpa pengerjaan riil.",
        type: "A"
      },
      {
        text: "B. Mematikan alarm, lalu langsung secara refleks membuka sosial media untuk scrolling video pendek selama 45 menit pertama di tempat tidur.",
        type: "B"
      },
      {
        text: "C. Menekan tombol snooze 12 kali berturut-turut sampai selimut sepenuhnya melilit tubuh Anda dengan amat nyaman bagai mumi firaun.",
        type: "C"
      },
      {
        text: "D. Terbangun dengan perasaan bersalah dan detak jantung kencang membayangkan beratnya tugas, lalu berakhir berdiam diri di atas kasur karena cemas.",
        type: "D"
      }
    ]
  },
  {
    id: 7,
    question: "Anda berniat mencari inspirasi koding atau referensi riset draf di internet. Apa yang sebenarnya terjadi berikutnya?",
    options: [
      {
        text: "A. Menghabiskan waktu 1 jam menata kategori bookmark browser agar tampak 'rapi' dan rapi sebelum mulai mendalami referensi tersebut.",
        type: "A"
      },
      {
        text: "B. Membuka tab baru untuk riset, lalu malah terdampar melihat ulasan barang hobi di online shop atau berita viral terhangat hari ini.",
        type: "B"
      },
      {
        text: "C. Membaca dua baris dokumentasi, merasa kelopak mata mendadak seberat 100 kg, lalu bersandar lunglai di kursi hingga jatuh tertidur.",
        type: "C"
      },
      {
        text: "D. Merasa minder melihat karya jenius orang lain di GitHub, merasa diri tidak berkompeten, lalu menutup draf dengan keputusasaan tinggi.",
        type: "D"
      }
    ]
  },
  {
    id: 8,
    question: "Bagaimana respon Anda terhadap notifikasi grup chat atau email dari atasan/dosen terkait batas waktu progress tugas?",
    options: [
      {
        text: "A. Memilih tidak membalas pesan tersebut sampai draf draf presentasi atau koding Anda tersusun sempurna tanpa cela sedikit pun.",
        type: "A"
      },
      {
        text: "B. Langsung membalas dengan emoji siap/ok demi formalitas, lalu kembali asyik bermain game online atau membalas chat pribadi.",
        type: "B"
      },
      {
        text: "C. Pura-pura tidak melihat push notification, membalik layar ponsel ke bawah, lalu bergelung kembali di balik selimut hangat.",
        type: "C"
      },
      {
        text: "D. Membaca pesan itu berulang kali, menganalisis emosi teks tersebut, lalu panik berjam-jam tanpa berani memulai aksi nyata.",
        type: "D"
      }
    ]
  },
  {
    id: 9,
    question: "Apa ritual wajib yang paling menyita waktu Anda sebelum mulai menyentuh tombol power computer untuk bekerja?",
    options: [
      {
        text: "A. Membersihkan layar monitor, menyelaraskan letak kabel mouse, serta menata gelas minum dengan sudut siku-siku yang estetik.",
        type: "A"
      },
      {
        text: "B. Menyiapkan camilan beraroma gurih, mencari playlist lo-fi yang paling 'nge-hype', and mengecek status medsos sekilas.",
        type: "B"
      },
      {
        text: "C. Menguji keempukan bantal leher sandaran kursi malas, mengatur tingkat kemiringan rebahan yang paling ergonomis untuk bersantai.",
        type: "C"
      },
      {
        text: "D. Menarik napas dalam-dalam, menghela napas cemas, bergumam takut draf koding error, lalu menunda menyalakan perangkat.",
        type: "D"
      }
    ]
  },
  {
    id: 10,
    question: "Bagian mana dari aplikasi 'Pemberantas Prokrastinasi' ini yang paling menarik perhatian pertama Anda?",
    options: [
      {
        text: "A. Panel grafik visual dan statistik aktivitas harian yang tersusun secara rapi, bersih, dan bergradasi warna harmonis.",
        type: "A"
      },
      {
        text: "B. Roda keberuntungan pemecah keheningan (Spin Wheel) karena memberikan dopamin segar yang interaktif dan seru.",
        type: "B"
      },
      {
        text: "C. Jukebox audio musik relaksasi di latar belakang agar bisa diputar sambil memejamkan mata beristirahat dengan damai.",
        type: "C"
      },
      {
        text: "D. Lembar draf catatan harian untuk mengaudit semua tugas terbengkalai, seraya mencemaskan sisa prokrastinasi hari esok.",
        type: "D"
      }
    ]
  },
  {
    id: 11,
    question: "Jika diberi waktu 1 minggu penuh untuk menyelesaikan tugas yang relatif mudah, kapan Anda akan menyelesaikannya?",
    options: [
      {
        text: "A. Menulis draf rencana rinci dari hari pertama, tapi eksekusi ditunda demi terus mendesain ulang layout dokumen agar menakjubkan.",
        type: "A"
      },
      {
        text: "B. Pada malam terakhir tepat jam 23:55 WIB, diiringi sensasi debaran jantung yang kencang setara mengendarai mobil balap formula.",
        type: "B"
      },
      {
        text: "C. Di hari ke-8 (melewati deadline), setelah mengajukan alasan klasik laptop mati mendadak atau jaringan internet bermasalah.",
        type: "C"
      },
      {
        text: "D. Mengerjakannya sedikit demi sedikit, namun meluangkan waktu berjam-jam menghapus kembali kalimat yang dianggap tidak cukup jenius.",
        type: "D"
      }
    ]
  },
  {
    id: 12,
    question: "Ketika Anda sedang asyik menunda pekerjaan, lalu tiba-tiba teringat masa depan karir, apa reaksi instan psikis Anda?",
    options: [
      {
        text: "A. Membeli buku planner mahal di toko online secara impulsif demi ilusi psikologis bahwa hidup akan langsung teratur besok lusa.",
        type: "A"
      },
      {
        text: "B. Segera mencari tontonan video komedi panjang untuk menenggelamkan rasa bersalah tersebut agar otak kembali penuh tawa.",
        type: "B"
      },
      {
        text: "C. Menghela napas, berpikir 'Ah, draf takdir sudah ditentukan', lalu memejamkan mata sejenak untuk melupakan beban pikiran.",
        type: "C"
      },
      {
        text: "D. Mensimulasikan skenario keguguran karir, membayangkan masa depan suram, lalu lelah sendiri karena stres tanpa berbuat apapun.",
        type: "D"
      }
    ]
  },
  {
    id: 13,
    question: "Bagaimana cara Anda merespon bug koding pertama atau hambatan administrasi awal saat baru saja membuka draf draf kerja?",
    options: [
      {
        text: "A. Menganggap draf tersebut gagal total, menghapus seluruh folder, lalu memulai file baru dari awal agar draf kembali bersih.",
        type: "A"
      },
      {
        text: "B. Menutup paksa tab koding/kerja, lalu beralih bermain game online demi memulihkan rasa frustasi dalam kurun waktu 5 detik.",
        type: "B"
      },
      {
        text: "C. Berpikir bahwa semesta sedang memberi isyarat bahwa hari ini adalah hari istirahat, lalu mematikan laptop untuk rebahan kembali.",
        type: "C"
      },
      {
        text: "D. Merenungi pesan error tersebut, merasa diri kurang cerdas untuk profesi ini, lalu diliputi perasaan cemas berlebih.",
        type: "D"
      }
    ]
  },
  {
    id: 14,
    question: "Apa jenis konsumsi camilan/minuman pendamping yang Anda andalkan untuk merangsang kinerja produktivitas Anda?",
    options: [
      {
        text: "A. Teh herbal hangat atau air infus jeruk lemon di cangkir porselen estetik bernuansa minimalis modern.",
        type: "A"
      },
      {
        text: "B. Minuman soda dingin manis atau keripik pedas ekstra micin demi ledakan energi mental yang instan di tenggorokan.",
        type: "B"
      },
      {
        text: "C. Tidak ada, terlalu malas beranjak dari posisi bersandar nyaman untuk sekadar menuangkan segelas air di dispenser.",
        type: "C"
      },
      {
        text: "D. Kopi tubruk hitam super pekat agar mata terjaga, walau terkadang meningkatkan denyut kecemasan di kepala.",
        type: "D"
      }
    ]
  },
  {
    id: 15,
    question: "Jika dalam kepungan tenggat waktu, sahabat karib Anda mengirim pesan mengajak nongkrong di kafe kekinian...",
    options: [
      {
        text: "A. Menolak halus karena merasa kafe tersebut terlalu bising dan bising untuk menghasilkan draf tugas yang bermutu tinggi.",
        type: "A"
      },
      {
        text: "B. Langsung dandan dan mematikan laptop! Menganggap bersosialisasi adalah alasan penyegaran otak yang sah dari jeratan deadline harian.",
        type: "B"
      },
      {
        text: "C. Menerima dengan gembira, asalkan kafe tersebut memiliki sofa beludru lebar yang empuk demi menopang kenyamanan bersandar.",
        type: "C"
      },
      {
        text: "D. Mengalami gejolak perang batin yang dahsyat, takut dicap egois namun cemas tugas terbengkalai, berakhir pusing memikirkannya.",
        type: "D"
      }
    ]
  },
  {
    id: 16,
    question: "Saat Anda dihadapkan pada tumpukan lembaran daftar tugas (Todo List) yang sangat padat di meja kerja Anda:",
    options: [
      {
        text: "A. Meluangkan waktu 30 menit menghias sub-tugas menggunakan pena warna-warni demi kenyamanan penglihatan yang visual dan rapi.",
        type: "A"
      },
      {
        text: "B. Memilih satu tugas termudah yang bisa selesai dalam 30 detik agar bisa segera dicoret demi kepuasan dopamin instan.",
        type: "B"
      },
      {
        text: "C. Terkejut melihat tumpukan daftar tugas, menghela napas pasrah, menutup buku planner lalu beranjak menuju ranjang tidur.",
        type: "C"
      },
      {
        text: "D. Membaca runtut semua tugas, menganalisis skala kesulitannya, mencemaskan apabila gagal, lalu berakhir pusing tanpa melangkah.",
        type: "D"
      }
    ]
  }
];

// Fisher-Yates Shuffle helper to choose random count of questions
function getRandomQuestions(pool: typeof QUIZ_QUESTIONS, count: number = 5): typeof QUIZ_QUESTIONS {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// Custom detailed diagnoses with humorous tone & tailored clinical descriptions
const RESULTS_DICTIONARY: Record<string, {
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  color: string;
  sealColor: string;
  description: string;
  therapy: string[];
}> = {
  "A": {
    title: "Perfeksionis Estetika & Dekorasi",
    subtitle: "The Over-Prepared Aesthetician",
    badge: "⭐ MASTER DEKORATOR MEJA",
    icon: "🎨",
    color: "from-purple-500/15 via-indigo-500/5 to-slate-900 border-purple-500/40 text-purple-200",
    sealColor: "bg-purple-500 text-purple-950 shadow-purple-500/20",
    description: "Anda menunda bukan karena malas, melainkan karena standar estetika Anda yang terlalu luhur. Anda menuntut kondisi lingkungan yang steril: meja harus licin mengkilap, diffuser aroma jeruk bali harus mengepul seimbang, dan playlist Spotify harus bernuansa lo-fi cafe Paris. Alhasil, energi kognitif Anda habis dikuras untuk mendekorasi ritual fokus, sementara tugas utamanya sama sekali tidak pernah dimulai.",
    therapy: [
      "Deklarasikan 'Terapi Meja Berantakan': Sengaja menulis atau koding di atas meja yang agak miring dengan satu gelas kotor di sebelah keyboard.",
      "Gunakan aturan 'Draf Sampah': Paksa diri menulis 10 baris terburuk tanpa boleh melirik keindahan struktur atau sintaks pada 3 menit pertama.",
      "Matikan ritual lilin aromaterapi dan nyalakan lampu utama yang terang benderang agar otak dirangsang hormon kerja tegang!"
    ]
  },
  "B": {
    title: "Pencandu Dopamin Instan & Gerilya",
    subtitle: "The Dopamine Scroll-Maniac",
    badge: "📱 DEWA INTUITIF DEADLINE",
    icon: "⚡",
    color: "from-amber-500/15 via-orange-500/5 to-slate-900 border-amber-500/40 text-amber-200",
    sealColor: "bg-amber-500 text-amber-950 shadow-amber-500/20",
    description: "Sistem saraf Anda telah dikooptasi oleh algoritma durasi pendek berkat paparan media sosial berlebih. Otak Anda kebal terhadap motivasi normal dan baru mau mengirimkan hormon fokus (kortisol/adrenalin) ketika taring kiamat tenggat waktu tinggal 2 jam lagi. Anda bekerja secara gerilya dengan panik ekstrim, lalu merayakan keberhasilan darurat itu seolah Anda adalah pahlawan kognitif yang tak terkalahkan.",
    therapy: [
      "Lakukan 'Karantina Berhala': Lempar smartphone Anda ke tumpukan pakaian kotor atau laci seberang ruangan sebelum menyentuh tombol start.",
      "Gunakan tab Roda Putar Alasan Konyol di atas! Biarkan takdir memilih tantangan mikro 5 menit demi merangsang dopamin pemula secara instan.",
      "Batasi tab browser hanya boleh aktif MAKSIMAL 3 buah saat pengerjaan draf utama. Tutup platform hiburan sekejap!"
    ]
  },
  "C": {
    title: "Penguasa Gravitasi & Dewa Mager",
    subtitle: "The Comfy Couch & Snooze Emperor",
    badge: "😴 DEWA REGENERASI TOTAL",
    icon: "🛋️",
    color: "from-teal-500/15 via-cyan-500/5 to-slate-900 border-teal-500/40 text-teal-200",
    sealColor: "bg-teal-400 text-teal-950 shadow-teal-400/20",
    description: "Tubuh Anda memiliki afinitas luar biasa terhadap gaya tarik bumi dan permukaan kasur. Saraf mata Anda memiliki sensitivitas tinggi terhadap materi tulisan panjang yang mendadak memicu reaksi mengantuk akut setingkat mati suri. Namun anehnya, begitu Anda ditarik menjauh dari laptop dan diberi stik game atau diajak mengobrol, daya hidup seluler Anda langsung melonjak naik ke 100% seketika.",
    therapy: [
      "Gunakan 'Pemicu Aliran Somatik': Tarik napas Box Breathing, berdiri tegak, tolak gravitasi kasur, lakukan stretching tangan selama 30 detik.",
      "Minum setengah gelas air putih bersuhu dingin segar sesaat sebelum duduk untuk merangsang reseptor lambung bawah agar terjaga.",
      "Nyalakan sound Generator 'Forest Rain' atau 'Theta Binaural Hum' di tab Audio Lab untuk membasuh rasa kantuk dengan ritme konstan."
    ]
  },
  "D": {
    title: "Pemikir Kritis Kiamat Prematur",
    subtitle: "The Doomsday Overthinker",
    badge: "🧠 MASTER ANALISIS PARALISIS",
    icon: "😰",
    color: "from-rose-500/15 via-pink-500/5 to-slate-900 border-rose-500/40 text-rose-200",
    sealColor: "bg-rose-500 text-rose-950 shadow-rose-500/20",
    description: "Anda mengalami kelumpuhan analisis akut (Analysis Paralysis). Otak Anda yang brilian terlalu sibuk mensimulasikan kegagalan masa depan, ketakutan dibilang jelek oleh penilai, hingga skenario ditolak kerja sebelum satu baris pun ditulis di atas lembar kerja. Anda menundanya demi melindungi ego kognitif dari potensi kesalahan awal, tanpa sadar bahwa tindakan berdiam diri justru merupakan kesalahan fatal yang sesungguhnya.",
    therapy: [
      "Tulis mantra ini padat-padat di kertas: 'Saya diizinkan sepenuhnya membuat draf bernilai sampah hari ini demi memulai langkah awal.'",
      "Gunakan metode 'Terapi Coretan Konyol': Ambil laptop, ketik sembarang huruf asal-asalan hantam keyboard selama 30 detik untuk memotong beban psikis lembar kosong.",
      "Fokus pada rentang durasi mikro kustom (hanya kerja 5 menit saja!). Jangan pikirkan kualitas fungsional akhir."
    ]
  }
};

interface DiagnosticQuizProps {
  userName: string;
  onNavigateToCatatan?: () => void;
  onNavigateToTriggers?: () => void;
}

export default function DiagnosticQuiz({ userName, onNavigateToCatatan, onNavigateToTriggers }: DiagnosticQuizProps) {
  const [activeQuestions, setActiveQuestions] = useState<typeof QUIZ_QUESTIONS>([]);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Landing, 1-5: Questions, 6: Result Certificate
  const [answers, setAnswers] = useState<string[]>([]);
  const [diagnosedResult, setDiagnosedResult] = useState<string | null>(null);
  const [stampActive, setStampActive] = useState<boolean>(false);

  // Initialize randomized set of questions when component registers or user changes
  useEffect(() => {
    setActiveQuestions(getRandomQuestions(QUIZ_QUESTIONS, 5));
  }, [userName]);

  // Restart Quiz state with a brand new randomized shuffle of questions
  const handleStartQuiz = () => {
    setActiveQuestions(getRandomQuestions(QUIZ_QUESTIONS, 5));
    setCurrentStep(1);
    setAnswers([]);
    setDiagnosedResult(null);
    setStampActive(false);
  };

  // Record answer & advance questions
  const handleAnswerSelect = (type: string) => {
    const nextAnswers = [...answers, type];
    setAnswers(nextAnswers);
    
    // Custom audio hint
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(500 + currentStep * 80, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch(e){}

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final dominance based on most frequent answer type
      const counts: Record<string, number> = { "A": 0, "B": 0, "C": 0, "D": 0 };
      nextAnswers.forEach(ans => { counts[ans] = (counts[ans] || 0) + 1; });
      
      // Determine dominant type, defaults to A or largest
      let dominantType = "A";
      let maxCount = -1;
      ["A", "B", "C", "D"].forEach(t => {
        if (counts[t] > maxCount) {
          maxCount = counts[t];
          dominantType = t;
        }
      });
      
      setDiagnosedResult(dominantType);
      setCurrentStep(6);
      
      // Delay stamp trigger sound & pop animation
      setTimeout(() => {
        setStampActive(true);
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
          }
        } catch(e){}
      }, 750);
    }
  };

  const currentQuestionData = activeQuestions[currentStep - 1];
  const diagnosticDetails = diagnosedResult ? RESULTS_DICTIONARY[diagnosedResult] : null;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <AnimatePresence mode="wait">
        
        {/* Step 0: Welcome Diagnostic Screen */}
        {currentStep === 0 && (
          <motion.div
            key="quiz-landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl backdrop-blur-md"
          >
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-teal-400 p-0.5 mx-auto mb-5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-teal-400 animate-spin" />
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase bg-teal-950/50 px-3 py-1 rounded-full border border-teal-900/40 font-bold">
              🩺 KLINIK DIAGNOSTIK KEJIWAAN &amp; SOSIOLOGI PENUNDA
            </span>
            
            <h1 className="text-xl md:text-2xl font-sans font-black tracking-tight text-white mt-4">
              Cari Tahu Karakter Asli Penundamu Serta Dapatkan Sertifikat Resmi!
            </h1>
            
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto mt-3">
              Apakah Anda menunda tugas karena meja Anda kurang wangi? Ataukah Anda benar-benar budak algoritma scroll ponsel yang gemar mencari adrenalina di menit terakhir sebelum kiamat deadline? Mari jujur mendiagnosis dirimu dalam kuesioner kognitif 5 langkah super santai ini!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="start-diagnostic-quiz-btn"
                onClick={handleStartQuiz}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 font-sans font-extrabold text-xs tracking-wider uppercase shadow-lg hover:shadow-teal-500/20 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Mulai Tes Diagnostik 🩺
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 border-t border-slate-900 mt-8 pt-6 text-[11px] font-mono text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                <p className="text-purple-300 font-bold">1. Perfeksionisme</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Estetika beralasan</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                <p className="text-amber-300 font-bold">2. Dopamine Seek</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Korban scroll ponsel</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                <p className="text-teal-300 font-bold">3. Gravitas</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Magnet kenyamanan</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-900">
                <p className="text-rose-300 font-bold">4. Overthinker</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Lumpuh kognitif</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1 to 5: Main Interactive Diagnostic Quiz Questions */}
        {currentStep >= 1 && currentStep <= 5 && currentQuestionData && (
          <motion.div
            key={`quiz-step-${currentStep}`}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 md:p-7 shadow-2xl backdrop-blur-md"
          >
            {/* Steps indicator progress */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-slate-400 uppercase font-black">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>
                PROGRESS DIAGNOSIS: {currentStep} / 5
              </div>
              <span className="text-[10px] font-mono text-teal-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold">
                Q-ID: 00{currentStep}
              </span>
            </div>

            {/* Slider visual track progress */}
            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-gradient-to-r from-purple-500 to-teal-400 h-full transition-all duration-300" 
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>

            <h3 className="text-sm md:text-base font-sans font-extrabold text-slate-100 flex items-start gap-2.5 leading-relaxed">
              <span className="p-1 px-2.5 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-900 text-[11px] font-mono font-bold mt-0.5 flex-shrink-0">
                {currentStep}
              </span>
              {currentQuestionData.question}
            </h3>

            {/* Answers List Grid */}
            <div className="mt-6 space-y-3">
              {currentQuestionData.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleAnswerSelect(opt.type)}
                  className="w-full text-left p-4 rounded-xl border border-slate-850 bg-slate-900/40 hover:bg-slate-900 hover:border-teal-500/30 transition-all select-none cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  <span className="text-xs leading-relaxed text-slate-200 group-hover:text-teal-300 pr-3 transition-colors">
                    {opt.text}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-950 group-hover:bg-teal-500 group-hover:text-slate-950 text-slate-500 flex-shrink-0 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 6: Certificate Generation Display Result */}
        {currentStep === 6 && diagnosticDetails && (
          <motion.div
            key="quiz-certificate-pane"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* The Certificate Widget */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-1 relative overflow-hidden shadow-2xl">
              {/* Retro Classic Golden Border */}
              <div className="border-[6px] border-double border-amber-500/50 rounded-[22px] bg-slate-950 p-6 md:p-8 relative">
                
                {/* Vintage Watermark BG lines */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Decorative vintage framing corners */}
                <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-amber-500/40 rounded-tl pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-amber-500/40 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-amber-500/40 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-amber-500/40 rounded-br pointer-events-none" />

                {/* Header Certificate Title */}
                <div className="text-center space-y-2 relative z-10">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-amber-500/80 uppercase font-black block">
                    CERTIFICATE OF COGNITIVE BIAS DIAGNOSIS
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif font-extrabold text-amber-100 tracking-wide">
                    SURAT KETERANGAN RESMI PENUNDAAN
                  </h2>
                  <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mt-2" />
                </div>

                {/* Authority Declaration */}
                <p className="text-[10.5px] font-mono text-slate-400 text-center leading-relaxed mt-6 italic">
                  Dengan ini, Dewan Tertinggi Sosiologi Kognitif Produktivitas AI menimbang perbuatan jujur dan kelakuan harian yang dilaporkan, dengan khidmat menerangkan bahwa:
                </p>

                {/* User Target Name */}
                <div className="text-center my-6 relative z-10">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-widest leading-none mb-1">DIBERIKAN KEPADA PELAKU</span>
                  <span className="text-lg md:text-xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-350 tracking-tight border-b-2 border-slate-900 pb-1.5 px-6 inline-block">
                    {userName || "Desi Nofitasari"}
                  </span>
                </div>

                {/* Substantive Result */}
                <p className="text-[10.5px] font-mono text-slate-400 text-center leading-relaxed mb-4">
                  Secara klinis divonis menyandang predikat kognitif tertinggi sebagai tipe:
                </p>

                {/* Major Badged Type Name */}
                <div className={`p-5 rounded-2xl border bg-gradient-to-br ${diagnosticDetails.color} text-center relative max-w-lg mx-auto mb-6 shadow-inner relative overflow-hidden backdrop-blur-md`}>
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-teal-400 uppercase">
                    {diagnosticDetails.badge}
                  </span>
                  <h3 className="text-lg md:text-xl font-sans font-black tracking-tight text-white mt-3 flex items-center justify-center gap-2">
                    <span className="text-2xl">{diagnosticDetails.icon}</span>
                    {diagnosticDetails.title}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">{diagnosticDetails.subtitle}</p>
                </div>

                {/* Custom Diagnosis Content */}
                <div className="space-y-4 max-w-xl mx-auto text-xs leading-relaxed text-slate-300 text-justify relative z-10 bg-slate-950/80 p-4 rounded-xl border border-slate-905">
                  <p className="indent-4 leading-relaxed">
                    <strong className="text-amber-400 font-bold font-sans">Analisis Klinis: </strong>
                    {diagnosticDetails.description}
                  </p>
                </div>

                {/* Retro Authorized Seal stamp inside certificate */}
                <div className="flex flex-wrap items-center justify-between gap-6 mt-8 border-t border-slate-900 pt-6 max-w-xl mx-auto">
                  <div className="text-left font-mono text-[10px] text-slate-500 leading-relaxed md:flex-1">
                    <p className="text-[9px] text-slate-600">ID SERTIFIKAT: <span className="text-slate-400 font-bold">CTF-{Math.floor(Math.random() * 900000) + 100000}</span></p>
                    <p className="text-[9px] text-slate-600">DIKONTROL OLEH: <span className="text-slate-400 font-bold">Klinik AI Coach 3.5-Flash</span></p>
                    <p className="text-[9px] text-slate-600">TANGGAL DIAGNOSA: <span className="text-slate-400 font-bold">{new Date().toLocaleDateString("id-ID")}</span></p>
                  </div>

                  {/* Stamp Design */}
                  <div className="relative w-28 h-28 flex items-center justify-center self-center flex-shrink-0">
                    <AnimatePresence>
                      {stampActive && (
                        <motion.div
                          initial={{ scale: 2.2, opacity: 0, rotate: -35 }}
                          animate={{ scale: 1, opacity: 1, rotate: -15 }}
                          transition={{ type: "spring", stiffness: 150, damping: 15 }}
                          className={`w-24 h-24 rounded-full border-[3.5px] border-double flex flex-col items-center justify-center text-center font-black ${diagnosticDetails.sealColor} select-none transform rotate-[-15deg] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]`}
                        >
                          <span className="text-[6.5px] tracking-widest font-mono uppercase">COGNITIVE SEAL</span>
                          <span className="text-[8px] font-black border-y border-current py-0.5 my-1 tracking-tight font-sans px-1">
                            LULUS TES MAGER
                          </span>
                          <span className="text-[6.5px] font-mono font-bold tracking-wider">AI DIAGNOSIS</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>

            {/* Recommendation Therapy Checklist Section */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-teal-400 animate-pulse" />
                <h4 className="text-sm font-sans font-bold tracking-tight text-white">
                  Resep Terapi Perilaku Kustom Anda:
                </h4>
              </div>

              <div className="space-y-3.5">
                {diagnosticDetails.therapy.map((step, tIdx) => (
                  <div key={tIdx} className="flex gap-3 items-start bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                    <div className="w-5 h-5 rounded-full bg-teal-950 text-teal-300 border border-teal-900 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5">
                      {tIdx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              {/* Integrated actions buttons to resolve this profile */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-900 justify-end">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans font-bold text-slate-350 hover:text-white hover:bg-slate-850 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Ulangi Tes Kognitif
                </button>

                {onNavigateToCatatan && (
                  <button
                    type="button"
                    onClick={onNavigateToCatatan}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-teal-900/60 text-xs font-sans font-bold text-teal-400 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    Catat Tugas Menunda &amp; Analisis AI 📝
                  </button>
                )}

                {onNavigateToTriggers && (
                  <button
                    type="button"
                    onClick={onNavigateToTriggers}
                    className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-sans font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal-500/10 active:scale-[0.98]"
                  >
                    Mainkan Roda Alasan 🎰
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
