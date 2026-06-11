"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Play, 
  X, 
  Lock, 
  Unlock,
  Loader2,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  title: string;
  type: string; // 'photo' | 'video'
  url: string;
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
  
  // Direct ID check (fallback if they pasted just the ID)
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
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "/default-video-thumbnail.jpg";
}

function getDirectImgurUrl(url: string): string {
  if (url.includes("imgur.com") && !url.includes("i.imgur.com")) {
    const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
    if (match) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
  }
  return url;
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "photo" | "video">("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);
  
  // Password Protection State
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Upload/Link form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo");
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Delete Confirmation modal states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminPassword("");
    } else {
      setLoginPassword("");
      setLoginError("");
      setIsLoginOpen(true);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setLoginError("");

    try {
      const res = await fetch("/api/gallery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });

      if (res.ok) {
        setAdminPassword(loginPassword);
        setIsAdmin(true);
        setIsLoginOpen(false);
      } else {
        setLoginError("Incorrect password. Please try again.");
      }
    } catch (err) {
      setLoginError("Connection error. Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredItems = items.filter(
    (item) => activeTab === "all" || item.type === activeTab
  );

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) {
      setUploadError("Please enter a media URL.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const finalUrl = getDirectImgurUrl(uploadUrl);

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          title: uploadTitle,
          type: uploadType,
          url: finalUrl,
        }),
      });

      if (res.ok) {
        setUploadTitle("");
        setUploadUrl("");
        setIsUploadOpen(false);
        fetchItems();
      } else {
        const errorData = await res.json();
        setUploadError(errorData.error || "Save failed. Please try again.");
      }
    } catch (err) {
      setUploadError("Network error. Save failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening Lightbox
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ id: deleteTargetId }),
      });

      if (res.ok) {
        setIsDeleteConfirmOpen(false);
        setDeleteTargetId(null);
        fetchItems();
      } else {
        alert("Failed to delete media item.");
      }
    } catch (err) {
      console.error("Delete media failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

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

          {/* Admin Controls Area */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={handleAdminToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                isAdmin
                  ? "bg-brand-navy border-brand-navy text-white shadow-md animate-pulse"
                  : "bg-white border-gray-200 text-gray-700 hover:border-brand-navy cursor-pointer"
              }`}
            >
              {isAdmin ? <Unlock className="w-4 h-4 text-brand-gold" /> : <Lock className="w-4 h-4" />}
              <span>{isAdmin ? "Admin Mode On" : "Admin Mode"}</span>
            </button>

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Button
                  variant="accent"
                  onClick={() => setIsUploadOpen(true)}
                  className="rounded-full flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Link</span>
                </Button>
              </motion.div>
            )}
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
            {filteredItems.map((item) => (
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
                {/* Media Content */}
                {item.type === "photo" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center">
                      {getYouTubeId(item.url) ? (
                        <img
                          src={getYouTubeThumbnail(item.url)}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <video 
                          src={item.url} 
                          className="w-full h-full object-cover opacity-60"
                          muted 
                          playsInline
                        />
                      )}
                    </div>
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Play Button Icon */}
                    <div className="relative z-10 w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                )}

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
                    <span className="text-[10px] text-gray-300 font-medium">{item.date}</span>
                  </div>
                  <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Delete Controls (Admin Only) */}
                {isAdmin && (
                  <button
                    onClick={(e) => requestDelete(item.id, e)}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-md border border-red-500/20 cursor-pointer"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">No media found</h3>
              <p className="text-gray-500">
                {activeTab === "all"
                  ? "Add photo or video links to start building your gallery."
                  : `No ${activeTab} items exist in your gallery.`}
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
                    />
                  )}
                </div>
              )}

              {/* Title & Metadata */}
              <div className="w-full max-w-3xl text-center mt-6 text-white px-4">
                <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {activeLightbox.type} &bull; {activeLightbox.date}
                </p>
                <h3 className="text-xl md:text-2xl font-bold">{activeLightbox.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Media Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsUploadOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-brand-navy text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-brand-gold" />
                  <span>Add Gallery Item</span>
                </h3>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUploadSubmit} className="p-8 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-brand-navy">
                    Media Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter descriptive title"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors"
                  />
                </div>

                {/* Media Type Selection */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-brand-navy block">Media Type</span>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadType("photo");
                        setUploadUrl("");
                      }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all cursor-pointer ${
                        uploadType === "photo"
                          ? "bg-brand-navy/5 border-brand-navy text-brand-navy"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadType("video");
                        setUploadUrl("");
                      }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all cursor-pointer ${
                        uploadType === "video"
                          ? "bg-brand-navy/5 border-brand-navy text-brand-navy"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <VideoIcon className="w-4 h-4" />
                      <span>Video</span>
                    </button>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <label htmlFor="media-url" className="text-sm font-semibold text-brand-navy">
                    {uploadType === "photo" ? "Imgur Image Link" : "YouTube Video Link"}
                  </label>
                  <input
                    id="media-url"
                    type="url"
                    required
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder={
                      uploadType === "photo"
                        ? "e.g., https://imgur.com/abc or direct image URL"
                        : "e.g., https://www.youtube.com/watch?v=abc"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors"
                  />
                </div>

                {/* Error Message */}
                {uploadError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                    {uploadError}
                  </p>
                )}

                {/* Submit Action */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    disabled={isUploading}
                    className="flex-1 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isUploading || !uploadUrl}
                    className="flex-1 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy/95 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Add Item</span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Passcode Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-brand-navy text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-gold" />
                  <span>Admin Access</span>
                </h3>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="admin-pass" className="text-sm font-semibold text-brand-navy">
                    Enter Admin Passcode
                  </label>
                  <input
                    id="admin-pass"
                    type="password"
                    required
                    autoFocus
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors"
                  />
                </div>

                {loginError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse">
                    {loginError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(false)}
                    disabled={isVerifying}
                    className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isVerifying || !loginPassword}
                    className="flex-1 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Access</span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-600 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Media Item</span>
                </h3>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-left">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Are you sure you want to delete this media item? This action will permanently remove it from the gallery.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
