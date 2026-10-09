"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, Award } from "lucide-react";

interface ClientLogo {
  id: string;
  name: string;
  logoUrl?: string;
  category?: string;
}

export function ClientLogos() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Duplicate logos for seamless infinite loop
  const marqueeLogos = logos.length > 0 ? [...logos, ...logos, ...logos] : [];

  return (
    <section className="py-16 bg-white border-y border-gray-100 relative overflow-hidden" id="clients">
      <div className="container px-6 md:px-12 mx-auto relative z-10">
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
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="container mx-auto px-6 text-center py-6">
          <p className="text-gray-400 text-sm mb-4">No client logos added yet.</p>
        </div>
      )}
    </section>
  );
}
