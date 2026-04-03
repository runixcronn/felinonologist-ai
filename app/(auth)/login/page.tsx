"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Mail, Lock, Eye, EyeOff, PawPrint } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(formRef.current?.children || [], {
      opacity: 0,
      y: 10,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.4");
  }, { scope: containerRef });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        // Attempt to check if user exists in the public table
        const { data: existingUser } = await supabase
          .from('Users')
          .select('uid')
          .eq('uid', data.user.id)
          .single();

        if (existingUser) {
          // User exists, update sign in time
          await supabase
            .from('Users')
            .update({ last_sign_in_at: new Date().toISOString() })
            .eq('uid', data.user.id);
        } else {
          // User missing in public table, attempt to heal (insert basic record)
          // We suppress errors here to allow login to proceed regardless of DB state
          await supabase.from('Users').insert({
            uid: data.user.id,
            display_name: email.split('@')[0],
            email: email,
            providers: ['email'],
            provider_type: 'email',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          }).then(({ error }) => {
             if (error) console.warn("Auto-creation of user record failed (non-critical):", error);
          });
        }

        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Giriş yapılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad-orange-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#grad-orange)"
            d="M0,0L48,26.7C96,53,192,107,288,122.7C384,139,480,117,576,122.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
          <path
            fill="url(#grad-orange-2)"
            d="M0,900L48,885.3C96,871,192,841,288,837.3C384,833,480,855,576,842.7C672,830,768,782,864,748.3C960,715,1056,697,1152,705.7C1248,715,1344,751,1392,769.7L1440,788L1440,900L1392,900C1344,900,1248,900,1152,900C1056,900,960,900,864,900C768,900,672,900,576,900C480,900,384,900,288,900C192,900,96,900,48,900L0,900Z"
          />
          <circle cx="80%" cy="20%" r="200" fill="url(#grad-orange-2)" fillOpacity="0.7" filter="blur(80px)" />
          <circle cx="10%" cy="50%" r="300" fill="url(#grad-orange)" fillOpacity="0.7" filter="blur(100px)" />
        </svg>
      </div>

      <div 
        ref={containerRef}
        className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 mb-4 text-orange-500">
            <PawPrint className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
            Tekrar Hoşgeldiniz
          </h1>
          <p className="text-muted mt-2 text-sm">
            Kedinizin dünyasına adım atmak için giriş yapın
          </p>
        </div>

        <form ref={formRef} onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1">E-posta</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-elevated/50 border border-border rounded-xl px-12 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-muted/50"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-foreground">Şifre</label>
              <Link href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                Şifremi unuttum?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-orange-500 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-elevated/50 border border-border rounded-xl px-12 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-muted/50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-muted">Veya</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted">
            Hesabınız yok mu?{" "}
            <Link 
              href="/register" 
              className="font-semibold text-orange-500 hover:text-orange-400 transition-colors hover:underline"
            >
              Hemen Kayıt Olun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
