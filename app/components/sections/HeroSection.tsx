"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set GSAP defaults
      gsap.defaults({ ease: "expo.out", duration: 1.5 });

      // Split text animation for heading
      const heading = headingRef.current;
      if (heading) {
        const words = heading.innerText.split(" ");
        heading.innerHTML = words
          .map((word) => {
            // Highlight "Intelligence" (Zekası) and "Reimagined" (Tanımlandı) in orange
            const isHighlight =
              word === "Zekası" || word === "Tanımlandı";
            const colorClass = isHighlight ? "text-brand" : "";
            return `<span class="inline-block overflow-hidden"><span class="hero-word inline-block ${colorClass}">${word}</span></span>`;
          })
          .join(" ");

        // Animate words
        gsap.fromTo(
          ".hero-word",
          { y: "100%" },
          {
            y: 0,
            stagger: 0.08,
            delay: 0.3,
            duration: 1.2,
          }
        );
      }

      // Subtitle animation
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.8,
        }
      );

      // CTA buttons animation
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          delay: 1,
        }
      );

      // Image parallax with glow
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.1, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.8,
            delay: 0.2,
          }
        );

        // Parallax on scroll
        gsap.to(imageRef.current, {
          y: 100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, var(--background), var(--surface), var(--background))'
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-light/10 rounded-full blur-[100px] animate-pulse" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-sm text-muted">Yapay Zeka Destekli Kedi Araştırmaları</span>
          </div>

          <h1
            ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Kedi Zekası Yeniden Tanımlandı
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-muted max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            En son yapay zeka teknolojisinin kedi davranışlarını nasıl çözdüğünü, genetik
            gizemleri nasıl açığa çıkardığını ve kedi bilişselliği anlayışımızı nasıl
            dönüştürdüğünü keşfedin.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#breeds"
              className="hero-cta px-8 py-4 rounded-full bg-brand hover:bg-brand-light text-white font-semibold transition-all duration-300 glow-box hover:glow-box-intense flex items-center justify-center gap-2"
            >
              Irkları Keşfet
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#about"
              className="hero-cta px-8 py-4 rounded-full border border-border-brand hover:border-brand text-foreground font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Daha Fazla Bilgi
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div
          ref={imageRef}
          className="relative w-full max-w-lg mx-auto lg:max-w-none lg:w-full"
        >
          {/* Orange glow behind image */}
          <div className="absolute inset-0 rounded-3xl bg-brand/20 blur-3xl transform scale-90" />

          <div className="relative glass rounded-3xl p-4 overflow-hidden">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden bg-surface">
              <Image
                src="/hero-cat.webp"
                alt="AI-analyzed cat portrait"
                fill
                className="object-cover"
                priority
              />
              {/* Scan lines overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
              {/* Data points overlay */}
              <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
                  <span className="text-sm text-muted">Görüntü İşleniyor: </span>
                  <span className="text-sm text-brand font-mono">%99.2 Irk Eşleşmesi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-muted uppercase tracking-widest">Kaydır</span>
        <div className="w-6 h-10 rounded-full border border-muted/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-brand animate-bounce" />
        </div>
      </div>
    </header>
  );
}
