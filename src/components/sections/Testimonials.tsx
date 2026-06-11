"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Loader2 
} from "lucide-react";

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

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="testimonials">
      <div className="container px-6 md:px-12 mx-auto max-w-5xl text-center relative">
        
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
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-[250px] flex flex-col items-center justify-center">
            <p className="text-gray-500">No testimonials available.</p>
          </div>
        )}

        {/* Navigation Controls */}
        {!isLoading && items.length > 1 && (
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
    </section>
  );
}
