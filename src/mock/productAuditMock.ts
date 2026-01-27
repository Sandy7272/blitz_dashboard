import { ProductAuditData } from "@/types/audit";

export const productAuditMockData: ProductAuditData = {
  // Meta
  productName: "Premium Wireless Headphones",
  websiteName: "techstore.com",
  productUrl: "https://techstore.com/products/wireless-headphones",
  date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
  reportId: "PA-2024-001",
  
  // Scores
  conversionScore: 68,
  contentScore: 72,
  visualScore: 65,
  trustScore: 58,
  ctaScore: 70,
  mobileScore: 78,
  
  // Executive Summary
  aiSummary: "This product page has strong mobile experience but significant trust and visual gaps are limiting conversions. Adding customer reviews and optimizing product imagery could boost add-to-cart rates by 20%+. The content quality is good but the description is too brief to fully convince buyers.",
  issuesCount: 8,
  potentialUplift: "+22%",
  whatsWorking: [
    "Mobile-optimized product gallery",
    "Clear pricing structure",
    "Fast add-to-cart functionality",
  ],
  priorityFixes: [
    "Add customer reviews section",
    "Include lifestyle imagery",
    "Strengthen value proposition",
  ],
  
  // Content Quality
  content: {
    titleAssessment: {
      status: "excellent",
      label: "Strong",
      details: "Clear, includes key features",
    },
    descriptionAssessment: {
      status: "warning",
      label: "Short",
      details: "Only 45 words, recommend 150+",
    },
    bulletsAssessment: {
      status: "good",
      label: "Good",
      details: "5 bullets, benefit-focused",
    },
    specsAssessment: {
      status: "excellent",
      label: "Complete",
      details: "Detailed specs table present",
    },
    seoAssessment: {
      status: "warning",
      label: "Moderate",
      details: "Missing long-tail keywords",
    },
    issues: [
      {
        severity: "warning",
        title: "Product description too brief",
        description: "Expand description to include use cases, benefits, and differentiation. Aim for 150-300 words.",
      },
      {
        severity: "info",
        title: "Add FAQ section",
        description: "Common questions answered directly on page reduce friction and support calls.",
      },
    ],
    aiSuggestion: "Focus on emotional benefits first, then features. Lead with how the product solves problems or improves life, then support with specifications.",
  },
  
  // Visual Quality
  visual: {
    productImages: 4,
    lifestylePhotos: 0,
    videos: 0,
    hasZoom: true,
    checklist: [
      { label: "High-resolution product shots", status: "pass", details: "1200x1200px minimum met" },
      { label: "Multiple angles shown", status: "pass", details: "Front, back, side views" },
      { label: "Lifestyle/context imagery", status: "fail", details: "No in-use photos found" },
      { label: "Product video", status: "fail", details: "No demo or overview video" },
      { label: "Size reference/scale", status: "partial", details: "Dimensions listed but no visual" },
      { label: "Color variants shown", status: "pass", details: "All options have images" },
    ],
    recommendations: [
      "Show product in real-world context. Lifestyle images can increase conversion by 20-30%.",
      "A 30-60 second demo video can boost time on page and reduce return rates.",
    ],
  },
  
  // Trust & Social Proof
  trust: {
    reviewCount: 0,
    averageRating: 0,
    hasReviews: false,
    signals: [
      { name: "Secure checkout badge", present: true },
      { name: "Money-back guarantee", present: false },
      { name: "Return policy visible", present: false },
      { name: "Trust badges", present: true },
      { name: "Customer testimonials", present: false },
    ],
    issues: [
      {
        severity: "critical",
        title: "No customer reviews displayed",
        description: "Reviews are the #1 trust factor. Even 5 reviews can increase conversion by 15%.",
      },
      {
        severity: "warning",
        title: "No visible return policy",
        description: "Clearly displayed return policy reduces purchase anxiety.",
      },
    ],
  },
  
  // CTA Analysis
  cta: {
    buttonText: "Add to Cart",
    visibility: "good",
    urgency: "warning",
    valueProposition: "warning",
    issues: [
      {
        severity: "warning",
        title: "No urgency elements",
        description: "Consider adding stock levels, limited-time offers, or shipping deadlines.",
      },
      {
        severity: "info",
        title: "Generic button text",
        description: "Test variations like 'Get Yours Now' or 'Start Listening Today'.",
      },
    ],
  },
  
  // Mobile Experience
  mobile: {
    score: 78,
    checklist: [
      { label: "Responsive layout", status: "pass", details: "Adapts well to all screen sizes" },
      { label: "Touch-friendly buttons", status: "pass", details: "44px minimum met" },
      { label: "Fast mobile load", status: "partial", details: "3.2s on 3G, aim for <3s" },
      { label: "Sticky add-to-cart", status: "fail", details: "Button scrolls out of view" },
      { label: "Thumb-zone optimized", status: "pass", details: "Key actions in easy reach" },
    ],
    issues: [
      {
        severity: "warning",
        title: "Add-to-cart not sticky on mobile",
        description: "Users must scroll back up to add to cart after reading product details.",
      },
    ],
  },
  
  // Roadmap
  roadmap: {
    phase1: [
      {
        title: "Add Review Section",
        description: "Integrate reviews from existing customers or use a review collection service",
        impact: "high",
        effort: "low",
      },
      {
        title: "Expand Description",
        description: "Add use cases, benefits, and emotional appeal to product copy",
        impact: "medium",
        effort: "low",
      },
      {
        title: "Display Return Policy",
        description: "Add visible return/refund policy near buy button",
        impact: "medium",
        effort: "low",
      },
    ],
    phase2: [
      {
        title: "Add Lifestyle Photography",
        description: "Create or source images showing product in real-world use",
        impact: "high",
        effort: "medium",
      },
      {
        title: "Implement Sticky CTA",
        description: "Add sticky add-to-cart bar for mobile users",
        impact: "medium",
        effort: "low",
      },
    ],
    phase3: [
      {
        title: "Create Product Video",
        description: "30-60 second demo showcasing key features and benefits",
        impact: "high",
        effort: "high",
      },
      {
        title: "Add Urgency Elements",
        description: "Stock counters, limited offers, or shipping deadlines",
        impact: "medium",
        effort: "medium",
      },
    ],
  },
  
  // Final Recommendations
  recommendations: [
    {
      title: "Trust First",
      description: "Focus on adding customer reviews and visible trust signals to reduce purchase anxiety.",
      priority: "high",
      category: "Trust",
    },
    {
      title: "Visual Storytelling",
      description: "Lifestyle imagery helps customers envision the product in their life.",
      priority: "high",
      category: "Visual",
    },
    {
      title: "Mobile Optimization",
      description: "Sticky CTA ensures the buy button is always accessible on mobile.",
      priority: "medium",
      category: "Mobile",
    },
    {
      title: "Content Depth",
      description: "Expand product description to fully communicate value proposition.",
      priority: "medium",
      category: "Content",
    },
  ],
};
