"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Mail, Clock, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".contact-heading", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".contact-heading",
          start: "top 80%",
        },
      });

      // Form elements animation
      gsap.from(".contact-form-element", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 75%",
        },
      });

      // Info cards animation
      gsap.from(".contact-card", {
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".contact-info",
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--background), var(--surface))'
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand text-sm font-semibold tracking-widest uppercase mb-4">
            DESTEK
          </span>
          <h2 className="contact-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Sonuçtan Emin <span className="text-brand">Değil Misiniz?</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Yapay zekamız nadir durumlarda kararsız kalabilir. Fotoğrafınızı uzman ekibimize gönderin, biz inceleyelim.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="contact-info lg:col-span-2 space-y-6">
            <div className="contact-card glass rounded-2xl p-6 hover:border-brand transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-foreground font-semibold mb-1">E-posta</h3>
              <p className="text-muted">cemalettinreha92@gmail.com</p>
            </div>



            <div className="contact-card glass rounded-2xl p-6 hover:border-brand transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-foreground font-semibold mb-1">
                Ortalama Yanıt
              </h3>
              <p className="text-muted">1-2 Gün</p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form lg:col-span-3 glass rounded-3xl p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="contact-form-element">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Adınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ad Soyad"
                  className="w-full px-5 py-4 rounded-xl bg-background border border-border-brand neon-input text-foreground placeholder:text-muted/50"
                />
              </div>
              <div className="contact-form-element">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ornek@email.com"
                  className="w-full px-5 py-4 rounded-xl bg-background border border-border-brand neon-input text-foreground placeholder:text-muted/50"
                />
              </div>
            </div>

            <div className="contact-form-element mb-6">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Konu
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Örn: Karışık Irk Analizi"
                className="w-full px-5 py-4 rounded-xl bg-background border border-border-brand neon-input text-foreground placeholder:text-muted/50"
              />
            </div>

            <div className="contact-form-element mb-8">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Mesajınız & Fotoğraf Linki
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Kedinizin durumunu anlatın ve varsa fotoğraf linkini ekleyin..."
                className="w-full px-5 py-4 rounded-xl bg-background border border-border-brand neon-input text-foreground placeholder:text-muted/50 resize-none"
              />
            </div>

            <div className="contact-form-element">
              <button 
                type="submit" 
                className="w-full md:w-auto px-8 py-4 rounded-full bg-brand text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 flex items-center justify-center gap-2 group"
              >
                İnceleme Talep Et
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
