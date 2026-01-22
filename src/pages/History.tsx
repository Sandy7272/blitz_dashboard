import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Download, Trash2, Calendar, Zap, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockHistory = [
  {
    id: "1",
    type: "apparel",
    thumbnail: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200",
    createdAt: "2024-01-15T10:30:00Z",
    credits: 5,
    status: "completed",
  },
  {
    id: "2",
    type: "food",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200",
    createdAt: "2024-01-14T14:20:00Z",
    credits: 5,
    status: "completed",
  },
  {
    id: "3",
    type: "apparel",
    thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200",
    createdAt: "2024-01-13T09:15:00Z",
    credits: 5,
    status: "completed",
  },
  {
    id: "4",
    type: "audit",
    thumbnail: null,
    createdAt: "2024-01-12T16:45:00Z",
    credits: 10,
    status: "completed",
    url: "https://example.com",
  },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apparel: "Apparel Photography",
      food: "Food Photography",
      audit: "Site Doctor",
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              History
            </h1>
            <p className="text-muted-foreground">
              View and manage all your generated content
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass pl-10 py-2 w-64"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-secondary/50 relative overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt="Generated content"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🔍</span>
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="p-3 rounded-full bg-primary text-primary-foreground hover:shadow-glow transition-shadow">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {getTypeLabel(item.type)}
                  </span>
                  <span className="credit-pill text-xs py-1 px-2">
                    <Zap className="w-3 h-3" />
                    {item.credits}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.createdAt)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {mockHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📂</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No history yet
            </h3>
            <p className="text-muted-foreground">
              Start generating content to see your history here
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
