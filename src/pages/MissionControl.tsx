import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Terminal, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Eye, 
  Copy, 
  Download, 
  Image as ImageIcon 
} from "lucide-react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MissionResult {
  format: string;
  url: string;
}

interface Mission {
  id: string;
  brief: string;
  status: string;
  timestamp: number;
  thumbnail?: string;
  resultUrl?: string;
  allResults?: MissionResult[]; 
  // socialCopy can be a single object (legacy) or a dictionary of platforms (new)
  socialCopy?: any; 
}

// Map backend statuses to UI states
const STATUS_MAP: Record<string, { label: string, color: string, icon: any, done: boolean }> = {
  'pending_upload': { label: 'Initializing', color: 'text-blue-500', icon: Loader2, done: false },
  'processing': { label: 'Thinking', color: 'text-purple-500', icon: Loader2, done: false },
  'processing_magic': { label: 'Designing', color: 'text-purple-500', icon: Loader2, done: false },
  'generating_photos': { label: 'Rendering', color: 'text-purple-500', icon: Loader2, done: false },
  'processing_campaign': { label: 'Strategizing', color: 'text-pink-500', icon: Loader2, done: false },
  'completed': { label: 'Deployed', color: 'text-green-500', icon: CheckCircle2, done: true },
  'pending_details': { label: 'Ready for Review', color: 'text-green-400', icon: CheckCircle2, done: true },
  'failed': { label: 'Failed', color: 'text-red-500', icon: AlertCircle, done: true },
};

export default function MissionControl() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeLog, setActiveLog] = useState("System Idle. Waiting for instructions...");
  const { user } = useAuth0();

  // Helper to force download image
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (e) {
      console.error(e);
      window.open(url, '_blank'); // Fallback
    }
  };

  useEffect(() => {
    if (!user?.sub) return;

    const fetchMissions = async () => {
      try {
        const jobs = await api.getUserMissions(user.sub);
        
        const updatedMissions = jobs.map((job: any) => {
          // Normalize results: if all_results exists, use it. Else fallback to single result_url
          let finalResults: MissionResult[] = [];
          
          if (job.all_results && job.all_results.length > 0) {
            finalResults = job.all_results;
          } else if (job.result_url) {
            finalResults = [{ format: 'default', url: job.result_url }];
          } else if (job.result_urls) {
             finalResults = job.result_urls.map((u: string, i: number) => ({ format: `Image ${i+1}`, url: u }));
          }

          return { 
            id: job.id, 
            brief: job.brief,
            status: job.status, 
            timestamp: new Date(job.created_at).getTime(),
            allResults: finalResults,
            socialCopy: job.social_copy 
          };
        });

        // --- NEW: UPDATE TERMINAL LOG ---
        // 1. Find the first job that is NOT done (processing)
        const activeJob = updatedMissions.find((m: Mission) => !STATUS_MAP[m.status]?.done);
        
        if (activeJob) {
            // If we have an active job, show what it's doing
            const action = STATUS_MAP[activeJob.status]?.label || "Processing";
            setActiveLog(`[Agent ${activeJob.id.substring(0,4)}] ${action}: "${activeJob.brief.substring(0, 30)}..."`);
        } else if (updatedMissions.length > 0) {
            // If no active jobs, show the result of the last completed job
            const lastJob = updatedMissions[0];
            if (lastJob.status === 'completed') {
                setActiveLog(`[System] Mission Complete: "${lastJob.brief.substring(0, 30)}..." deployed.`);
            } else {
                setActiveLog(`[System] Last status: ${lastJob.status}`);
            }
        } else {
            setActiveLog("System Idle. Waiting for instructions...");
        }
        // --------------------------------

        // Simple check to avoid unnecessary re-renders
        if (JSON.stringify(updatedMissions) !== JSON.stringify(missions)) {
          setMissions(updatedMissions);
        }
      } catch (e) {
        console.error("Poll failed", e);
      }
    };

    fetchMissions();
    const interval = setInterval(fetchMissions, 5000);
    return () => clearInterval(interval);
  }, [user, missions]);

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

                    {/* Result Row */}
                    {uiState.done && m.allResults && m.allResults.length > 0 && (
                      <div className="border-t border-white/5 p-4 bg-black/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* LEFT: ASSET GALLERY */}
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary tracking-wider flex items-center gap-2">
                                <ImageIcon className="w-3 h-3"/> GENERATED ASSETS ({m.allResults.length})
                              </span>
                           </div>
                           
                           {/* Main Preview (First Image) */}
                           <div className="relative aspect-video rounded-lg overflow-hidden bg-black group-hover:shadow-glow transition-all border border-white/10">
                              <img src={m.allResults[0].url} alt="Result" className="w-full h-full object-contain" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 flex items-center justify-between backdrop-blur-md">
                                 <span className="text-xs font-mono text-white capitalize">{m.allResults[0].format.replace(/_/g, " ")}</span>
                                 <div className="flex gap-2">
                                   <a href={m.allResults[0].url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white"><Eye className="w-3 h-3"/></a>
                                   <button onClick={() => handleDownload(m.allResults![0].url, `blitz_${m.id}_${m.allResults![0].format}.jpg`)} className="p-1.5 hover:bg-white/20 rounded-md transition-colors text-white"><Download className="w-3 h-3"/></button>
                                 </div>
                              </div>
                           </div>

                           {/* Thumbnails Grid (If > 1 image) */}
                           {m.allResults.length > 1 && (
                             <div className="grid grid-cols-3 gap-2">
                               {m.allResults.slice(1).map((res, idx) => (
                                 <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-white/10 bg-black/40 group/thumb">
                                    <img src={res.url} className="w-full h-full object-cover opacity-70 group-hover/thumb:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                       <a href={res.url} target="_blank" rel="noreferrer" className="text-white hover:text-primary"><Eye className="w-4 h-4"/></a>
                                       <button onClick={() => handleDownload(res.url, `blitz_${m.id}_${res.format}.jpg`)} className="text-white hover:text-primary"><Download className="w-4 h-4"/></button>
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-black/80 text-[10px] text-center py-1 text-gray-300 truncate px-1">
                                      {res.format.replace("instagram_", "")}
                                    </div>
                                 </div>
                               ))}
                             </div>
                           )}
                        </div>

                        {/* RIGHT: AGENT COPY (MULTI-PLATFORM) */}
                        <div className="flex flex-col h-full">
                          {m.socialCopy ? (
                             <Tabs defaultValue="instagram" className="w-full flex-1 flex flex-col">
                               <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs font-bold text-primary tracking-wider">GENERATED COPY</span>
                                 <TabsList className="bg-black/40 h-8 p-0 border border-white/10">
                                   <TabsTrigger value="instagram" className="text-xs h-full px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">IG</TabsTrigger>
                                   <TabsTrigger value="twitter" className="text-xs h-full px-3 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">X</TabsTrigger>
                                   <TabsTrigger value="linkedin" className="text-xs h-full px-3 data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-300">LI</TabsTrigger>
                                 </TabsList>
                               </div>
                               
                               {/* Loop through platforms to create content panes */}
                               {['instagram', 'twitter', 'linkedin'].map((plat) => {
                                  // Robustly handle if the copy is string (legacy) or dict (new)
                                  const content = (typeof m.socialCopy === 'object' && m.socialCopy[plat]) 
                                    ? m.socialCopy[plat] 
                                    : (plat === 'instagram' ? m.socialCopy : null);

                                  if (!content) return <TabsContent key={plat} value={plat} className="text-xs text-muted-foreground flex-1">No content generated.</TabsContent>;

                                  return (
                                    <TabsContent key={plat} value={plat} className="flex-1 mt-0 h-full">
                                       <div className="relative bg-white/5 rounded-lg border border-white/5 h-[300px] flex flex-col">
                                          <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-gray-300 space-y-3 custom-scrollbar">
                                             {content.headline && <p className="font-bold text-white text-sm">{content.headline}</p>}
                                             <p className="whitespace-pre-wrap leading-relaxed">{content.caption}</p>
                                             {content.hashtags && <p className="text-blue-400">{Array.isArray(content.hashtags) ? content.hashtags.join(' ') : content.hashtags}</p>}
                                          </div>
                                          <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${content.headline || ''}\n\n${content.caption}\n\n${Array.isArray(content.hashtags) ? content.hashtags.join(' ') : content.hashtags || ''}`);
                                                toast.success(`Copied ${plat} text!`);
                                            }}
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-xs text-center border-t border-white/5 transition-colors flex items-center justify-center gap-2 font-medium"
                                          >
                                            <Copy className="w-3 h-3" /> Copy for {plat.charAt(0).toUpperCase() + plat.slice(1)}
                                          </button>
                                       </div>
                                    </TabsContent>
                                  );
                               })}
                             </Tabs>
                          ) : (
                             <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground bg-white/5 rounded-lg border border-dashed border-white/10 h-full min-h-[300px]">
                               <span>Generating copy...</span>
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
            {["Coming Soon"].map((trend, i) => (
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