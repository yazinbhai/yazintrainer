"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Lock, 
  Unlock, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Admin and passcode states
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Edit / Add modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formId, setFormId] = useState<string | null>(null); // null means adding
  const [formQuote, setFormQuote] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formRole, setFormRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Confirmation modal states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    if (items.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    if (items.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  // Passcode Auth handlers
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

  // Form CRUD Operations
  const openAddForm = () => {
    setFormId(null);
    setFormQuote("");
    setFormAuthor("");
    setFormRole("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (item: TestimonialItem) => {
    setFormId(item.id);
    setFormQuote(item.quote);
    setFormAuthor(item.author);
    setFormRole(item.role);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuote.trim() || !formAuthor.trim() || !formRole.trim()) {
      setFormError("All fields are required.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    const payload = {
      id: formId,
      quote: formQuote,
      author: formAuthor,
      role: formRole
    };

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setIsFormOpen(false);
        
        // Refetch and find index of new/edited item
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const freshData = await response.json();
          setItems(freshData);
          
          // Focus on the saved item in the carousel
          const targetId = result.item.id;
          const targetIndex = freshData.findIndex((itm: TestimonialItem) => itm.id === targetId);
          if (targetIndex !== -1) {
            setCurrentIndex(targetIndex);
          }
        }
      } else {
        const errorData = await res.json();
        setFormError(errorData.error || "Failed to save testimonial.");
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
      const res = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword
        },
        body: JSON.stringify({ id: deleteTargetId })
      });

      if (res.ok) {
        // Adjust currentIndex if we delete the last element
        if (currentIndex >= items.length - 1 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        setIsDeleteConfirmOpen(false);
        setDeleteTargetId(null);
        fetchTestimonials();
      } else {
        alert("Failed to delete testimonial.");
      }
    } catch (err) {
      console.error("Delete testimonial error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="testimonials">
      <div className="container px-6 md:px-12 mx-auto max-w-5xl text-center relative">
        
        {/* Admin Controls Header */}
        <div className="absolute top-0 right-6 z-20 flex items-center gap-3">
          <button
            onClick={handleAdminToggle}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
              isAdmin
                ? "bg-brand-navy border-brand-navy text-white shadow-md animate-pulse"
                : "bg-white border-gray-200 text-gray-600 hover:border-brand-navy cursor-pointer"
            }`}
          >
            {isAdmin ? <Unlock className="w-3.5 h-3.5 text-brand-gold" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isAdmin ? "Admin On" : "Admin Mode"}</span>
          </button>

          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={openAddForm}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-gold text-brand-navy text-xs font-bold hover:bg-brand-gold/90 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Testimonial</span>
            </motion.button>
          )}
        </div>

        <Quote className="w-16 h-16 text-brand-muted/80 mx-auto mb-12" />

        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-indigo" />
          </div>
        ) : items.length > 0 ? (
          <div className="relative h-[280px] md:h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-brand-navy leading-relaxed mb-8 max-w-4xl mx-auto">
                  "{items[currentIndex].quote}"
                </h3>
                <div className="relative group">
                  <div className="font-bold text-gray-900 text-lg">{items[currentIndex].author}</div>
                  <div className="text-brand-gold font-medium text-sm tracking-wider uppercase">{items[currentIndex].role}</div>
                  
                  {/* Edit/Delete overlays for the active testimonial slide */}
                  {isAdmin && (
                    <div className="absolute -top-3 -right-24 flex items-center gap-2 bg-white/95 border border-gray-100 shadow-lg px-3 py-1 rounded-full">
                      <button
                        onClick={() => openEditForm(items[currentIndex])}
                        className="p-1 text-brand-indigo hover:text-brand-navy transition-colors cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => requestDelete(items[currentIndex].id, e)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-[250px] flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-6">No testimonials available.</p>
            {isAdmin && (
              <Button onClick={openAddForm} variant="accent" className="rounded-full">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Testimonial
              </Button>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-16">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === index ? "bg-brand-indigo w-8" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

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

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-left">
                <div className="space-y-2">
                  <label htmlFor="testimonial-pass" className="text-sm font-semibold text-brand-navy">
                    Enter Admin Passcode
                  </label>
                  <input
                    id="testimonial-pass"
                    type="password"
                    required
                    autoFocus
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors text-sm"
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
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-brand-navy text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {formId ? <Edit className="w-4 h-4 text-brand-gold" /> : <Plus className="w-4 h-4 text-brand-gold" />}
                  <span>{formId ? "Edit Testimonial" : "Add Testimonial"}</span>
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 space-y-5 text-left">
                {/* Author Name */}
                <div className="space-y-2">
                  <label htmlFor="formAuthor" className="text-sm font-semibold text-brand-navy">
                    Author Name
                  </label>
                  <input
                    id="formAuthor"
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors text-sm"
                  />
                </div>

                {/* Job Role */}
                <div className="space-y-2">
                  <label htmlFor="formRole" className="text-sm font-semibold text-brand-navy">
                    Job Role / Institution
                  </label>
                  <input
                    id="formRole"
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. VP of Product, Acme Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors text-sm"
                  />
                </div>

                {/* Testimonial Quote */}
                <div className="space-y-2">
                  <label htmlFor="formQuote" className="text-sm font-semibold text-brand-navy">
                    Testimonial Quote
                  </label>
                  <textarea
                    id="formQuote"
                    rows={4}
                    required
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Type the quote here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold text-gray-800 transition-colors text-sm resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse">
                    {formError}
                  </p>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    disabled={isSaving}
                    className="flex-1 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-600 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
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
                  <span>Delete Testimonial</span>
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
                  Are you sure you want to delete this testimonial? This action will permanently remove it from the carousel.
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
