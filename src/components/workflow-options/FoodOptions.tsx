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

const SETTING_TYPE_OPTIONS: OptionField[] = [
  { label: "Restaurant Table", value: "restaurant-table", displayValue: "Restaurant Table" },
  { label: "Kitchen Counter", value: "kitchen-counter", displayValue: "Kitchen Counter" },
  { label: "Rustic Wooden", value: "rustic-wooden", displayValue: "Rustic Wooden" },
  { label: "Modern Minimal", value: "modern-minimal", displayValue: "Modern Minimal" },
  { label: "Marble", value: "marble", displayValue: "Marble" },
  { label: "Outdoor Picnic", value: "outdoor-picnic", displayValue: "Outdoor Picnic" },
];

const LIGHTING_OPTIONS: OptionField[] = [
  { label: "Bright & Airy", value: "bright-airy", displayValue: "Bright & Airy" },
  { label: "Moody Dark", value: "moody-dark", displayValue: "Moody Dark" },
  { label: "Warm Cozy", value: "warm-cozy", displayValue: "Warm Cozy" },
  { label: "Dramatic Side", value: "dramatic-side", displayValue: "Dramatic Side" },
];

const STYLING_OPTIONS: OptionField[] = [
  { label: "Plated Elegance", value: "plated-elegance", displayValue: "Plated Elegance" },
  { label: "Casual Everyday", value: "casual-everyday", displayValue: "Casual Everyday" },
  { label: "Deconstructed", value: "deconstructed", displayValue: "Deconstructed" },
  { label: "Action Shot", value: "action-shot", displayValue: "Action Shot" },
  { label: "Overhead Flat Lay", value: "overhead-flat-lay", displayValue: "Overhead Flat Lay" },
];

const BACKGROUND_TREATMENT_OPTIONS: OptionField[] = [
  { label: "Clean", value: "clean", displayValue: "Clean" },
  { label: "Textured", value: "textured", displayValue: "Textured" },
  { label: "Blurred", value: "blurred", displayValue: "Blurred" },
  { label: "Patterned", value: "patterned", displayValue: "Patterned" },
];

const COLOR_GRADE_OPTIONS: OptionField[] = [
  { label: "Natural", value: "natural", displayValue: "Natural" },
  { label: "Warm", value: "warm", displayValue: "Warm" },
  { label: "Cool", value: "cool", displayValue: "Cool" },
  { label: "Vintage", value: "vintage", displayValue: "Vintage" },
  { label: "High Saturation", value: "high-saturation", displayValue: "High Saturation" },
];

const IMAGE_RATIO_OPTIONS: OptionField[] = [
  { label: "Square 1:1", value: "1:1", displayValue: "Square 1:1" },
  { label: "Portrait 4:5", value: "4:5", displayValue: "Portrait 4:5" },
  { label: "Landscape 16:9", value: "16:9", displayValue: "Landscape 16:9" },
  { label: "Story 9:16", value: "9:16", displayValue: "Story 9:16" },
];

const PROPS_OPTIONS: OptionField[] = [
  { label: "Utensils", value: "utensils", displayValue: "Utensils" },
  { label: "Napkins", value: "napkins", displayValue: "Napkins" },
  { label: "Beverages", value: "beverages", displayValue: "Beverages" },
  { label: "Garnish", value: "garnish", displayValue: "Garnish" },
  { label: "Seasoning", value: "seasoning", displayValue: "Seasoning" },
  { label: "Flowers", value: "flowers", displayValue: "Flowers" },
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

export function FoodOptions() {
  const { food, updateFood } = useWorkflowOptions();

  const handlePropChange = (prop: string, checked: boolean) => {
    const newProps = checked
      ? [...food.props, prop as any]
      : food.props.filter((p) => p !== prop);
    updateFood({ props: newProps });
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-sm">Setting & Composition</h4>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Setting Type"
          value={food.settingType}
          options={SETTING_TYPE_OPTIONS}
          onChange={(value) => updateFood({ settingType: value as any })}
        />
        <SelectField
          label="Image Ratio"
          value={food.imageRatio}
          options={IMAGE_RATIO_OPTIONS}
          onChange={(value) => updateFood({ imageRatio: value as any })}
        />
      </div>

      <div className="pt-4 border-t">
        <RadioField
          label="Lighting"
          value={food.lighting}
          options={LIGHTING_OPTIONS}
          onChange={(value) => updateFood({ lighting: value as any })}
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Props</h4>
        <div className="grid grid-cols-3 gap-3">
          {PROPS_OPTIONS.map((prop) => (
            <div key={prop.value} className="flex items-center space-x-2">
              <Checkbox
                id={prop.value}
                checked={food.props.includes(prop.value as any)}
                onCheckedChange={(checked) => handlePropChange(prop.value, checked as boolean)}
              />
              <Label htmlFor={prop.value}>{prop.displayValue}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Styling & Color</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Styling Approach"
            value={food.styling}
            options={STYLING_OPTIONS}
            onChange={(value) => updateFood({ styling: value as any })}
          />
          <SelectField
            label="Background"
            value={food.backgroundTreatment}
            options={BACKGROUND_TREATMENT_OPTIONS}
            onChange={(value) => updateFood({ backgroundTreatment: value as any })}
          />
          <SelectField
            label="Color Grade"
            value={food.colorGrade}
            options={COLOR_GRADE_OPTIONS}
            onChange={(value) => updateFood({ colorGrade: value as any })}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="space-y-1">
          <Label htmlFor="food-custom-prompt">Custom Prompt (optional)</Label>
          <Textarea
            id="food-custom-prompt"
            placeholder="Add any additional details or specific requirements..."
            value={food.customPrompt || ""}
            onChange={(e) => updateFood({ customPrompt: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
