import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Upload, 
  Zap, 
  BrainCircuit, 
  Instagram, 
  Linkedin,
  Twitter,
  CheckCircle2, 
  Loader2,
  ArrowRight,
  MessageSquare,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// Types for our Mission Config
interface MissionConfig {
  brief: string;
  vibe: string;
  channels: string[];
}

export default function DeployAgent() {
  const navigate = useNavigate();
  const { user } = useAuth0(); // 2. Get User
  
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
  const [activeJobId, setActiveJobId] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  // 3. FETCH DNA FROM API (Replaces localStorage)
  useEffect(() => {
    if (!user?.sub) return;

    const loadDNA = async () => {
      try {
        const dna = await api.getBrandDNA(user.sub);
        // Only set if we actually got data back
        if (dna && (dna.voice || dna.colors)) {
           setBrandDNA(dna);
        }
      } catch (e) {
        console.log("No cloud DNA found, using defaults.");
      }
    };
    loadDNA();
  }, [user]);

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
      
      // 4. CREATE JOB WITH USER ID
      // Ensure your api.ts createPhotoJob accepts userId as 2nd arg
      const jobData = await api.createPhotoJob([file.type], user?.sub);
      const { jobId, uploadUrls } = jobData;
      
      // 5. Upload to S3
      await api.uploadToS3(uploadUrls[0].url, file);
      
      setStatus("thinking");

      // AUTO-CONFIGURE: We now force all formats
      const allChannels = ["instagram_story", "instagram_feed", "instagram_carousel"];
      
      // 6. Start Agent (Passing Brand DNA + Brief)
      await api.startProcessing(jobId, "custom_campaign", {
        ...config,
        brand_voice: brandDNA?.voice || "Professional",
        brand_colors: brandDNA?.colors || {},
        deliverables: allChannels, // Force all
        whatsapp_user_id: user?.sub // Pass sub for tracking in backend details
      });

      // 7. REMOVED LOCAL STORAGE LOGIC
      // The backend now owns the "Active Mission" state in the DB.

      setStatus("deployed");
      setActiveJobId(jobId);
      toast.success("Agent deployed! Monitor progress in Mission Control.");
      
      // Redirect to Mission Control
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
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Deploy Campaign Agent</h1>
            <p className="text-muted-foreground">One brief. Multi-platform execution.</p>
          </div>

          <div className="glass-card p-6">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Zap className="w-5 h-5 text-primary" /> Target Product
             </h3>
             <div className="border-2 border-dashed border-white/10 bg-black/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative group">
               {preview ? (
                 <div className="relative">
                   <img src={preview} alt="Product" className="h-64 mx-auto object-contain rounded-lg shadow-2xl" />
                   <button onClick={() => {setFile(null); setPreview(null)}} className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/50 p-2 rounded-full text-white">×</button>
                 </div>
               ) : (
                 <>
                   <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                   <p className="text-sm font-medium">Drop Product Image</p>
                   <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                 </>
               )}
             </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <MessageSquare className="w-5 h-5 text-primary" /> Mission Brief
             </h3>
             <textarea 
               className="input-glass w-full h-32 resize-none text-lg"
               placeholder="e.g., 'Launch our new Summer Collection. Make it feel urgent, high-energy, and Gen-Z focused.'"
               value={config.brief}
               onChange={(e) => setConfig({...config, brief: e.target.value})}
             />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          <div className="glass-card p-4 border-l-4 border-l-primary flex items-start gap-3">
             <BrainCircuit className="w-6 h-6 text-primary shrink-0" />
             <div>
               <h4 className="font-bold text-sm">Brand Memory Active</h4>
               {brandDNA ? (
                 <p className="text-xs text-muted-foreground mt-1">Voice: <span className="text-white">"{brandDNA.voice.substring(0, 30)}..."</span></p>
               ) : (
                 <p className="text-xs text-red-400 mt-1">No DNA found. Using generic.</p>
               )}
             </div>
          </div>

          {/* DELIVERABLES INFO CARD (Static now) */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Package Includes
            </h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                   <Instagram className="w-4 h-4 text-pink-500" />
                   <span className="text-sm font-medium">Instagram Kit</span>
                   <span className="text-xs text-muted-foreground ml-auto">Story, Feed, Reel</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                   <Twitter className="w-4 h-4 text-blue-400" />
                   <span className="text-sm font-medium">X / Twitter</span>
                   <span className="text-xs text-muted-foreground ml-auto">Thread & Copy</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                   <Linkedin className="w-4 h-4 text-blue-600" />
                   <span className="text-sm font-medium">LinkedIn</span>
                   <span className="text-xs text-muted-foreground ml-auto">Professional Post</span>
                </div>
            </div>
          </div>

          <button 
            onClick={handleDeploy}
            disabled={status !== 'idle'}
            className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-glow-hover"
          >
            {status === 'idle' && <>Deploy Agent <ArrowRight className="w-5 h-5" /></>}
            {status === 'uploading' && <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>}
            {status === 'thinking' && <><BrainCircuit className="w-5 h-5 animate-pulse" /> Strategizing...</>}
            {status === 'deployed' && <><CheckCircle2 className="w-5 h-5" /> Active</>}
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
}