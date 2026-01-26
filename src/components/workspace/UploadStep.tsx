import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadStepProps {
  file: File | null;
  preview: string | null;
  onFileChange: (file: File | null, preview: string | null) => void;
  onNext: () => void;
  accepts?: string;
  hint?: string;
  subHint?: string;
}

export function UploadStep({
  file,
  preview,
  onFileChange,
  onNext,
  accepts = "image/*",
  hint = "Drop your image here",
  subHint = "JPG, PNG, or WebP • Max 10MB",
}: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type.startsWith("image/")) {
        onFileChange(droppedFile, URL.createObjectURL(droppedFile));
      }
    },
    [onFileChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile, URL.createObjectURL(selectedFile));
    }
  };

  const handleRemove = () => {
    onFileChange(null, null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col"
    >
      {/* 1. Header: visible, flex-none so it doesn't shrink */}
      <div className="text-center mb-4 flex-none">
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
          Upload Your Image
        </h2>
        <p className="text-sm text-muted-foreground">
          Start by uploading a product photo.
        </p>
      </div>

      {/* 2. Main Canvas Area: flex-1 ensures it takes available space but DOES NOT overflow */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full relative">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            "relative transition-all duration-300 ease-in-out",
            "flex flex-col items-center justify-center",
            // Layout Logic:
            // - w-full max-w-4xl: Wide enough
            // - aspect-video: Keeps it rectangular (like a studio canvas)
            // - max-h-full: PREVENTS SCROLLBAR (shrinks if screen is short)
            "w-full max-w-4xl aspect-video max-h-full",
            "border-2 border-dashed rounded-xl",
            isDragging
              ? "border-primary bg-primary/10"
              : preview
              ? "border-white/10 bg-black/40"
              : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/40",
            "cursor-pointer overflow-hidden"
          )}
        >
          <input
            type="file"
            accept={accepts}
            onChange={handleFileSelect}
            className={cn(
              "absolute inset-0 opacity-0 z-10",
              preview ? "hidden" : "cursor-pointer"
            )}
          />

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full h-full flex items-center justify-center p-4"
              >
                {/* Image constrained to fit inside the canvas box */}
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded-md shadow-lg"
                />

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors z-20 backdrop-blur-md border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Filename Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-primary text-xs font-medium backdrop-blur-md"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{file?.name}</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Upload className="w-8 h-8 text-primary/80" />
                </div>
                <p className="text-foreground font-semibold text-lg mb-1">
                  {hint}
                </p>
                <p className="text-muted-foreground text-sm mb-4">{subHint}</p>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground hover:bg-white/10 transition-colors">
                  <FileImage className="w-3 h-3" />
                  <span>Click to browse</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Footer Button: flex-none, CENTERED */}
      <motion.div
        className="flex justify-center flex-none pt-4 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={onNext}
          disabled={!preview}
          className={cn(
            "btn-primary px-8 py-3 text-base flex items-center gap-2 rounded-full shadow-lg hover:scale-105 transition-all",
            !preview && "opacity-50 cursor-not-allowed grayscale"
          )}
        >
          Continue to Style Selection
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </button>
      </motion.div>
    </motion.div>
  );
}