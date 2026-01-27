// Audit Data Types - Backend Ready Structure

export interface WebsiteAuditData {
  // Meta
  websiteName: string;
  websiteUrl: string;
  date: string;
  reportId: string;
  
  // Scores
  overallScore: number;
  performanceScore: number;
  seoScore: number;
  uxScore: number;
  conversionScore: number;
  securityScore: number;
  
  // Executive Summary
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  priorityFixes: PriorityFix[];
  
  // Performance
  performance: {
    lcp: { value: string; status: ScoreStatus };
    fid: { value: string; status: ScoreStatus };
    cls: { value: string; status: ScoreStatus };
    ttfb: { value: string; status: ScoreStatus };
    issues: AuditIssue[];
    recommendation: string;
  };
  
  // SEO
  seo: {
    checklist: SeoChecklistItem[];
    issues: AuditIssue[];
    recommendations: string[];
  };
  
  // UX
  ux: {
    mobileScore: number;
    desktopScore: number;
    mobileInsights: string[];
    desktopInsights: string[];
    issues: AuditIssue[];
  };
  
  // Conversion
  conversion: {
    ctaCount: number;
    aboveFoldCta: boolean;
    formOptimization: number;
    trustSignals: number;
    issues: AuditIssue[];
    funnelSteps: FunnelStep[];
  };
  
  // Security
  security: {
    sslValid: boolean;
    headers: SecurityHeader[];
    issues: AuditIssue[];
    recommendation: string;
  };
  
  // Roadmap
  roadmap: {
    phase1: RoadmapItem[];
    phase2: RoadmapItem[];
    phase3: RoadmapItem[];
  };
  
  // Final Recommendations
  recommendations: Recommendation[];
}

export interface ProductAuditData {
  // Meta
  productName: string;
  websiteName: string;
  productUrl: string;
  date: string;
  reportId: string;
  
  // Scores
  conversionScore: number;
  contentScore: number;
  visualScore: number;
  trustScore: number;
  ctaScore: number;
  mobileScore: number;
  
  // Executive Summary
  aiSummary: string;
  issuesCount: number;
  potentialUplift: string;
  whatsWorking: string[];
  priorityFixes: string[];
  
  // Content Quality
  content: {
    titleAssessment: ContentAssessment;
    descriptionAssessment: ContentAssessment;
    bulletsAssessment: ContentAssessment;
    specsAssessment: ContentAssessment;
    seoAssessment: ContentAssessment;
    issues: AuditIssue[];
    aiSuggestion: string;
  };
  
  // Visual Quality
  visual: {
    productImages: number;
    lifestylePhotos: number;
    videos: number;
    hasZoom: boolean;
    checklist: VisualChecklistItem[];
    recommendations: string[];
  };
  
  // Trust & Social Proof
  trust: {
    reviewCount: number;
    averageRating: number;
    hasReviews: boolean;
    signals: TrustSignal[];
    issues: AuditIssue[];
  };
  
  // CTA Analysis
  cta: {
    buttonText: string;
    visibility: ScoreStatus;
    urgency: ScoreStatus;
    valueProposition: ScoreStatus;
    issues: AuditIssue[];
  };
  
  // Mobile Experience
  mobile: {
    score: number;
    checklist: MobileChecklistItem[];
    issues: AuditIssue[];
  };
  
  // Roadmap
  roadmap: {
    phase1: RoadmapItem[];
    phase2: RoadmapItem[];
    phase3: RoadmapItem[];
  };
  
  // Final Recommendations
  recommendations: Recommendation[];
}

// Shared Types
export type ScoreStatus = 'excellent' | 'good' | 'warning' | 'critical';

export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface AuditIssue {
  severity: IssueSeverity;
  title: string;
  description: string;
}

export interface PriorityFix {
  title: string;
  impact: string;
}

export interface SeoChecklistItem {
  element: string;
  status: ScoreStatus;
  details: string;
}

export interface SecurityHeader {
  name: string;
  status: 'present' | 'missing' | 'misconfigured';
  details: string;
}

export interface FunnelStep {
  name: string;
  dropoff: number;
  status: ScoreStatus;
}

export interface RoadmapItem {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface ContentAssessment {
  status: ScoreStatus;
  label: string;
  details: string;
}

export interface VisualChecklistItem {
  label: string;
  status: 'pass' | 'fail' | 'partial';
  details: string;
}

export interface TrustSignal {
  name: string;
  present: boolean;
}

export interface MobileChecklistItem {
  label: string;
  status: 'pass' | 'fail' | 'partial';
  details: string;
}

// API Response Types
export interface AuditJobResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  stage?: string;
  result?: WebsiteAuditData | ProductAuditData;
  error?: string;
}
