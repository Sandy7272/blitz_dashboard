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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflowOptions } from "./WorkflowOptionsContext";

interface OptionField {
  label: string;
  value: string;
  displayValue: string;
}

const HOLIDAY_TYPE_OPTIONS: OptionField[] = [
  { label: "Christmas", value: "christmas", displayValue: "Christmas" },
  { label: "Halloween", value: "halloween", displayValue: "Halloween" },
  { label: "New Year", value: "new-year", displayValue: "New Year" },
  { label: "Valentine's Day", value: "valentines", displayValue: "Valentine's Day" },
  { label: "Easter", value: "easter", displayValue: "Easter" },
  { label: "Thanksgiving", value: "thanksgiving", displayValue: "Thanksgiving" },
  { label: "Summer Sale", value: "summer", displayValue: "Summer Sale" },
  { label: "Black Friday", value: "black-friday", displayValue: "Black Friday" },
  { label: "General Festive", value: "general-festive", displayValue: "General Festive" },
];

const THEME_MOOD_OPTIONS: OptionField[] = [
  { label: "Cozy Warm", value: "cozy-warm", displayValue: "Cozy Warm" },
  { label: "Energetic Fun", value: "energetic-fun", displayValue: "Energetic Fun" },
  { label: "Elegant Luxury", value: "elegant-luxury", displayValue: "Elegant Luxury" },
  { label: "Nostalgic", value: "nostalgic", displayValue: "Nostalgic" },
  { label: "Modern Bold", value: "modern-bold", displayValue: "Modern Bold" },
  { label: "Minimal Clean", value: "minimal-clean", displayValue: "Minimal Clean" },
];

const COLOR_SCHEME_OPTIONS: OptionField[] = [
  { label: "Traditional Red/Green", value: "traditional-red-green", displayValue: "Traditional Red/Green" },
  { label: "Gold/Black", value: "gold-black", displayValue: "Gold/Black" },
  { label: "Pastel", value: "pastel", displayValue: "Pastel" },
  { label: "Metallic", value: "metallic", displayValue: "Metallic" },
  { label: "Vibrant", value: "vibrant", displayValue: "Vibrant" },
  { label: "Monochrome", value: "monochrome", displayValue: "Monochrome" },
];

const DECORATIONS_LEVEL_OPTIONS: OptionField[] = [
  { label: "Minimal", value: "minimal", displayValue: "Minimal" },
  { label: "Moderate", value: "moderate", displayValue: "Moderate" },
  { label: "Festive", value: "festive", displayValue: "Festive" },
  { label: "Elaborate", value: "elaborate", displayValue: "Elaborate" },
  { label: "Over-the-top", value: "over-the-top", displayValue: "Over-the-top" },
];

const BACKGROUND_STYLE_OPTIONS: OptionField[] = [
  { label: "Holiday Scene", value: "holiday-scene", displayValue: "Holiday Scene" },
  { label: "Gradient", value: "gradient", displayValue: "Gradient" },
  { label: "Textured", value: "textured", displayValue: "Textured" },
  { label: "Patterned", value: "patterned", displayValue: "Patterned" },
  { label: "Solid", value: "solid", displayValue: "Solid" },
];

const STYLE_VARIANT_OPTIONS: OptionField[] = [
  { label: "Commercial Ad", value: "commercial-ad", displayValue: "Commercial Ad" },
  { label: "Social Post", value: "social-post", displayValue: "Social Post" },
  { label: "Banner", value: "banner", displayValue: "Banner" },
  { label: "Story", value: "story", displayValue: "Story" },
];

interface SelectFieldProps {
  label: string;
  value: string;
  options: OptionField[];
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
  options: OptionField[];
  onChange: (value: string) => void;
}

function RadioField({ label, value, options, onChange }: RadioFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-3">
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

export function HolidayOptions() {
  const { holiday, updateHoliday } = useWorkflowOptions();

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-sm">Holiday Selection</h4>
      <SelectField
        label="Holiday Type"
        value={holiday.holidayType}
        options={HOLIDAY_TYPE_OPTIONS}
        onChange={(value) => updateHoliday({ holidayType: value as any })}
      />

      <div className="pt-4 border-t">
        <RadioField
          label="Theme Mood"
          value={holiday.themeMood}
          options={THEME_MOOD_OPTIONS}
          onChange={(value) => updateHoliday({ themeMood: value as any })}
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Visual Style</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Color Scheme"
            value={holiday.colorScheme}
            options={COLOR_SCHEME_OPTIONS}
            onChange={(value) => updateHoliday({ colorScheme: value as any })}
          />
          <SelectField
            label="Decorations Level"
            value={holiday.decorationsLevel}
            options={DECORATIONS_LEVEL_OPTIONS}
            onChange={(value) => updateHoliday({ decorationsLevel: value as any })}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Composition</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Background Style"
            value={holiday.backgroundStyle}
            options={BACKGROUND_STYLE_OPTIONS}
            onChange={(value) => updateHoliday({ backgroundStyle: value as any })}
          />
          <SelectField
            label="Output Format"
            value={holiday.styleVariant}
            options={STYLE_VARIANT_OPTIONS}
            onChange={(value) => updateHoliday({ styleVariant: value as any })}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="holiday-text-overlay"
            checked={holiday.textOverlay}
            onCheckedChange={(checked) => updateHoliday({ textOverlay: checked as boolean })}
          />
          <Label htmlFor="holiday-text-overlay">Include Text Overlay</Label>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="space-y-1">
          <Label htmlFor="holiday-custom-prompt">Custom Prompt (optional)</Label>
          <Textarea
            id="holiday-custom-prompt"
            placeholder="Add any additional details or specific requirements..."
            value={holiday.customPrompt || ""}
            onChange={(e) => updateHoliday({ customPrompt: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
