import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, User, Brain, AlertCircle, RefreshCw, MessageSquare, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  time: string;
}

interface PsychConsultationProps {
  userName: string;
  theme: "dark" | "light";
}

export default function PsychConsultation({ userName, theme }: PsychConsultationProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: `Halo ${userName || "Teman Fokus"}! I'm Coach Amanda 🌸. Sebagai konselor psikologi khusus penundaan (procrastination psychologist), aku di sini untuk mendengarkan beban, kekhawatiran, atau rasa penatmu secara mendalam.\n\nSeringkali kita menunda bukan karena malas, tetapi karena kecemasan, rasa takut tidak sempurna, atau kelelahan kognitif. Apa tugas pelik yang sedang kamu tunda hari ini? Mari kita urai bersama secara perlahan dan tanpa penghakiman.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    setErrorMsg(null);

    const newMsg: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      // Map conversation history for API
      const historyPayload = messages.slice(1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text,
      }));

      const res = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          userName: userName,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const replyMsg: Message = {
        id: `${Date.now()}-model`,
        role: "model",
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal menghubungi Coach Amanda. Coba periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Apakah Anda yakin ingin memulai ulang sesi konsultasi dengan Coach Amanda?")) {
      setMessages([
        {
          id: "welcome-re",
          role: "model",
          text: `Halo kembali ${userName}! Mari kita mulai lembaran konsultasi baru. Tugas atau kendala psikologis apa yang ingin kamu ceritakan kepadaku sekarang? Aku siap membantu menguraikannya dengan metode CBT. 🌸`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setErrorMsg(null);
    }
  };

  const suggestedTopic = (topic: string) => {
    setInputValue(topic);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="psych-consult-root">
      {/* Intro Header Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-teal-500/10 rounded-2xl relative overflow-hidden" id="psych-consult-header">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Brain className="w-24 h-24 text-teal-400" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-sans font-extrabold text-white">Konsultasi Psikologis AI</h3>
            <p className="text-xs text-slate-350 mt-1 leading-relaxed">
              Curhat klinis interaktif dengan <strong>Coach Amanda</strong>. Memanfaatkan pendekatan <em>Cognitive Behavioral Therapy (CBT)</em> untuk mengurangi rasa bersalah dan memilah emosi negatif di balik prokrastinasi.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Chat Board Frame */}
      <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden flex flex-col h-[550px] shadow-2xl relative" id="psych-chat-board">
        {/* Chat Ribbon bar */}
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-850 flex items-center justify-between" id="psych-chat-ribbon">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-teal-400/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-xs">
                CA
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-100 block font-sans">Coach Amanda, Psi.</span>
              <span className="text-[10px] font-mono text-teal-400 block tracking-wider uppercase">Procrastination Therapist AI</span>
            </div>
          </div>

          <button
            id="clear-chat-btn"
            onClick={clearChat}
            className="p-1.5 px-2.5 bg-slate-950 hover:bg-slate-800 text-slate-450 hover:text-rose-400 border border-slate-800 rounded-lg text-[10px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset Chat"
          >
            <RefreshCw className="w-3 h-3" />
            Mulai Ulang Konseling
          </button>
        </div>

        {/* Talk Messages Container Scrollpane */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans leading-relaxed scrollbar-thin" id="messages-scrollpane">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  msg.role === "user" 
                    ? "bg-teal-500 text-slate-950 font-sans" 
                    : "bg-slate-900 text-teal-400 border border-slate-800"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>

                {/* Msg Bubble element */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-xl text-xs border ${
                    msg.role === "user"
                      ? "bg-teal-600/10 border-teal-500/20 text-teal-200 rounded-tr-none"
                      : "bg-slate-900/60 border-slate-850 text-slate-200 rounded-tl-none whitespace-pre-wrap"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[9px] font-mono text-slate-500 block ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Assistant Loading bubble indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto" id="loading-indicator-bubble">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></span>
                <span className="text-[10px] font-mono text-slate-450 ml-1.5">Coach Amanda sedang menyusun intervensi CBT...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-950/20 border border-rose-800/80 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs" id="chat-error-toast">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-400" />
              <div className="flex-1">
                <p className="font-bold">Gagal Berkonsultasi</p>
                <p className="mt-0.5 text-slate-350">{errorMsg}</p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Topics Panel */}
        <div className="px-5 py-2.5 border-t border-slate-900 bg-slate-950 flex flex-wrap gap-2 items-center" id="suggested-topics-list">
          <span className="text-[9px] font-mono text-slate-450 uppercase">Topik Relevan:</span>
          {[
            "Takut ga sempurna (Perfeksionisme)",
            "Gak ada mood untuk mulai kerja",
            "Cemas duluan liat tugas pelik/susah",
            "Gampang kepecah fokus pas ada HP",
          ].map((topic, i) => (
            <button
              key={i}
              type="button"
              id={`suggested-topic-${i}`}
              onClick={() => suggestedTopic(topic)}
              className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-teal-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              💡 {topic}
            </button>
          ))}
        </div>

        {/* Input Chat form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-850 flex gap-2.5 items-center" id="psych-chat-form">
          <input
            id="chat-user-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ceritakan beban atau alasan penundaanmu kepada Coach Amanda...`}
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-teal-500 font-sans transition-colors placeholder-slate-500"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              !inputValue.trim() || isLoading
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-400 text-slate-950 hover:shadow-lg hover:shadow-teal-500/15"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Insight Tips Footer */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex gap-3 text-xs text-slate-400 leading-normal" id="psych-tips-footer">
        <ShieldAlert className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Tips CBT Klinis:</strong> Cobalah untuk menceritakan rasa bersalahmu secara jujur tanpa menghakimi diri sendiri. Coach Amanda dilatih menggunakan kerangka kerja intervensi kognitif untuk membantumu menemukan hambatan psikologis terdalam.
        </p>
      </div>
    </div>
  );
}
