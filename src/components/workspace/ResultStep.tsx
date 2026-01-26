import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  ArrowLeftRight, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Heart,
  ZoomIn,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ResultStepProps {
  results: string[];
  originalPreview: string | null;
  onRegenerate: () => void;
  onStartNew: () => void;
}

export function ResultStep({
  results,
  originalPreview,
  onRegenerate,
  onStartNew,
}: ResultStepProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const selectedResult = results[selectedIndex];

  const handleDownload = async () => {
    if (!selectedResult) return;
    
    try {
      const response = await fetch(selectedResult);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blitz-enhanced-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Download failed. Please try again.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(selectedResult);
    toast.success("Image URL copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Success header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Generation Complete
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Your Results Are Ready
        </h2>
        <p className="text-muted-foreground">
          {results.length > 1
            ? `We generated ${results.length} variations. Select your favorite!`
            : "Here's your enhanced image. Download or share it."}
        </p>
      </motion.div>

      {/* Main preview */}
      <div className="relative">
        <motion.div
          className={cn(
            "relative rounded-2xl overflow-hidden bg-secondary/30 border border-border",
            isZoomed && "fixed inset-4 z-50 bg-background"
          )}
          layoutId="result-preview"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={showComparison ? "original" : selectedResult}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              src={showComparison ? originalPreview! : selectedResult}
              alt={showComparison ? "Original" : "Enhanced result"}
              className={cn(
                "w-full object-contain",
                isZoomed ? "max-h-[calc(100vh-8rem)]" : "max-h-[500px]"
              )}
            />
          </AnimatePresence>

          {/* Comparison label */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-sm"
            >
              Original Image
            </motion.div>
          )}

          {/* Image controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={cn(
                "p-2 rounded-lg backdrop-blur-sm transition-colors",
                showComparison
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/50 text-white hover:bg-black/70"
              )}
              title="Compare with original"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
              title="Zoom"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Zoom overlay close */}
        {isZoomed && (
          <div
            className="fixed inset-0 bg-black/80 -z-10"
            onClick={() => setIsZoomed(false)}
          />
        )}
      </div>

      {/* Variations selector */}
      {results.length > 1 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Select Variation:
          </p>
          <div className="grid grid-cols-4 gap-3">
            {results.map((url, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedIndex(idx);
                  setShowComparison(false);
                }}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                  selectedIndex === idx
                    ? "border-primary shadow-[0_0_20px_hsl(155_100%_59%_/_0.3)]"
                    : "border-transparent hover:border-white/20"
                )}
              >
                <img
                  src={url}
                  alt={`Variation ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {selectedIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-primary drop-shadow-lg" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="btn-primary flex-1 py-4 text-base flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Image
        </button>
        
        <button
          onClick={handleCopyLink}
          className="btn-secondary flex-1 py-4 text-base flex items-center justify-center gap-2"
        >
          <Copy className="w-5 h-5" />
          Copy Link
        </button>
      </div>

      {/* Secondary actions */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border">
        <button
          onClick={onRegenerate}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
        <button
          onClick={onStartNew}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <ImageIcon className="w-4 h-4" />
          Start New Project
        </button>
      </div>
    </motion.div>
  );
}
