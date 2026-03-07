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
  result_urls?: string[];
  result_url?: string;
  clean_studio_photo_url?: string;
  clean_lifestyle_photo_urls?: string[];
  clean_collage_url?: string;
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
        // Include listing kits and studio generations
        const listingJobs = (data || []).filter(
          (job: any) =>
            job?.tier === "photos" ||
            job?.mode === "listing_kit" ||
            job?.mode === "model_shoot" ||
            job?.mode === "food_photography" ||
            job?.mode === "holiday_ad" ||
            job?.mode === "virtual_staging"
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

  const getBadgeLabel = (job: ListingJob) => {
    if (job.mode === "listing_kit") return "Listing Kit";
    if (job.mode === "model_shoot") return "Apparel Studio";
    if (job.mode === "food_photography") return "Food Studio";
    if (job.mode === "holiday_ad") return "Holiday Studio";
    if (job.mode === "virtual_staging") return "Staging Studio";
    return "Studio";
  };

  const getImages = (job: ListingJob) => {
    if (job.all_results && job.all_results.length > 0) {
      return job.all_results.map((img) => img.url);
    }
    if (job.result_urls && job.result_urls.length > 0) {
      return job.result_urls;
    }
    if (job.result_url) {
      return [job.result_url];
    }
    if (job.clean_studio_photo_url) {
      const imgs = [job.clean_studio_photo_url];
      if (job.clean_lifestyle_photo_urls?.length) imgs.push(...job.clean_lifestyle_photo_urls);
      if (job.clean_collage_url) imgs.push(job.clean_collage_url);
      return imgs;
    }
    return [];
  };

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
                      {job.listing_title || getBadgeLabel(job)}
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {getBadgeLabel(job)}
                  </span>
                </div>

                {/* Render based on job type */}
                {job.mode === "listing_kit" ? (
                  /* Listing Kit Layout */
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
                        {getImages(job).length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {getImages(job).map((url, i) => (
                              <div
                                key={`${job.id}-img-${i}`}
                                className="relative aspect-square rounded-md overflow-hidden border border-white/10 bg-black/40"
                              >
                                <img
                                  src={url}
                                  alt={`generated-${i}`}
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
                ) : (
                  /* Photo Generation Layout (apparel, food, holiday, staging) */
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Generated Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Photo results */}
                        {job.all_results && job.all_results.length > 0 && (
                          <div className="col-span-2 md:col-span-3 lg:col-span-4">
                            <div className="space-y-2 mb-4">
                              <p className="text-xs font-semibold text-muted-foreground">Standard Photos</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {job.all_results.map((img, i) => (
                                  <div
                                    key={`${job.id}-standard-${i}`}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40 group cursor-pointer"
                                  >
                                    <img
                                      src={img.url}
                                      alt={`Generated image ${i + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <a
                                        href={img.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                                      >
                                        View Full Size
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Clean studio photos */}
                        {job.result_urls && job.result_urls.length > 0 && (
                          <div className="col-span-2 md:col-span-3 lg:col-span-4">
                            <div className="space-y-2 mb-4">
                              <p className="text-xs font-semibold text-muted-foreground">Clean Studio Photos</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {job.result_urls.map((url, i) => (
                                  <div
                                    key={`${job.id}-clean-${i}`}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40 group cursor-pointer"
                                  >
                                    <img
                                      src={url}
                                      alt={`Clean studio ${i + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                                      >
                                        View Full Size
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Single clean studio photo */}
                        {job.clean_studio_photo_url && (
                          <div className="col-span-2 md:col-span-3 lg:col-span-4">
                            <div className="space-y-2 mb-4">
                              <p className="text-xs font-semibold text-muted-foreground">Clean Studio Photo</p>
                              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40 group cursor-pointer inline-block">
                                <img
                                  src={job.clean_studio_photo_url}
                                  alt="Clean studio"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <a
                                    href={job.clean_studio_photo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                                  >
                                    View Full Size
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Clean lifestyle photos */}
                        {job.clean_lifestyle_photo_urls && job.clean_lifestyle_photo_urls.length > 0 && (
                          <div className="col-span-2 md:col-span-3 lg:col-span-4">
                            <div className="space-y-2 mb-4">
                              <p className="text-xs font-semibold text-muted-foreground">Clean Lifestyle Photos</p>
                              <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-4 gap-3">
                                {job.clean_lifestyle_photo_urls.map((url, i) => (
                                  <div
                                    key={`${job.id}-lifestyle-${i}`}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40 group cursor-pointer"
                                  >
                                    <img
                                      src={url}
                                      alt={`Lifestyle ${i + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                                      >
                                        View Full Size
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Collage */}
                        {job.clean_collage_url && (
                          <div className="col-span-2 md:col-span-3 lg:col-span-4">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground">Photo Collage</p>
                              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40 group cursor-pointer inline-block">
                                <img
                                  src={job.clean_collage_url}
                                  alt="Photo collage"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <a
                                    href={job.clean_collage_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
                                  >
                                    View Full Size
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* No images message */}
                      {getImages(job).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-8">No images generated for this job.</p>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
