import { WebsiteAuditData } from "@/types/audit";

export const websiteAuditMockData: WebsiteAuditData = {
  // Meta
  websiteName: "example.com",
  websiteUrl: "https://example.com",
  date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
  reportId: "WA-2024-001",
  
  // Scores
  overallScore: 72,
  performanceScore: 68,
  seoScore: 75,
  uxScore: 80,
  conversionScore: 65,
  securityScore: 85,
  
  // Executive Summary
  aiSummary: "Your website shows strong fundamentals but has key optimization opportunities. Performance bottlenecks and SEO gaps are limiting organic reach. Quick wins in Core Web Vitals could yield 20%+ traffic improvement. The mobile experience is solid, but desktop conversion paths need attention.",
  strengths: [
    "Mobile-responsive design implemented correctly",
    "SSL certificate properly configured",
    "Clear navigation structure",
    "Fast server response times (TTFB < 200ms)",
  ],
  weaknesses: [
    "Large unoptimized images slowing load times",
    "Missing meta descriptions on 12 pages",
    "No structured data markup implemented",
    "Weak internal linking strategy",
  ],
  priorityFixes: [
    { title: "Optimize Images", impact: "Est. +15% speed boost" },
    { title: "Add Meta Tags", impact: "Est. +10% CTR" },
    { title: "Fix CLS Issues", impact: "Est. +5% engagement" },
  ],
  
  // Performance
  performance: {
    lcp: { value: "2.8s", status: "warning" },
    fid: { value: "45ms", status: "excellent" },
    cls: { value: "0.25", status: "critical" },
    ttfb: { value: "180ms", status: "excellent" },
    issues: [
      {
        severity: "critical",
        title: "Large images not optimized",
        description: "5 images exceed 500KB, significantly impacting load time.",
      },
      {
        severity: "warning",
        title: "Render-blocking JavaScript",
        description: "3 scripts blocking initial render. Consider async loading.",
      },
      {
        severity: "info",
        title: "Browser caching not configured",
        description: "Static assets could benefit from longer cache durations.",
      },
    ],
    recommendation: "Implement WebP image format with lazy loading to reduce payload by ~60%. Combined with code splitting, expect LCP improvement to under 2s.",
  },
  
  // SEO
  seo: {
    checklist: [
      { element: "Title Tags", status: "excellent", details: "All pages have unique titles" },
      { element: "Meta Descriptions", status: "warning", details: "12 pages missing descriptions" },
      { element: "H1 Tags", status: "excellent", details: "Properly structured" },
      { element: "Structured Data", status: "critical", details: "No schema markup detected" },
      { element: "XML Sitemap", status: "excellent", details: "Valid and submitted" },
      { element: "Canonical URLs", status: "warning", details: "5 pages have issues" },
    ],
    issues: [
      {
        severity: "critical",
        title: "Missing structured data",
        description: "No JSON-LD schema found. Rich snippets unavailable.",
      },
      {
        severity: "warning",
        title: "Duplicate title tags",
        description: "3 pages share identical titles.",
      },
    ],
    recommendations: [
      "Implement Organization, WebPage, and BreadcrumbList schemas to improve rich snippet eligibility.",
      "Write unique, compelling descriptions (150-160 chars) for all pages to improve CTR.",
    ],
  },
  
  // UX
  ux: {
    mobileScore: 75,
    desktopScore: 82,
    mobileInsights: [
      "Responsive design works well",
      "Touch targets slightly small (36px vs 44px recommended)",
      "Text readable without zoom",
    ],
    desktopInsights: [
      "Clean navigation structure",
      "Good visual hierarchy",
      "Some content hard to scan",
    ],
    issues: [
      {
        severity: "warning",
        title: "Mobile touch targets under 44px",
        description: "CTA buttons on product pages are 36px height. Recommend 44px minimum.",
      },
      {
        severity: "info",
        title: "Consider sticky navigation",
        description: "Long-form pages would benefit from persistent navigation access.",
      },
      {
        severity: "info",
        title: "Add progress indicators",
        description: "Multi-step forms lack visual progress feedback.",
      },
    ],
  },
  
  // Conversion
  conversion: {
    ctaCount: 8,
    aboveFoldCta: true,
    formOptimization: 65,
    trustSignals: 4,
    funnelSteps: [
      { name: "Landing", dropoff: 0, status: "excellent" },
      { name: "Product View", dropoff: 35, status: "warning" },
      { name: "Add to Cart", dropoff: 28, status: "warning" },
      { name: "Checkout", dropoff: 42, status: "critical" },
    ],
    issues: [
      {
        severity: "critical",
        title: "High checkout abandonment",
        description: "42% drop-off at checkout. Consider guest checkout option.",
      },
      {
        severity: "warning",
        title: "Weak value proposition",
        description: "Benefits not clearly communicated above the fold.",
      },
    ],
  },
  
  // Security
  security: {
    sslValid: true,
    headers: [
      { name: "HTTPS", status: "present", details: "Valid SSL certificate" },
      { name: "HSTS", status: "missing", details: "Not configured" },
      { name: "X-Frame-Options", status: "present", details: "DENY" },
      { name: "CSP", status: "missing", details: "Not configured" },
      { name: "X-Content-Type-Options", status: "present", details: "nosniff" },
    ],
    issues: [
      {
        severity: "warning",
        title: "Missing HSTS header",
        description: "Enable HTTP Strict Transport Security for enhanced protection.",
      },
      {
        severity: "info",
        title: "CSP not configured",
        description: "Content Security Policy would prevent XSS attacks.",
      },
    ],
    recommendation: "Configure HSTS with 1-year max-age and implement a strict Content Security Policy. These changes significantly reduce attack surface.",
  },
  
  // Roadmap
  roadmap: {
    phase1: [
      {
        title: "Image Optimization",
        description: "Convert to WebP, implement lazy loading, resize for display",
        impact: "high",
        effort: "low",
      },
      {
        title: "Add Meta Descriptions",
        description: "Write unique descriptions for all 12 missing pages",
        impact: "medium",
        effort: "low",
      },
      {
        title: "Fix CLS Issues",
        description: "Add explicit dimensions to images and embeds",
        impact: "high",
        effort: "low",
      },
    ],
    phase2: [
      {
        title: "Implement Schema Markup",
        description: "Add Organization, WebPage, Product schemas",
        impact: "medium",
        effort: "medium",
      },
      {
        title: "Optimize Checkout Flow",
        description: "Add guest checkout, reduce form fields",
        impact: "high",
        effort: "medium",
      },
    ],
    phase3: [
      {
        title: "Advanced Security Headers",
        description: "Implement HSTS, CSP, and other security headers",
        impact: "medium",
        effort: "medium",
      },
      {
        title: "Performance Monitoring",
        description: "Set up RUM for ongoing performance tracking",
        impact: "medium",
        effort: "high",
      },
    ],
  },
  
  // Final Recommendations
  recommendations: [
    {
      title: "Quick Wins First",
      description: "Focus on image optimization and meta descriptions for immediate impact with minimal effort.",
      priority: "high",
      category: "Performance",
    },
    {
      title: "Conversion Focus",
      description: "Reduce checkout friction to capture the 42% of users abandoning at final step.",
      priority: "high",
      category: "Conversion",
    },
    {
      title: "SEO Foundation",
      description: "Structured data implementation will unlock rich snippets and improve CTR.",
      priority: "medium",
      category: "SEO",
    },
    {
      title: "Security Hardening",
      description: "While basics are covered, advanced headers will future-proof against emerging threats.",
      priority: "medium",
      category: "Security",
    },
  ],
};
