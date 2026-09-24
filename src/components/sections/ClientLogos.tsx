"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Building2, 
  Lock, 
  Unlock, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  Upload, 
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientLogo {
  id: string;
  name: string;
  logoUrl?: string;
  category?: string;
}

export function ClientLogos() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin passcode states
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Form CRUD states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formCategory, setFormCategory] = useState("Corporate");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLogos = async () => {
    try {
      const res = await fetch("/api/client-logos");
      if (res.ok) {
        const data = await res.json();
        setLogos(data);
      }
    } catch (err) {
      console.error("Failed to fetch client logos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Passcode Auth
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
        setLoginError("Incorrect passcode. Please try again.");
      }
    } catch (err) {
      setLoginError("Connection error. Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Image Upload helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be under 5MB.");
      return;
    }

    setIsUploading(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        headers: {
          "x-admin-password": adminPassword,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormLogoUrl(data.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormLogoUrl(reader.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Form CRUD Handlers
  const openAddForm = () => {
    setFormId(null);
    setFormName("");
    setFormLogoUrl("");
    setFormCategory("Corporate");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (item: ClientLogo) => {
    setFormId(item.id);
    setFormName(item.name);
    setFormLogoUrl(item.logoUrl || "");
    setFormCategory(item.category || "Corporate");
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Client or organization name is required.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    const payload = {
      id: formId,
      name: formName,
      logoUrl: formLogoUrl,
      category: formCategory,
    };

    try {
      const res = await fetch("/api/client-logos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsFormOpen(false);
        fetchLogos();
      } else {
        const errorData = await res.json();
        setFormError(errorData.error || "Failed to save client logo.");
      }
    } catch (err) {
      setFormError("Network error. Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/client-logos", {
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
        fetchLogos();
      } else {
        alert("Failed to delete client logo.");
      }
    } catch (err) {
      console.error("Delete client logo error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Duplicate logos for seamless infinite loop
  const marqueeLogos = logos.length > 0 ? [...logos, ...logos, ...logos] : [];

  return (
    <section className="py-16 bg-white border-y border-gray-100 relative overflow-hidden" id="clients">
      <div className="container px-6 md:px-12 mx-auto relative z-10">
        
        {/* Admin Controls Bar */}
        <div className="flex justify-end items-center gap-3 mb-2">
          <button
            onClick={handleAdminToggle}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
              isAdmin
                ? "bg-brand-navy border-brand-navy text-white shadow-md animate-pulse"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy cursor-pointer"
            }`}
          >
            {isAdmin ? <Unlock className="w-3.5 h-3.5 text-brand-gold" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isAdmin ? "Admin On" : "Admin Mode"}</span>
          </button>

          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={openAddForm}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-gold text-brand-navy text-xs font-bold hover:bg-brand-gold/90 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client Logo</span>
            </motion.button>
          )}
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center leading-tight">
            <span className="text-brand-navy block mb-1">Appreciated for</span>
            <span className="text-brand-gold block">Exceptional Training Sessions by</span>
          </h2>
        </div>

      </div>

      {/* Infinite Logo Slider */}
      {isLoading ? (
        <div className="h-[100px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-indigo" />
        </div>
      ) : logos.length > 0 ? (
        <div className="relative w-full overflow-hidden py-3">
          {/* Side Fades for Infinite Mask Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Continuous Auto-Scrolling Slider Track */}
          <motion.div
            className="flex items-center gap-6 md:gap-10 w-max"
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: Math.max(18, logos.length * 4),
            }}
          >
            {marqueeLogos.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="group relative w-[190px] md:w-[240px] h-[100px] md:h-[115px] rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:border-brand-gold hover:shadow-md hover:scale-105 flex flex-col items-center justify-center p-4 transition-all duration-300 shrink-0"
              >
                {item.logoUrl ? (
                  <div className="relative w-full h-[65px] md:h-[75px] flex items-center justify-center">
                    <Image
                      src={item.logoUrl}
                      alt={item.name}
                      fill
                      className="object-contain opacity-100 transition-all duration-300"
                      sizes="240px"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 w-full">
                    <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-gold flex items-center justify-center font-bold shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-sm md:text-base text-brand-navy text-center line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                )}

                {/* Admin Quick Action Overlay */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white border border-gray-200 shadow-md px-2 py-1 rounded-full z-30 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => openEditForm(item)}
                      className="p-1 text-brand-indigo hover:text-brand-navy transition-colors cursor-pointer"
                      title="Edit Logo"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => requestDelete(item.id, e)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                      title="Delete Logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="container mx-auto px-6 text-center py-6">
          <p className="text-gray-400 text-sm mb-4">No client logos added yet.</p>
          {isAdmin && (
            <Button onClick={openAddForm} variant="accent" className="rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Add First Client Logo
            </Button>
          )}
        </div>
      )}

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
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 text-brand-navy"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-brand-navy text-white">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-gold" />
                  <span>Admin Verification</span>
                </h3>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-left">
                <div className="space-y-2">
                  <label htmlFor="client-pass" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Passcode
                  </label>
                  <input
                    id="client-pass"
                    type="password"
                    required
                    autoFocus
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 text-sm"
                  />
                </div>

                {loginError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {loginError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(false)}
                    disabled={isVerifying}
                    className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isVerifying || !loginPassword}
                    className="flex-1 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span>Unlock</span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRUD Add / Edit Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 text-brand-navy"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-brand-navy text-white">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-gold" />
                  <span>{formId ? "Edit Client Logo" : "Add Client Logo"}</span>
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-left">
                {/* Client Name */}
                <div className="space-y-2">
                  <label htmlFor="clientName" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Client / Organization Name
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 text-sm"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="clientCategory" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Industry / Category
                  </label>
                  <input
                    id="clientCategory"
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. EdTech, Corporate, University"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 text-sm"
                  />
                </div>

                {/* Logo Image URL or File Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center justify-between">
                    <span>Logo Image (PNG / SVG / JPG)</span>
                    {formLogoUrl && <span className="text-emerald-600 text-[11px] font-medium">Image attached</span>}
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formLogoUrl}
                      onChange={(e) => setFormLogoUrl(e.target.value)}
                      placeholder="Paste Image URL (or upload file)"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 text-sm"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-brand-navy text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shrink-0">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-indigo" />
                      ) : (
                        <Upload className="w-4 h-4 text-brand-indigo" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Tip: If no image is uploaded, a custom brand emblem will automatically display.
                  </p>
                </div>

                {/* Image Preview */}
                {formLogoUrl && (
                  <div className="relative w-full h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-3">
                    <Image
                      src={formLogoUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {formError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    disabled={isSaving}
                    className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="flex-1 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span>Save Logo</span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 text-brand-navy"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-600 text-white">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Client Logo</span>
                </h3>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-left">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Are you sure you want to remove this client logo? This action cannot be undone.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
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
