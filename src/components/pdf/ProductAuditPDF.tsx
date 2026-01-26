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

// Placeholder data - all values are dynamic
const data = {
  productName: "{{product_name}}",
  websiteName: "{{website_name}}",
  date: "{{report_date}}",
  conversionScore: 68,
  contentScore: 72,
  visualScore: 65,
  trustScore: 58,
  ctaScore: 70,
  mobileScore: 78,
  aiSummary:
    "{{ai_summary}} - This product page has strong mobile experience but significant trust and visual gaps are limiting conversions. Adding customer reviews and optimizing product imagery could boost add-to-cart rates by 20%+.",
};

export const ProductAuditPDF = () => {
  const totalPages = 9;

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
            <p className="text-xl font-bold text-foreground mb-0.5">8</p>
            <p className="text-xs text-muted-foreground">Issues Found</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <div className="w-10 h-10 rounded-full bg-score-excellent/10 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-score-excellent" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">+22%</p>
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
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-score-excellent mt-1.5 flex-shrink-0" />
                Mobile-optimized product gallery
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-score-excellent mt-1.5 flex-shrink-0" />
                Clear pricing structure
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-score-excellent mt-1.5 flex-shrink-0" />
                Fast add-to-cart functionality
              </li>
            </ul>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              Priority Fixes
            </h3>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                Add customer reviews section
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                Include lifestyle imagery
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                Strengthen value proposition
              </li>
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
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-excellent/10 text-score-excellent">Strong</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">Clear, includes key features</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Description Length</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">Short</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">Only 45 words, recommend 150+</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Feature Bullets</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-good/10 text-score-good">Good</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">5 bullets, benefit-focused</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">Specifications</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-score-excellent/10 text-score-excellent">Complete</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">Detailed specs table present</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-xs text-foreground">SEO Optimization</td>
                <td className="py-2 px-3"><span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-warning/10 text-warning">Moderate</span></td>
                <td className="py-2 px-3 text-xs text-muted-foreground">Missing long-tail keywords</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2 mb-4">
          <IssueItem severity="warning" title="Product description too brief" description="Expand description to include use cases, benefits, and differentiation. Aim for 150-300 words." />
          <IssueItem severity="info" title="Add FAQ section" description="Common questions answered directly on page reduce friction and support calls." />
        </div>

        <RecommendationBox
          type="ai"
          title="AI Writing Suggestion"
          description="Focus on emotional benefits first, then features. Lead with how the product solves problems or improves life, then support with specifications."
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
            <p className="text-xl font-bold text-foreground mb-0.5">4</p>
            <p className="text-[10px] text-muted-foreground">Product Images</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-xl font-bold text-warning mb-0.5">0</p>
            <p className="text-[10px] text-muted-foreground">Lifestyle Photos</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-xl font-bold text-warning mb-0.5">0</p>
            <p className="text-[10px] text-muted-foreground">Videos</p>
          </div>
          <div className="bg-card rounded-lg p-3 shadow-card border border-border/50 text-center">
            <p className="text-xl font-bold text-score-excellent mb-0.5">Yes</p>
            <p className="text-[10px] text-muted-foreground">Zoom Feature</p>
          </div>
        </div>

        {/* Image Checklist */}
        <div className="bg-card rounded-lg shadow-card border border-border/50 mb-4 p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Visual Elements Checklist</h3>
          <StatusIndicator label="High-resolution product shots" status="pass" details="1200x1200px minimum met" />
          <StatusIndicator label="Multiple angles shown" status="pass" details="Front, back, side views" />
          <StatusIndicator label="Lifestyle/context imagery" status="fail" details="No in-use photos found" />
          <StatusIndicator label="Product video" status="fail" details="No demo or overview video" />
          <StatusIndicator label="Size reference/scale" status="partial" details="Dimensions listed but no visual" />
          <StatusIndicator label="Color variants shown" status="pass" details="All options have images" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <RecommendationBox
            type="tip"
            title="Add Lifestyle Photography"
            description="Show product in real-world context. Lifestyle images can increase conversion by 20-30%."
          />
          <RecommendationBox
            type="tip"
            title="Create Product Video"
            description="A 30-60 second demo video can boost time on page and reduce return rates."
          />
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
              <div className="text-3xl font-bold text-foreground">—</div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 text-muted-foreground/30" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">No reviews yet</p>
              </div>
            </div>
            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-[10px] text-destructive font-medium">⚠️ Missing reviews severely impacts trust</p>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <h3 className="font-semibold text-sm text-foreground mb-3">Trust Signals Found</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-score-excellent/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-score-excellent" />
                </div>
                <span className="text-foreground">Secure checkout badge</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                </div>
                <span className="text-muted-foreground">No money-back guarantee</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                </div>
                <span className="text-muted-foreground">No return policy visible</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Issues */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Critical Trust Gaps</h3>
        <div className="space-y-2 mb-4">
          <IssueItem severity="critical" title="No customer reviews displayed" description="Reviews are the #1 trust factor. Even 5 reviews can increase conversion by 15%." />
          <IssueItem severity="critical" title="No satisfaction guarantee" description="Money-back or satisfaction guarantees reduce purchase anxiety significantly." />
          <IssueItem severity="warning" title="Return policy not prominent" description="Clearly display return terms near add-to-cart button." />
        </div>

        <RecommendationBox
          type="ai"
          title="Trust Building Priority"
          description="Implement a review collection system immediately. Start with post-purchase email requests. Display any existing reviews prominently above the fold."
        />
      </PDFPage>

      {/* Page 7: User Journey & Checkout */}
      <PDFPage pageNumber={7} totalPages={totalPages}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">User Journey & Checkout Flow</h2>
            <p className="text-xs text-muted-foreground">Friction points and conversion blockers</p>
          </div>
        </div>

        {/* Journey Analysis */}
        <div className="bg-secondary/30 rounded-lg p-4 mb-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Purchase Path Analysis</h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-score-excellent flex items-center justify-center mx-auto mb-1.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-[10px] text-muted-foreground">View Product</p>
              <p className="text-xs font-medium text-foreground">100%</p>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-score-good flex items-center justify-center mx-auto mb-1.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Add to Cart</p>
              <p className="text-xs font-medium text-foreground">~35%</p>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center mx-auto mb-1.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Checkout</p>
              <p className="text-xs font-medium text-foreground">~18%</p>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center mx-auto mb-1.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Purchase</p>
              <p className="text-xs font-medium text-foreground">~8%</p>
            </div>
          </div>
        </div>

        {/* Friction Points */}
        <h3 className="font-semibold text-sm text-foreground mb-3">Identified Friction Points</h3>
        <div className="space-y-2 mb-4">
          <IssueItem severity="warning" title="Shipping cost revealed late" description="Display shipping estimate on product page to prevent checkout abandonment." />
          <IssueItem severity="warning" title="No guest checkout option" description="Mandatory account creation causes 23% checkout abandonment." />
          <IssueItem severity="info" title="Missing cart urgency elements" description="Add stock levels or limited-time offers to encourage immediate purchase." />
        </div>

        <RecommendationBox
          type="ai"
          title="Quick Win"
          description="Add a 'Free shipping over $X' threshold message and show estimated delivery date on product page. These two changes typically reduce cart abandonment by 15%."
        />
      </PDFPage>

      {/* Page 8: Optimization Roadmap */}
      <PDFPage pageNumber={8} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-1">Optimization Roadmap</h2>
        <p className="text-xs text-muted-foreground mb-5">Phased plan to maximize product page conversions</p>

        <RoadmapPhase
          phase="Phase 1"
          title="Quick Wins"
          timeline="Week 1"
          status="current"
          items={[
            { title: "Add money-back guarantee badge", description: "Near add-to-cart button" },
            { title: "Display shipping cost upfront", description: "Estimate on product page" },
            { title: "Expand product description", description: "Add benefits and use cases" },
            { title: "Enable guest checkout", description: "Remove account requirement" },
          ]}
        />

        <RoadmapPhase
          phase="Phase 2"
          title="Trust Building"
          timeline="Week 2-3"
          status="upcoming"
          items={[
            { title: "Implement review collection", description: "Post-purchase email automation" },
            { title: "Add lifestyle photography", description: "Product in real-world context" },
            { title: "Create product demo video", description: "30-60 second overview" },
            { title: "Display return policy prominently", description: "Clear, customer-friendly terms" },
          ]}
        />

        <RoadmapPhase
          phase="Phase 3"
          title="Conversion Optimization"
          timeline="Week 4-6"
          status="upcoming"
          items={[
            { title: "A/B test CTA variations", description: "Button color, copy, placement" },
            { title: "Add social proof elements", description: "Recent purchases, popularity badges" },
            { title: "Implement urgency triggers", description: "Stock levels, limited offers" },
            { title: "Optimize mobile checkout", description: "Streamlined mobile experience" },
          ]}
        />
      </PDFPage>

      {/* Page 9: Final Growth Insights */}
      <PDFPage pageNumber={9} totalPages={totalPages}>
        <h2 className="text-xl font-bold text-foreground mb-4">Final Growth Insights</h2>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-5">
          <h3 className="font-semibold text-sm text-foreground mb-2">Summary</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Your product page has a solid foundation with good mobile experience and clear pricing. 
            The primary conversion blockers are lack of social proof (no reviews) and missing trust signals. 
            Implementing Phase 1 quick wins could yield immediate 10-15% conversion improvement.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            With full implementation of all phases, expect to see add-to-cart rates increase by 20-30% 
            and overall conversion rates improve by 15-22% within 6 weeks.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-score-excellent mb-1">+22%</p>
            <p className="text-xs text-muted-foreground">Expected Conversion Lift</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-accent mb-1">+30%</p>
            <p className="text-xs text-muted-foreground">Add-to-Cart Rate</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50 text-center">
            <p className="text-2xl font-bold text-info mb-1">-15%</p>
            <p className="text-xs text-muted-foreground">Cart Abandonment</p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            Next Steps
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Ready to transform your product page? Our team can help you implement these 
            recommendations and set up ongoing optimization.
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-medium">
              Get Implementation Support
            </div>
            <div className="border border-primary text-primary px-4 py-2 rounded-lg text-xs font-medium">
              Schedule Review Call
            </div>
          </div>
        </div>
      </PDFPage>
    </div>
  );
};
