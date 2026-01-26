import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, CheckCircle2, FileImage } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Upload Your Image
        </h2>
        <p className="text-muted-foreground">
          Start by uploading a product photo. We'll transform it into professional quality.
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative min-h-[320px] flex flex-col items-center justify-center",
          "rounded-2xl border-2 border-dashed transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5"
            : preview
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50",
          "cursor-pointer"
        )}
      >
        <input
          type="file"
          accept={accepts}
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative p-4 w-full"
            >
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-xl object-contain shadow-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Success indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                {file?.name}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Upload className={cn(
                  "w-10 h-10 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">{hint}</p>
              <p className="text-muted-foreground text-sm mb-4">{subHint}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <FileImage className="w-4 h-4" />
                <span>or click anywhere to browse</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <button
          onClick={onNext}
          disabled={!preview}
          className={cn(
            "btn-primary px-8 py-4 text-base flex items-center gap-2",
            !preview && "opacity-50 cursor-not-allowed"
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
