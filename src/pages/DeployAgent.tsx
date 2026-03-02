import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Upload, 
  Zap, 
  BrainCircuit, 
  Instagram, 
  Linkedin,
  Twitter,
  CheckCircle2, 
  Loader2,
  ArrowRight,
  MessageSquare,
  Layers,
  Rocket,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { api, type JobStatusResponse } from "@/lib/api";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// Types for our Mission Config
interface MissionConfig {
  brief: string;
  vibe: string;
  channels: string[];
}

export default function DeployAgent() {
  const navigate = useNavigate();
  const { user } = useAuth0(); // 2. Get User

  // Page Mode (Listing Kit is primary)
  const [mode, setMode] = useState<"campaign" | "listing">("listing");
  
  // 1. Load Brand DNA (The Brain)
  const [brandDNA, setBrandDNA] = useState<{colors: any, voice: string} | null>(null);
  
  // 2. Mission State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [config, setConfig] = useState<MissionConfig>({
    brief: "",
    vibe: "High Energy",
    channels: ["instagram_story"]
  });
  
  const [status, setStatus] = useState<"idle" | "uploading" | "thinking" | "deployed">("idle");
  const [activeJobId, setActiveJobId] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [searchParams] = useSearchParams();
  const roastId = searchParams.get('job_id');

  // 3. Listing Kit State
  const [listingFiles, setListingFiles] = useState<File[]>([]);
  const [listingPreviews, setListingPreviews] = useState<string[]>([]);
  const [listingJobId, setListingJobId] = useState<string | null>(null);
  const [listingStatus, setListingStatus] = useState<"idle" | "uploading" | "generating" | "ready">("idle");
  const [listingResults, setListingResults] = useState<string[]>([]);
  const [listingTitle, setListingTitle] = useState("");
  const [listingProductName, setListingProductName] = useState("");
  const [listingProductUrl, setListingProductUrl] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [listingFeatures, setListingFeatures] = useState<string[]>([]);
  const [listingZipUrl, setListingZipUrl] = useState<string | null>(null);
  const [listingSocialCopy, setListingSocialCopy] = useState<Record<string, any> | null>(null);
  const [listingManualStage, setListingManualStage] = useState<"listing" | "social" | null>(null);
  const [listingPushStatus, setListingPushStatus] = useState<"idle" | "pushing" | "pushed" | "failed">("idle");
  const [productId, setProductId] = useState("");
  const [productOptions, setProductOptions] = useState<Array<{ id: string; title: string }>>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSelection, setProductSelection] = useState("create_new");
  const [manualProductId, setManualProductId] = useState("");
  const [exportPlatform, setExportPlatform] = useState("woocommerce");
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [shopifyShop, setShopifyShop] = useState<string | null>(null);
  const [shopifyConnected, setShopifyConnected] = useState(false);

  // 3. FETCH DNA FROM API (Replaces localStorage)
  useEffect(() => {
    if (!user?.sub) return;

    const loadDNA = async () => {
      try {
        const dna = await api.getBrandDNA(user.sub);
        // Only set if we actually got data back
        if (dna && (dna.voice || dna.colors)) {
           setBrandDNA(dna);
        }
      } catch (e) {
        console.log("No cloud DNA found, using defaults.");
      }
    };
    loadDNA();
  }, [user]);

  // 3b. Load credits for header display and gating
  useEffect(() => {
    if (!user?.sub) return;
    const loadCredits = async () => {
      try {
        const profile = await api.getUserProfile(user.sub);
        setCredits(profile.credits ?? 0);
        setShopifyShop(profile.shopify_shop || null);
        setShopifyConnected(Boolean(profile.shopify_connected));
      } catch (e) {
        console.error("Failed to load credits", e);
      }
    };
    loadCredits();
  }, [user]);

  const connectShopify = async () => {
    const shop = prompt("Enter your shop URL (e.g. my-store.myshopify.com)");
    if (!shop || !user?.sub) return;

    try {
      const authUrl = await api.getShopifyConnectUrl(shop, user.sub);
      if (!authUrl) {
        toast.error("Could not start Shopify connect. Try again.");
        return;
      }
      toast.info("Redirecting to Shopify...");
      window.location.assign(authUrl);
    } catch (e) {
      console.error(e);
      toast.error("Failed to start Shopify connect.");
    }
  };

  // 4. Fetch Shopify products for picker (Listing Kit only)
  useEffect(() => {
    if (mode !== "listing" || !user?.sub) return;

    const loadProducts = async () => {
      setProductsLoading(true);
      try {
        const products = await api.getShopifyProducts(user.sub);
        setProductOptions(products);
      } catch (e) {
        console.error("Failed to load Shopify products", e);
        setProductOptions([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [mode, user]);

  // 1. Function to Trigger the Update
const handleDeployToStore = async () => {
  // 1. Get ID from URL (since activeJobId might be null in Fix Mode)
  
  const targetJobId = activeJobId || roastId; // <--- The Fix

  if (!targetJobId) {
    toast.error("No Job ID found. Please re-run the roast.");
    return;
  }
  try {
    toast.info("Agent is updating your store...");
    
    // Call the same start-processing endpoint, but with the NEW mode
    await api.post('/start-processing', {
      jobId: targetJobId, // The ID of the Roast Job
      mode: 'apply_shopify_update', 
      config: {
        // You would get these from the roastData/AI suggestions
        product_id: "8921381239", // Example Product ID
        updates: {
           title: "New Optimized Title",
           description: "<h2>Better Description</h2><p>Converted by Blitz.</p>"
        },
        whatsapp_user_id: user?.sub
      }
    });
    
    toast.success("Update Queued!");
  } catch (e) {
    toast.error("Failed to deploy.");
  }
};

  // --- Listing Kit Helpers ---
  const handleListingFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setListingFiles(files);
    setListingPreviews(files.map((f) => URL.createObjectURL(f)));
    // Reset results when new files are chosen
    setListingResults([]);
    setListingTitle("");
    setListingProductName("");
    setListingDescription("");
    setListingFeatures([]);
    setListingZipUrl(null);
    setListingSocialCopy(null);
    setListingManualStage(null);
    setListingProductUrl("");
    setListingPushStatus("idle");
    setListingJobId(null);
    setListingStatus("idle");
  };

  const handleProductSelectionChange = (value: string) => {
    setProductSelection(value);
    if (value === "create_new") {
      setProductId("");
    } else if (value === "manual") {
      setProductId(manualProductId);
    } else {
      setProductId(value);
    }
  };

  const collectListingImages = (data: JobStatusResponse) => {
    const images: string[] = [];
    if (data.clean_studio_photo_url) images.push(data.clean_studio_photo_url);
    if (data.clean_lifestyle_photo_urls?.length) images.push(...data.clean_lifestyle_photo_urls);
    if (data.clean_photo_urls?.length) images.push(...data.clean_photo_urls);
    if (data.clean_collage_url) images.push(data.clean_collage_url);
    return Array.from(new Set(images));
  };

  const pollListingStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getJobStatus(jobId);
        if (data.status === "pending_details" || data.status === "completed") {
          clearInterval(interval);
          setListingStatus("ready");
          setListingTitle(data.listing_title || "");
          setListingDescription(data.listing_description || "");
          setListingFeatures(data.listing_features || []);
          if (data.social_copy) {
            setListingSocialCopy(data.social_copy as Record<string, any>);
          }
          setListingZipUrl(data.assets_zip_url || null);
          setListingResults(collectListingImages(data));
        } else if (data.status === "failed") {
          clearInterval(interval);
          setListingStatus("idle");
          toast.error("Listing generation failed.");
        }
      } catch (e) {
        console.error(e);
      }
    }, 3000);
  };

  const handleGenerateListing = async () => {
    if (!listingFiles.length) {
      toast.error("Please add product images.");
      return;
    }
    if (!listingProductName.trim()) {
      toast.error("Please add the product name.");
      return;
    }
    if (credits !== null && credits <= 0) {
      setShowCreditModal(true);
      return;
    }

    try {
      setListingStatus("uploading");
      const fileTypes = listingFiles.map((f) => f.type);
      const jobData = await api.createPhotoJob(
        fileTypes,
        user?.sub,
        listingProductName.trim(),
        listingProductUrl.trim() || undefined
      );
      const { jobId, uploadUrls } = jobData;
      setListingJobId(jobId);

      await Promise.all(
        uploadUrls.map((u, i) => api.uploadToS3(u.url, listingFiles[i]))
      );

      setListingStatus("generating");
      setListingPushStatus("idle");
      setListingSocialCopy(null);
      setListingManualStage(null);
      await api.startProcessing(jobId, "listing_kit", {});
      pollListingStatus(jobId);
      toast.success("Listing kit started. Generating assets...");
    } catch (e) {
      console.error(e);
      setListingStatus("idle");
      toast.error("Failed to start listing generation.");
    }
  };

  const downloadBlob = (filename: string, data: BlobPart, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const buildListingExportJson = () => {
    return JSON.stringify(
      {
        platform: exportPlatform,
        title: listingTitle,
        description: listingDescription,
        features: listingFeatures,
        image_urls: listingResults,
      },
      null,
      2
    );
  };

  const buildListingExportCsv = () => {
    const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const features = listingFeatures.join(" | ");
    const imageUrls = listingResults.join(" | ");
    const header = ["title", "description", "features", "image_urls"].join(",");
    const row = [
      esc(listingTitle),
      esc(listingDescription),
      esc(features),
      esc(imageUrls),
    ].join(",");
    return `${header}\n${row}\n`;
  };

  const buildShopifyHtml = (description: string, features: string[]) => {
    const esc = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const descHtml = description ? `<p>${esc(description).replace(/\n/g, "<br/>")}</p>` : "";
    const featuresHtml = features?.length
      ? `<ul>${features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`
      : "";
    return `${descHtml}${featuresHtml}`.trim();
  };

  const handlePushListingToStore = async () => {
    if (!listingJobId) {
      toast.error("No listing job found. Generate a listing first.");
      return;
    }
    if (productSelection !== "create_new" && !productId) {
      toast.error("Please select or enter a Shopify Product ID.");
      return;
    }

    try {
      if (credits !== null && credits <= 0) {
        setShowCreditModal(true);
        return;
      }
      const html = buildShopifyHtml(listingDescription, listingFeatures);
      const imageUrls = listingResults;
      setListingPushStatus("pushing");
      
      await api.post('/start-processing', {
        jobId: listingJobId,
        mode: 'apply_shopify_update',
        config: {
          product_id: productId || null,
          updates: {
            title: listingTitle,
            description: html,
            image_urls: imageUrls
          },
          whatsapp_user_id: user?.sub
        }
      });
      // Poll for completion or insufficient credits
      const poll = setInterval(async () => {
        try {
          const status = await api.getJobStatus(listingJobId);
          if (status.status === "failed_credits") {
            clearInterval(poll);
            setShowCreditModal(true);
            setListingPushStatus("failed");
          } else if (status.status === "completed" || status.status === "completed_with_warnings") {
            clearInterval(poll);
            toast.success("Listing pushed to Shopify!");
            setListingPushStatus("pushed");
          } else if (status.status === "failed") {
            clearInterval(poll);
            toast.error("Shopify push failed.");
            setListingPushStatus("failed");
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to push listing to Shopify.");
      setListingPushStatus("failed");
    }
  };

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const toggleChannel = (channel: string) => {
    setConfig(prev => ({
      ...prev,
      channels: prev.channels.includes(channel) 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleDeploy = async () => {
    if (!file) {
      toast.error("Agent needs a product image to start.");
      return;
    }
    if (!config.brief) {
      toast.error("Please give the agent a brief.");
      return;
    }

    try {
      setStatus("uploading");
      
      // 4. CREATE JOB WITH USER ID
      // Ensure your api.ts createPhotoJob accepts userId as 2nd arg
      const jobData = await api.createPhotoJob([file.type], user?.sub);
      const { jobId, uploadUrls } = jobData;
      
      // 5. Upload to S3
      await api.uploadToS3(uploadUrls[0].url, file);
      
      setStatus("thinking");

      // AUTO-CONFIGURE: We now force all formats
      const allChannels = ["instagram_story", "instagram_feed", "instagram_carousel"];
      
      // 6. Start Agent (Passing Brand DNA + Brief)
      await api.startProcessing(jobId, "custom_campaign", {
        ...config,
        brand_voice: brandDNA?.voice || "Professional",
        brand_colors: brandDNA?.colors || {},
        deliverables: allChannels, // Force all
        whatsapp_user_id: user?.sub // Pass sub for tracking in backend details
      });

      // 7. REMOVED LOCAL STORAGE LOGIC
      // The backend now owns the "Active Mission" state in the DB.

      setStatus("deployed");
      setActiveJobId(jobId);
      toast.success("Agent deployed! Monitor progress in Mission Control.");
      
      // Redirect to Mission Control
      setTimeout(() => navigate("/missions"), 2000);

    } catch (e) {
      console.error(e);
      toast.error("Agent failed to deploy.");
      setStatus("idle");
    }
  };

  const brandColorList = (() => {
    if (!brandDNA?.colors) return [];
    if (Array.isArray(brandDNA.colors)) return brandDNA.colors.slice(0, 5);
    const obj = brandDNA.colors as Record<string, string>;
    return Object.values(obj).filter(Boolean).slice(0, 5);
  })();

  const listingStage = (() => {
    if (!listingFiles.length) return "upload";
    if (listingStatus === "uploading" || listingStatus === "generating") return "processing";
    if (listingStatus === "ready") {
      if (listingSocialCopy && listingManualStage === "social") return "social";
      return "listing";
    }
    return "upload";
  })();

  const processingSteps = [
    { label: "Uploading product images", done: listingStatus !== "uploading" },
    { label: "Generating listing images", done: listingStatus === "ready" || listingStatus === "generating" },
    { label: "Writing listing description", done: listingStatus === "ready" },
    { label: "Creating social media copy", done: Boolean(listingSocialCopy) },
  ];
  const activeProcessingIndex = Math.max(
    0,
    processingSteps.findIndex((step) => !step.done)
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {showCreditModal && (
          <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">
            <div className="glass-card p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-2">Insufficient Credits</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You need credits to continue. Get the $20 pack to unlock 10 listing kits.
              </p>
              <div className="flex gap-3">
                <RouterLink to="/billing" className="btn-primary flex-1 text-center">
                  Get $20 Pack
                </RouterLink>
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Credits</p>
              <p className="text-lg font-bold">
                {credits !== null ? `${credits} Cr` : "—"}
              </p>
            </div>
            <RouterLink
              to="/billing"
              className="btn-primary py-2 px-3 flex items-center gap-2 text-xs"
            >
              <Plus className="w-4 h-4" /> Add
            </RouterLink>
          </div>
          <div className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Shopify</p>
              {shopifyConnected ? (
                <p className="text-sm font-medium">Connected</p>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
              {shopifyShop && (
                <p className="text-[11px] text-muted-foreground">{shopifyShop}</p>
              )}
            </div>
            <button
              onClick={connectShopify}
              className={shopifyConnected ? "btn-secondary py-2 px-3 text-xs" : "btn-primary py-2 px-3 text-xs"}
            >
              {shopifyConnected ? "Reconnect" : "Connect"}
            </button>
          </div>
        </div>
        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("campaign")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              mode === "campaign"
                ? "bg-primary text-black"
                : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            Campaign
          </button>
          <button
            onClick={() => setMode("listing")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              mode === "listing"
                ? "bg-primary text-black"
                : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            Listing Kit
          </button>
        </div>

        {mode === "campaign" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-display font-bold">Deploy Campaign Agent</h1>
                <p className="text-muted-foreground">One brief. Multi-platform execution.</p>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Target Product
                </h3>
                <div className="border-2 border-dashed border-white/10 bg-black/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative group">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Product" className="h-64 mx-auto object-contain rounded-lg shadow-2xl" />
                      <button onClick={() => {setFile(null); setPreview(null)}} className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/50 p-2 rounded-full text-white">×</button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                      <p className="text-sm font-medium">Drop Product Image</p>
                      <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </>
                  )}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Mission Brief
                </h3>
                <textarea 
                  className="input-glass w-full h-32 resize-none text-lg"
                  placeholder="e.g., 'Launch our new Summer Collection. Make it feel urgent, high-energy, and Gen-Z focused.'"
                  value={config.brief}
                  onChange={(e) => setConfig({...config, brief: e.target.value})}
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div className="glass-card p-4 border-l-4 border-l-primary flex items-start gap-3">
                <BrainCircuit className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Brand Memory Active</h4>
                  {brandDNA ? (
                    <p className="text-xs text-muted-foreground mt-1">Voice: <span className="text-white">"{brandDNA.voice.substring(0, 30)}..."</span></p>
                  ) : (
                    <p className="text-xs text-red-400 mt-1">No DNA found. Using generic.</p>
                  )}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Package Includes
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium">Instagram Kit</span>
                    <span className="text-xs text-muted-foreground ml-auto">Story, Feed, Reel</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">X / Twitter</span>
                    <span className="text-xs text-muted-foreground ml-auto">Thread & Copy</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn</span>
                    <span className="text-xs text-muted-foreground ml-auto">Professional Post</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleDeployToStore}
                className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-xl font-bold flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" /> Push to Live Store
              </button>

              <button 
                onClick={handleDeploy}
                disabled={status !== 'idle'}
                className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-glow-hover"
              >
                {status === 'idle' && <>Deploy Agent <ArrowRight className="w-5 h-5" /></>}
                {status === 'uploading' && <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>}
                {status === 'thinking' && <><BrainCircuit className="w-5 h-5 animate-pulse" /> Strategizing...</>}
                {status === 'deployed' && <><CheckCircle2 className="w-5 h-5" /> Active</>}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">Listing Kit</h1>
                <p className="text-muted-foreground">
                  Go from raw product photos to a publish-ready listing in minutes.
                </p>
              </div>

              {listingStage === "upload" && (
                <div className="glass-card p-8 md:p-10 space-y-6 transition-all">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Step 1</p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">
                      Upload product photos + name
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add a clear product name so the description is accurate.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Product name</label>
                    <input
                      value={listingProductName}
                      onChange={(e) => setListingProductName(e.target.value)}
                      placeholder="e.g. Roadster Leather Riding Suit"
                      className="input-glass w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Product URL (optional)</label>
                    <input
                      value={listingProductUrl}
                      onChange={(e) => setListingProductUrl(e.target.value)}
                      placeholder="Paste a product page to pull extra angle refs"
                      className="input-glass w-full"
                    />
                  </div>

                  <div className="border-2 border-dashed border-white/10 bg-black/20 rounded-2xl p-10 text-center hover:border-primary/50 transition-colors relative group">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium">Drop 2–8 product images</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or WebP</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleListingFilesChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>

                  {listingPreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {listingPreviews.map((src, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30">
                          <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                      <span>
                        Brand DNA:{" "}
                        {brandDNA?.voice
                          ? `"${brandDNA.voice.substring(0, 30)}..."`
                          : "Not set"}
                      </span>
                    </div>
                    <RouterLink to="/brand-dna" className="text-primary hover:underline">
                      Edit Brand DNA
                    </RouterLink>
                  </div>

                  <button
                    onClick={handleGenerateListing}
                    disabled={listingStatus !== "idle"}
                    className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-glow-hover"
                  >
                    {listingStatus === "idle" && <>Generate Listing Kit <ArrowRight className="w-5 h-5" /></>}
                    {listingStatus === "uploading" && <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>}
                    {listingStatus === "generating" && <><BrainCircuit className="w-5 h-5 animate-pulse" /> Generating...</>}
                    {listingStatus === "ready" && <><CheckCircle2 className="w-5 h-5" /> Ready</>}
                  </button>
                </div>
              )}

              {listingStage === "processing" && (
                <div className="glass-card p-8 md:p-10 space-y-6 transition-all">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Step 2</p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">
                      Creating your listing
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Each step completes and slides away as we finish it.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {processingSteps.map((step, idx) => {
                      const isActive = idx === activeProcessingIndex;
                      const isDone = step.done;
                      return (
                        <div
                          key={`${step.label}-${idx}`}
                          className={`overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-500 ease-out ${
                            isDone
                              ? "opacity-0 -translate-x-6 max-h-0 py-0 border-transparent"
                              : isActive
                                ? "border-primary/40 bg-primary/10"
                                : "border-white/10 bg-black/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-primary" : "bg-white/20"}`} />
                            <div className="text-sm text-muted-foreground">{step.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {listingStage === "listing" && (
                <div className="glass-card p-8 md:p-10 space-y-6 transition-all">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Step 3</p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">
                      Listing created
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Push to Shopify or download for other platforms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Listing Copy</p>
                        <p className="text-base font-semibold">{listingTitle || "Untitled Listing"}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-3">
                          {listingDescription || "No description generated."}
                        </p>
                        {listingFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {listingFeatures.map((f, i) => (
                              <span key={i} className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Generated Images</p>
                        {listingResults.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {listingResults.map((src, idx) => (
                              <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/30">
                                <img src={src} alt={`result-${idx}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">Generated photos will appear here.</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Push to Shopify</p>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Target Product</label>
                          <select
                            value={productSelection}
                            onChange={(e) => handleProductSelectionChange(e.target.value)}
                            className="input-glass w-full"
                          >
                            <option value="create_new">Create new product</option>
                            {productOptions.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.id})
                              </option>
                            ))}
                            <option value="manual">Enter product ID manually</option>
                          </select>
                          {productsLoading && (
                            <p className="text-xs text-muted-foreground">Loading products…</p>
                          )}
                          {productSelection === "manual" && (
                            <input
                              value={manualProductId}
                              onChange={(e) => {
                                setManualProductId(e.target.value);
                                if (productSelection === "manual") {
                                  setProductId(e.target.value);
                                }
                              }}
                              placeholder="e.g., 8921381239"
                              className="input-glass w-full"
                            />
                          )}
                        </div>
                        <button
                          onClick={handlePushListingToStore}
                          disabled={listingStatus !== "ready"}
                          className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                          <Rocket className="w-5 h-5" /> Push to Shopify
                        </button>
                        {listingZipUrl ? (
                          <a
                            href={listingZipUrl}
                            className="w-full btn-secondary py-3 text-sm font-bold text-center"
                          >
                            Download Full Kit
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground">ZIP kit will be available after generation.</p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Download for other platforms</p>
                        <select
                          value={exportPlatform}
                          onChange={(e) => setExportPlatform(e.target.value)}
                          className="input-glass w-full"
                        >
                          <option value="woocommerce">WooCommerce</option>
                          <option value="magento">Magento</option>
                          <option value="amazon">Amazon</option>
                          <option value="etsy">Etsy</option>
                          <option value="bigcommerce">BigCommerce</option>
                          <option value="squarespace">Squarespace</option>
                          <option value="wix">Wix</option>
                        </select>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            disabled={listingStatus !== "ready"}
                            onClick={() =>
                              downloadBlob(
                                `listing_${exportPlatform}.json`,
                                buildListingExportJson(),
                                "application/json"
                              )
                            }
                            className="btn-secondary py-2 text-sm font-semibold disabled:opacity-50"
                          >
                            Download JSON
                          </button>
                          <button
                            disabled={listingStatus !== "ready"}
                            onClick={() =>
                              downloadBlob(
                                `listing_${exportPlatform}.csv`,
                                buildListingExportCsv(),
                                "text/csv"
                              )
                            }
                            className="btn-secondary py-2 text-sm font-semibold disabled:opacity-50"
                          >
                            Download CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {listingSocialCopy && (
                    <button
                      onClick={() => setListingManualStage("social")}
                      className="btn-secondary w-full py-3 text-sm font-semibold"
                    >
                      Continue to Social Content
                    </button>
                  )}
                </div>
              )}

              {listingStage === "social" && (
                <div className="glass-card p-8 md:p-10 space-y-6 transition-all">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Step 4</p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">
                      Social media content
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Copy and download your launch posts.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["instagram", "twitter", "linkedin"].map((plat) => (
                      <div key={plat} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs text-muted-foreground uppercase">{plat}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">
                          {listingSocialCopy?.[plat]?.caption || "No caption generated."}
                        </p>
                        <button
                          onClick={() => {
                            const content = listingSocialCopy?.[plat];
                            const text = `${content?.headline || ""}\n\n${content?.caption || ""}\n\n${
                              Array.isArray(content?.hashtags) ? content?.hashtags.join(" ") : content?.hashtags || ""
                            }`.trim();
                            navigator.clipboard.writeText(text);
                            toast.success(`Copied ${plat} copy`);
                          }}
                          className="btn-secondary w-full mt-3 text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setListingManualStage(null)}
                    className="text-xs text-muted-foreground hover:text-white"
                  >
                    Back to listing actions
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Blitz can make mistakes — please review text descriptions once you Push to Shopify.
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
