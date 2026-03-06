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

const STAGING_TYPE_OPTIONS: OptionField[] = [
  { label: "Product Display", value: "product-display", displayValue: "Product Display" },
  { label: "Lifestyle", value: "lifestyle", displayValue: "Lifestyle" },
  { label: "Minimal Studio", value: "minimal-studio", displayValue: "Minimal Studio" },
  { label: "E-commerce Clean", value: "ecommerce-clean", displayValue: "E-commerce Clean" },
  { label: "Editorial Fashion", value: "editorial-fashion", displayValue: "Editorial Fashion" },
  { label: "Industrial", value: "industrial", displayValue: "Industrial" },
];

const COMPOSITION_TYPE_OPTIONS: OptionField[] = [
  { label: "Centered", value: "centered", displayValue: "Centered" },
  { label: "Rule of Thirds", value: "rule-of-thirds", displayValue: "Rule of Thirds" },
  { label: "Diagonal", value: "diagonal", displayValue: "Diagonal" },
  { label: "Symmetrical", value: "symmetrical", displayValue: "Symmetrical" },
  { label: "Asymmetrical", value: "asymmetrical", displayValue: "Asymmetrical" },
];

const DEPTH_OF_FIELD_OPTIONS: OptionField[] = [
  { label: "Shallow DOF", value: "shallow-dof", displayValue: "Shallow DOF" },
  { label: "Medium DOF", value: "medium-dof", displayValue: "Medium DOF" },
  { label: "Deep DOF", value: "deep-dof", displayValue: "Deep DOF" },
];

const CAMERA_ANGLE_OPTIONS: OptionField[] = [
  { label: "Eye Level", value: "eye-level", displayValue: "Eye Level" },
  { label: "High Angle", value: "high-angle", displayValue: "High Angle" },
  { label: "Low Angle", value: "low-angle", displayValue: "Low Angle" },
  { label: "Overhead", value: "overhead", displayValue: "Overhead" },
  { label: "Dutch Angle", value: "dutch-angle", displayValue: "Dutch Angle" },
];

const LIGHTING_SETUP_OPTIONS: OptionField[] = [
  { label: "Softbox", value: "softbox", displayValue: "Softbox" },
  { label: "Natural Light", value: "natural-light", displayValue: "Natural Light" },
  { label: "Rim Light", value: "rim-light", displayValue: "Rim Light" },
  { label: "Rembrandt", value: "rembrandt", displayValue: "Rembrandt" },
  { label: "Split Light", value: "split-light", displayValue: "Split Light" },
];

const TEXTURE_OPTIONS: OptionField[] = [
  { label: "Smooth", value: "smooth", displayValue: "Smooth" },
  { label: "Wood Grain", value: "wood-grain", displayValue: "Wood Grain" },
  { label: "Concrete", value: "concrete", displayValue: "Concrete" },
  { label: "Fabric", value: "fabric", displayValue: "Fabric" },
  { label: "Metal", value: "metal", displayValue: "Metal" },
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

export function StagingOptions() {
  const { staging, updateStaging } = useWorkflowOptions();

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-sm">Staging Setup</h4>
      <SelectField
        label="Staging Type"
        value={staging.stagingType}
        options={STAGING_TYPE_OPTIONS}
        onChange={(value) => updateStaging({ stagingType: value as any })}
      />

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Camera & Composition</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Composition"
            value={staging.compositionType}
            options={COMPOSITION_TYPE_OPTIONS}
            onChange={(value) => updateStaging({ compositionType: value as any })}
          />
          <SelectField
            label="Camera Angle"
            value={staging.cameraAngle}
            options={CAMERA_ANGLE_OPTIONS}
            onChange={(value) => updateStaging({ cameraAngle: value as any })}
          />
          <SelectField
            label="Depth of Field"
            value={staging.depthOfField}
            options={DEPTH_OF_FIELD_OPTIONS}
            onChange={(value) => updateStaging({ depthOfField: value as any })}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm mb-4">Lighting & Texture</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Lighting Setup"
            value={staging.lightingSetup}
            options={LIGHTING_SETUP_OPTIONS}
            onChange={(value) => updateStaging({ lightingSetup: value as any })}
          />
          <SelectField
            label="Surface Texture"
            value={staging.surfaceTexture}
            options={TEXTURE_OPTIONS}
            onChange={(value) => updateStaging({ surfaceTexture: value as any })}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="staging-reflective"
            checked={staging.reflectiveSurface}
            onCheckedChange={(checked) => updateStaging({ reflectiveSurface: checked as boolean })}
          />
          <Label htmlFor="staging-reflective">Reflective Surface</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="staging-glass"
            checked={staging.glassElements}
            onCheckedChange={(checked) => updateStaging({ glassElements: checked as boolean })}
          />
          <Label htmlFor="staging-glass">Glass Elements</Label>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="space-y-1">
          <Label htmlFor="staging-custom-prompt">Custom Prompt (optional)</Label>
          <Textarea
            id="staging-custom-prompt"
            placeholder="Add any additional details or specific requirements..."
            value={staging.customPrompt || ""}
            onChange={(e) => updateStaging({ customPrompt: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
