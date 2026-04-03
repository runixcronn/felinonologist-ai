"use client";

import { createPortal } from "react-dom";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, ArrowRight, X } from "lucide-react";

// ... existing code ...

const navLinks = [
  { href: "#about", label: "Hakkında" },
  { href: "#breeds", label: "Irklar" },
  { href: "#research", label: "Araştırma" },
  { href: "#contact", label: "İletişim" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      
      // Open menu
      gsap.to(mobileMenuRef.current, {
        x: "0%",
        duration: 0.5,
        ease: "power3.out",
      });

      // Stagger links
      gsap.fromTo(
        ".mobile-nav-link",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.2, // Wait for menu to start sliding
          ease: "power2.out",
        }
      );
    } else {
      // Allow body scroll
      document.body.style.overflow = "";

      // Close menu
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -150, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        delay: 0.6,
      }
    );

    // Scroll detection for glass effect with GSAP animation
    let lastScrolled = false;
    
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 50;
      
      if (shouldBeScrolled !== lastScrolled) {
        lastScrolled = shouldBeScrolled;
        setIsScrolled(shouldBeScrolled);
        
        // GSAP animation for padding
        gsap.to(navRef.current, {
          paddingTop: shouldBeScrolled ? "1rem" : "1.5rem",
          paddingBottom: shouldBeScrolled ? "1rem" : "1.5rem",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      style={{ opacity: 0, transform: "translateY(-150px)", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 border-b ${
        isScrolled
          ? "glass-strong border-border-brand"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative z-[70]">
          <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center glow-box group-hover:glow-box-intense transition-shadow duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 text-white"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5c-1.5-2-4-3-6-2s-3 4-2 6c1 3 4 5 8 8 4-3 7-5 8-8 1-2-1-5-2-6s-4.5 0-6 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">
            Felino<span className="text-brand">nologist</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted hover:text-brand transition-colors duration-300 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-10 h-10 rounded-full bg-surface hover:bg-surface-elevated border border-border-brand flex items-center justify-center transition-all duration-300 hover:scale-105 group"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            suppressHydrationWarning
          >
            {mounted && (
              <>
                <Sun 
                  className={`w-5 h-5 absolute transition-all duration-300 ${
                    theme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-0"
                  }`}
                />
                <Moon 
                  className={`w-5 h-5 absolute transition-all duration-300 ${
                    theme === "light"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                />
              </>
            )}
          </button>

          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand hover:bg-brand-light text-white font-semibold transition-all duration-300 glow-box hover:glow-box-intense"
          >
            Başlayın
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3 relative z-[70]">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full bg-surface border border-border-brand flex items-center justify-center transition-all duration-300"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            suppressHydrationWarning
          >
            {mounted && (
              <>
                <Sun 
                  className={`w-4 h-4 absolute transition-all duration-300 ${
                    theme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-0"
                  }`}
                />
                <Moon 
                  className={`w-4 h-4 absolute transition-all duration-300 ${
                    theme === "light"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                />
              </>
            )}
          </button>

          <button 
            className="text-foreground p-2 mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mounted && createPortal(
        <div 
          ref={mobileMenuRef}
          className="fixed inset-0 bg-background/98 backdrop-blur-xl z-[999] md:hidden flex flex-col translate-x-full"
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-end p-6 border-b border-border-brand/20">
              {/* Close Button */}
              <button 
                className="w-10 h-10 rounded-full bg-surface hover:bg-surface-elevated border border-border-brand flex items-center justify-center text-foreground transition-all duration-300 mr-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
          </div>

          {/* Links Container */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-nav-link text-3xl font-bold text-foreground hover:text-brand transition-colors duration-300 opacity-0 translate-y-4"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-nav-link mt-8 flex items-center gap-2 px-8 py-4 rounded-full bg-brand hover:bg-brand-light text-white font-bold text-lg transition-all duration-300 glow-box hover:glow-box-intense opacity-0 translate-y-4"
            >
              Başlayın
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
