"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Lock, 
  Unlock, 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Quote, 
  Building2, 
  Play, 
  Sparkles,
  Award
} from "lucide-react";

// Helpers for YouTube and Imgur URLs
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  const liveMatch = url.match(/\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].trim().length === 11) {
    return match[2].trim();
  }
  const directId = url.trim();
  if (directId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(directId)) {
    return directId;
  }
  return null;
}

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function getItemThumbnail(item: any): string {
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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "testimonials" | "logos">("gallery");

  // Data states
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Gallery Modal States
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryFormId, setGalleryFormId] = useState<string | null>(null);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryType, setGalleryType] = useState<"photo" | "video">("photo");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [galleryThumbnailUrl, setGalleryThumbnailUrl] = useState("");
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  // Testimonial Modal States
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialFormId, setTestimonialFormId] = useState<string | null>(null);
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);
  const [testimonialError, setTestimonialError] = useState("");

  // Logo Modal States
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoFormId, setLogoFormId] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoCategory, setLogoCategory] = useState("Corporate");
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");

  // Check stored passcode on mount
  useEffect(() => {
    const storedPass = sessionStorage.getItem("yazintrainer_admin_pass");
    if (storedPass) {
      verifyStoredPassword(storedPass);
    } else {
      setIsLoadingData(false);
    }
  }, []);

  const verifyStoredPassword = async (pass: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/gallery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        setAdminPassword(pass);
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        sessionStorage.removeItem("yazintrainer_admin_pass");
      }
    } catch (err) {
      console.error("Auto login failed", err);
    } finally {
      setIsVerifying(false);
      setIsLoadingData(false);
    }
  };

  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      const [gRes, tRes, lRes] = await Promise.all([
        fetch("/api/gallery?t=" + Date.now()),
        fetch("/api/testimonials?t=" + Date.now()),
        fetch("/api/client-logos?t=" + Date.now())
      ]);

      if (gRes.ok) setGalleryItems(await gRes.json());
      if (tRes.ok) setTestimonials(await tRes.json());
      if (lRes.ok) setClientLogos(await lRes.json());
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setIsLoadingData(false);
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
        sessionStorage.setItem("yazintrainer_admin_pass", loginPassword);
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setLoginError("Incorrect passcode. Please try again.");
      }
    } catch (err) {
      setLoginError("Connection error. Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("yazintrainer_admin_pass");
    setAdminPassword("");
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  // --- GALLERY HANDLERS ---
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle.trim() || !galleryUrl.trim()) {
      setGalleryError("Title and Media Link are required.");
      return;
    }

    setIsUploadingGallery(true);
    setGalleryError("");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          id: galleryFormId,
          title: galleryTitle,
          type: galleryType,
          url: galleryUrl,
          thumbnailUrl: galleryThumbnailUrl,
        }),
      });

      if (res.ok) {
        setIsGalleryModalOpen(false);
        fetchAllData();
      } else {
        const errorData = await res.json();
        setGalleryError(errorData.error || "Save failed.");
      }
    } catch (err) {
      setGalleryError("Network error.");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAllData();
      else alert("Failed to delete item.");
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumb = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        headers: { "x-admin-password": adminPassword },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (isThumb) setGalleryThumbnailUrl(data.url);
        else setGalleryUrl(data.url);
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  // --- TESTIMONIAL HANDLERS ---
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialQuote.trim() || !testimonialAuthor.trim() || !testimonialRole.trim()) {
      setTestimonialError("All fields are required.");
      return;
    }

    setIsSavingTestimonial(true);
    setTestimonialError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          id: testimonialFormId,
          quote: testimonialQuote,
          author: testimonialAuthor,
          role: testimonialRole,
        }),
      });

      if (res.ok) {
        setIsTestimonialModalOpen(false);
        fetchAllData();
      } else {
        const data = await res.json();
        setTestimonialError(data.error || "Save failed.");
      }
    } catch (err) {
      setTestimonialError("Network error.");
    } finally {
      setIsSavingTestimonial(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAllData();
      else alert("Failed to delete testimonial.");
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // --- LOGO HANDLERS ---
  const handleLogoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoName.trim()) {
      setLogoError("Client name is required.");
      return;
    }

    setIsSavingLogo(true);
    setLogoError("");

    try {
      const res = await fetch("/api/client-logos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          id: logoFormId,
          name: logoName,
          logoUrl: logoUrl,
          category: logoCategory,
        }),
      });

      if (res.ok) {
        setIsLogoModalOpen(false);
        fetchAllData();
      } else {
        const data = await res.json();
        setLogoError(data.error || "Save failed.");
      }
    } catch (err) {
      setLogoError("Network error.");
    } finally {
      setIsSavingLogo(false);
    }
  };

  const deleteLogo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this logo?")) return;
    try {
      const res = await fetch("/api/client-logos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAllData();
      else alert("Failed to delete logo.");
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        headers: { "x-admin-password": adminPassword },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.url);
      }
    } catch (err) {
      console.error("Logo upload error", err);
    }
  };

  // Render Login Form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-brand-navy text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="w-full max-w-md bg-white text-brand-navy rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-gold/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-brand-gold" />
            </div>
            <h1 className="text-2xl font-bold">Yazin Trainer Admin</h1>
            <p className="text-xs text-gray-500 mt-2">
              Enter your passcode to manage Gallery, Testimonials & Client Logos
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label htmlFor="passcode" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Admin Passcode
              </label>
              <input
                id="passcode"
                type="password"
                required
                autoFocus
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-navy text-brand-navy text-center tracking-widest text-lg font-bold"
              />
            </div>

            {loginError && (
              <div className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !loginPassword}
              className="w-full py-3.5 rounded-xl bg-brand-navy text-white font-bold text-sm tracking-wide uppercase hover:bg-brand-indigo transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-brand-gold" />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-4">
            <a 
              href="/" 
              className="text-xs text-gray-500 hover:text-brand-navy transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <span>Return to yazintrainer.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Render Admin Dashboard
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 pt-24 pb-20">
      {/* Top Navbar */}
      <div className="border-b border-gray-200 bg-white fixed top-0 inset-x-0 z-40 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <a href="/" className="font-bold text-xl text-brand-navy flex items-center gap-2">
            <span>Yazin</span>
            <span className="text-brand-gold">Trainer</span>
          </a>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-600 hover:text-brand-navy flex items-center gap-1.5 transition-colors font-medium"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="text-xs px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-4">
        {/* Management Tabs */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ImageIcon className="w-4 h-4 text-brand-gold" />
              <span>Gallery ({galleryItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "testimonials"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Quote className="w-4 h-4 text-brand-gold" />
              <span>Testimonials ({testimonials.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("logos")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "logos"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-gold" />
              <span>Client Logos ({clientLogos.length})</span>
            </button>
          </div>

          {/* Tab Specific Add Button */}
          {activeTab === "gallery" && (
            <button
              onClick={() => {
                setGalleryFormId(null);
                setGalleryTitle("");
                setGalleryType("photo");
                setGalleryUrl("");
                setGalleryThumbnailUrl("");
                setGalleryError("");
                setIsGalleryModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-indigo transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Add Gallery Item</span>
            </button>
          )}

          {activeTab === "testimonials" && (
            <button
              onClick={() => {
                setTestimonialFormId(null);
                setTestimonialQuote("");
                setTestimonialAuthor("");
                setTestimonialRole("");
                setTestimonialError("");
                setIsTestimonialModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-indigo transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Add Testimonial</span>
            </button>
          )}

          {activeTab === "logos" && (
            <button
              onClick={() => {
                setLogoFormId(null);
                setLogoName("");
                setLogoUrl("");
                setLogoCategory("Corporate");
                setLogoError("");
                setIsLogoModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-indigo transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Add Client Logo</span>
            </button>
          )}
        </div>

        {/* TAB 1: GALLERY TAB */}
        {activeTab === "gallery" && (
          <div>
            {isLoadingData ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-navy" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => {
                  const thumb = getItemThumbnail(item);
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="aspect-video bg-black relative">
                        {thumb ? (
                          <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs">No preview</div>
                        )}
                        <span className="absolute top-3 left-3 bg-brand-navy/80 backdrop-blur-md text-[10px] uppercase font-bold text-brand-gold px-2.5 py-1 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-brand-navy text-base line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-gray-500 truncate mt-1">{item.url}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100">
                          <span className="text-[11px] text-gray-400">{item.date}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setGalleryFormId(item.id);
                                setGalleryTitle(item.title);
                                setGalleryType(item.type as "photo" | "video");
                                setGalleryUrl(item.url);
                                setGalleryThumbnailUrl(item.thumbnailUrl || "");
                                setGalleryError("");
                                setIsGalleryModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => deleteGalleryItem(item.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TESTIMONIALS TAB */}
        {activeTab === "testimonials" && (
          <div>
            {isLoadingData ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-navy" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <Quote className="w-8 h-8 text-brand-gold/60 mb-3" />
                      <p className="text-brand-navy text-sm font-medium italic mb-4 leading-relaxed">
                        &quot;{item.quote}&quot;
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{item.author}</div>
                        <div className="text-brand-gold text-xs font-semibold uppercase">{item.role}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setTestimonialFormId(item.id);
                            setTestimonialQuote(item.quote);
                            setTestimonialAuthor(item.author);
                            setTestimonialRole(item.role);
                            setTestimonialError("");
                            setIsTestimonialModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteTestimonial(item.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LOGOS TAB */}
        {activeTab === "logos" && (
          <div>
            {isLoadingData ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-navy" /></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {clientLogos.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col items-center justify-between text-center relative group">
                    <div className="w-full h-24 relative flex items-center justify-center mb-3">
                      {item.logoUrl ? (
                        <img src={item.logoUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Award className="w-10 h-10 text-brand-gold" />
                      )}
                    </div>
                    <div className="font-bold text-sm text-brand-navy truncate w-full">{item.name}</div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{item.category || "Corporate"}</div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 w-full justify-center">
                      <button
                        onClick={() => {
                          setLogoFormId(item.id);
                          setLogoName(item.name);
                          setLogoUrl(item.logoUrl || "");
                          setLogoCategory(item.category || "Corporate");
                          setLogoError("");
                          setIsLogoModalOpen(true);
                        }}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLogo(item.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* GALLERY MODAL */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsGalleryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsGalleryModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-brand-navy mb-4">{galleryFormId ? "Edit Gallery Item" : "Add Gallery Item"}</h3>
              <form onSubmit={handleGallerySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Title</label>
                  <input type="text" required value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="Title" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setGalleryType("photo")} className={`py-2 rounded-xl text-xs font-bold border ${galleryType === "photo" ? "bg-brand-navy text-white border-brand-navy" : "bg-gray-50 border-gray-200 text-gray-700"}`}>Photo</button>
                    <button type="button" onClick={() => setGalleryType("video")} className={`py-2 rounded-xl text-xs font-bold border ${galleryType === "video" ? "bg-brand-navy text-white border-brand-navy" : "bg-gray-50 border-gray-200 text-gray-700"}`}>Video</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Media Link / File</label>
                  <input type="text" required value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-2" placeholder="YouTube URL or Image URL" />
                  <label className="w-full py-2 px-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input type="file" onChange={(e) => handleGalleryFileUpload(e, false)} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Custom Thumbnail URL (Optional)</label>
                  <input type="text" value={galleryThumbnailUrl} onChange={(e) => setGalleryThumbnailUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-2" placeholder="Thumbnail URL" />
                  <label className="w-full py-2 px-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Thumbnail File
                    <input type="file" onChange={(e) => handleGalleryFileUpload(e, true)} className="hidden" />
                  </label>
                </div>
                {galleryError && <p className="text-xs text-red-600">{galleryError}</p>}
                <div className="flex gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold">Cancel</button>
                  <button type="submit" disabled={isUploadingGallery} className="flex-1 py-2.5 bg-brand-navy text-white rounded-xl text-xs font-bold">{isUploadingGallery ? "Saving..." : "Save Item"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TESTIMONIAL MODAL */}
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsTestimonialModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsTestimonialModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-brand-navy mb-4">{testimonialFormId ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Quote</label>
                  <textarea required rows={3} value={testimonialQuote} onChange={(e) => setTestimonialQuote(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="Testimonial quote text..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Author Name</label>
                  <input type="text" required value={testimonialAuthor} onChange={(e) => setTestimonialAuthor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="e.g. Dr. Rajesh Kumar" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Role / Designation</label>
                  <input type="text" required value={testimonialRole} onChange={(e) => setTestimonialRole(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="e.g. CEO, Apex Group" />
                </div>
                {testimonialError && <p className="text-xs text-red-600">{testimonialError}</p>}
                <div className="flex gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold">Cancel</button>
                  <button type="submit" disabled={isSavingTestimonial} className="flex-1 py-2.5 bg-brand-navy text-white rounded-xl text-xs font-bold">{isSavingTestimonial ? "Saving..." : "Save Testimonial"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGO MODAL */}
      <AnimatePresence>
        {isLogoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsLogoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsLogoModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-brand-navy mb-4">{logoFormId ? "Edit Client Logo" : "Add Client Logo"}</h3>
              <form onSubmit={handleLogoSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Organization / Client Name</label>
                  <input type="text" required value={logoName} onChange={(e) => setLogoName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="e.g. Malabar Gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Logo URL or Upload</label>
                  <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-2" placeholder="https://... logo image URL" />
                  <label className="w-full py-2 px-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Logo File
                    <input type="file" onChange={handleLogoFileUpload} className="hidden" />
                  </label>
                </div>
                {logoError && <p className="text-xs text-red-600">{logoError}</p>}
                <div className="flex gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setIsLogoModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold">Cancel</button>
                  <button type="submit" disabled={isSavingLogo} className="flex-1 py-2.5 bg-brand-navy text-white rounded-xl text-xs font-bold">{isSavingLogo ? "Saving..." : "Save Logo"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
