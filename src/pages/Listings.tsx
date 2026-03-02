import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Image as ImageIcon, Copy } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ListingJob {
  id: string;
  status: string;
  created_at?: string;
  listing_title?: string;
  listing_description?: string;
  listing_features?: string[];
  all_results?: Array<{ format: string; url: string }>;
  social_copy?: any;
  tier?: string;
  mode?: string;
}

export default function Listings() {
  const { user } = useAuth0();
  const [jobs, setJobs] = useState<ListingJob[]>([]);

  useEffect(() => {
    if (!user?.sub) return;
    let mounted = true;

    const fetchJobs = async () => {
      try {
        const data = await api.getUserMissions(user.sub);
        const listingJobs = (data || []).filter(
          (job: any) => job?.tier === "photos" || job?.mode === "listing_kit"
        );
        if (mounted) setJobs(listingJobs);
      } catch (e) {
        console.error(e);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const at = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bt - at;
    });
  }, [jobs]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Past Listings</h1>
          <p className="text-muted-foreground">
            Review previous listing kits and social media posts.
          </p>
        </div>

        {sortedJobs.length === 0 ? (
          <div className="glass-card p-8 text-center text-sm text-muted-foreground">
            No listings yet. Generate one in Listing Kit.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <div key={job.id} className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {job.created_at ? new Date(job.created_at).toLocaleString() : "—"}
                    </p>
                    <h3 className="text-lg font-bold">
                      {job.listing_title || "Untitled Listing"}
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Listing Kit
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="glass-card p-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Listing Copy
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {job.listing_description || "No description available."}
                      </p>
                      {job.listing_features && job.listing_features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.listing_features.map((f, i) => (
                            <span
                              key={`${job.id}-feat-${i}`}
                              className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="glass-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <ImageIcon className="w-3 h-3" /> Generated Images
                        </h4>
                      </div>
                      {job.all_results && job.all_results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {job.all_results.map((img, i) => (
                            <div
                              key={`${job.id}-img-${i}`}
                              className="relative aspect-square rounded-md overflow-hidden border border-white/10 bg-black/40"
                            >
                              <img
                                src={img.url}
                                alt={img.format}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No images available.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Social Media Copy
                      </h4>
                      {job.social_copy ? (
                        <Tabs defaultValue="instagram" className="w-full">
                          <TabsList className="bg-black/40 h-8 p-0 border border-white/10">
                            <TabsTrigger value="instagram" className="text-xs h-full px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">IG</TabsTrigger>
                            <TabsTrigger value="twitter" className="text-xs h-full px-3 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">X</TabsTrigger>
                            <TabsTrigger value="linkedin" className="text-xs h-full px-3 data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-300">LI</TabsTrigger>
                          </TabsList>
                          {["instagram", "twitter", "linkedin"].map((plat) => {
                            const content = typeof job.social_copy === "object" && job.social_copy[plat]
                              ? job.social_copy[plat]
                              : plat === "instagram"
                                ? job.social_copy
                                : null;

                            if (!content) {
                              return (
                                <TabsContent key={plat} value={plat} className="text-xs text-muted-foreground">
                                  No content generated.
                                </TabsContent>
                              );
                            }

                            return (
                              <TabsContent key={plat} value={plat} className="mt-2">
                                <div className="relative bg-white/5 rounded-lg border border-white/5 p-3 text-xs text-muted-foreground space-y-2">
                                  {content.headline && (
                                    <p className="font-semibold text-white">{content.headline}</p>
                                  )}
                                  <p className="whitespace-pre-wrap leading-relaxed">{content.caption}</p>
                                  {content.hashtags && (
                                    <p className="text-blue-400">
                                      {Array.isArray(content.hashtags)
                                        ? content.hashtags.join(" ")
                                        : content.hashtags}
                                    </p>
                                  )}
                                  <button
                                    onClick={() => {
                                      const text = `${content.headline || ""}\n\n${content.caption}\n\n${
                                        Array.isArray(content.hashtags)
                                          ? content.hashtags.join(" ")
                                          : content.hashtags || ""
                                      }`.trim();
                                      navigator.clipboard.writeText(text);
                                      toast.success(`Copied ${plat} copy`);
                                    }}
                                    className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 text-xs text-center border border-white/10 rounded-md transition-colors flex items-center justify-center gap-2"
                                  >
                                    <Copy className="w-3 h-3" /> Copy
                                  </button>
                                </div>
                              </TabsContent>
                            );
                          })}
                        </Tabs>
                      ) : (
                        <p className="text-xs text-muted-foreground">No social copy available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

