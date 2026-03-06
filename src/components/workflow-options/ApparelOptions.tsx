import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflowOptions } from "./WorkflowOptionsContext";

interface ApparelOptionField {
  label: string;
  value: string;
  displayValue: string;
}

const GENDER_OPTIONS: ApparelOptionField[] = [
  { label: "Male", value: "male", displayValue: "Male" },
  { label: "Female", value: "female", displayValue: "Female" },
  { label: "Non-binary", value: "non-binary", displayValue: "Non-binary" },
];

const AGE_RANGE_OPTIONS: ApparelOptionField[] = [
  { label: "18-25", value: "18-25", displayValue: "18-25" },
  { label: "26-35", value: "26-35", displayValue: "26-35" },
  { label: "36-50", value: "36-50", displayValue: "36-50" },
  { label: "50+", value: "50+", displayValue: "50+" },
];

const ETHNICITY_OPTIONS: ApparelOptionField[] = [
  { label: "Caucasian", value: "caucasian", displayValue: "Caucasian" },
  { label: "African", value: "african", displayValue: "African" },
  { label: "Asian", value: "asian", displayValue: "Asian" },
  { label: "Latino", value: "latino", displayValue: "Latino" },
  { label: "Middle Eastern", value: "middle-eastern", displayValue: "Middle Eastern" },
  { label: "Mixed", value: "mixed", displayValue: "Mixed" },
];

const SKIN_TONE_OPTIONS: ApparelOptionField[] = [
  { label: "Fair", value: "fair", displayValue: "Fair" },
  { label: "Medium", value: "medium", displayValue: "Medium" },
  { label: "Tan", value: "tan", displayValue: "Tan" },
  { label: "Deep", value: "deep", displayValue: "Deep" },
];

const HAIR_STYLE_OPTIONS: ApparelOptionField[] = [
  { label: "Short", value: "short", displayValue: "Short" },
  { label: "Medium", value: "medium", displayValue: "Medium" },
  { label: "Long", value: "long", displayValue: "Long" },
  { label: "Curly", value: "curly", displayValue: "Curly" },
  { label: "Straight", value: "straight", displayValue: "Straight" },
  { label: "Braided", value: "braided", displayValue: "Braided" },
];

const HAIR_COLOR_OPTIONS: ApparelOptionField[] = [
  { label: "Black", value: "black", displayValue: "Black" },
  { label: "Brown", value: "brown", displayValue: "Brown" },
  { label: "Blonde", value: "blonde", displayValue: "Blonde" },
  { label: "Red", value: "red", displayValue: "Red" },
  { label: "Grey", value: "grey", displayValue: "Grey" },
  { label: "Platinum", value: "platinum", displayValue: "Platinum" },
];

const POSE_OPTIONS: ApparelOptionField[] = [
  { label: "Standing", value: "standing", displayValue: "Standing" },
  { label: "Sitting", value: "sitting", displayValue: "Sitting" },
  { label: "Walking", value: "walking", displayValue: "Walking" },
  { label: "Dynamic", value: "dynamic", displayValue: "Dynamic" },
];

const BACKGROUND_TYPE_OPTIONS: ApparelOptionField[] = [
  { label: "Studio White", value: "studio-white", displayValue: "Studio White" },
  { label: "Studio Grey", value: "studio-grey", displayValue: "Studio Grey" },
  { label: "Outdoor Urban", value: "outdoor-urban", displayValue: "Outdoor Urban" },
  { label: "Outdoor Nature", value: "outdoor-nature", displayValue: "Outdoor Nature" },
  { label: "Beach", value: "beach", displayValue: "Beach" },
  { label: "Interior", value: "interior", displayValue: "Interior" },
];

const LIGHTING_STYLE_OPTIONS: ApparelOptionField[] = [
  { label: "Soft", value: "soft", displayValue: "Soft" },
  { label: "Dramatic", value: "dramatic", displayValue: "Dramatic" },
  { label: "Natural", value: "natural", displayValue: "Natural" },
  { label: "High Key", value: "high-key", displayValue: "High Key" },
  { label: "Golden Hour", value: "golden-hour", displayValue: "Golden Hour" },
];

const IMAGE_STYLE_OPTIONS: ApparelOptionField[] = [
  { label: "Commercial", value: "commercial", displayValue: "Commercial" },
  { label: "Editorial", value: "editorial", displayValue: "Editorial" },
  { label: "Lifestyle", value: "lifestyle", displayValue: "Lifestyle" },
  { label: "Minimalist", value: "minimalist", displayValue: "Minimalist" },
  { label: "Trendy", value: "trendy", displayValue: "Trendy" },
];

interface SelectFieldProps {
  label: string;
  value: string;
  options: ApparelOptionField[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={label}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.displayValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface RadioFieldProps {
  label: string;
  value: string;
  options: ApparelOptionField[];
  onChange: (value: string) => void;
}

function RadioField({ label, value, options, onChange }: RadioFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <RadioGroupItem value={opt.value} id={`${label}-${opt.value}`} />
            <Label htmlFor={`${label}-${opt.value}`}>{opt.displayValue}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export function ApparelOptions() {
  const { apparel, updateApparel } = useWorkflowOptions();

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-sm">Model & Appearance</h4>
      <div className="grid grid-cols-2 gap-4">
        <RadioField
          label="Gender"
          value={apparel.modelGender}
          options={GENDER_OPTIONS}
          onChange={(value) => updateApparel({ modelGender: value as any })}
        />
        <SelectField
          label="Age Range"
          value={apparel.ageRange}
          options={AGE_RANGE_OPTIONS}
          onChange={(value) => updateApparel({ ageRange: value as any })}
        />
        <SelectField
          label="Ethnicity"
          value={apparel.ethnicity}
          options={ETHNICITY_OPTIONS}
          onChange={(value) => updateApparel({ ethnicity: value as any })}
        />
        <SelectField
          label="Skin Tone"
          value={apparel.skinTone}
          options={SKIN_TONE_OPTIONS}
          onChange={(value) => updateApparel({ skinTone: value as any })}
        />
        <SelectField
          label="Hair Style"
          value={apparel.hairStyle}
          options={HAIR_STYLE_OPTIONS}
          onChange={(value) => updateApparel({ hairStyle: value as any })}
        />
        <SelectField
          label="Hair Color"
          value={apparel.hairColor}
          options={HAIR_COLOR_OPTIONS}
          onChange={(value) => updateApparel({ hairColor: value as any })}
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Scene & Style</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Pose/Action"
            value={apparel.pose}
            options={POSE_OPTIONS}
            onChange={(value) => updateApparel({ pose: value as any })}
          />
          <SelectField
            label="Background"
            value={apparel.backgroundType}
            options={BACKGROUND_TYPE_OPTIONS}
            onChange={(value) => updateApparel({ backgroundType: value as any })}
          />
          <SelectField
            label="Lighting"
            value={apparel.lightingStyle}
            options={LIGHTING_STYLE_OPTIONS}
            onChange={(value) => updateApparel({ lightingStyle: value as any })}
          />
          <SelectField
            label="Image Style"
            value={apparel.imageStyle}
            options={IMAGE_STYLE_OPTIONS}
            onChange={(value) => updateApparel({ imageStyle: value as any })}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="space-y-1">
          <Label htmlFor="apparel-custom-prompt">Custom Prompt (optional)</Label>
          <Textarea
            id="apparel-custom-prompt"
            placeholder="Add any additional details or specific requirements..."
            value={apparel.customPrompt || ""}
            onChange={(e) => updateApparel({ customPrompt: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
