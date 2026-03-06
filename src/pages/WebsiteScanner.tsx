import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon,
  Search,
  ExternalLink,
  Loader2,
  X,
  Box,
  CheckCircle2,
  AlertCircle,
  Info,
  Grid3X3,
  FileText,
  Globe
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth0 } from "@auth0/auth0-react";

export interface ProductUrl {
  url: string;
  type: "product" | "category" | "sitemap" | "internal";
  confidence: number;
}

export default function WebsiteScanner() {
  const { user } = useAuth0();
  const [domain, setDomain] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [productUrls, setProductUrls] = useState<ProductUrl[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Extract domain from URL if full URL provided
    const droppedText = e.dataTransfer.files[0]?.name || e.dataTransfer.getData('text');
    const urlMatch = droppedText.match(/https?:\/\/([^\/]+)/);
    if (urlMatch) {
      setDomain(urlMatch[1]);
    } else {
      setDomain(droppedText);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const urlMatch = file.name.match(/https?:\/\/([^\/]+)/);
      if (urlMatch) {
        setDomain(urlMatch[1]);
      } else {
        setDomain(file.name);
      }
    }
  };

  const handleReset = () => {
    setDomain("");
    setProductUrls([]);
    setShowResults(false);
    setActiveJobId(null);
    setProgress(0);
  };

  const discoverProductUrls = async () => {
    if (!domain) {
      toast.error("Please enter a valid domain");
      return;
    }

    setIsScanning(true);
    setProgress(10);
    setProductUrls([]);

    try {
      // First, discover URLs via the new endpoint
      const data = await api.post("/scan-domain", { domain });
      setActiveJobId(data.jobId);
      setProgress(30);

      // Poll for results
      const pollResults = setInterval(async () => {
        try {
          const statusData = await api.get(`/job-status/${data.jobId}`);

          if (statusData.status === "completed") {
            clearInterval(pollResults);
            setIsScanning(false);
            setProgress(100);

            if (statusData.product_urls && statusData.product_urls.length > 0) {
              setProductUrls(statusData.product_urls);
              setShowResults(true);
              toast.success(`Discovered ${statusData.product_urls.length} product URLs!`);
            } else {
              setProductUrls([]);
              toast.warning("No product URLs found on this domain.");
            }
          } else if (statusData.status === "failed") {
            clearInterval(pollResults);
            setIsScanning(false);
            toast.error(statusData.error || "Scanning failed");
          } else if (statusData.status === "processing") {
            setProgress(Math.min(progress + 15, 90));
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    } catch (error: any) {
      console.error("Scan error:", error);
      setIsScanning(false);
      toast.error(error.response?.data?.error || "Failed to start scan. Please try again.");
    }
  };

  const canScan = domain.trim().length > 0;
  const getDomainDisplay = () => {
    return domain.startsWith("http") ? new URL(domain).hostname : domain;
  };

  const filteredUrls = (type: string | null) => {
    if (!type) return productUrls;
    return productUrls.filter((url) => url.type === type);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-primary" />
            <p className="text-sm text-primary font-medium">Product Discovery</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Website Scanner</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Automatically discover product URLs from any website. Enter a domain and let our scanner crawl the site to find products, categories, and internal pages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-foreground">Enter Domain</h3>
                <FeatureTooltip content="Supported: example.com, https://example.com, https://example.com/products" side="top">
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </FeatureTooltip>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-border bg-black/20"
                }`}
              >
                {domain ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{getDomainDisplay()}</p>
                        <p className="text-xs text-muted-foreground">Ready to scan</p>
                      </div>
                    </div>
                    <button onClick={handleReset} className="p-2 hover:bg-black/30 rounded-full transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">Enter or paste a domain URL</p>
                    <p className="text-xs text-muted-foreground mb-4">Example: example.com or https://example.com</p>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                      className="input-glass w-full px-4 py-3 text-center"
                    />
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Scan Button */}
            <div className="glass-card p-6">
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Scanning {getDomainDisplay()}... {Math.round(progress)}%
                      </span>
                    </div>
                    <button
                      onClick={handleReset}
                      className="btn-ghost text-sm flex items-center justify-center gap-1 py-2 px-3 w-full"
                    >
                      <X className="w-4 h-4" /> Cancel Scan
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button
                      onClick={discoverProductUrls}
                      disabled={!canScan}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Search className="w-5 h-5" /> {canScan ? `Scan ${getDomainDisplay()}` : "Enter a domain first"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">Discovery Results</h3>
                {productUrls.length > 0 && (
                  <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    {productUrls.length} URLs
                  </span>
                )}
              </div>
            </div>

            {!showResults ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Results will appear here after scanning completes</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Results Grid */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button
                    onClick={() => {}}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      productUrls.some((u) => u.type === "product")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Box className="w-4 h-4" /> Products
                    </div>
                  </button>
                  <button
                    onClick={() => {}}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      productUrls.some((u) => u.type === "category")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Grid3X3 className="w-4 h-4" /> Categories
                    </div>
                  </button>
                  <button
                    onClick={() => {}}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      productUrls.some((u) => u.type === "sitemap")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Sitemaps
                    </div>
                  </button>
                  <button
                    onClick={() => {}}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      productUrls.some((u) => u.type === "internal")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" /> Internal
                    </div>
                  </button>
                </div>

                {/* URL List */}
                <div className="flex-grow overflow-y-auto space-y-2 max-h-[400px]">
                  {productUrls.length > 0 ? (
                    productUrls.map((url, idx) => (
                      <div key={idx} className="glass-card/50 p-4 rounded-lg border border-border/50 hover:border-border/80 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            url.type === "product" ? "bg-green-500/20" :
                            url.type === "category" ? "bg-blue-500/20" :
                            url.type === "sitemap" ? "bg-purple-500/20" :
                            "bg-gray-500/20"
                          }`}>
                            {url.type === "product" ? <Box className="w-4 h-4 text-green-500" /> :
                             url.type === "category" ? <Grid3X3 className="w-4 h-4 text-blue-500" /> :
                             url.type === "sitemap" ? <FileText className="w-4 h-4 text-purple-500" /> :
                             <Globe className="w-4 h-4 text-gray-500" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {url.url}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                url.type === "product" ? "bg-green-500/20 text-green-500" :
                                url.type === "category" ? "bg-blue-500/20 text-blue-500" :
                                url.type === "sitemap" ? "bg-purple-500/20 text-purple-500" :
                                "bg-gray-500/20 text-gray-500"
                              }`}>
                                {url.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {(url.confidence * 100).toFixed(0)}% match
                              </span>
                            </div>
                          </div>
                          <a
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>No product URLs discovered</p>
                      <p className="text-sm">Try a different domain</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Tooltip component (can be moved to shared components)
const FeatureTooltip = ({ content, side, children }: { content: string; side: "top" | "bottom" | "left" | "right"; children: React.ReactNode }) => {
  return <>{children}</>;
};
