import PDFCoverPage from "./PDFCoverPage";
import PDFPage from "./PDFPage";
import { ScoreCircle } from "../ui/ScoreCircle";
import { ScoreCard } from "../ui/ScoreCard";
import { ScoreBar } from "../ui/ScoreBar";
import { IssueItem } from "../ui/IssueItem";
import { RecommendationBox } from "../ui/RecommendationBox";
import { RoadmapPhase } from "../ui/RoadmapPhase";
import { WebsiteAuditData } from "@/types/audit";
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

interface WebsiteAuditPDFProps {
  data: WebsiteAuditData;
}

export const WebsiteAuditPDF = ({ data }: WebsiteAuditPDFProps) => {
  const totalPages = 10;

  const getStatusBadge = (status: string) => {
    const styles = {
      excellent: "bg-score-excellent/10 text-score-excellent",
      good: "bg-score-good/10 text-score-good",
      warning: "bg-warning/10 text-warning",
      critical: "bg-destructive/10 text-destructive",
    };
    const labels = {
      excellent: "Optimal",
      good: "Good",
      warning: "Needs Work",
      critical: "Critical",
    };
    return (
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${styles[status as keyof typeof styles] || styles.warning}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

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
            {data.priorityFixes.map((fix, i) => (
              <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-border/50">
                <p className="text-xs font-medium text-foreground">{fix.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{fix.impact}</p>
              </div>
            ))}
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
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">LCP</p>
            <p className={`text-2xl font-bold ${data.performance.lcp.status === 'excellent' ? 'text-score-excellent' : data.performance.lcp.status === 'good' ? 'text-score-good' : data.performance.lcp.status === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {data.performance.lcp.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Largest Contentful Paint</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">FID</p>
            <p className={`text-2xl font-bold ${data.performance.fid.status === 'excellent' ? 'text-score-excellent' : data.performance.fid.status === 'good' ? 'text-score-good' : data.performance.fid.status === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {data.performance.fid.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">First Input Delay</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">CLS</p>
            <p className={`text-2xl font-bold ${data.performance.cls.status === 'excellent' ? 'text-score-excellent' : data.performance.cls.status === 'good' ? 'text-score-good' : data.performance.cls.status === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {data.performance.cls.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Cumulative Layout Shift</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">TTFB</p>
            <p className={`text-2xl font-bold ${data.performance.ttfb.status === 'excellent' ? 'text-score-excellent' : data.performance.ttfb.status === 'good' ? 'text-score-good' : data.performance.ttfb.status === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {data.performance.ttfb.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Time to First Byte</p>
          </div>
        </div>

        {/* Issues */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Detected Issues</h3>
        <div className="space-y-2 mb-5">
          {data.performance.issues.map((issue, i) => (
            <IssueItem
              key={i}
              severity={issue.severity}
              title={issue.title}
              description={issue.description}
            />
          ))}
        </div>

        {/* AI Recommendation */}
        <RecommendationBox
          type="ai"
          title="AI Recommendation"
          description={data.performance.recommendation}
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
              {data.seo.checklist.map((item, i) => (
                <tr key={i}>
                  <td className="py-2 px-3 text-xs text-foreground">{item.element}</td>
                  <td className="py-2 px-3">{getStatusBadge(item.status)}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.seo.recommendations.slice(0, 2).map((rec, i) => (
            <RecommendationBox
              key={i}
              type="tip"
              title={i === 0 ? "Add Schema Markup" : "Fix Meta Descriptions"}
              description={rec}
            />
          ))}
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
              <ScoreCircle score={data.ux.mobileScore} size="md" />
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {data.ux.mobileInsights.map((insight, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className={`w-1 h-1 rounded-full ${i < 2 ? 'bg-score-excellent' : 'bg-warning'} flex-shrink-0`} />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Desktop</h3>
            </div>
            <div className="flex justify-center mb-3">
              <ScoreCircle score={data.ux.desktopScore} size="md" />
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {data.ux.desktopInsights.map((insight, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className={`w-1 h-1 rounded-full ${i < 2 ? 'bg-score-excellent' : 'bg-warning'} flex-shrink-0`} />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* UX Issues */}
        <h3 className="font-semibold text-sm text-foreground mb-3">UX Improvement Opportunities</h3>
        <div className="space-y-2">
          {data.ux.issues.map((issue, i) => (
            <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
          ))}
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
            <p className="text-xl font-bold text-foreground mb-0.5">{data.conversion.ctaCount}</p>
            <p className="text-[10px] text-muted-foreground">CTAs Found</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className={`text-xl font-bold ${data.conversion.aboveFoldCta ? 'text-score-excellent' : 'text-warning'} mb-0.5`}>
              {data.conversion.aboveFoldCta ? 'Yes' : 'No'}
            </p>
            <p className="text-[10px] text-muted-foreground">Above Fold CTA</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-xl font-bold text-foreground mb-0.5">{data.conversion.formOptimization}%</p>
            <p className="text-[10px] text-muted-foreground">Form Optimization</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-xl font-bold text-foreground mb-0.5">{data.conversion.trustSignals}</p>
            <p className="text-[10px] text-muted-foreground">Trust Signals</p>
          </div>
        </div>

        {/* Funnel Analysis */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Conversion Funnel Analysis</h3>
        <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 mb-5">
          <div className="flex items-center justify-between gap-2">
            {data.conversion.funnelSteps.map((step, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-16 rounded-lg mb-2 flex items-center justify-center ${
                  step.status === 'excellent' ? 'bg-score-excellent/20' :
                  step.status === 'good' ? 'bg-score-good/20' :
                  step.status === 'warning' ? 'bg-warning/20' : 'bg-destructive/20'
                }`}>
                  <span className="text-lg font-bold text-foreground">{100 - step.dropoff}%</span>
                </div>
                <p className="text-xs font-medium text-foreground">{step.name}</p>
                {step.dropoff > 0 && (
                  <p className="text-[10px] text-destructive">-{step.dropoff}%</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div className="space-y-2">
          {data.conversion.issues.map((issue, i) => (
            <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
          ))}
        </div>
      </PDFPage>

      {/* Page 8: Security */}
      <PDFPage pageNumber={8} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Security Review</h2>
            <p className="text-xs text-muted-foreground">SSL, headers, and trust analysis</p>
          </div>
        </div>

        {/* SSL Status */}
        <div className={`rounded-lg p-4 mb-5 flex items-center gap-3 ${data.security.sslValid ? 'bg-score-excellent/10 border border-score-excellent/20' : 'bg-destructive/10 border border-destructive/20'}`}>
          <Lock className={`w-6 h-6 ${data.security.sslValid ? 'text-score-excellent' : 'text-destructive'}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {data.security.sslValid ? 'SSL Certificate Valid' : 'SSL Certificate Issue'}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.security.sslValid ? 'Your site is served over HTTPS with a valid certificate' : 'Certificate expired or misconfigured'}
            </p>
          </div>
        </div>

        {/* Security Headers */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Security Headers</h3>
        <div className="bg-card rounded-lg shadow-card border border-border/50 mb-5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Header</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.security.headers.map((header, i) => (
                <tr key={i}>
                  <td className="py-2 px-3 text-xs text-foreground">{header.name}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      header.status === 'present' ? 'bg-score-excellent/10 text-score-excellent' :
                      header.status === 'missing' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                    }`}>
                      {header.status === 'present' ? 'Present' : header.status === 'missing' ? 'Missing' : 'Misconfigured'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{header.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Issues & Recommendation */}
        <div className="space-y-2 mb-4">
          {data.security.issues.map((issue, i) => (
            <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
          ))}
        </div>

        <RecommendationBox
          type="ai"
          title="Security Recommendation"
          description={data.security.recommendation}
        />
      </PDFPage>

      {/* Page 9: Optimization Roadmap */}
      <PDFPage pageNumber={9} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Optimization Roadmap</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Prioritized action plan for maximum impact
        </p>

        <div className="space-y-6">
          <RoadmapPhase
            phase={1}
            title="Quick Wins"
            description="High impact, low effort improvements"
            items={data.roadmap.phase1}
          />
          <RoadmapPhase
            phase={2}
            title="Strategic Improvements"
            description="Medium-term optimization projects"
            items={data.roadmap.phase2}
          />
          <RoadmapPhase
            phase={3}
            title="Advanced Optimization"
            description="Long-term growth initiatives"
            items={data.roadmap.phase3}
          />
        </div>
      </PDFPage>

      {/* Page 10: Final Recommendations */}
      <PDFPage pageNumber={10} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Growth Recommendations</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Key takeaways and next steps for your website
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {data.recommendations.map((rec, i) => (
            <div key={i} className={`rounded-lg p-4 border ${
              rec.priority === 'high' ? 'bg-primary/5 border-primary/20' :
              rec.priority === 'medium' ? 'bg-accent/5 border-accent/20' : 'bg-secondary/50 border-border/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  rec.priority === 'high' ? 'bg-primary/10 text-primary' :
                  rec.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                }`}>
                  {rec.priority.toUpperCase()}
                </span>
                <span className="text-[10px] text-muted-foreground">{rec.category}</span>
              </div>
              <h4 className="font-semibold text-sm text-foreground mb-1">{rec.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-primary/10 rounded-xl p-6 text-center border border-primary/20">
          <h3 className="text-lg font-bold text-foreground mb-2">Ready to Optimize?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our team can help you implement these recommendations and improve your website performance.
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
            Get Expert Help <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </PDFPage>
    </div>
  );
};
