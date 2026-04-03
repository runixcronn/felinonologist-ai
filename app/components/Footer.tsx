import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Özellikler", href: "#" },
    { label: "Fiyatlandırma", href: "#" },
    { label: "API", href: "#" },
  ],
  company: [
    { label: "Hakkımızda", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Kariyer", href: "#" },
  ],
  resources: [
    { label: "Dokümantasyon", href: "#" },
    { label: "Araştırma Makaleleri", href: "#research" },
    { label: "Destek", href: "#contact" },
  ],
};

const socialLinks = [
  {
    label: "Twitter",
    href: "#",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    label: "GitHub",
    href: "#",
    icon: <Github className="w-5 h-5" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <Linkedin className="w-5 h-5" />,
  },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border-brand">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center glow-box">
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
            <p className="text-muted max-w-sm mb-6 leading-relaxed">
              Gelişmiş yapay zeka ve makine öğrenimi ile kedi zekasının geleceğine öncülük ediyoruz. Kedileri daha önce hiç olmadığı gibi anlıyoruz.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background border border-border-brand flex items-center justify-center text-muted hover:text-brand hover:border-brand transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Ürün</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-brand transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Şirket</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-brand transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Kaynaklar</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-brand transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-brand flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Felinonologist AI. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-muted hover:text-brand transition-colors duration-300"
            >
              Gizlilik Politikası
            </a>
            <a
              href="#"
              className="text-muted hover:text-brand transition-colors duration-300"
            >
              Kullanım Şartları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
