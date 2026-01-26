import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info, Sparkles, Layers, Wand2, Maximize, Palette } from "lucide-react";
import { FeatureTooltip } from "@/components/onboarding/FeatureTooltip";
import { cn } from "@/lib/utils";

export interface GenerationOptions {
  quality: number;
  variations: number;
  enhanceDetails: boolean;
  removeBackground: boolean;
  upscale: boolean;
}

interface OptionsStepProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
  onNext: () => void;
  onBack: () => void;
  credits: number;
}

export function OptionsStep({
  options,
  onChange,
  onNext,
  onBack,
  credits,
}: OptionsStepProps) {
  const estimatedCredits = calculateCredits(options);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Customize AI Options
        </h2>
        <p className="text-muted-foreground">
          Fine-tune your generation settings for the perfect result.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Quality Slider */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">Output Quality</Label>
              <FeatureTooltip content="Higher quality produces sharper details but takes longer">
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </FeatureTooltip>
            </div>
            <span className="text-sm font-medium text-primary">
              {options.quality === 1 ? "Standard" : options.quality === 2 ? "High" : "Ultra"}
            </span>
          </div>
          <Slider
            value={[options.quality]}
            onValueChange={([value]) => onChange({ ...options, quality: value })}
            min={1}
            max={3}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Standard</span>
            <span>High</span>
            <span>Ultra</span>
          </div>
        </div>

        {/* Variations */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">Number of Variations</Label>
              <FeatureTooltip content="Generate multiple versions to choose from">
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </FeatureTooltip>
            </div>
            <span className="text-sm font-medium text-primary">{options.variations}</span>
          </div>
          <Slider
            value={[options.variations]}
            onValueChange={([value]) => onChange({ ...options, variations: value })}
            min={1}
            max={4}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="glass-card p-6 space-y-6">
          <OptionToggle
            icon={Wand2}
            label="Enhance Details"
            description="AI-powered sharpening and detail enhancement"
            checked={options.enhanceDetails}
            onChange={(checked) => onChange({ ...options, enhanceDetails: checked })}
          />

          <OptionToggle
            icon={Palette}
            label="Remove Background"
            description="Automatically remove and replace background"
            checked={options.removeBackground}
            onChange={(checked) => onChange({ ...options, removeBackground: checked })}
          />

          <OptionToggle
            icon={Maximize}
            label="Upscale to 4K"
            description="Increase resolution for print-ready quality"
            checked={options.upscale}
            onChange={(checked) => onChange({ ...options, upscale: checked })}
          />
        </div>

        {/* Credits estimate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Estimated Cost</p>
              <p className="text-xs text-muted-foreground">Based on your selected options</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{estimatedCredits}</p>
            <p className="text-xs text-muted-foreground">credits</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between pt-4"
      >
        <button onClick={onBack} className="btn-ghost px-6 py-3">
          ← Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary px-8 py-4 text-base flex items-center gap-2"
        >
          <Wand2 className="w-5 h-5" />
          Generate Now
        </button>
      </motion.div>
    </motion.div>
  );
}

interface OptionToggleProps {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function OptionToggle({ icon: Icon, label, description, checked, onChange }: OptionToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          checked ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <Label className="text-sm font-semibold cursor-pointer">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function calculateCredits(options: GenerationOptions): number {
  let base = 5;
  base += (options.quality - 1) * 2;
  base += (options.variations - 1) * 3;
  if (options.enhanceDetails) base += 2;
  if (options.removeBackground) base += 3;
  if (options.upscale) base += 5;
  return base;
}
