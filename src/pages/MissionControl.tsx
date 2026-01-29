import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Terminal, TrendingUp, CheckCircle2, Clock, Loader2, AlertCircle, Eye, Copy } from "lucide-react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

interface Mission {
  id: string;
  brief: string;
  status: string;
  timestamp: number;
  thumbnail?: string;
  resultUrl?: string;
  // New Field for Agent Copy - can be object or string from API
  socialCopy?: {
    headline: string;
    caption: string;
    hashtags: string[];
  } | string;
}

// Map backend statuses to UI states
const STATUS_MAP: Record<string, { label: string, color: string, icon: any, done: boolean }> = {
  // Active States
  'pending_upload': { label: 'Initializing', color: 'text-blue-500', icon: Loader2, done: false },
  'processing': { label: 'Thinking', color: 'text-purple-500', icon: Loader2, done: false },
  'processing_magic': { label: 'Designing', color: 'text-purple-500', icon: Loader2, done: false },
  'generating_photos': { label: 'Rendering', color: 'text-purple-500', icon: Loader2, done: false },
  'processing_campaign': { label: 'Strategizing', color: 'text-pink-500', icon: Loader2, done: false }, // New state for campaign agent
  
  // Completed States (Assets Ready)
  'completed': { label: 'Deployed', color: 'text-green-500', icon: CheckCircle2, done: true },
  'pending_details': { label: 'Ready for Review', color: 'text-green-400', icon: CheckCircle2, done: true },
  
  // Failed
  'failed': { label: 'Failed', color: 'text-red-500', icon: AlertCircle, done: true },
};

export default function MissionControl() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeLog, setActiveLog] = useState("System Idle. Waiting for instructions...");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("active_missions") || "[]");
    setMissions(saved);
  }, []);

  useEffect(() => {
    if (missions.length === 0) return;

    const interval = setInterval(async () => {
      const updatedMissions = await Promise.all(missions.map(async (m) => {
        // Stop polling if we already marked it as done in local state (optional optimization)
        // But we keep polling 'pending_details' just in case backend updates further.
        if (m.status === 'failed') return m;

        try {
          const data = await api.getJobStatus(m.id);
          const backendStatus = data.status || 'processing';
          
          // Terminal Logic
          if (backendStatus === "generating_photos" || backendStatus === "processing_campaign") {
            setActiveLog(`[Agent ${m.id.substring(0,4)}] Drafting content for "${m.brief}"...`);
          } else if (backendStatus === "pending_details" || backendStatus === "completed") {
            setActiveLog(`[Agent ${m.id.substring(0,4)}] Mission Successful. Assets deployed.`);
          }

          // Extract Result URL (Handle multiple formats)
          let resultUrl = m.resultUrl;
          if (data.result_urls && data.result_urls.length > 0) resultUrl = data.result_urls[0];
          else if (data.result_url) resultUrl = data.result_url;
          // Fallback for 'pending_details' photo array
          else if (data.photo_urls && data.photo_urls.length > 0) resultUrl = data.photo_urls[0];
          else if (data.clean_photo_urls && data.clean_photo_urls.length > 0) resultUrl = data.clean_photo_urls[0];

          // Extract Social Copy (New)
          const socialCopy = data.social_copy;

          return { ...m, status: backendStatus, resultUrl, socialCopy };
        } catch (e) {
          return m;
        }
      }));

      if (JSON.stringify(updatedMissions) !== JSON.stringify(missions)) {
        setMissions(updatedMissions);
        localStorage.setItem("active_missions", JSON.stringify(updatedMissions));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [missions]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* LIVE TERMINAL */}
        <div className="bg-black/90 border border-white/10 rounded-xl p-6 font-mono text-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse" />
          <div className="flex items-center gap-2 text-primary mb-4 border-b border-white/10 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="uppercase tracking-widest text-xs font-bold">Agent_Activity_Log_Live</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-auto" />
          </div>
          <div className="h-12 flex items-center text-green-400">
            <span className="mr-2 opacity-50">[{new Date().toLocaleTimeString()}]</span>
            <span className="typing-effect">{activeLog}</span>
          </div>
        </div>

        {/* ACTIVE OPERATIONS */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Active Operations
            </h3>
            <Link to="/deploy" className="text-xs btn-ghost">New Mission +</Link>
          </div>

          <div className="space-y-4">
            {missions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No active agents. Deploy one to start.</p>
            ) : (
              missions.map((m) => {
                // Determine UI state from map or fallback
                const uiState = STATUS_MAP[m.status] || { label: m.status, color: 'text-blue-500', icon: Loader2, done: false };
                const Icon = uiState.icon;

                return (
                  <div key={m.id} className="flex flex-col bg-white/5 rounded-lg border border-white/5 hover:border-primary/30 transition-all group overflow-hidden">
                    
                    {/* Top Row: Status & Brief */}
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 ${uiState.color}`}>
                            <Icon className={`w-5 h-5 ${!uiState.done && 'animate-spin'}`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{m.brief}</h4>
                            <p className="text-xs text-muted-foreground font-mono">ID: {m.id.substring(0,8)}...</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-xs px-2 py-1 rounded uppercase font-bold bg-white/5 ${uiState.color}`}>
                           {uiState.label}
                         </span>
                      </div>
                    </div>

                    {/* Result Row (Only if done and has data) */}
                    {uiState.done && m.resultUrl && (
                      <div className="border-t border-white/5 p-4 bg-black/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left: Image Asset */}
                        <div className="relative aspect-square md:aspect-video rounded-lg overflow-hidden bg-black group-hover:shadow-glow transition-all">
                          <img src={m.resultUrl} alt="Result" className="w-full h-full object-cover" />
                          <a 
                            href={m.resultUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full hover:bg-primary hover:text-black text-white transition-colors"
                          >
                            <Eye className="w-4 h-4"/>
                          </a>
                        </div>

                        {/* Right: Agent Copy */}
                        <div className="flex flex-col h-full">
                          {m.socialCopy ? (
                             <div className="space-y-2 flex-1 flex flex-col">
                               <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-primary tracking-wider">GENERATED CAPTION</span>
                                 <button 
                                   onClick={() => {
                                     const copy = m.socialCopy;
                                     if (typeof copy === 'string') {
                                       navigator.clipboard.writeText(copy);
                                     } else if (copy) {
                                       navigator.clipboard.writeText(`${copy.headline}\n\n${copy.caption}\n\n${copy.hashtags.join(' ')}`);
                                     }
                                   }}
                                   className="text-xs flex items-center gap-1 hover:text-white text-muted-foreground transition-colors"
                                 >
                                   <Copy className="w-3 h-3" /> Copy
                                 </button>
                               </div>
                               <div className="p-3 bg-white/5 rounded-lg text-xs text-muted-foreground font-mono flex-1 overflow-y-auto border border-white/5">
                                 {typeof m.socialCopy === 'string' ? (
                                   <p className="leading-relaxed whitespace-pre-wrap">{m.socialCopy}</p>
                                 ) : m.socialCopy ? (
                                   <>
                                     <p className="font-bold text-white mb-2">{m.socialCopy.headline}</p>
                                     <p className="mb-3 leading-relaxed">{m.socialCopy.caption}</p>
                                     <p className="text-blue-400">{m.socialCopy.hashtags.join(' ')}</p>
                                   </>
                                 ) : null}
                               </div>
                             </div>
                          ) : (
                             <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground bg-white/5 rounded-lg border border-dashed border-white/10">
                               <span>Generating caption...</span>
                             </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* VIRAL FORECAST */}
        <div>
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary" /> Viral Forecast
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Minimalist Luxury", "Y2K Cyber", "Eco-Green"].map((trend, i) => (
              <div key={i} className="glass-card p-0 overflow-hidden cursor-pointer group opacity-75 hover:opacity-100 transition-opacity">
                <div className="h-24 bg-gradient-to-br from-gray-800 to-black relative p-4 flex flex-col justify-between border-l-4 border-l-primary">
                   <span className="font-bold text-white">{trend}</span>
                   <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded w-fit">Trending Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}