import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneCall } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Dropdown from "@/components/Dropdown";
import Vapi from "@vapi-ai/web";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const TestCallWindow = () => {
  const axiosSecure = useAxiosSecure();
  const vapi = React.useMemo(
    () => new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || ""),
    [],
  );

  const { data: agentsResponse, isLoading: isLoadingAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agent");
      return res.data;
    },
  });

  const agents = agentsResponse?.data || [];
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedAgentName, setSelectedAgentName] = useState("");

  const [isCalling, setIsCalling] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [activeTranscript, setActiveTranscript] = useState({
    text: "",
    role: "",
  });
  const transcriptRef = useRef(null);

  const timerRef = useRef(null);

  const startCall = async () => {
    if (!selectedAgentId) {
      toast.error("Please select an Agent first.");
      return;
    }

    try {
      setIsConnecting(true);
      setTranscripts([]);
      setActiveTranscript({ text: "", role: "" });
      await vapi.start(selectedAgentId);
    } catch (err) {
      setIsConnecting(false);
      console.error("Error starting Vapi call:", err);
      toast.error(
        `Error: ${err?.message || "Failed to start call"}. Check console.`,
      );
    }
  };

  const endCall = () => {
    vapi.stop();
    setIsCalling(false);
    setIsConnecting(false);
    setIsMuted(false);
    setVolume(0);
    setCallDuration(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    vapi.setMuted(newMuteState);
  };

  useEffect(() => {
    const onCallStart = () => {
      setIsConnecting(false);
      setIsCalling(true);
      setCallDuration(0);
      toast.success("Call started successfully.");
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    };

    const onCallEnd = () => {
      setIsCalling(false);
      setIsConnecting(false);
      toast.success("Call ended.");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const onVolumeLevel = (level) => {
      setVolume(level * 255); // Scale 0-1 to 0-255 for the waveform visualization
    };

    const onMessage = (message) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "final") {
          setTranscripts((prev) => [
            ...prev,
            { id: Date.now(), role: message.role, text: message.transcript },
          ]);
          setActiveTranscript({ text: "", role: "" });
        } else {
          setActiveTranscript({ text: message.transcript, role: message.role });
        }
      }
    };

    const onError = (e) => {
      console.error("Vapi Error Event:", e);
      // toast.error(`Vapi Error: ${e?.message || JSON.stringify(e)}`);
      setIsCalling(false);
      setIsConnecting(false);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcripts, activeTranscript]);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <Breadcrumb text={"Check the voice tester"} />
      </div>

      <div
        className={`flex-1 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] border border-slate-100 overflow-y-auto lg:overflow-hidden min-h-[500px] md:min-h-[600px] ${isCalling ? "flex flex-col lg:flex-row" : "relative flex flex-col items-center pt-6 md:pt-10 pb-10"}`}
      >
        {!isCalling ? (
          <>
            {/* --- IDLE STATE (Before Call) --- */}
            {/* Agent Selector Card */}
            <div className="w-[90%] max-w-md bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-3xl p-6 z-40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex-shrink-0">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5v14M22 10v4M7 5v14M2 10v4" />
                  </svg>
                </div>
                <h3 className="text-slate-800 font-bold text-xl md:text-2xl tracking-tight">
                  Select Your AI Agent
                </h3>
              </div>

              <div className="relative z-50">
                <Dropdown
                  placeholder={
                    isLoadingAgents ? "Loading agents..." : "Select an Agent"
                  }
                  options={agents.map((a) => a.name || "Unknown Agent")}
                  value={selectedAgentName}
                  onSelect={(name) => {
                    const agent = agents.find(
                      (a) => (a.name || "Unknown Agent") === name,
                    );
                    if (agent) {
                      const vapiId =
                        agent.agentId ||
                        agent.vapiAgentId ||
                        agent.vapi_agent_id ||
                        agent.id;
                      setSelectedAgentId(vapiId);
                      setSelectedAgentName(name);
                    }
                  }}
                  className={`${isCalling || isLoadingAgents ? "opacity-50 pointer-events-none" : ""}`}
                  inputClass="!w-full !bg-slate-50/50 !text-slate-800 !placeholder-slate-400 !border-slate-200 hover:!bg-slate-50 hover:!border-sky-300 focus:!border-sky-500 !rounded-xl !px-5 !py-3.5 !text-[15px] !shadow-sm !transition-all"
                  optionClass="!bg-white !text-slate-700 !border-slate-100 shadow-xl"
                  icon="!text-slate-400 !right-5"
                />
              </div>
            </div>

            <div className="relative my-auto z-10 py-6 md:py-0">
              <motion.div className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_80px_rgba(14,165,233,0.15)] ring-8 ring-slate-50">
                <motion.img
                  src="/moon.png"
                  alt="Voice Orb"
                  className="absolute inset-0 w-full h-full object-cover rounded-full opacity-90 mix-blend-multiply"
                />
                <span className="text-white text-xl md:text-2xl font-black relative z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-widest uppercase">
                  Ready
                </span>
              </motion.div>
            </div>

            {/* Controls Bar */}
            <div className="z-40 mt-6 flex-shrink-0">
              {!isConnecting ? (
                <motion.button
                  onClick={startCall}
                  className={`group flex items-center gap-3 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all ${
                    !selectedAgentId
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 border-b-[3px] border-teal-700"
                  }`}
                >
                  <PhoneCall
                    className={`w-5 h-5 md:w-6 md:h-6 ${selectedAgentId ? "group-hover:animate-pulse" : ""}`}
                  />
                  {!selectedAgentId
                    ? "Select Agent to Call"
                    : "Start Test Call"}
                </motion.button>
              ) : (
                <motion.button
                  disabled
                  className="flex items-center gap-3 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all bg-green-500/70 text-white opacity-80 cursor-not-allowed shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                >
                  <PhoneCall className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                  Connecting...
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* --- ACTIVE STATE (Split Screen) --- */}

            <div className="flex-1 relative flex flex-col items-center justify-between p-6 md:p-8 min-h-[350px] lg:min-h-[500px] shrink-0 bg-slate-50/30">
              {/* Timer Pill */}
              <div className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-100 rounded-full shadow-sm z-20">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                <span className="text-slate-700 font-mono text-[15px] tracking-wider font-semibold">
                  {formatTime(callDuration)}
                </span>
              </div>

              {/* Spiky Waveforms Area */}
              <div
                className="absolute top-1/2 left-0 w-full h-40 md:h-64 -translate-y-1/2 flex items-center justify-center px-4 pointer-events-none z-0 transition-opacity duration-300"
                style={{ opacity: isCalling && volume > 2 ? 1 : 0 }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 150"
                  preserveAspectRatio="none"
                  className="overflow-visible"
                >
                  <Waveform
                    color="#10B981"
                    isCalling={isCalling}
                    volume={volume}
                    multiplier={1.25}
                    freq={0.06}
                    strokeWidth={2}
                  />
                  <Waveform
                    color="#34D399"
                    isCalling={isCalling}
                    volume={volume}
                    multiplier={1.0}
                    freq={0.08}
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                  <Waveform
                    color="#059669"
                    isCalling={isCalling}
                    volume={volume}
                    multiplier={0.6}
                    freq={0.04}
                    strokeWidth={1}
                    opacity={0.3}
                  />
                </svg>
              </div>

              <div className="relative my-auto z-10">
                <motion.div
                  animate={{ scale: 1 + volume / 800 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center relative overflow-hidden bg-white border-[8px] border-slate-50 shadow-[0_0_60px_rgba(16,185,129,0.15)] ring-1 ring-slate-100"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50"
                    animate={{ opacity: volume > 10 ? [0.6, 1, 0.6] : 0.6 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  <div className="relative z-20 flex flex-col items-center">
                    {isMuted ? (
                      <MicOff
                        className="w-12 h-12 text-slate-300 mb-3"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Mic
                        className="w-12 h-12 text-emerald-500 mb-3"
                        strokeWidth={1.5}
                      />
                    )}
                    <span className="text-slate-500 text-sm font-semibold tracking-wide uppercase">
                      {isMuted
                        ? "Muted"
                        : volume > 5
                          ? "Speaking"
                          : "Listening"}
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-full shadow-lg z-20"
              >
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full transition-all flex items-center justify-center ${
                    isMuted
                      ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                      : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
                <div className="w-[1px] h-8 bg-slate-200 mx-2" />
                <button
                  onClick={endCall}
                  className="p-4 px-8 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all flex items-center justify-center shadow-md hover:shadow-rose-500/25"
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </button>
              </motion.div>
            </div>

            <div className="w-full lg:w-[380px] xl:w-[450px] border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col bg-slate-50 min-h-[350px] lg:min-h-0 lg:h-auto shrink-0 flex-1">
              {/* Transcript Header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-white">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-teal-500"
                >
                  <path d="M2 12h4l2-9 4 18 2-9h4" />
                </svg>
                <h3 className="text-slate-800 font-bold text-lg">
                  Live Transcript
                </h3>
              </div>

              {/* Chat Area */}
              <div
                ref={transcriptRef}
                className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scroll-smooth"
              >
                {transcripts.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm shadow-blue-500/20"
                          : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Active/Interim Transcript */}
                {activeTranscript.text && (
                  <div
                    className={`flex ${activeTranscript.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] opacity-80 shadow-sm flex items-end gap-2 leading-relaxed ${
                        activeTranscript.role === "user"
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm shadow-blue-500/20"
                          : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                      }`}
                    >
                      {activeTranscript.text}
                      <span className="flex gap-0.5 mb-1.5 ml-2">
                        <span
                          className="w-1 h-1 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1 h-1 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1 h-1 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    </div>
                  </div>
                )}

                {transcripts.length === 0 && !activeTranscript.text && (
                  <div className="flex-1 flex items-center justify-center text-sky-600 text-sm">
                    Waiting for speech...
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Waveform = ({
  color,
  isCalling,
  volume,
  multiplier,
  freq,
  strokeWidth,
  opacity = 1,
}) => {
  const isVoiceActive = isCalling && volume > 2;
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId;
    const animate = () => {
      setTime((prev) => prev + 0.1);
      frameId = requestAnimationFrame(animate);
    };
    if (isVoiceActive) {
      animate();
    } else {
      setTime(0);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isVoiceActive]);

  const generatePath = () => {
    const points = 100;
    const width = 1000;
    const step = width / points;
    const centerY = 75;
    let d = `M 0 ${centerY}`;

    for (let i = 0; i <= points; i++) {
      const x = i * step;
      // Reduced amplitude logic for a more subtle "normal" look
      const baseAmplitude = isVoiceActive ? volume * multiplier * 0.4 : 0;
      const waveVariation = 0.5 + Math.sin(i * 0.1 + time) * 0.5;
      const amplitude = baseAmplitude * waveVariation;

      const y = centerY + Math.sin(i * freq * 10 + time) * amplitude;

      if (i === 0) continue;
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  return (
    <motion.path
      d={generatePath()}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

export default TestCallWindow;
