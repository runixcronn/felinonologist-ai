"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ReactMarkdown from "react-markdown";
import { 
  Send, 
  Plus, 
  MessageSquare, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  MoreVertical, 
  Settings, 
  Menu, 
  X, 
  Bot,
  Paperclip,
  Loader2,
  Trash2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { useAlert } from "@/app/components/providers/AlertProvider";

// Types
type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string | null;
  created_at?: string;
};

type Chat = {
  id: string;
  title: string;
  created_at: string;
};

export default function ChatPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const supabase = createClient();

  // Fetch Chats on Load
  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) setChats(data);
    };

    fetchChats();
  }, []);

  const loadChat = async (chatId: string) => {
    setIsChatLoading(true);
    setCurrentChatId(chatId);
    
    // Mobile sidebar auto close
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        image_url: msg.image_url
      })));
    }
    setIsChatLoading(false);
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("Dosya boyutu 5MB'dan küçük olmalıdır.", "warning");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Avoid hydration mismatch
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const width = isSidebarOpen ? 280 : 72;
      
      // Desktop Animation
      if (window.innerWidth >= 768) {
        gsap.to(sidebarRef.current, {
          width: width,
          duration: 0.5,
          ease: "elastic.out(1, 0.9)",
        });

        // Text & Content Animation
        if (isSidebarOpen) {
          gsap.to(".sidebar-text", {
             opacity: 1,
             x: 0,
             display: "block",
             duration: 0.3,
             delay: 0.1
          });
          gsap.to(".sidebar-item", {
            justifyContent: "flex-start",
            duration: 0.3
          });
        } else {
           gsap.to(".sidebar-text", {
             opacity: 0,
             x: -10,
             display: "none",
             duration: 0.1
          });
          gsap.to(".sidebar-item", {
            justifyContent: "center",
            duration: 0.3
          });
        }
      } else {
        // Mobile Animation
        gsap.to(sidebarRef.current, {
          x: isSidebarOpen ? "0%" : "-100%",
          width: 280,
          duration: 0.4,
          ease: "power3.inOut"
        });
      }
    }, sidebarRef);

    return () => ctx.revert();
    return () => ctx.revert();
  }, [isSidebarOpen]);

  useGSAP(() => {
    gsap.from(".hero-element", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2
    });

    gsap.from(".input-section", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.4
    });
  }, { scope: mainRef });

  // ...

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // ...



  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering loadChat
    setChatToDelete(chatId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    
    try {
      // Delete messages first (due to foreign key)
      await supabase.from('messages').delete().eq('chat_id', chatToDelete);
      // Then delete the chat
      await supabase.from('chats').delete().eq('id', chatToDelete);
      
      // Update local state
      setChats(prev => prev.filter(chat => chat.id !== chatToDelete));
      
      // If deleted chat was current, reset view
      if (currentChatId === chatToDelete) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
    
    setChatToDelete(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessageContent = input;
    const currentImage = selectedImage;
    let imageUrl = null;

    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    // Optimistic UI update
    const tempUserMsg: Message = { role: 'user', content: userMessageContent, image_url: imagePreview };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // 1. Upload Image if exists
      if (currentImage) {
        const fileExt = currentImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('chat-images')
          .upload(filePath, currentImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chat-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // 2. Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessageContent,
          image_url: imageUrl,
          chatId: currentChatId,
          history: messages // Send previous context
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to send message");

      // 3. Update Chat ID if new
      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId);
        // Refresh chat list to show new chat
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: chatsData } = await supabase
            .from('chats')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (chatsData) setChats(chatsData);
        }
      }

      // 4. Add Assistant Message
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin." }]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex h-screen bg-background text-foreground font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="md:hidden absolute top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg shadow-sm"
         >
           <Menu className="w-5 h-5" />
         </button>
      )}

      {/* Sidebar - Refactored for GSAP */}
      <aside 
        ref={sidebarRef}
        className="fixed md:static inset-y-0 left-0 z-40 bg-surface border-r border-border-neutral flex flex-col overflow-hidden shadow-xl md:shadow-none"
        style={{ width: 280 }}
      >
        <div className={`p-4 flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"} sidebar-item`}>
            <button 
              onClick={startNewChat}
              className={`flex items-center gap-2 bg-surface-elevated border border-border-neutral hover:bg-surface-hover transition-colors text-sm font-medium rounded-xl shadow-sm group whitespace-nowrap overflow-hidden ${isSidebarOpen ? "flex-1 px-4 py-3" : "p-3 justify-center"}`}
            >
              <Plus className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="sidebar-text group-hover:text-orange-500 transition-colors">Yeni Sohbet</span>
            </button>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden ml-2 p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            <h3 className="sidebar-text text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase px-2 mb-2 whitespace-nowrap">Geçmiş</h3>
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-surface-hover rounded-lg transition-colors group sidebar-item cursor-pointer ${currentChatId === chat.id ? "bg-surface-hover text-brand" : ""}`}
                  onClick={() => loadChat(chat.id)}
                  title={!isSidebarOpen ? chat.title : ""}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${currentChatId === chat.id ? "text-brand" : "group-hover:text-orange-500"}`} />
                  <span className="sidebar-text truncate text-left flex-1">{chat.title}</span>
                  {isSidebarOpen && (
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                      title="Sohbeti Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-500 transition-colors" />
                    </button>
                  )}
                </div>
              ))}
              {chats.length === 0 && (
                <div className="px-2 text-xs text-muted-foreground sidebar-text">Henüz sohbet yok.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border-neutral">
           <div className="bg-orange-500/10 rounded-xl p-3 overflow-hidden">
              <div className="flex items-center gap-3 mb-2 sidebar-item">
                 <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0">
                    <Bot className="w-5 h-5" />
                 </div>
                 <div className="sidebar-text">
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">Pro Plan</p>
                    <p className="text-xs text-muted-foreground opacity-70">Sınırsız erişim</p>
                 </div>
              </div>
              <button className="sidebar-text w-full text-xs bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors font-medium">
                Yükselt
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 flex flex-col relative h-full w-full overflow-y-auto" data-lenis-prevent>
        {/* Toggle Sidebar Button (Desktop) */}
        <div className="hidden md:block absolute top-4 left-4 z-10">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
             title={isSidebarOpen ? "Sidebarı Küçült" : "Sidebarı Genişlet"}
           >
               <Menu className="w-5 h-5" />
           </button>
       </div>

        {/* Top Right Header Controls */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-surface-elevated hover:bg-surface-hover transition-colors border border-transparent hover:border-border-neutral"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-md">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium hidden sm:block">Profil</span>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border-neutral overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-border-neutral mb-1">
                  <p className="text-sm font-medium">Kullanıcı</p>
                  <p className="text-xs text-muted">user@example.com</p>
                </div>
                
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push('/profile');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-500" />
                  Profili Görüntüle
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors">
                  <Settings className="w-4 h-4 text-zinc-500" />
                  Ayarlar
                </button>
                <button 
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors"
                >
                  {mounted && (resolvedTheme === 'dark' ? <Moon className="w-4 h-4 text-zinc-500" /> : <Sun className="w-4 h-4 text-zinc-500" />)}
                  Tema: {mounted ? (resolvedTheme === 'dark' ? 'Koyu' : 'Açık') : ''}
                </button>
                
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto px-4 pt-20 pb-32" 
          style={{ scrollBehavior: 'smooth' }}
          data-lenis-prevent
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 hero-element">
                    <Bot className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-orange-500 to-orange-700 dark:to-orange-300 hero-element">
                  Merhaba, nasıl yardımcı olabilirim?
                </h2>
                <p className="text-muted max-w-md hero-element">
                  Kedi ırkları, bakımı veya davranışları hakkında merak ettiğiniz her şeyi sorabilirsiniz.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-xl hero-element">
                  {["British Shorthair özellikleri nedir?", "Kedim neden çok miyavlıyor?", "En iyi kedi maması önerileri", "Aşı takvimi nasıl olmalı?"].map((suggestion, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(suggestion)}
                       className="p-3 text-sm text-left border border-border-neutral rounded-xl hover:bg-surface-hover hover:border-brand/30 transition-all group"
                    >
                      <span className="group-hover:text-brand transition-colors">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : isChatLoading ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex gap-4 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    {i % 2 !== 0 && (
                      <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
                    )}
                    <div className={`rounded-2xl px-5 py-4 ${i % 2 === 0 ? 'bg-orange-200 dark:bg-orange-900/30 w-48' : 'bg-zinc-200 dark:bg-zinc-700 w-64'}`}>
                      <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-full mb-2"></div>
                      <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-3/4"></div>
                    </div>
                    {i % 2 === 0 && (
                      <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-orange-500" />
                    </div>
                  )}
                  
                  <div 
                    className={`
                      max-w-[80%] rounded-2xl px-5 py-3.5 leading-relaxed
                      ${msg.role === 'user' 
                        ? 'bg-orange-500 text-white rounded-tr-sm' 
                        : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 rounded-tl-sm border border-zinc-200 dark:border-zinc-700/50'
                      }
                    `}
                  >
                    {msg.image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden max-w-sm">
                        <img src={msg.image_url} alt="Uploaded" className="w-full h-auto rounded-lg object-cover" />
                      </div>
                    )}
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-orange-500" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl rounded-tl-sm border border-zinc-200 dark:border-zinc-700/50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" style={{ animation: 'bounce 1s infinite', animationDelay: '0ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" style={{ animation: 'bounce 1s infinite', animationDelay: '200ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" style={{ animation: 'bounce 1s infinite', animationDelay: '400ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-linear-to-t from-background via-background to-transparent input-section">
          <div className="max-w-3xl mx-auto">
            {imagePreview && (
              <div className="mb-2 relative inline-block">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer shadow-sm hover:bg-red-600 transition-colors z-10" onClick={removeImage}>
                  <X className="w-3 h-3" />
                </div>
                <img src={imagePreview} alt="Preview" className="h-20 w-auto rounded-lg border border-orange-200 shadow-md object-cover" />
              </div>
            )}
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Kediniz hakkında bir şeyler sorun..."
                className="w-full bg-surface-elevated border border-border-neutral rounded-2xl pl-12 pr-14 py-4 shadow-lg shadow-black/5 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all placeholder:text-muted"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-orange-500 transition-colors"
                disabled={isLoading}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
              
              <button
                type="submit"
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="absolute right-2 top-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
            <p className="text-center text-[10px] text-zinc-400 mt-2">
              Yapay zeka hatalı bilgi verebilir. Lütfen önemli konularda veterinerinize danışın.
            </p>
          </div>
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteChat}
        title="Sohbeti Sil"
        message="Bu sohbeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />
    </div>
  );
}