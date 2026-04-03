"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const breeds = [
  {
    name: "Maine Coon",
    trait: "Nazik Dev",
    accuracy: "%99.2",
    image: "/breeds/maine-coon.webp",
    size: "large",
  },
  {
    name: "Siames",
    trait: "Konuşkan Zeka",
    accuracy: "%98.7",
    image: "/breeds/siamese.webp",
    size: "medium",
  },
  {
    name: "Persian",
    trait: "Sakin Arkadaş",
    accuracy: "%97.9",
    image: "/breeds/persian.webp",
    size: "medium",
  },
  {
    name: "Bengal",
    trait: "Vahşi Ruh",
    accuracy: "%98.4",
    image: "/breeds/bengal.webp",
    size: "large",
  },
  {
    name: "Scottish Fold",
    trait: "Baykuş Bakışlı",
    accuracy: "%96.8",
    image: "/breeds/scottish-fold.webp",
    size: "small",
  },
  {
    name: "Ragdoll",
    trait: "Uysal Dost",
    accuracy: "%98.1",
    image: "/breeds/ragdoll.webp",
    size: "small",
  },
];

export function BreedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Store pre-built timelines for each card
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);
  const isInitializedRef = useRef(false);

  // Memoized breed count to prevent unnecessary recalculations
  const breedCount = useMemo(() => breeds.length, []);

  // Initialize timelines after DOM is ready
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    // Small delay to ensure DOM elements are mounted
    const initTimer = setTimeout(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const image = card.querySelector(".breed-image");
        const detailsAction = card.querySelector(".details-action");
        const title = card.querySelector(".breed-title");
        const svgRect = card.querySelector(".border-rect");

        // Create a paused timeline for this card
        const tl = gsap.timeline({ paused: true });

        // Image zoom
        tl.to(image, {
          scale: 1.15,
          duration: 0.6,
          ease: "power2.out",
        }, 0);

        // Details action slide from left
        tl.fromTo(
          detailsAction,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          0.1
        );

        // Title color change
        tl.to(title, {
          color: "var(--brand-orange)",
          duration: 0.3,
          ease: "power2.out",
        }, 0);

        // Border drawing
        if (svgRect) {
          tl.to(svgRect, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          }, 0);
        }

        timelinesRef.current[index] = tl;
      });

      isInitializedRef.current = true;
    }, 100);

    return () => clearTimeout(initTimer);
  }, [breedCount]);

  // Optimized hover handlers using pre-built timelines
  const handleMouseEnter = useCallback((index: number) => {
    const tl = timelinesRef.current[index];
    if (tl) {
      tl.timeScale(1).play();
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const tl = timelinesRef.current[index];
    if (tl) {
      tl.timeScale(1.5).reverse();
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".breeds-heading",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".breeds-heading",
            start: "top 85%",
          },
        }
      );

      // Staggered card reveal
      gsap.fromTo(
        ".breed-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: {
            amount: 0.6,
            from: "start",
          },
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".breeds-grid",
            start: "top 85%",
          },
        }
      );

      // Set initial state for details action
      gsap.set(".details-action", { opacity: 0, x: -30 });
      // Set initial state for border rect
      gsap.set(".border-rect", { strokeDashoffset: 1000, opacity: 0 });
    }, sectionRef);

    return () => {
      ctx.revert();
      // Kill all timelines on cleanup
      timelinesRef.current.forEach(tl => tl?.kill());
      timelinesRef.current = [];
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="breeds"
      className="py-32 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand text-sm font-semibold tracking-widest uppercase mb-4">
            IRK KÜTÜPHANESİ
          </span>
          <h2 className="breeds-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tanıyabileceğimiz <span className="text-brand">Irklar</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Yapay zekamız, dünyanın dört bir yanından yüzlerce farklı kedi ırkını tüy yapısı, kulak şekli ve yüz hatlarından ayırt etmek için eğitildi.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="breeds-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {breeds.map((breed, index) => (
            <div
              key={breed.name}
              ref={(el) => { cardsRef.current[index] = el; }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className={`breed-card group relative rounded-2xl overflow-hidden border border-border-brand cursor-pointer ${
                breed.size === "large"
                  ? "col-span-2 row-span-2"
                  : breed.size === "medium"
                  ? "col-span-1 row-span-2 md:col-span-2 md:row-span-1"
                  : "col-span-1 row-span-1"
              }`}
            >
              {/* Image */}
              <div className="absolute inset-0 bg-surface overflow-hidden">
                <Image
                  src={breed.image}
                  alt={breed.name}
                  fill
                  className="breed-image object-cover"
                />
                {/* Gradient overlay - theme aware */}
                <div 
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: 'linear-gradient(to top, var(--overlay-gradient-from), var(--overlay-gradient-via), transparent)'
                  }}
                />
              </div>

              {/* Border drawing effect - SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke="var(--brand-orange)"
                  strokeWidth="2"
                  rx="16"
                  className="border-rect"
                  style={{
                    strokeDasharray: "1000",
                    strokeDashoffset: "1000",
                    opacity: 0,
                  }}
                />
              </svg>

              {/* Content */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                {/* Accuracy badge - improved for light mode */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gray-900/80 dark:bg-white/10 backdrop-blur-md text-xs font-mono text-white dark:text-brand font-semibold shadow-lg border border-white/10 dark:border-brand/20">
                  {breed.accuracy}
                </div>

                <h3 className="breed-title text-xl md:text-2xl font-bold text-foreground mb-1">
                  {breed.name}
                </h3>
                <p className="text-sm text-muted">{breed.trait}</p>

                {/* Hover action - GSAP animated from left */}
                <div className="details-action mt-4">
                  <span className="inline-flex items-center gap-2 text-sm text-brand font-medium">
                    Detayları Gör
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border-brand hover:border-brand text-foreground font-semibold transition-all duration-300 hover:glow-box"
          >
            Tüm Irk Kütüphanesini İncele
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
