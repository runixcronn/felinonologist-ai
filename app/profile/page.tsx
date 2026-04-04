"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Mail, Camera, Save, Loader2, Sparkles, Shield, Cat } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAlert } from "@/app/components/providers/AlertProvider";

// Skeleton component with gradient animation
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-linear-to-r from-zinc-300 via-zinc-200 to-zinc-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 bg-size-[200%_100%] rounded ${className}`} 
    style={{ animation: 'shimmer 1.5s infinite' }}
  />
);

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    bio: "",
    avatar_url: ""
  });
  const { showAlert } = useAlert();
  const [stats, setStats] = useState({
    chatCount: 0,
    messageCount: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      
      setFormData({
        display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || "",
        email: user.email || "",
        bio: user.user_metadata?.bio || "",
        avatar_url: user.user_metadata?.avatar_url || ""
      });

      // Fetch user stats from chats table
      const { count: chatCount } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch message count
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStats({
        chatCount: chatCount || 0,
        messageCount: messageCount || 0
      });
      
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      showAlert("Lütfen geçerli bir resim dosyası seçin.", "warning");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Dosya boyutu 5MB'dan küçük olmalıdır.", "warning");
      return;
    }

    setUploadingPhoto(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      showAlert("Profil fotoğrafı başarıyla güncellendi!", "success");
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      showAlert("Fotoğraf yüklenirken bir sorun oluştu.", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: formData.display_name,
          bio: formData.bio
        }
      });

      if (error) throw error;
      
      showAlert("Profil başarıyla güncellendi!", "success");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      showAlert("Profil güncellenirken bir sorun oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-linear-to-bl from-orange-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-linear-to-tr from-orange-600/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card Skeleton */}
            <div className="lg:col-span-1">
              <div className="glass-strong rounded-3xl p-6 text-center">
                <Skeleton className="w-36 h-36 rounded-full mx-auto mb-6" />
                <Skeleton className="h-7 w-40 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto mb-6" />
                <div className="flex justify-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-strong rounded-3xl p-8">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-5">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-14 w-52 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-linear-to-bl from-orange-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-linear-to-tr from-orange-600/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link 
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-foreground hover:bg-brand/10 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Sohbete Dön</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card - Left Side */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-3xl p-8 text-center relative overflow-hidden group">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Avatar Section */}
              <div className="relative inline-block mb-6">
                {/* Avatar Ring Animation */}
                <div className="absolute -inset-2 bg-linear-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
                <div className="absolute -inset-1 bg-linear-to-r from-orange-400 to-orange-600 rounded-full animate-spin-slow opacity-30" style={{ animationDuration: '8s' }} />
                
                <div className="relative w-36 h-36 rounded-full bg-surface-elevated border-4 border-surface flex items-center justify-center text-muted overflow-hidden shadow-2xl">
                  {formData.avatar_url ? (
                    <Image
                      src={formData.avatar_url}
                      alt="Profil Fotoğrafı"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16" />
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-1 -right-1 p-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 disabled:opacity-70 disabled:hover:scale-100"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {formData.display_name || "İsimsiz Kullanıcı"}
              </h1>
              <p className="text-muted text-sm flex items-center justify-center gap-2 mb-6">
                <Mail className="w-4 h-4" />
                {formData.email}
              </p>

              {/* Stats/Badges */}
              <div className="flex justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <Cat className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-foreground">Kedi Sever</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-foreground">Doğrulandı</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="glass rounded-2xl p-6 mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                İstatistikler
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Sohbet Sayısı</span>
                  <span className="text-sm font-semibold text-foreground">{stats.chatCount}</span>
                </div>
                <div className="h-px bg-border-neutral" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Toplam Mesaj</span>
                  <span className="text-sm font-semibold text-foreground">{stats.messageCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Personal Info Card */}
              <div className="glass-strong rounded-3xl p-8">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Kişisel Bilgiler
                </h2>
                
                <div className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Ad Soyad</label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur" />
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                          type="text"
                          value={formData.display_name}
                          onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-surface-elevated border border-border-neutral rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition-all text-foreground placeholder:text-muted"
                          placeholder="Adınızı girin..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">E-posta Adresi</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-4 bg-surface-elevated/50 border border-border-neutral rounded-xl text-muted cursor-not-allowed"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Shield className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      E-posta adresi güvenlik nedeniyle değiştirilemez.
                    </p>
                  </div>

                  {/* Bio Textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Hakkımda</label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur" />
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Kendinizi ve kedinizi tanıtın..."
                        className="relative w-full p-4 bg-surface-elevated border border-border-neutral rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition-all resize-none text-foreground placeholder:text-muted"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative group flex items-center gap-3 px-8 py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-xl shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Button Glow */}
                  <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                  <span className="relative flex items-center gap-3">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Değişiklikleri Kaydet
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
