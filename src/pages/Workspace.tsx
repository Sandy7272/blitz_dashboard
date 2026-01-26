import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Link as LinkIcon, 
  Wand2, 
  Download, 
  RefreshCw,
  X,
  Image as ImageIcon,
  Loader2,
  ArrowLeftRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { HintTooltip } from "@/components/onboarding/HintTooltip";
import { FeatureTooltip } from "@/components/onboarding/FeatureTooltip";
import { api } from "@/lib/api"; // Ensure this import exists
import { toast } from "sonner";

const workflowTypes = {
  apparel: {
    backendMode: "model_shoot",
    title: "Apparel Photography",
    subtitle: "Professional Product Images",
    description: "Upload any clothing or accessory photo. Get back a polished, studio-quality image ready for your store.",
    uploadHint: "Drop your product photo here",
    uploadSubHint: "JPG, PNG, or WebP • Max 10MB",
    emptyResultText: "Your enhanced product image will appear here",
    processingText: "Enhancing your image...",
    credits: 5,
    accepts: "image/*",
  },
  food: {
    backendMode: "food_photography",
    title: "Food Photography",
    subtitle: "Mouth-Watering Visuals",
    description: "Upload a dish photo and watch it transform into an appetizing, professional food image.",
    uploadHint: "Drop your food photo here",
    uploadSubHint: "JPG, PNG, or WebP • Max 10MB",
    emptyResultText: "Your enhanced food image will appear here",
    processingText: "Making your dish look delicious...",
    credits: 5,
    accepts: "image/*",
  },
  audit: {
    backendMode: "audit",
    title: "Site Doctor",
    subtitle: "Website Health Check",
    description: "Enter your website URL to receive a comprehensive audit with clear, actionable improvements.",
    uploadHint: "",
    uploadSubHint: "",
    emptyResultText: "Your audit report will appear here",
    processingText: "Analyzing your website...",
    credits: 10,
    accepts: null,
  },
};

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as keyof typeof workflowTypes) || "apparel";
  const workflow = workflowTypes[type];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Updated State for Multiple Results
  const [results, setResults] = useState<string[]>([]); 
  const [result, setResult] = useState<string | null>(null); // The currently selected image
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const pollStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getJobStatus(id);
        
        if (data.status === "processing_magic" || data.status === "processing") {
           setProgress((prev) => Math.min(prev + 5, 90));
        }

        if (data.status === "completed") {
          clearInterval(interval);
          setIsGenerating(false);
          setProgress(100);
          
          if (data.result_urls && data.result_urls.length > 0) {
            setResults(data.result_urls);
            setResult(data.result_urls[0]); // Select first image by default
          } else if (data.result_url) {
            setResults([data.result_url]);
            setResult(data.result_url);
          }
          
          toast.success("Generation complete!");
        } else if (data.status === "failed") {
          clearInterval(interval);
          setIsGenerating(false);
          toast.error("Server reported a failure.");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(5);
    setResults([]);
    setResult(null);

    try {
      let jobId = "";
      if (type === 'audit') {
        const data = await api.createAuditJob(url);
        jobId = data.jobId;
        setProgress(20);
      } else if (file) {
        const jobData = await api.createPhotoJob([file.type]);
        jobId = jobData.jobId;
        const uploadUrl = jobData.uploadUrls[0].url;
        setProgress(15);
        await api.uploadToS3(uploadUrl, file);
        setProgress(40);
        await api.startProcessing(jobId, workflow.backendMode, {});
      }

      setActiveJobId(jobId);
      pollStatus(jobId);

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      toast.error("Generation failed. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsGenerating(false);
    setProgress(0);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUrl("");
    setResult(null);
    setResults([]);
    setShowComparison(false);
  };

  const isAudit = type === "audit";
  const canGenerate = isAudit ? url.trim().length > 0 : !!file;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-sm text-primary font-medium mb-1">{workflow.subtitle}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{workflow.title}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{workflow.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <HintTooltip id="workspace-upload-hint" hint="Start here! Upload any product image." position="right" delay={1000}>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{isAudit ? "Enter Website URL" : "Step 1: Upload Your Image"}</h3>
                  <FeatureTooltip content="Supported formats: JPG, PNG. Max 10MB" side="top">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </FeatureTooltip>
                </div>
                
                {isAudit ? (
                  <div className="space-y-2 mt-4">
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourwebsite.com" className="input-glass pl-12" />
                    </div>
                  </div>
                ) : (
                  <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`upload-zone mt-4 ${isDragging ? "active" : ""}`}>
                    {preview ? (
                      <div className="relative w-full">
                        <img src={preview} alt="Upload" className="max-h-64 mx-auto rounded-xl object-contain" />
                        <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-foreground font-medium mb-1">{workflow.uploadHint}</p>
                        <p className="text-xs text-muted-foreground">{workflow.uploadSubHint}</p>
                        <input type="file" accept={workflow.accepts || ""} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </HintTooltip>

            {/* Generate Button */}
            <div className="glass-card p-6">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
                      <motion.div className="absolute inset-y-0 left-0 bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {workflow.processingText} {Math.round(progress)}%</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button onClick={handleGenerate} disabled={!canGenerate} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50">
                      <Wand2 className="w-5 h-5" /> {canGenerate ? "Generate Enhanced Image" : "Upload first"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Panel - Result Gallery */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{result ? "Your Results" : "Step 3: Download"}</h3>
              {result && (
                <div className="flex gap-2">
                   <button onClick={() => setShowComparison(!showComparison)} className={`btn-ghost text-sm ${showComparison ? "text-primary" : ""}`} title="Compare Original">
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  <a href={result} download className="btn-primary text-sm flex items-center gap-1 py-2 px-3" target="_blank" rel="noreferrer">
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              )}
            </div>

            {/* Main Canvas */}
            <div className="relative flex-grow min-h-[300px] bg-secondary/30 rounded-xl flex items-center justify-center overflow-hidden border border-border/50">
              {result ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={showComparison ? "original" : result}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    src={showComparison ? preview! : result}
                    alt="Result"
                    className="w-full h-full object-contain"
                  />
                  {showComparison && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
                      Original
                    </div>
                  )}
                </AnimatePresence>
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
                  <p>{workflow.emptyResultText}</p>
                </div>
              )}
            </div>

            {/* Thumbnails Strip */}
            {results.length > 1 && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Select Variation:</p>
                <div className="grid grid-cols-4 gap-3">
                  {results.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setResult(url); setShowComparison(false); }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        result === url ? "border-primary shadow-glow-subtle" : "border-transparent hover:border-white/20"
                      }`}
                    >
                      <img src={url} alt={`Var ${idx}`} className="w-full h-full object-cover" />
                      {result === url && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}