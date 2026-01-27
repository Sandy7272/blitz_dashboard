import PDFCoverPage from "./PDFCoverPage";
import PDFPage from "./PDFPage";
import { ScoreCircle } from "../ui/ScoreCircle";
import { ScoreCard } from "../ui/ScoreCard";
import { ScoreBar } from "../ui/ScoreBar";
import { IssueItem } from "../ui/IssueItem";
import { RecommendationBox } from "../ui/RecommendationBox";
import { RoadmapPhase } from "../ui/RoadmapPhase";
import { StatusIndicator } from "../ui/StatusIndicator";
import { ProductAuditData } from "@/types/audit";
import {
  FileText,
  Image,
  Award,
  ShoppingCart,
  Smartphone,
  Target,
  CheckCircle2,
  Zap,
  Star,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

interface ProductAuditPDFProps {
  data: ProductAuditData;
}

export const ProductAuditPDF = ({ data }: ProductAuditPDFProps) => {
  const totalPages = 9;

  const getStatusBadge = (status: string) => {
    const styles = {
      excellent: "bg-score-excellent/10 text-score-excellent",
      good: "bg-score-good/10 text-score-good",
      warning: "bg-warning/10 text-warning",
      critical: "bg-destructive/10 text-destructive",
    };
    const labels = {
      excellent: "Strong",
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
        title="Product Page Audit"
        subtitle="Conversion optimization analysis and recommendations"
        websiteName={data.productName}
        date={data.date}
        overallScore={data.conversionScore}
        reportType="product"
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

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <div className="w-10 h-10 rounded-full bg-score-good/10 flex items-center justify-center mx-auto mb-2">
              <ShoppingCart className="w-5 h-5 text-score-good" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">{data.conversionScore}%</p>
            <p className="text-xs text-muted-foreground">Conversion Ready</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">{data.issuesCount}</p>
            <p className="text-xs text-muted-foreground">Issues Found</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <div className="w-10 h-10 rounded-full bg-score-excellent/10 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-score-excellent" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">{data.potentialUplift}</p>
            <p className="text-xs text-muted-foreground">Potential Uplift</p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-score-excellent/5 border border-score-excellent/20 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-score-excellent" />
              What's Working
            </h3>
            <ul className="space-y-1.5">
              {data.whatsWorking.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-score-excellent mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              Priority Fixes
            </h3>
            <ul className="space-y-1.5">
              {data.priorityFixes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PDFPage>

      {/* Page 3: Conversion Performance Dashboard */}
      <PDFPage pageNumber={3} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Conversion Performance Dashboard</h2>

        <div className="flex items-center justify-center mb-6">
          <ScoreCircle score={data.conversionScore} size="xl" label="Conversion Readiness" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <ScoreCard title="Content Quality" score={data.contentScore} icon={FileText} description="Title, description, specs" />
          <ScoreCard title="Visual Design" score={data.visualScore} icon={Image} description="Images, layout, aesthetics" />
          <ScoreCard title="Trust & Credibility" score={data.trustScore} icon={Award} description="Reviews, badges, guarantees" />
          <ScoreCard title="CTA Effectiveness" score={data.ctaScore} icon={ShoppingCart} description="Buttons, urgency, clarity" />
          <ScoreCard title="Mobile Experience" score={data.mobileScore} icon={Smartphone} description="Responsiveness, usability" className="col-span-2" />
        </div>

        <div className="bg-secondary/30 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Performance Breakdown</h3>
          <div className="space-y-3">
            <ScoreBar score={data.contentScore} label="Content Quality" />
            <ScoreBar score={data.visualScore} label="Visual Design" />
            <ScoreBar score={data.trustScore} label="Trust & Credibility" />
            <ScoreBar score={data.ctaScore} label="CTA Effectiveness" />
            <ScoreBar score={data.mobileScore} label="Mobile Experience" />
          </div>
        </div>
      </PDFPage>

      {/* Page 4: Product Content Quality */}
      <PDFPage pageNumber={4} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Product Content Quality</h2>
            <p className="text-xs text-muted-foreground">Title, description, and specifications analysis</p>
          </div>
        </div>

        {/* Content Analysis */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 mb-5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Element</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Assessment</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Product Title</td>
                <td className="py-2 px-3">{getStatusBadge(data.content.titleAssessment.status)}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{data.content.titleAssessment.details}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Description Length</td>
                <td className="py-2 px-3">{getStatusBadge(data.content.descriptionAssessment.status)}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{data.content.descriptionAssessment.details}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Feature Bullets</td>
                <td className="py-2 px-3">{getStatusBadge(data.content.bulletsAssessment.status)}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{data.content.bulletsAssessment.details}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Specifications</td>
                <td className="py-2 px-3">{getStatusBadge(data.content.specsAssessment.status)}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{data.content.specsAssessment.details}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">SEO Optimization</td>
                <td className="py-2 px-3">{getStatusBadge(data.content.seoAssessment.status)}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{data.content.seoAssessment.details}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2 mb-4">
          {data.content.issues.map((issue, i) => (
            <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
          ))}
        </div>

        <RecommendationBox
          type="ai"
          title="AI Writing Suggestion"
          description={data.content.aiSuggestion}
        />
      </PDFPage>

      {/* Page 5: Visual & Media Quality */}
      <PDFPage pageNumber={5} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Visual & Media Quality</h2>
            <p className="text-xs text-muted-foreground">Image quality, consistency, and media analysis</p>
          </div>
        </div>

        {/* Visual Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-xl font-bold text-foreground mb-0.5">{data.visual.productImages}</p>
            <p className="text-[10px] text-muted-foreground">Product Images</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className={`text-xl font-bold ${data.visual.lifestylePhotos > 0 ? 'text-foreground' : 'text-warning'} mb-0.5`}>
              {data.visual.lifestylePhotos}
            </p>
            <p className="text-[10px] text-muted-foreground">Lifestyle Photos</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className={`text-xl font-bold ${data.visual.videos > 0 ? 'text-foreground' : 'text-warning'} mb-0.5`}>
              {data.visual.videos}
            </p>
            <p className="text-[10px] text-muted-foreground">Videos</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className={`text-xl font-bold ${data.visual.hasZoom ? 'text-score-excellent' : 'text-warning'} mb-0.5`}>
              {data.visual.hasZoom ? 'Yes' : 'No'}
            </p>
            <p className="text-[10px] text-muted-foreground">Zoom Feature</p>
          </div>
        </div>

        {/* Image Checklist */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 mb-4 p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Visual Elements Checklist</h3>
          {data.visual.checklist.map((item, i) => (
            <StatusIndicator key={i} label={item.label} status={item.status} details={item.details} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.visual.recommendations.map((rec, i) => (
            <RecommendationBox
              key={i}
              type="tip"
              title={i === 0 ? "Add Lifestyle Photography" : "Create Product Video"}
              description={rec}
            />
          ))}
        </div>
      </PDFPage>

      {/* Page 6: Trust & Social Proof */}
      <PDFPage pageNumber={6} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Trust & Social Proof</h2>
            <p className="text-xs text-muted-foreground">Reviews, ratings, and credibility signals</p>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <h3 className="font-semibold text-sm text-foreground mb-3">Customer Reviews</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl font-bold text-foreground">
                {data.trust.hasReviews ? data.trust.averageRating.toFixed(1) : '—'}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        data.trust.hasReviews && star <= Math.round(data.trust.averageRating)
                          ? 'text-warning fill-warning'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.trust.hasReviews ? `${data.trust.reviewCount} reviews` : 'No reviews yet'}
                </p>
              </div>
            </div>
            {!data.trust.hasReviews && (
              <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-[10px] text-destructive font-medium">⚠️ Missing reviews severely impacts trust</p>
              </div>
            )}
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <h3 className="font-semibold text-sm text-foreground mb-3">Trust Signals Found</h3>
            <ul className="space-y-2">
              {data.trust.signals.map((signal, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    signal.present ? 'bg-score-excellent/10' : 'bg-destructive/10'
                  }`}>
                    {signal.present ? (
                      <CheckCircle2 className="w-3 h-3 text-score-excellent" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-destructive" />
                    )}
                  </div>
                  <span className={signal.present ? 'text-foreground' : 'text-muted-foreground'}>
                    {signal.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Issues */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Critical Trust Gaps</h3>
        <div className="space-y-2">
          {data.trust.issues.map((issue, i) => (
            <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
          ))}
        </div>
      </PDFPage>

      {/* Page 7: CTA & Mobile */}
      <PDFPage pageNumber={7} totalPages={totalPages}>
        <div className="grid grid-cols-2 gap-6">
          {/* CTA Analysis */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">CTA Analysis</h2>
                <p className="text-xs text-muted-foreground">Button effectiveness</p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 mb-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm">
                  {data.cta.buttonText}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Visibility</span>
                  {getStatusBadge(data.cta.visibility)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Urgency</span>
                  {getStatusBadge(data.cta.urgency)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Value Proposition</span>
                  {getStatusBadge(data.cta.valueProposition)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {data.cta.issues.map((issue, i) => (
                <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
              ))}
            </div>
          </div>

          {/* Mobile Experience */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Mobile Experience</h2>
                <p className="text-xs text-muted-foreground">Responsive usability</p>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <ScoreCircle score={data.mobile.score} size="md" label="Mobile Score" />
            </div>

            <div className="bg-card rounded-lg shadow-card border border-border/50 p-4 mb-4">
              {data.mobile.checklist.map((item, i) => (
                <StatusIndicator key={i} label={item.label} status={item.status} details={item.details} />
              ))}
            </div>

            <div className="space-y-2">
              {data.mobile.issues.map((issue, i) => (
                <IssueItem key={i} severity={issue.severity} title={issue.title} description={issue.description} />
              ))}
            </div>
          </div>
        </div>
      </PDFPage>

      {/* Page 8: Optimization Roadmap */}
      <PDFPage pageNumber={8} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Optimization Roadmap</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Prioritized action plan for maximum conversion impact
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

      {/* Page 9: Final Recommendations */}
      <PDFPage pageNumber={9} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Conversion Growth Recommendations</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Key takeaways and next steps for your product page
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
          <h3 className="text-lg font-bold text-foreground mb-2">Ready to Boost Conversions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our team can help you implement these recommendations and optimize your product pages.
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
            Get Expert Help <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </PDFPage>
    </div>
  );
};
