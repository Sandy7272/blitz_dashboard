import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Upload, Save, Type, Palette, Mic, Globe, Instagram, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth0 } from "@auth0/auth0-react"; // Assuming Auth0 is used

export default function BrandDNA() {
  const [colors, setColors] = useState({ primary: "#2dffa7", secondary: "#0F0F0F" });
  const [voice, setVoice] = useState("Minimalist, confident, and Gen-Z friendly.");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { user } = useAuth0(); // Get logged in user

  // REPLACE useEffect for loading
  useEffect(() => {
    if (!user?.sub) return;
    
    const loadDNA = async () => {
      try {
        const data = await api.getBrandDNA(user.sub);
        if (data) {
          if (data.colors) setColors(data.colors);
          if (data.voice) setVoice(data.voice);
          if (data.website) setWebsite(data.website);
          if (data.instagram) setInstagram(data.instagram);
        }
      } catch (e) {
        console.log("No existing DNA found, starting fresh.");
      }
    };
    loadDNA();
  }, [user]);
  
  // REPLACE handleSave
  const handleSave = async () => {
    if (!user?.sub) return toast.error("Please log in to save.");
    
    try {
      await api.saveBrandDNA(user.sub, { 
        colors, 
        voice, 
        website, 
        instagram 
      });
      toast.success("Brand DNA saved to cloud.");
    } catch (e) {
      toast.error("Failed to save.");
    }
  };

  const handleAnalyze = async () => {
    if (!website) {
      toast.error("Please enter a Website URL to analyze.");
      return;
    }

    try {
      setIsAnalyzing(true);
      toast.info("Scanning website and analyzing tone...");
      
      const dna = await api.analyzeBrand(website);
      
      setVoice(dna.voice);
      
      // Handle colors - could be array or object from backend
      if (Array.isArray(dna.colors)) {
        setColors({
          primary: dna.colors[0] || "#2dffa7",
          secondary: dna.colors[1] || "#0F0F0F"
        });
      } else if (dna.colors && typeof dna.colors === 'object') {
        setColors(dna.colors);
      }
      
      toast.success("Brand DNA extracted from website!");
      
      // We can also append the Instagram style to the voice context implicitly
      if (dna.instagram_style) {
        setVoice(prev => `${dna.voice}\n\nVisual Style: ${dna.instagram_style}`);
      }

    } catch (e) {
      toast.error("Failed to analyze brand. Website might be blocking bots.");
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Brand DNA</h1>
          <p className="text-muted-foreground">Connect your channels to train the Agent's brain.</p>
        </div>

        {/* CONNECT CHANNELS */}
        <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Connected Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="https://yourbrand.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="@yourbrand"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isAnalyzing ? "Scanning & Analyzing..." : "Auto-Calibrate from Website"}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual Identity */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Visual Identity</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Logo</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-black/20">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Drop logo here</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Primary</label>
                  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg border border-white/10">
                    <input type="color" value={colors.primary} onChange={(e) => setColors({...colors, primary: e.target.value})} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
                    <span className="text-sm font-mono">{colors.primary}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Secondary</label>
                  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg border border-white/10">
                    <input type="color" value={colors.secondary} onChange={(e) => setColors({...colors, secondary: e.target.value})} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
                    <span className="text-sm font-mono">{colors.secondary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice & Context */}
          <div className="glass-card p-6 space-y-6">
             <div className="flex items-center gap-3 mb-4">
              <Mic className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Voice & Tone</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Brand Persona</label>
                <textarea 
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="input-glass w-full h-48 resize-none leading-relaxed"
                  placeholder="Describe how your brand speaks..."
                />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save Brand DNA
        </button>
      </div>
    </DashboardLayout>
  );
}