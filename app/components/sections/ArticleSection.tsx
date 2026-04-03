"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ArticleSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from(".article-heading", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".article-heading",
          start: "top 80%",
        },
      });

      // Paragraph fade-in with stagger
      gsap.from(".article-paragraph", {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".article-content",
          start: "top 75%",
        },
      });

      // Reveal mask animation for highlighted text
      gsap.from(".reveal-text", {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".article-content",
          start: "top 70%",
        },
      });

      // Side cards animation
      gsap.from(".article-card", {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -50 : 50),
        stagger: 0.2,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".article-cards",
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={sectionRef}
      id="about"
      className="py-32 relative"
      style={{
        background: 'linear-gradient(to bottom, var(--background), var(--surface), var(--background))'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-brand text-sm font-semibold tracking-widest uppercase mb-4">
            NASIL ÇALIŞIR?
          </span>
          <h2 className="article-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Bir Fotoğrafla <span className="text-brand">Tanıyın</span>
          </h2>
          <p className="article-paragraph text-muted text-lg max-w-2xl mx-auto">
            Gelişmiş görsel tanıma teknolojimiz sayesinde kedinizin fotoğrafını saniyeler içinde analiz ediyoruz.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Main Article Content */}
          <div className="article-content space-y-6">
            <p className="article-paragraph text-lg text-muted leading-relaxed">
              <span className="reveal-text inline bg-brand/10 px-1">
                Fotoğrafı Yükle
              </span>{" "}
              veya kameranızı kullanarak kedinizin net bir fotoğrafını çekin. Uygulamamız, galerinizden seçtiğiniz fotoğrafları da destekler.
            </p>

            <p className="article-paragraph text-lg text-muted leading-relaxed">
              Yapay zeka motorumuz, görseldeki kedinin{" "}
              <span className="reveal-text inline bg-brand/10 px-1">
                yüz hatlarını, tüy yapısını ve vücut formunu
              </span>{" "}
              analiz ederek veritabanımızdaki binlerce ırk ile karşılaştırır.
            </p>

            <p className="article-paragraph text-lg text-muted leading-relaxed">
              Sonuç olarak, kedinizin tahmin edilen ırkı,{" "}
              <span className="reveal-text inline bg-brand/10 px-1">
                karakteristik özellikleri
              </span>{" "}
              ve ona özel bakım önerileri anında ekranınıza gelir.
            </p>

            <div className="pt-6">
              <a
                href="#research"
                className="inline-flex items-center gap-2 text-brand font-semibold hover:gap-4 transition-all duration-300"
              >
                Örnek analiz raporunu inceleyin
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="article-cards grid sm:grid-cols-2 gap-6">
            <div className="article-card glass rounded-2xl p-6 hover:border-brand transition-colors duration-300">
              <div className="text-4xl font-bold text-brand mb-2">5M+</div>
              <div className="text-foreground font-semibold mb-1">
                Analiz Edilen Fotoğraf
              </div>
              <p className="text-sm text-muted">
                Kullanıcılarımız tarafından
              </p>
            </div>

            <div className="article-card glass rounded-2xl p-6 hover:border-brand transition-colors duration-300">
              <div className="text-4xl font-bold text-brand mb-2">%99.2</div>
              <div className="text-foreground font-semibold mb-1">Doğruluk Oranı</div>
              <p className="text-sm text-muted">
                Görsel tanıma testlerinde
              </p>
            </div>

            <div className="article-card glass rounded-2xl p-6 hover:border-brand transition-colors duration-300">
              <div className="text-4xl font-bold text-brand mb-2">150+</div>
              <div className="text-foreground font-semibold mb-1">
                Tanınan Irk
              </div>
              <p className="text-sm text-muted">
                Geniş kapsamlı veritabanı
              </p>
            </div>

            <div className="article-card glass rounded-2xl p-6 hover:border-brand transition-colors duration-300">
              <div className="text-4xl font-bold text-brand mb-2">2sn</div>
              <div className="text-foreground font-semibold mb-1">
                İşlem Süresi
              </div>
              <p className="text-sm text-muted">
                Işık hızında sonuçlar
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
