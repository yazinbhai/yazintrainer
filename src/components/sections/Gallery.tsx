"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Play, 
  X, 
  Sparkles
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  type: string; // 'photo' | 'video'
  url: string;
  thumbnailUrl?: string;
  date: string;
}

// Helpers for YouTube and Imgur URLs
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // Handle shorts
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  
  // Handle live streams
  const liveMatch = url.match(/\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  // Standard formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].trim().length === 11) {
    return match[2].trim();
  }
  
  // Direct ID check
  const directId = url.trim();
  if (directId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(directId)) {
    return directId;
  }

  return null;
}

function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
}

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getItemThumbnail(item: GalleryItem): string {
  if (item.thumbnailUrl && item.thumbnailUrl.trim() !== "") {
    return item.thumbnailUrl;
  }
  if (item.type === "video") {
    const ytThumb = getYouTubeThumbnail(item.url);
    if (ytThumb) return ytThumb;
    return "";
  }
  return item.url;
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "photo" | "video">("all");
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  // Fetch gallery items
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(
    (item) => activeTab === "all" || item.type === activeTab
  );

  return (
    <section className="py-24 bg-brand-muted" id="gallery">
      <div className="container px-6 md:px-12 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
              Visual Showcase
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-4">
              Training & Speaking <span className="text-brand-gold">Gallery.</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Moments from corporate training rooms, institutional workshops, and public keynotes.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-1">
            {(["all", "photo", "video"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-gray-600 hover:text-brand-navy"
                }`}
              >
                {tab === "all" ? "All Media" : tab + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const thumbUrl = getItemThumbnail(item);

              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer aspect-video"
                  onClick={() => setActiveLightbox(item)}
                >
                  {/* Media Thumbnail Preview Content */}
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const ytId = getYouTubeId(item.url);
                          if (ytId) {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                          }
                        }}
                      />
                    ) : item.type === "video" ? (
                      <video 
                        src={item.url} 
                        className="w-full h-full object-cover opacity-70"
                        muted 
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}

                    {/* Dark gradient overlay for videos */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors pointer-events-none">
                        <div className="w-14 h-14 bg-white/20 group-hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg text-white group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overlays & Information */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "photo" ? (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                          <ImageIcon className="w-3.5 h-3.5" /> Photo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                          <VideoIcon className="w-3.5 h-3.5" /> Video
                        </span>
                      )}

                      {item.thumbnailUrl && (
                        <span className="flex items-center gap-1 text-[9px] uppercase font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" /> Custom Cover
                        </span>
                      )}

                      <span className="text-[10px] text-gray-300 font-medium ml-auto">{item.date}</span>
                    </div>
                    <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">No media found</h3>
              <p className="text-gray-500">
                {activeTab === "all"
                  ? "Media items will appear here."
                  : `No ${activeTab} items exist in gallery.`}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActiveLightbox(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/10 hover:border-white/20 transition-all z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-5xl w-full max-h-[85vh] bg-transparent rounded-2xl overflow-hidden flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeLightbox.type === "photo" ? (
                <div className="relative w-full max-h-[75vh] flex justify-center">
                  <img
                    src={activeLightbox.url}
                    alt={activeLightbox.title}
                    className="object-contain max-h-[75vh] rounded-xl shadow-2xl"
                  />
                </div>
              ) : (
                <div className="w-full max-h-[75vh] aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                  {getYouTubeId(activeLightbox.url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(activeLightbox.url)}
                      title={activeLightbox.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={activeLightbox.url}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                    />
                  )}
                </div>
              )}

              {/* Title Header */}
              <div className="w-full text-center mt-4 text-white px-4">
                <h3 className="text-xl font-bold">{activeLightbox.title}</h3>
                <p className="text-xs text-gray-300 mt-1">{activeLightbox.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
