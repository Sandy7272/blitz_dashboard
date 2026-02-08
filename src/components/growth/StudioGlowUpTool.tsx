import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

type GlowFormat = "square" | "story" | "landscape";

const FORMAT_PREVIEW: Record<GlowFormat, { w: number; h: number; label: string }> = {
  square: { w: 360, h: 360, label: "Square (1080×1080)" },
  story: { w: 360, h: 640, label: "Story (1080×1920)" },
  landscape: { w: 400, h: 225, label: "Landscape (1200×675)" },
};

function normalizeUrl(input: string) {
  const v = (input || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function safeHostname(input: string) {
  const v = normalizeUrl(input);
  if (!v) return "";
  try {
    return new URL(v).hostname.replace(/^www\./i, "");
  } catch {
    return input.trim();
  }
}

export function StudioGlowUpTool(props: {
  defaultBeforeUrl?: string | null;
  defaultAfterUrl?: string | null;
  defaultStoreUrl?: string;
  defaultTitle?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [format, setFormat] = useState<GlowFormat>("square");
  const [beforePreview, setBeforePreview] = useState<string | null>(props.defaultBeforeUrl || null);
  const [afterPreview, setAfterPreview] = useState<string | null>(props.defaultAfterUrl || null);
  const [storeUrl, setStoreUrl] = useState(props.defaultStoreUrl || "");
  const [downloading, setDownloading] = useState(false);

  const dims = FORMAT_PREVIEW[format];
  const hostname = safeHostname(storeUrl) || "yourstore.com";
  const title = (props.defaultTitle || "").trim();

  const canExport = Boolean(beforePreview && afterPreview);

  const caption = useMemo(() => {
    const pieces: string[] = [];
    pieces.push("Studio Glow-Up (Before → After)");
    if (title) pieces.push(title);
    const cleanUrl = normalizeUrl(storeUrl);
    if (cleanUrl) pieces.push(cleanUrl);
    pieces.push("Made with Blitz ⚡️");
    return pieces.join("\n");
  }, [storeUrl, title]);

  const pickImage = (which: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (which === "before") setBeforePreview(url);
    else setAfterPreview(url);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    if (!canExport) {
      toast.error("Add both Before and After images first.");
      return;
    }
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `blitz-studio-glow-up-${format}.png`;
      a.click();
      toast.success("Downloaded PNG");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export image.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold">Studio Glow-Up</h3>
        <p className="text-sm text-muted-foreground">
          A clean before/after card people love sharing (and it nudges clicks back to your store).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Format</label>
              <select
                className="input-glass mt-1"
                value={format}
                onChange={(e) => setFormat(e.target.value as GlowFormat)}
              >
                <option value="square">{FORMAT_PREVIEW.square.label}</option>
                <option value="story">{FORMAT_PREVIEW.story.label}</option>
                <option value="landscape">{FORMAT_PREVIEW.landscape.label}</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Store URL</label>
              <input
                className="input-glass mt-1"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="yourstore.com/products/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Before</label>
              <div className="border border-white/10 bg-black/20 rounded-xl p-3">
                {beforePreview ? (
                  <img
                    src={beforePreview}
                    crossOrigin="anonymous"
                    alt="before"
                    className="w-full h-40 object-contain rounded-lg bg-black/30"
                  />
                ) : (
                  <div className="h-40 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-sm text-muted-foreground">
                    Upload your raw product photo
                  </div>
                )}
                <label className="btn-secondary py-2 px-3 text-xs inline-flex items-center gap-2 cursor-pointer mt-3">
                  <Upload className="w-4 h-4" />
                  Upload Before
                  <input type="file" accept="image/*" className="hidden" onChange={pickImage("before")} />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">After</label>
              <div className="border border-white/10 bg-black/20 rounded-xl p-3">
                {afterPreview ? (
                  <img
                    src={afterPreview}
                    crossOrigin="anonymous"
                    alt="after"
                    className="w-full h-40 object-contain rounded-lg bg-black/30"
                  />
                ) : (
                  <div className="h-40 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-sm text-muted-foreground">
                    Use your Blitz studio photo (or upload one)
                  </div>
                )}
                <label className="btn-secondary py-2 px-3 text-xs inline-flex items-center gap-2 cursor-pointer mt-3">
                  <Upload className="w-4 h-4" />
                  Upload After
                  <input type="file" accept="image/*" className="hidden" onChange={pickImage("after")} />
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!canExport || downloading}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Exporting..." : "Download PNG"}
          </button>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-muted-foreground mb-1">Suggested caption</p>
            <pre className="text-[11px] whitespace-pre-wrap text-white/90 font-sans">
              {caption}
            </pre>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Preview</p>
            <span className="text-[11px] text-muted-foreground">
              Exports at full resolution
            </span>
          </div>

          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-[28px] border border-white/10 shadow-2xl"
              style={{
                width: dims.w,
                height: dims.h,
                background:
                  "radial-gradient(900px 600px at 15% 10%, rgba(16, 185, 129, 0.22), transparent 55%), radial-gradient(900px 600px at 85% 25%, rgba(59, 130, 246, 0.18), transparent 55%), linear-gradient(180deg, rgba(8, 12, 18, 0.95), rgba(8, 12, 18, 0.70))",
              }}
            >
              <div className="absolute inset-x-0 top-4 px-5 flex items-center justify-between">
                <div className="text-white font-display font-extrabold tracking-tight text-[14px]">
                  Studio Glow-Up
                </div>
                <div className="text-[10px] text-white/60">Made with Blitz</div>
              </div>

              <div className="absolute inset-x-0 top-12 px-5">
                <div className="text-[11px] text-white/70 truncate">{title || hostname}</div>
              </div>

              <div className="absolute inset-x-0 top-[22%] px-5 h-[60%] grid grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/25">
                  {beforePreview ? (
                    <img
                      src={beforePreview}
                      crossOrigin="anonymous"
                      alt="before-card"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-white/60">
                      Before
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/45 border border-white/10 text-[10px] text-white">
                    Before
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/25">
                  {afterPreview ? (
                    <img
                      src={afterPreview}
                      crossOrigin="anonymous"
                      alt="after-card"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-white/60">
                      After
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-black text-[10px] font-bold">
                    After
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-4 px-5 flex items-center justify-between gap-3">
                <div className="px-3 py-2 rounded-full bg-black/35 border border-white/10 text-[11px] text-white/90 truncate">
                  {hostname}
                </div>
                <div className="px-3 py-2 rounded-full bg-primary text-black text-[11px] font-bold">
                  Shop now
                </div>
              </div>
            </div>
          </div>

          {!canExport && (
            <p className="text-[11px] text-muted-foreground">
              Tip: Once you generate a Listing Kit, use the studio image as the “After”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

