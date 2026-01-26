interface WebsiteAuditPDFProps {
  data: any;
}
import PDFCoverPage from "./PDFCoverPage";
import PDFPage from "./PDFPage";
import { ScoreCircle } from "../ui/ScoreCircle";
import { ScoreCard } from "../ui/ScoreCard";
import { ScoreBar } from "../ui/ScoreBar";
import { IssueItem } from "../ui/IssueItem";
import { RecommendationBox } from "../ui/RecommendationBox";
import { RoadmapPhase } from "../ui/RoadmapPhase";
import { StatusIndicator } from "../ui/StatusIndicator";
import {
  Gauge,
  Search,
  Smartphone,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  MousePointer,
  Lock,
  CheckCircle2,
  Target,
  ArrowRight,
} from "lucide-react";


// Placeholder data - all values are dynamic
const data = {
  websiteName: "{{website_name}}",
  date: "{{report_date}}",
  overallScore: 72,
  performanceScore: 68,
  seoScore: 75,
  uxScore: 80,
  conversionScore: 65,
  securityScore: 85,
  aiSummary:
    "{{ai_summary}} - Your website shows strong fundamentals but has key optimization opportunities. Performance bottlenecks and SEO gaps are limiting organic reach. Quick wins in Core Web Vitals could yield 20%+ traffic improvement.",
  strengths: [
    "Mobile-responsive design implemented correctly",
    "SSL certificate properly configured",
    "Clear navigation structure",
    "Fast server response times",
  ],
  weaknesses: [
    "Large unoptimized images slowing load times",
    "Missing meta descriptions on 12 pages",
    "No structured data markup",
    "Weak internal linking strategy",
  ],
};

export const WebsiteAuditPDF = () => {
  const totalPages = 10;

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Page 1: Cover */}
      <PDFCoverPage
        title="Comprehensive Website Audit"
        subtitle="In-depth analysis and strategic recommendations"
        websiteName={data.websiteName}
        date={data.date}
        overallScore={data.overallScore}
        reportType="website"
      />

      {/* Page 2: Executive Summary */}
      <PDFPage pageNumber={2} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Executive Summary</h2>

        {/* AI Summary Box */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-accent/10 flex-shrink-0">
              <Target className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-1">AI-Powered Analysis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{data.aiSummary}</p>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-score-excellent/5 border border-score-excellent/20 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-score-excellent" />
              Key Strengths
            </h3>
            <ul className="space-y-1.5">
              {data.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-score-excellent mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              Areas for Improvement
            </h3>
            <ul className="space-y-1.5">
              {data.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Priority Fixes */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">🔥 Top Priority Fixes</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-border/50">
              <p className="text-xs font-medium text-foreground">Optimize Images</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Est. +15% speed boost</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-border/50">
              <p className="text-xs font-medium text-foreground">Add Meta Tags</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Est. +10% CTR</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-border/50">
              <p className="text-xs font-medium text-foreground">Fix CLS Issues</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Est. +5% engagement</p>
            </div>
          </div>
        </div>
      </PDFPage>

      {/* Page 3: Health Dashboard */}
      <PDFPage pageNumber={3} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Overall Health Dashboard</h2>

        <div className="flex items-center justify-center mb-6">
          <ScoreCircle score={data.overallScore} size="xl" label="Overall Score" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <ScoreCard title="Performance" score={data.performanceScore} icon={Gauge} description="Page speed & Core Web Vitals" />
          <ScoreCard title="SEO" score={data.seoScore} icon={Search} description="Search engine optimization" />
          <ScoreCard title="User Experience" score={data.uxScore} icon={Smartphone} description="Usability & accessibility" />
          <ScoreCard title="Conversion" score={data.conversionScore} icon={TrendingUp} description="CTA & conversion elements" />
          <ScoreCard title="Security" score={data.securityScore} icon={Shield} description="SSL, headers & trust" className="col-span-2" />
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            <ScoreBar score={data.performanceScore} label="Performance" />
            <ScoreBar score={data.seoScore} label="SEO" />
            <ScoreBar score={data.uxScore} label="User Experience" />
            <ScoreBar score={data.conversionScore} label="Conversion" />
            <ScoreBar score={data.securityScore} label="Security" />
          </div>
        </div>
      </PDFPage>

      {/* Page 4: Performance & Speed */}
      <PDFPage pageNumber={4} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Gauge className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Performance & Speed</h2>
            <p className="text-xs text-muted-foreground">Core Web Vitals & loading metrics</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">LCP</p>
            <p className="text-2xl font-bold text-warning">2.8s</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Largest Contentful Paint</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">FID</p>
            <p className="text-2xl font-bold text-score-excellent">45ms</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">First Input Delay</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">CLS</p>
            <p className="text-2xl font-bold text-destructive">0.25</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Cumulative Layout Shift</p>
          </div>
        </div>

        {/* Issues */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Detected Issues</h3>
        <div className="space-y-2 mb-5">
          <IssueItem
            severity="critical"
            title="Large images not optimized"
            description="5 images exceed 500KB, significantly impacting load time."
          />
          <IssueItem
            severity="warning"
            title="Render-blocking JavaScript"
            description="3 scripts blocking initial render. Consider async loading."
          />
          <IssueItem
            severity="info"
            title="Browser caching not configured"
            description="Static assets could benefit from longer cache durations."
          />
        </div>

        {/* AI Recommendation */}
        <RecommendationBox
          type="ai"
          title="AI Recommendation"
          description="Implement WebP image format with lazy loading to reduce payload by ~60%. Combined with code splitting, expect LCP improvement to under 2s."
        />
      </PDFPage>

      {/* Page 5: SEO Audit */}
      <PDFPage pageNumber={5} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">SEO Audit</h2>
            <p className="text-xs text-muted-foreground">Search engine optimization analysis</p>
          </div>
        </div>

        {/* SEO Overview Table */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 mb-5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Element</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Title Tags</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-excellent/10 text-score-excellent">Optimal</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">All pages have unique titles</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Meta Descriptions</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">Needs Work</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">12 pages missing descriptions</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">H1 Tags</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-excellent/10 text-score-excellent">Optimal</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">Properly structured</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Structured Data</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">Missing</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">No schema markup detected</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">XML Sitemap</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-excellent/10 text-score-excellent">Optimal</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">Valid and submitted</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Canonical URLs</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">Needs Work</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">5 pages have issues</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <RecommendationBox
            type="tip"
            title="Add Schema Markup"
            description="Implement Organization, WebPage, and BreadcrumbList schemas to improve rich snippet eligibility."
          />
          <RecommendationBox
            type="tip"
            title="Fix Meta Descriptions"
            description="Write unique, compelling descriptions (150-160 chars) for all pages to improve CTR."
          />
        </div>
      </PDFPage>

      {/* Page 6: UX & Mobile */}
      <PDFPage pageNumber={6} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">UX & Mobile Experience</h2>
            <p className="text-xs text-muted-foreground">Usability and accessibility analysis</p>
          </div>
        </div>

        {/* Mobile vs Desktop Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Mobile</h3>
            </div>
            <div className="flex justify-center mb-3">
              <ScoreCircle score={75} size="md" />
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-score-excellent flex-shrink-0" />
                Responsive design works well
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-warning flex-shrink-0" />
                Touch targets slightly small
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-score-excellent flex-shrink-0" />
                Text readable without zoom
              </li>
            </ul>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Desktop</h3>
            </div>
            <div className="flex justify-center mb-3">
              <ScoreCircle score={82} size="md" />
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-score-excellent flex-shrink-0" />
                Clean navigation structure
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-score-excellent flex-shrink-0" />
                Good visual hierarchy
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-warning flex-shrink-0" />
                Some content hard to scan
              </li>
            </ul>
          </div>
        </div>

        {/* UX Issues */}
        <h3 className="font-semibold text-sm text-foreground mb-3">UX Improvement Opportunities</h3>
        <div className="space-y-2">
          <IssueItem severity="warning" title="Mobile touch targets under 44px" description="CTA buttons on product pages are 36px height. Recommend 44px minimum." />
          <IssueItem severity="info" title="Consider sticky navigation" description="Long-form pages would benefit from persistent navigation access." />
          <IssueItem severity="info" title="Add progress indicators" description="Multi-step forms lack visual progress feedback." />
        </div>
      </PDFPage>

      {/* Page 7: Conversion Optimization */}
      <PDFPage pageNumber={7} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <MousePointer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Conversion Optimization</h2>
            <p className="text-xs text-muted-foreground">CTA effectiveness and funnel analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground mb-0.5">3</p>
            <p className="text-[10px] text-muted-foreground">CTAs Found</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-warning mb-0.5">Low</p>
            <p className="text-[10px] text-muted-foreground">CTA Visibility</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-score-excellent mb-0.5">4</p>
            <p className="text-[10px] text-muted-foreground">Trust Signals</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-warning mb-0.5">5</p>
            <p className="text-[10px] text-muted-foreground">Form Fields</p>
          </div>
        </div>

        {/* CTA Review */}
        <h3 className="font-semibold text-sm text-foreground mb-3">CTA Analysis</h3>
        <div className="bg-secondary/30 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div>
                <p className="font-medium text-xs text-foreground">Primary CTA: "Get Started"</p>
                <p className="text-[10px] text-muted-foreground">Homepage hero section</p>
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-excellent/10 text-score-excellent">Good</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div>
                <p className="font-medium text-xs text-foreground">Secondary CTA: "Learn More"</p>
                <p className="text-[10px] text-muted-foreground">Below fold, low contrast</p>
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">Improve</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-xs text-foreground">Form CTA: "Submit"</p>
                <p className="text-[10px] text-muted-foreground">Generic, lacks urgency</p>
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">Weak</span>
            </div>
          </div>
        </div>

        <RecommendationBox
          type="ai"
          title="Conversion Uplift Potential"
          description="By improving CTA visibility, adding social proof near forms, and reducing form fields from 5 to 3, expect 15-25% conversion rate improvement."
        />
      </PDFPage>

      {/* Page 8: Security & Trust */}
      <PDFPage pageNumber={8} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Security & Trust</h2>
            <p className="text-xs text-muted-foreground">Security headers and trust signals</p>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border/50 mb-4 p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Security Checklist</h3>
          <StatusIndicator label="SSL Certificate" status="pass" details="Valid until Dec 2025" />
          <StatusIndicator label="HTTPS Redirect" status="pass" details="All traffic redirected" />
          <StatusIndicator label="HSTS Header" status="fail" details="Not implemented" />
          <StatusIndicator label="Content Security Policy" status="partial" details="Basic policy, can be stricter" />
          <StatusIndicator label="X-Frame-Options" status="pass" details="DENY configured" />
          <StatusIndicator label="X-Content-Type-Options" status="pass" details="nosniff enabled" />
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border/50 p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Trust Signals Audit</h3>
          <StatusIndicator label="Privacy Policy" status="pass" details="Accessible in footer" />
          <StatusIndicator label="Contact Information" status="pass" details="Phone and email visible" />
          <StatusIndicator label="Customer Reviews" status="partial" details="Limited visibility" />
          <StatusIndicator label="Security Badges" status="fail" details="No trust seals displayed" />
          <StatusIndicator label="Money-Back Guarantee" status="fail" details="Not mentioned" />
        </div>
      </PDFPage>

      {/* Page 9: Strategic Roadmap */}
      <PDFPage pageNumber={9} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-1">Strategic Action Roadmap</h2>
        <p className="text-xs text-muted-foreground mb-5">Phased implementation plan for maximum impact</p>

        <RoadmapPhase
          phase="Phase 1"
          title="Quick Wins"
          timeline="Week 1-2"
          status="current"
          items={[
            { title: "Optimize and compress all images", description: "Use WebP format, lazy loading" },
            { title: "Add missing meta descriptions", description: "12 pages need descriptions" },
            { title: "Implement HSTS header", description: "Critical security improvement" },
            { title: "Increase CTA button sizes to 44px", description: "Mobile UX improvement" },
          ]}
        />

        <RoadmapPhase
          phase="Phase 2"
          title="Medium-Term Improvements"
          timeline="Week 3-6"
          status="upcoming"
          items={[
            { title: "Implement structured data markup", description: "Organization, Product, FAQ schemas" },
            { title: "Optimize JavaScript delivery", description: "Code splitting, async loading" },
            { title: "Add trust badges and social proof", description: "Reviews, security seals" },
            { title: "Improve form conversion", description: "Reduce fields, add progress indicators" },
          ]}
        />

        <RoadmapPhase
          phase="Phase 3"
          title="Long-Term Growth"
          timeline="Month 2-3"
          status="upcoming"
          items={[
            { title: "Implement A/B testing framework", description: "Test CTAs, layouts, copy" },
            { title: "Build internal linking strategy", description: "Topic clusters, pillar pages" },
            { title: "Create content optimization plan", description: "SEO-driven content calendar" },
            { title: "Set up performance monitoring", description: "Real-time Core Web Vitals tracking" },
          ]}
        />
      </PDFPage>

      {/* Page 10: Final Insights */}
      <PDFPage pageNumber={10} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Final Insights & Next Steps</h2>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-5">
          <h3 className="font-semibold text-sm text-foreground mb-2">Conclusion</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Your website has a solid foundation with good security practices and mobile responsiveness. 
            The primary opportunities lie in performance optimization (especially image handling) and 
            SEO improvements (structured data, meta descriptions). Implementing the Phase 1 quick wins 
            alone could yield a 15-20% improvement in Core Web Vitals and organic search visibility.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            With systematic implementation of all phases, expect to see significant improvements in 
            user engagement, search rankings, and conversion rates within 90 days.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-score-excellent mb-1">+25%</p>
            <p className="text-xs text-muted-foreground">Expected Traffic Growth</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-accent mb-1">+15%</p>
            <p className="text-xs text-muted-foreground">Conversion Rate Uplift</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-info mb-1">2x</p>
            <p className="text-xs text-muted-foreground">Page Speed Improvement</p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            Ready to Get Started?
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Our team is ready to help you implement these recommendations and track your progress.
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-medium">
              Schedule a Strategy Call
            </div>
            <div className="border border-primary text-primary px-4 py-2 rounded-lg text-xs font-medium">
              Download Full Report
            </div>
          </div>
        </div>
      </PDFPage>
    </div>
  );
};
