import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Upload, 
  Zap, 
  BrainCircuit, 
  Instagram, 
  Mail, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

// Types for our Mission Config
interface MissionConfig {
  brief: string;
  vibe: string;
  channels: string[];
}

export default function DeployAgent() {
  const navigate = useNavigate();
  
  // 1. Load Brand DNA (The Brain)
  const [brandDNA, setBrandDNA] = useState<{colors: any, voice: string} | null>(null);
  
  // 2. Mission State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [config, setConfig] = useState<MissionConfig>({
    brief: "",
    vibe: "High Energy",
    channels: ["instagram_story"]
  });
  
  const [status, setStatus] = useState<"idle" | "uploading" | "thinking" | "deployed">("idle");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  useEffect(() => {
    const dna = localStorage.getItem("brand_dna");
    if (dna) {
      setBrandDNA(JSON.parse(dna));
    }
  }, []);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const toggleChannel = (channel: string) => {
    setConfig(prev => ({
      ...prev,
      channels: prev.channels.includes(channel) 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleDeploy = async () => {
    if (!file) {
      toast.error("Agent needs a product image to start.");
      return;
    }
    if (!config.brief) {
      toast.error("Please give the agent a brief.");
      return;
    }

    try {
      setStatus("uploading");
      
      // 1. Create Job
      const jobData = await api.createPhotoJob([file.type]);
      const { jobId, uploadUrls } = jobData;
      
      // 2. Upload to S3
      await api.uploadToS3(uploadUrls[0].url, file);
      
      setStatus("thinking");
      
      // 3. Start Agent (Passing Brand DNA + Brief)
      // We use 'custom_campaign' mode which we will map in backend
      await api.startProcessing(jobId, "custom_campaign", {
        ...config,
        brand_voice: brandDNA?.voice || "Professional",
        brand_colors: brandDNA?.colors || {},
        deliverables: config.channels
      });

      // --- NEW CODE: SAVE MISSION TO MEMORY ---
      const newMission = {
        id: jobId,
        brief: config.brief,
        status: "active",
        timestamp: Date.now(),
        thumbnail: preview // Save the blob URL (note: this is temporary for the session)
      };

      const existing = JSON.parse(localStorage.getItem("active_missions") || "[]");
      localStorage.setItem("active_missions", JSON.stringify([newMission, ...existing]));
      // ----------------------------------------

      setStatus("deployed");
      setActiveJobId(jobId);
      toast.success("Agent deployed! Monitor progress in Mission Control.");
      
      // Optional: Redirect to Mission Control or Results after 2s
      setTimeout(() => navigate("/"), 2000);

    } catch (e) {
      console.error(e);
      toast.error("Agent failed to deploy.");
      setStatus("idle");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Input & Brief */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Deploy New Agent</h1>
            <p className="text-muted-foreground">Assign a mission to your autonomous marketing employee.</p>
          </div>

          {/* Product Input */}
          <div className="glass-card p-6">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Zap className="w-5 h-5 text-primary" /> 
               Target Asset
             </h3>
             
             <div className="border-2 border-dashed border-white/10 bg-black/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative">
               {preview ? (
                 <div className="relative">
                   <img src={preview} alt="Product" className="h-64 mx-auto object-contain rounded-lg shadow-2xl" />
                   <button onClick={() => {setFile(null); setPreview(null)}} className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/50 p-2 rounded-full text-white transition-colors">
                     ×
                   </button>
                 </div>
               ) : (
                 <>
                   <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                   <p className="text-sm text-foreground font-medium">Drop Product Image</p>
                   <p className="text-xs text-muted-foreground mb-4">The agent will analyze this product.</p>
                   <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                 </>
               )}
             </div>
          </div>

          {/* The Brief */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <MessageSquare className="w-5 h-5 text-primary" /> 
               Mission Brief
             </h3>
             <textarea 
               className="input-glass w-full h-32 resize-none"
               placeholder="e.g., 'Launch a Summer Sale campaign targeting Gen-Z. Make it feel urgent and high-energy.'"
               value={config.brief}
               onChange={(e) => setConfig({...config, brief: e.target.value})}
             />
             <div className="flex gap-2 mt-3">
               {["Summer Sale", "Holiday Gift", "New Drop", "Clearance"].map(tag => (
                 <button key={tag} onClick={() => setConfig({...config, brief: tag})} className="px-3 py-1 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-full text-xs transition-colors">
                   + {tag}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Strategy & Execute */}
        <div className="space-y-6">
          
          {/* Brand DNA Indicator */}
          <div className="glass-card p-4 border-l-4 border-l-primary flex items-start gap-3">
             <BrainCircuit className="w-6 h-6 text-primary shrink-0" />
             <div>
               <h4 className="font-bold text-sm">Brand Memory Active</h4>
               {brandDNA ? (
                 <p className="text-xs text-muted-foreground mt-1">
                   Voice: <span className="text-white">"{brandDNA.voice.substring(0, 30)}..."</span> loaded.
                 </p>
               ) : (
                 <p className="text-xs text-red-400 mt-1">No DNA found. Agent running generic mode.</p>
               )}
             </div>
          </div>

          {/* Channel Selector */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Deliverables</h3>
            <div className="space-y-3">
                {[
                    { id: "instagram_story", label: "IG Story (9:16)", icon: Instagram },
                    { id: "instagram_feed", label: "IG Feed Post (4:5)", icon: Zap }, // Changed from 'viral_reel' to a supported static format for now
                    { id: "instagram_carousel", label: "Carousel Slide (Detail)", icon: MessageSquare },
                ].map((ch) => (
                    <div 
                    key={ch.id} 
                    onClick={() => toggleChannel(ch.id)}
                   className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${config.channels.includes(ch.id) ? "bg-primary/10 border-primary text-white" : "bg-transparent border-white/10 text-muted-foreground hover:bg-white/5"}`}
                 >
                   <ch.icon className={`w-4 h-4 ${config.channels.includes(ch.id) ? "text-primary" : ""}`} />
                   <span className="text-sm font-medium">{ch.label}</span>
                   {config.channels.includes(ch.id) && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                 </div>
               ))}
            </div>
          </div>

          {/* Launch Button */}
          <button 
            onClick={handleDeploy}
            disabled={status !== 'idle'}
            className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-glow-hover"
          >
            {status === 'idle' && <>Authorize Agent <ArrowRight className="w-5 h-5" /></>}
            {status === 'uploading' && <><Loader2 className="w-5 h-5 animate-spin" /> Uploading Asset...</>}
            {status === 'thinking' && <><BrainCircuit className="w-5 h-5 animate-pulse" /> Strategizing...</>}
            {status === 'deployed' && <><CheckCircle2 className="w-5 h-5" /> Mission Active</>}
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
}