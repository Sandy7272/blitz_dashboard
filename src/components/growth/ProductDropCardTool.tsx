import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Copy, Download, Upload } from "lucide-react";
import { toast } from "sonner";

type DropFormat = "story" | "square" | "landscape";
type DropTheme = "neon" | "clean" | "lux";

const FORMAT_PREVIEW: Record<DropFormat, { w: number; h: number; label: string }> = {
  story: { w: 360, h: 640, label: "Story (1080×1920)" },
  square: { w: 360, h: 360, label: "Square (1080×1080)" },
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

function clampTextStyle(lines: number) {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    WebkitLineClamp: lines,
    overflow: "hidden",
  };
}

export function ProductDropCardTool(props: {
  defaultImageUrl?: string | null;
  defaultTitle?: string;
  defaultPrice?: string;
  defaultStoreUrl?: string;
  blitzUrl?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [format, setFormat] = useState<DropFormat>("story");
  const [theme, setTheme] = useState<DropTheme>("neon");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(props.defaultImageUrl || null);

  const [title, setTitle] = useState(props.defaultTitle || "");
  const [price, setPrice] = useState(props.defaultPrice || "");
  const [storeUrl, setStoreUrl] = useState(props.defaultStoreUrl || "");
  const [tag, setTag] = useState("NEW DROP");
  const [downloading, setDownloading] = useState(false);

  const dims = FORMAT_PREVIEW[format];
  const hostname = safeHostname(storeUrl) || "yourstore.com";
  const blitzLink = useMemo(() => {
    if (props.blitzUrl) return props.blitzUrl;
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  }, [props.blitzUrl]);
  const blitzHost = safeHostname(blitzLink) || "blitz.ai";

  const themeVars = useMemo(() => {
    if (theme === "lux") {
      return {
        bg: "radial-gradient(1200px 700px at 20% 10%, rgba(255, 215, 0, 0.18), transparent 55%), radial-gradient(900px 600px at 90% 20%, rgba(16, 185, 129, 0.12), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.65))",
        accent: "rgba(255, 215, 0, 0.95)",
        border: "rgba(255, 215, 0, 0.25)",
      };
    }
    if (theme === "clean") {
      return {
        bg: "radial-gradient(900px 600px at 20% 10%, rgba(16, 185, 129, 0.18), transparent 60%), radial-gradient(900px 600px at 90% 30%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(180deg, rgba(8, 12, 18, 0.95), rgba(8, 12, 18, 0.70))",
        accent: "rgba(16, 185, 129, 0.95)",
        border: "rgba(16, 185, 129, 0.25)",
      };
    }
    // neon
    return {
      bg: "radial-gradient(900px 600px at 15% 10%, rgba(16, 185, 129, 0.28), transparent 55%), radial-gradient(900px 600px at 85% 25%, rgba(59, 130, 246, 0.22), transparent 55%), radial-gradient(900px 600px at 55% 90%, rgba(236, 72, 153, 0.14), transparent 60%), linear-gradient(180deg, rgba(8, 12, 18, 0.95), rgba(8, 12, 18, 0.68))",
      accent: "rgba(16, 185, 129, 0.95)",
      border: "rgba(16, 185, 129, 0.25)",
    };
  }, [theme]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const caption = useMemo(() => {
    const pieces: string[] = [];
    const cleanTitle = (title || "").trim() || "New drop";
    const cleanPrice = (price || "").trim();
    const cleanUrl = normalizeUrl(storeUrl);
    pieces.push(`${cleanTitle}${cleanPrice ? ` — ${cleanPrice}` : ""}`);
    if (cleanUrl) pieces.push(cleanUrl);
    pieces.push(`Made with Blitz ⚡️ ${blitzHost}`);
    return pieces.join("\n");
  }, [title, price, storeUrl]);

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Copied caption");
    } catch {
      toast.error("Could not copy (browser blocked clipboard).");
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    if (!imagePreview) {
      toast.error("Add a product image first.");
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
      a.download = `blitz-drop-card-${format}.png`;
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
        <h3 className="text-lg font-bold">Drop Poster Generator</h3>
        <p className="text-sm text-muted-foreground">
          A launch-ready poster that feels premium and drives clicks to your store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-xs text-muted-foreground">Product Image</label>
          <div className="border border-white/10 bg-black/20 rounded-xl p-4 relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                crossOrigin="anonymous"
                alt="drop-preview"
                className="w-full h-44 object-contain rounded-lg bg-black/30"
              />
            ) : (
              <div className="h-44 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-sm text-muted-foreground">
                Upload one hero image
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <label className="btn-secondary py-2 px-3 text-xs inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
              </label>
              {imageFile && (
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(props.defaultImageUrl || null);
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Format</label>
              <select
                className="input-glass mt-1"
                value={format}
                onChange={(e) => setFormat(e.target.value as DropFormat)}
              >
                <option value="story">{FORMAT_PREVIEW.story.label}</option>
                <option value="square">{FORMAT_PREVIEW.square.label}</option>
                <option value="landscape">{FORMAT_PREVIEW.landscape.label}</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Theme</label>
              <select
                className="input-glass mt-1"
                value={theme}
                onChange={(e) => setTheme(e.target.value as DropTheme)}
              >
                <option value="neon">Neon</option>
                <option value="clean">Clean</option>
                <option value="lux">Luxury</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Tag</label>
              <input
                className="input-glass mt-1"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g., NEW DROP"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Price (optional)</label>
              <input
                className="input-glass mt-1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='$79'
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Product Name</label>
            <input
              className="input-glass mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Black Sneakers"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Store URL</label>
            <input
              className="input-glass mt-1"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="yourstore.com/products/..."
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tip: paste your product link (best), or your store URL.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Exporting..." : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={handleCopyCaption}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
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
              className="relative overflow-hidden rounded-[28px] border shadow-2xl"
              style={{
                width: dims.w,
                height: dims.h,
                borderColor: themeVars.border,
                background: themeVars.bg,
              }}
            >
              {/* Soft glows */}
              <div
                className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-60"
                style={{ background: themeVars.accent }}
              />
              <div className="absolute -bottom-28 -right-28 w-72 h-72 rounded-full bg-blue-500/25 blur-3xl" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <div
                  className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border"
                  style={{ borderColor: themeVars.border, color: "white", background: "rgba(0,0,0,0.35)" }}
                >
                  {tag || "NEW DROP"}
                </div>
              </div>

              {/* Price */}
              {price?.trim() ? (
                <div className="absolute top-4 right-4">
                  <div
                    className="px-3 py-1 rounded-full text-[11px] font-bold border"
                    style={{ borderColor: themeVars.border, color: "black", background: themeVars.accent }}
                  >
                    {price.trim()}
                  </div>
                </div>
              ) : null}

              {/* Product image */}
              <div className="absolute inset-x-0 top-[18%] flex justify-center px-6">
                <div className="w-full h-[46%] rounded-2xl bg-black/25 border border-white/10 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      crossOrigin="anonymous"
                      alt="product"
                      className="w-full h-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground">Add an image</div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="absolute inset-x-0 bottom-[18%] px-6">
                <div className="text-white font-display font-extrabold tracking-tight leading-tight">
                  <div
                    className="text-[22px] md:text-[22px]"
                    style={clampTextStyle(format === "landscape" ? 1 : 2)}
                  >
                    {(title || "").trim() || "Your Product Name"}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="absolute inset-x-0 bottom-4 px-6 flex items-center justify-between gap-3">
                <div className="px-3 py-2 rounded-full bg-black/35 border border-white/10 text-[11px] text-white/90 truncate">
                  {hostname}
                </div>
                <div
                  className="px-3 py-2 rounded-full text-[11px] font-bold"
                  style={{ color: "black", background: themeVars.accent }}
                >
                  Shop now
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-4 right-6 translate-x-2 text-[10px] text-white/70">
                Made with Blitz • {blitzHost}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-muted-foreground mb-1">Suggested caption</p>
            <pre className="text-[11px] whitespace-pre-wrap text-white/90 font-sans">
              {caption}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
