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
  ArrowLeftRight
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

const workflowTypes = {
  apparel: {
    title: "Apparel Photography",
    description: "Upload your product image to generate professional studio shots",
    credits: 5,
    accepts: "image/*",
  },
  food: {
    title: "Food Photography",
    description: "Transform your food photos into mouth-watering visuals",
    credits: 5,
    accepts: "image/*",
  },
  audit: {
    title: "Site Doctor",
    description: "Enter a URL to audit your website's UX and performance",
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
  const [result, setResult] = useState<string | null>(null);
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

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setResult(preview); // In real app, this would be the generated image
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
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
    setShowComparison(false);
  };

  const isAudit = type === "audit";
  const canGenerate = isAudit ? url.trim().length > 0 : !!file;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {workflow.title}
          </h1>
          <p className="text-muted-foreground">{workflow.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Upload Zone / URL Input */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {isAudit ? "Website URL" : "Upload Image"}
              </h3>

              {isAudit ? (
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="input-glass pl-12"
                  />
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`upload-zone ${isDragging ? "active" : ""}`}
                >
                  {preview ? (
                    <div className="relative w-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-xl object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-foreground font-medium mb-1">
                        Drop your image here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse
                      </p>
                      <input
                        type="file"
                        accept={workflow.accepts || ""}
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Generation Controls */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Generate</h3>
                  <p className="text-sm text-muted-foreground">
                    Cost: <span className="text-primary font-medium">{workflow.credits} credits</span>
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating... {Math.round(progress)}%
                      </span>
                      <button
                        onClick={handleCancel}
                        className="btn-ghost text-destructive"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="generate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <Wand2 className="w-5 h-5" />
                    Generate
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Panel - Canvas/Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Result</h3>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`btn-ghost text-sm ${showComparison ? "text-primary" : ""}`}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost text-sm">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={handleReset} className="btn-ghost text-sm">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative aspect-square rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
              {result ? (
                <AnimatePresence>
                  <motion.img
                    key={showComparison ? "original" : "result"}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    src={result}
                    alt="Result"
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Your generated result will appear here</p>
                </div>
              )}
            </div>

            {showComparison && preview && result && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Showing: Original Image
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
