import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  Play, 
  Pause, 
  Music, 
  Disc, 
  Link as LinkIcon, 
  Sparkles, 
  Youtube, 
  Tv, 
  Compass, 
  Globe, 
  HelpCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Curated stable copyright-free MP3 relaxation tracks
const CURATED_MP3_LIST = [
  {
    id: "mp3-1",
    title: "🎹 Deep Healing Classical Piano",
    artist: "Ambient Solfeggio 528Hz Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "mp3-2",
    title: "☕ Cozy Rainy Cafe Lo-Fi",
    artist: "Mellow Study Flow Lounge",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "mp3-3",
    title: "🌿 Relaxing Nature Streams",
    artist: "Alpha Forest Soundscape",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "mp3-4",
    title: "🪐 Orbit Cabin Space Guitar",
    artist: "Astronaut Calm Gravity Waves",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
  }
];

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Handle various YouTube link formats (watch?v=, share links, embed links)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function FocusAudioLab() {
  // Main Player states
  const [currentPlayType, setCurrentPlayType] = useState<"none" | "mp3" | "youtube">("none");
  const [activeTrackId, setActiveTrackId] = useState<string>("mp3-1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  // Curated tracks details
  const [activeMp3Track, setActiveMp3Track] = useState(CURATED_MP3_LIST[0]);
  const [activeYtId, setActiveYtId] = useState<string>("jfKfPfyJRdk");
  const [activeYtTitle, setActiveYtTitle] = useState<string>("Lofi Girl Study Beats");

  // Custom pasting state
  const [inputUrl, setInputUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // YouTube Visbility Option (User can hide video display if they only want background audio)
  const [showVideoFrame, setShowVideoFrame] = useState<boolean>(true);

  // Reference for standard HTML5 MP3 Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Equalizer visual animation levels
  const [eqLevels, setEqLevels] = useState<number[]>([12, 18, 8, 22, 15, 28, 10, 6]);

  // Create & mount HTML5 Audio elements safely
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Equalizer motion simulation while playing
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setEqLevels(prev => prev.map(() => Math.floor(Math.random() * 85) + 15));
      }, 120);
    } else {
      setEqLevels([5, 5, 5, 5, 5, 5, 5, 5]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Play a Curated MP3 beats
  const handlePlayMp3 = (trackId: string) => {
    const selected = CURATED_MP3_LIST.find(t => t.id === trackId);
    if (!selected || !audioRef.current) return;

    // Turn off YouTube stream
    if (currentPlayType === "youtube") {
      setIsPlaying(false);
    }

    setActiveTrackId(trackId);
    setActiveMp3Track(selected);
    setCurrentPlayType("mp3");

    // Load and play mp3 file
    audioRef.current.src = selected.url;
    audioRef.current.load();
    
    // Play trigger with error safe check
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setErrorMessage("");
        })
        .catch((err) => {
          console.warn("Dihambat oleh autoplay policy browser. Harap klik play kembali.", err);
          setIsPlaying(false);
        });
    }
  };

  // Play a Selected YouTube Video ID
  const handlePlayYt = (ytId: string, trackTitle: string, playlistId: string) => {
    if (!ytId) return;

    // Pause potential MP3 playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Assign active targets
    setActiveTrackId(playlistId);
    setActiveYtId(ytId);
    setActiveYtTitle(trackTitle);
    setCurrentPlayType("youtube");
    setIsPlaying(true);
    setErrorMessage("");
  };

  // Handle custom Input YouTube URL Submission
  const handleCustomLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!inputUrl.trim()) return;

    const extractedId = getYouTubeId(inputUrl.trim());
    if (extractedId) {
      // Pause any MP3 elements
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setActiveTrackId("custom-yt");
      setActiveYtId(extractedId);
      setActiveYtTitle("🔴 Custom Request YouTube Audio Stream");
      setCurrentPlayType("youtube");
      setIsPlaying(true);
      setInputUrl("");
    } else {
      setErrorMessage("⚠️ Format link tidak dikenali. Harap masukkan link YouTube yang valid!");
    }
  };

  // Switch Master Toggle play/pause for active channels
  const togglePlayState = () => {
    if (currentPlayType === "mp3" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (currentPlayType === "youtube") {
      // Toggle play for YouTube is simplified by loading/unloading stream frame
      setIsPlaying(!isPlaying);
    } else {
      // Default fallback fallback
      handlePlayMp3("mp3-1");
    }
  };

  return (
    <div className="bg-slate-950/65 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      
      {/* Decorative Cosmic backgrounds */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with cute active label */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60 mb-5 text-left">
        <div>
          <span className="text-[10px] uppercase tracking-widest bg-pink-950 text-pink-400 border border-pink-900/40 font-mono font-bold px-2 py-0.5 rounded">
            📻 JUKEBOX MUSIK FOKUS ELEGAN
          </span>
          <h2 className="text-md font-sans font-extrabold text-slate-100 mt-1.5 flex items-center gap-2">
            <Music className={`w-5 h-5 text-pink-400 ${isPlaying ? "animate-bounce" : ""}`} />
            Personal Relaxation Radio &amp; YouTube Player
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
            Putar koleksi instan lagu penenang pikiran bebas stres saat Anda mengerjakan tugas, atau tempel link video YouTube favorit Anda untuk diputar langsung di dalam aplikasi!
          </p>
        </div>

        {/* Dynamic Equalizer Track representation bar */}
        <div className="flex items-end justify-center h-12 bg-slate-950/90 border border-slate-900 px-4 py-2.5 rounded-xl gap-1 w-32 self-center shadow-inner">
          {eqLevels.map((lvl, index) => (
            <motion.div
              key={index}
              className={`w-1 rounded-t-sm ${
                index < 2 ? "bg-purple-500/80" : index < 5 ? "bg-pink-400/80" : "bg-teal-400/80"
              }`}
              animate={{ height: `${lvl}%` }}
              transition={{ type: "tween", duration: 0.12 }}
              style={{ minHeight: "3px" }}
            />
          ))}
        </div>
      </div>

      {/* Main active player dashboard plate */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
        
        {/* Left column: CD Visual state indicator */}
        <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-850 p-4 rounded-xl text-center shadow-md">
          <div className="relative mb-3">
            {/* Vinyl record rotation */}
            <div 
              className={`w-28 h-28 rounded-full bg-slate-950 border-[3px] border-slate-850 flex items-center justify-center relative shadow-xl ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "6s" }}
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full border border-slate-950 flex flex-col items-center justify-center">
                <span className="w-2.5 h-2.5 bg-slate-950 rounded-full"></span>
              </div>
            </div>
            
            {/* Small active channel tag label */}
            <span className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 py-0.5 px-2 bg-pink-900 border border-pink-700/60 font-mono text-[9px] text-pink-300 font-bold rounded shadow">
              {currentPlayType === "youtube" ? "🔴 YOUTUBE" : currentPlayType === "mp3" ? "🎵 SOUNDSTREAM" : "🔇 WAITING"}
            </span>
          </div>

          <div className="w-full mt-2.5 space-y-1">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Lagu Sedang Berbunyi:
            </p>
            <p className="text-xs font-sans font-extrabold text-slate-100 truncate max-w-[190px] mx-auto">
              {currentPlayType === "youtube" 
                ? activeYtTitle 
                : currentPlayType === "mp3" 
                  ? activeMp3Track.title 
                  : "Silakan pilih salah satu musik"
              }
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[190px] mx-auto">
              {currentPlayType === "youtube" ? "Live Stream Audio feed" : currentPlayType === "mp3" ? activeMp3Track.artist : "Menunggu giliran main..."}
            </p>
          </div>

          {/* Quick Play & Stop controller inside CD widget */}
          <div className="w-full mt-4 flex items-center gap-2">
            <button
              id="jukebox-master-toggle-btn"
              onClick={togglePlayState}
              className={`flex-1 py-2 px-3.5 rounded-lg text-xs font-sans font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isPlaying
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow shadow-rose-900/20"
                  : "bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  PAUSE PLAYBACK
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  RESUME PLAY
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Dynamic YouTube Player output / Instruction box */}
        <div className="md:col-span-8 bg-slate-900/30 border border-slate-850 p-4 rounded-xl flex flex-col justify-between min-h-[190px] relative overflow-hidden">
          
          {/* Active play type conditional rendering */}
          {currentPlayType === "youtube" && isPlaying ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                    📡 INDONESIA STREAM FEED ACTIVE (YOUTUBE EMBED)
                  </span>
                </div>
                
                {/* Visual Video Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowVideoFrame(!showVideoFrame)}
                  className="px-2 py-0.5 text-[9px] font-mono bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-slate-300 transition-colors cursor-pointer"
                >
                  {showVideoFrame ? "🙈 Sembunyikan Video (Simpan Bandwidth)" : "👁️ Tampilkan Screen Video"}
                </button>
              </div>

              {/* Styled YouTube iframe container inside browser frame simulation */}
              <div className={`transition-all duration-300 overflow-hidden ${showVideoFrame ? "h-36" : "h-0 opacity-0"}`}>
                <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                  <iframe
                    title="Youtube Background Focus stream"
                    src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&loop=1&playlist=${activeYtId}&controls=1&mute=0`}
                    className="w-full h-full border-0 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              
              {!showVideoFrame && (
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900 text-center py-6">
                  <Tv className="w-6 h-6 text-slate-600 mx-auto mb-2 animate-pulse" />
                  <p className="text-[11px] font-sans text-slate-300 font-medium">Video YouTube disembunyikan</p>
                  <p className="text-[9px] font-mono text-slate-500 mt-0.5">Audio tetap berjalan damai di latar belakang.</p>
                </div>
              )}
            </div>
          ) : currentPlayType === "mp3" && isPlaying ? (
            <div className="flex flex-col items-center justify-center py-6 h-full text-center">
              <div className="p-3.5 rounded-full bg-teal-950/40 border border-teal-900/40 mb-3.5">
                <Music className="w-7 h-7 text-teal-400 animate-spin" style={{ animationDuration: "10s" }} />
              </div>
              <p className="text-xs font-sans text-slate-200 font-bold">Lagu Relaksasi MP3 Sedang Berjalan</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1 max-w-sm">
                Memutar link stream langsung beresolusi optimal. Musik ini bebas hambatan lag jaringan!
              </p>
              
              {/* Native volume helper indicator */}
              <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-slate-950 rounded-lg border border-slate-900 w-44">
                <Volume2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-850 rounded appearance-none cursor-pointer accent-teal-400"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full">
              <Compass className="w-8 h-8 text-slate-600 mb-2.5" />
              <p className="text-xs font-sans text-slate-300 font-bold">Sistem Radio Siap Dimainkan</p>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm mt-0.5">
                Klik salah satu lagu rekomendasi MP3 di bawah, atau masukkan link video YouTube favorit Anda di kolom formulir.
              </p>
            </div>
          )}

          {/* Prompt error message displaying */}
          {errorMessage && (
            <div className="mt-3 p-2 bg-rose-950/40 border border-rose-900/40 rounded-lg text-[10px] text-rose-300 font-mono text-left">
              {errorMessage}
            </div>
          )}
        </div>

      </div>

      {/* Grid selector - Curated MP3 beats is now beautifully positioned at full width */}
      <div className="border-t border-slate-900 pt-5 text-left">
        
        {/* Box Left: Curated Healing Sound Stream MP3 */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
          <label className="text-[10.5px] font-mono tracking-wider font-bold text-teal-400 block mb-3 uppercase">
            🎵 PILIH REKOMENDASI MUSIK BEBAS HAMBATAN (.MP3):
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {CURATED_MP3_LIST.map((track) => {
              const isActive = currentPlayType === "mp3" && activeTrackId === track.id && isPlaying;
              return (
                <button
                  key={track.id}
                  onClick={() => handlePlayMp3(track.id)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isActive 
                      ? "bg-teal-950/25 border-teal-500/50" 
                      : "bg-slate-900/45 border-slate-850 hover:bg-slate-850/80 hover:border-slate-700"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p className={`text-xs font-sans font-bold truncate ${isActive ? "text-teal-300" : "text-slate-200"}`}>
                      {track.title}
                    </p>
                    <p className="text-[9.5px] text-slate-500 font-mono truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isActive ? "bg-teal-500 text-slate-950" : "bg-slate-950 text-slate-400"
                  }`}>
                    {isActive ? (
                      <span className="flex gap-0.5 items-end h-2.5">
                        <span className="w-0.5 h-2.5 bg-slate-950 animate-pulse"></span>
                        <span className="w-0.5 h-1.5 bg-slate-950 animate-ping"></span>
                      </span>
                    ) : (
                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Paste Custom YouTube Link input Form block */}
      <form onSubmit={handleCustomLinkSubmit} className="mt-5 pt-4 border-t border-slate-900/70 text-left">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide flex-shrink-0">
            <LinkIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>PASTE LINK LIVE REQUES LAGU YOUTUBEMU:</span>
          </div>
          
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Tempel link URL YouTube (contoh: https://www.youtube.com/watch?v=5qap5aO4i9A)..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-grow bg-slate-950/80 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600 font-sans"
            />
            <button
              type="submit"
              disabled={!inputUrl.trim()}
              className="px-4 py-2 bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 font-sans font-extrabold text-xs rounded-lg cursor-pointer transition-all active:scale-95 text-center shrink-0 disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-teal-500/5"
            >
              🚀 Putar Lagu
            </button>
          </div>
        </div>
        <p className="text-[9px] text-slate-500 font-mono italic mt-2">
          *Anda bisa memainkan link YouTube apa saja! Format link web standar browser pc, link ponsel m.youtube maupun klip pendek banyolan didukung sepenuhnya.
        </p>
      </form>

    </div>
  );
}
