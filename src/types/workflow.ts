// Workflow Types
export type WorkflowType = "apparel" | "food" | "holiday" | "staging";

// Apparel / Model Shoot Config
export interface ApparelConfig {
  modelGender: "male" | "female" | "non-binary";
  ageRange: "18-25" | "26-35" | "36-50" | "50+";
  ethnicity: "caucasian" | "african" | "asian" | "latino" | "middle-eastern" | "mixed";
  skinTone: "fair" | "medium" | "tan" | "deep";
  hairStyle: "short" | "medium" | "long" | "curly" | "straight" | "braided";
  hairColor: "black" | "brown" | "blonde" | "red" | "grey" | "platinum";
  pose: "standing" | "sitting" | "walking" | "dynamic";
  backgroundType: "studio-white" | "studio-grey" | "outdoor-urban" | "outdoor-nature" | "beach" | "interior";
  lightingStyle: "soft" | "dramatic" | "natural" | "high-key" | "golden-hour";
  imageStyle: "commercial" | "editorial" | "lifestyle" | "minimalist" | "trendy";
  customPrompt?: string;
}

// Food Photography Config
export interface FoodConfig {
  settingType: "restaurant-table" | "kitchen-counter" | "rustic-wooden" | "modern-minimal" | "marble" | "outdoor-picnic";
  props: ("utensils" | "napkins" | "beverages" | "garnish" | "seasoning" | "flowers")[];
  lighting: "bright-airy" | "moody-dark" | "warm-cozy" | "dramatic-side";
  styling: "plated-elegance" | "casual-everyday" | "deconstructed" | "action-shot" | "overhead-flat-lay";
  backgroundTreatment: "clean" | "textured" | "blurred" | "patterned";
  colorGrade: "natural" | "warm" | "cool" | "vintage" | "high-saturation";
  imageRatio: "1:1" | "4:5" | "16:9" | "9:16";
  customPrompt?: string;
}

// Holiday Ad Studio Config
export interface HolidayConfig {
  holidayType: "christmas" | "halloween" | "new-year" | "valentines" | "easter" | "thanksgiving" | "summer" | "black-friday" | "general-festive";
  themeMood: "cozy-warm" | "energetic-fun" | "elegant-luxury" | "nostalgic" | "modern-bold" | "minimal-clean";
  colorScheme: "traditional-red-green" | "gold-black" | "pastel" | "metallic" | "vibrant" | "monochrome";
  decorationsLevel: "minimal" | "moderate" | "festive" | "elaborate" | "over-the-top";
  backgroundStyle: "holiday-scene" | "gradient" | "textured" | "patterned" | "solid";
  textOverlay: boolean;
  styleVariant: "commercial-ad" | "social-post" | "banner" | "story";
  customPrompt?: string;
}

// Staging / Lifestyle Config
export interface StagingConfig {
  roomType: "living-room" | "bedroom" | "kitchen" | "dining-room" | "office" | "bathroom" | "nursery" | "full-house";
  interiorStyle: "modern-contemporary" | "scandinavian" | "industrial" | "farmhouse" | "mid-century-modern" | "bohemian" | "traditional" | "luxury";
  colorPalette: "neutral-tones" | "warm-earth-tones" | "cool-blue-grey" | "bold-colorful" | "black-white" | "pastel";
  furnitureDensity: "minimal" | "balanced" | "full" | "maximalist";
  lightingAtmosphere: "bright-natural" | "warm-evening" | "soft-ambient" | "dramatic-spotlight" | "golden-hour";
  plantsGreenery: boolean;
  artDecor: boolean;
  windowView: "no-windows" | "indoor-plant-wall" | "city-view" | "nature-view" | "ocean-view";
  imageQuality: "hd" | "2k" | "4k";
  customPrompt?: string;
}

// Combined Generation Config
export interface GenerationConfig {
  apparel?: ApparelConfig;
  food?: FoodConfig;
  holiday?: HolidayConfig;
  staging?: StagingConfig;
}

// Default values for each workflow
export const DEFAULT_APPAREL_CONFIG: ApparelConfig = {
  modelGender: "female",
  ageRange: "18-25",
  ethnicity: "caucasian",
  skinTone: "medium",
  hairStyle: "long",
  hairColor: "brown",
  pose: "standing",
  backgroundType: "studio-white",
  lightingStyle: "natural",
  imageStyle: "commercial",
};

export const DEFAULT_FOOD_CONFIG: FoodConfig = {
  settingType: "restaurant-table",
  props: ["utensils", "garnish"],
  lighting: "bright-airy",
  styling: "plated-elegance",
  backgroundTreatment: "clean",
  colorGrade: "natural",
  imageRatio: "1:1",
};

export const DEFAULT_HOLIDAY_CONFIG: HolidayConfig = {
  holidayType: "christmas",
  themeMood: "cozy-warm",
  colorScheme: "traditional-red-green",
  decorationsLevel: "moderate",
  backgroundStyle: "holiday-scene",
  textOverlay: false,
  styleVariant: "social-post",
};

export const DEFAULT_STAGING_CONFIG: StagingConfig = {
  roomType: "living-room",
  interiorStyle: "modern-contemporary",
  colorPalette: "neutral-tones",
  furnitureDensity: "balanced",
  lightingAtmosphere: "bright-natural",
  plantsGreenery: true,
  artDecor: true,
  windowView: "city-view",
  imageQuality: "hd",
};
