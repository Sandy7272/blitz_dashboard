import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Palette, Settings, Wand2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { WizardStepper, WizardStep } from "./WizardStepper";
import { UploadStep } from "./UploadStep";
import { TemplateStep } from "./TemplateStep";
import { OptionsStep, GenerationOptions } from "./OptionsStep";
import { GeneratingStep } from "./GeneratingStep";
import { ResultStep } from "./ResultStep";
import { api } from "@/lib/api";

interface CreationWizardProps {
  workflowType: "apparel" | "food";
  backendMode: string;
}

const wizardSteps: WizardStep[] = [
  { id: 1, title: "Upload", description: "Add your image", icon: Upload },
  { id: 2, title: "Style", description: "Choose preset", icon: Palette },
  { id: 3, title: "Options", description: "Customize AI", icon: Settings },
  { id: 4, title: "Generate", description: "Create magic", icon: Wand2 },
  { id: 5, title: "Result", description: "Download", icon: ImageIcon },
];

const defaultOptions: GenerationOptions = {
  quality: 2,
  variations: 1,
  enhanceDetails: true,
  removeBackground: false,
  upscale: false,
};

export function CreationWizard({ workflowType, backendMode }: CreationWizardProps) {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Upload
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Step 2: Template
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Step 3: Options
  const [options, setOptions] = useState<GenerationOptions>(defaultOptions);
  
  // Step 4: Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<"uploading" | "processing" | "rendering" | "completed" | "failed">("uploading");
  
  // Step 5: Results
  const [results, setResults] = useState<string[]>([]);

  const handleFileChange = useCallback((newFile: File | null, newPreview: string | null) => {
    setFile(newFile);
    setPreview(newPreview);
  }, []);

  const pollStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getJobStatus(jobId);
        
        if (data.status === "processing_magic" || data.status === "processing") {
          setProgress((prev) => Math.min(prev + 5, 85));
          setGenerationStatus("processing");
        }

        if (data.status === "completed") {
          clearInterval(interval);
          setProgress(100);
          setGenerationStatus("completed");
          
          if (data.result_urls && data.result_urls.length > 0) {
            setResults(data.result_urls);
          } else if (data.result_url) {
            setResults([data.result_url]);
          }
          
          // Move to result step after a brief delay
          setTimeout(() => {
            setCurrentStep(5);
            setIsGenerating(false);
          }, 1000);
          
          toast.success("Your image is ready!");
        } else if (data.status === "failed") {
          clearInterval(interval);
          setIsGenerating(false);
          setGenerationStatus("failed");
          toast.error("Generation failed. Please try again.");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);
  };

  const handleGenerate = async () => {
    if (!file) return;
    
    setCurrentStep(4);
    setIsGenerating(true);
    setProgress(5);
    setGenerationStatus("uploading");
    setResults([]);

    try {
      // Create job
      const jobData = await api.createPhotoJob([file.type]);
      const jobId = jobData.jobId;
      setProgress(15);
      
      // Upload to S3
      const uploadUrl = jobData.uploadUrls[0].url;
      await api.uploadToS3(uploadUrl, file);
      setProgress(40);
      setGenerationStatus("processing");
      
      // Start processing with options
      await api.startProcessing(jobId, backendMode, {
        template: selectedTemplate,
        quality: options.quality,
        variations: options.variations,
        enhanceDetails: options.enhanceDetails,
        removeBackground: options.removeBackground,
        upscale: options.upscale,
      });
      
      setProgress(50);
      pollStatus(jobId);

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setGenerationStatus("failed");
      toast.error("Generation failed. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsGenerating(false);
    setProgress(0);
    setCurrentStep(3);
  };

  const handleRegenerate = () => {
    setResults([]);
    setProgress(0);
    handleGenerate();
  };

  const handleStartNew = () => {
    setCurrentStep(1);
    setFile(null);
    setPreview(null);
    setSelectedTemplate(null);
    setOptions(defaultOptions);
    setResults([]);
    setProgress(0);
    setIsGenerating(false);
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper - hide during generation/result */}
      {currentStep < 4 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 glass-card"
        >
          <WizardStepper
            steps={wizardSteps.slice(0, 3)}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </motion.div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <UploadStep
            key="upload"
            file={file}
            preview={preview}
            onFileChange={handleFileChange}
            onNext={() => setCurrentStep(2)}
            accepts="image/*"
            hint={workflowType === "food" ? "Drop your food photo here" : "Drop your product photo here"}
          />
        )}

        {currentStep === 2 && (
          <TemplateStep
            key="template"
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <OptionsStep
            key="options"
            options={options}
            onChange={setOptions}
            onNext={handleGenerate}
            onBack={() => setCurrentStep(2)}
            credits={100}
          />
        )}

        {currentStep === 4 && (
          <div key="generating" className="glass-card p-8">
            <GeneratingStep
              progress={progress}
              status={generationStatus}
              onCancel={handleCancel}
            />
          </div>
        )}

        {currentStep === 5 && results.length > 0 && (
          <div key="result" className="glass-card p-8">
            <ResultStep
              results={results}
              originalPreview={preview}
              onRegenerate={handleRegenerate}
              onStartNew={handleStartNew}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
