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
        {/* Header with improved copy */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm text-primary font-medium mb-1">{workflow.subtitle}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {workflow.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">{workflow.description}</p>
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
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {isAudit ? "Enter Website URL" : "Step 1: Upload Your Image"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isAudit 
                  ? "Paste the full URL of the website you want to audit" 
                  : "We'll enhance it automatically using AI"
                }
              </p>

              {isAudit ? (
                <div className="space-y-2">
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="input-glass pl-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: https://mystore.com or https://myblog.com/products
                  </p>
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
                        alt="Your uploaded image"
                        className="max-h-64 mx-auto rounded-xl object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-primary mt-3 text-center">
                        ✓ Image ready. Click Generate below to enhance.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-foreground font-medium mb-1">
                        {workflow.uploadHint}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        or click to browse your files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workflow.uploadSubHint}
                      </p>
                      <input
                        type="file"
                        accept={workflow.accepts || ""}
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Upload image file"
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Generation Controls */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Step 2: Generate</h3>
                  <p className="text-sm text-muted-foreground">
                    This will use <span className="text-primary font-medium">{workflow.credits} credits</span>
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
                    <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
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
                        {workflow.processingText} {Math.round(progress)}%
                      </span>
                      <button
                        onClick={handleCancel}
                        className="btn-ghost text-destructive text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Usually takes 5-15 seconds. Please don't close this page.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="generate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none py-4 text-base"
                    >
                      <Wand2 className="w-5 h-5" />
                      {canGenerate ? "Generate Enhanced Image" : "Upload an image first"}
                    </button>
                    {!canGenerate && (
                      <p className="text-xs text-muted-foreground text-center">
                        {isAudit ? "Enter a URL above to start the audit" : "Upload an image above to enable generation"}
                      </p>
                    )}
                  </motion.div>
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
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {result ? "Your Enhanced Image" : "Step 3: Download Result"}
                </h3>
                {result && (
                  <p className="text-sm text-primary">✓ Ready to download</p>
                )}
              </div>
              {result && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`btn-ghost text-sm flex items-center gap-1 ${showComparison ? "text-primary" : ""}`}
                    title="Compare with original"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </button>
                  <button 
                    className="btn-primary text-sm flex items-center gap-1 py-2 px-3"
                    title="Download enhanced image"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button 
                    onClick={handleReset} 
                    className="btn-ghost text-sm"
                    title="Start over with a new image"
                  >
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
                    alt="Your enhanced product image"
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>
              ) : (
                <div className="text-center text-muted-foreground p-6">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
                  <p className="font-medium text-foreground mb-1">{workflow.emptyResultText}</p>
                  <p className="text-sm">Upload an image and click Generate to get started</p>
                </div>
              )}
            </div>

            {showComparison && preview && result && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground">
                  <ArrowLeftRight className="w-3 h-3" />
                  Viewing: Original Image
                </span>
              </div>
            )}

            {result && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Happy with the result?</span> Download it now or generate a new version.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

