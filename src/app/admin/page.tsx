"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  LayoutGrid,
  CheckCircle,
  Layers,
  Award,
  BarChart3,
  Globe,
  X,
  Save,
  ShieldCheck,
  ArrowLeft,
  Check,
  Image as ImageIcon,
  Phone,
  Video,
  Share2,
  Sparkles,
  MapPin,
  FileText
} from "lucide-react";
import Link from "next/link";
import { login, logout, getCurrentUser } from "@/lib/auth";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { useToast } from "@/components/ui/Toast";

// Helper functions for Instant Local Cache
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAdminCached = (colId: string): any[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const itemStr = localStorage.getItem("admin_cache_" + colId);
    return itemStr ? JSON.parse(itemStr) : null;
  } catch {
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAdminCached = (colId: string, data: any[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("admin_cache_" + colId, JSON.stringify(data));
  } catch (e) {
    console.warn("LocalStorage cache failed", e);
  }
};

export default function AdminPage() {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "services" | "packages" | "courses" | "stats" | "results" | "globals"
  >("services");

  // State for database items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Non-technical field states for complex JSON properties
  const [packageFeatures, setPackageFeatures] = useState<{ text: string; included: boolean }[]>([]);
  const [courseFeatures, setCourseFeatures] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [globalData, setGlobalData] = useState<Record<string, any>>({});
  const [aboutFeatures, setAboutFeatures] = useState<string[]>([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoadingUser(true);
    const user = await getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoadingUser(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter your admin email and password", "warning");
      return;
    }
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsAuthenticated(true);
      showToast("Signed in to System Portal", "success");
    } else {
      showToast("Invalid credentials. Please check your admin details.", "error");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    showToast("Signed out successfully", "info");
  };

  const getCollectionId = (tab = activeTab) => {
    switch (tab) {
      case "services":
        return COLLECTIONS.SERVICES;
      case "packages":
        return COLLECTIONS.PACKAGES;
      case "courses":
        return COLLECTIONS.COURSES;
      case "stats":
        return COLLECTIONS.STATS;
      case "results":
        return COLLECTIONS.RESULTS;
      case "globals":
        return COLLECTIONS.GLOBALS;
      default:
        return COLLECTIONS.SERVICES;
    }
  };

  // Instant SWR Fetch Function
  useEffect(() => {
    if (isAuthenticated) {
      fetchItemsSWR();
    }
  }, [isAuthenticated, activeTab]);

  const fetchItemsSWR = async (forceSpinner = false) => {
    const colId = getCollectionId();

    const cached = getAdminCached(colId);
    if (cached) {
      setItems(cached);
    } else if (forceSpinner) {
      setIsLoadingItems(true);
    }

    try {
      const response = await databases.listDocuments(DATABASE_ID, colId, [
        Query.limit(100)
      ]);
      setItems(response.documents);
      setAdminCached(colId, response.documents);
      if (typeof window !== "undefined") {
        localStorage.removeItem("cms_cache_" + activeTab);
        localStorage.removeItem("cms_cache_about_data");
        localStorage.removeItem("cms_cache_hero_data");
        localStorage.removeItem("cms_cache_site_branding");
        localStorage.removeItem("cms_cache_contact_info");
        localStorage.removeItem("cms_cache_social_links");
        localStorage.removeItem("cms_cache_intro_video");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Background sync error:", error);
      if (!cached) {
        showToast("Failed to load records", "error");
      }
    } finally {
      setIsLoadingItems(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    const defaultData = getDefaultFormData(activeTab);
    setFormData(defaultData);
    setupSpecialFields(activeTab, defaultData);
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setupSpecialFields(activeTab, item);
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupSpecialFields = (tab: string, data: any) => {
    if (tab === "packages") {
      try {
        const parsed = typeof data.tpm_features === "string" ? JSON.parse(data.tpm_features) : data.tpm_features;
        setPackageFeatures(Array.isArray(parsed) ? parsed : [{ text: "", included: true }]);
      } catch {
        setPackageFeatures([{ text: "", included: true }]);
      }
    } else if (tab === "courses") {
      try {
        const parsed = typeof data.tcm_features === "string" ? JSON.parse(data.tcm_features) : data.tcm_features;
        setCourseFeatures(Array.isArray(parsed) ? parsed : [""]);
      } catch {
        setCourseFeatures([""]);
      }
    } else if (tab === "globals") {
      try {
        const parsed = typeof data.tgm_content === "string" ? JSON.parse(data.tgm_content) : data.tgm_content;
        setGlobalData(parsed && typeof parsed === "object" ? parsed : {});
        if (parsed && Array.isArray(parsed.features)) {
          setAboutFeatures(parsed.features);
        } else {
          setAboutFeatures([]);
        }
      } catch {
        setGlobalData({});
        setAboutFeatures([]);
      }
    }
  };

  const handleSlugPresetChange = (slug: string) => {
    setFormData({ ...formData, tgm_slug: slug });
    // Provide default structured object if globalData is currently empty or changing slug
    switch (slug) {
      case "branding":
        setGlobalData({
          siteName: "FAIZ KHAN",
          siteNameHighlight: "DIGITAL",
          logoUrl: "",
          faviconUrl: "/favicon.ico",
          tagPill: "Premium Digital Marketing Services",
          metaTitle: "Faiz Khan Digital | Premium Digital Marketing Services",
          metaDescription: "Transform your digital presence with Faiz Khan Digital. Expert marketing strategies for verified results.",
          metaKeywords: "digital marketing, facebook ads, instagram ads, google ads, performance marketing"
        });
        break;
      case "contact":
        setGlobalData({
          email: "faizkhandigital@gmail.com",
          phone: "Available on WhatsApp",
          whatsappLink: "https://wa.link/uwwdyh",
          location: "Based in India, Serving Worldwide",
          footerBio: "Transforming digital presence with cutting-edge marketing strategies and expert guidance.",
          copyrightText: "Faiz Khan Digital. All rights reserved."
        });
        break;
      case "social":
        setGlobalData({
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          twitter: "https://twitter.com",
          youtube: "https://youtube.com",
          linkedin: ""
        });
        break;
      case "intro_video":
        setGlobalData({
          videoUrl: "",
          title: "Watch Introduction",
          subtitle: "Discover how we scale businesses through high-converting performance marketing"
        });
        break;
      case "hero":
        setGlobalData({
          titleLine1: "Digital Presence",
          titleLine2: "Reimagined",
          subtitle: "Transform your brand with expert strategies. Zero guesswork, infinite scalability, and verified results.",
          ctaPrimary: "Start Building",
          ctaSecondary: "Explore Services",
          tagPill: "Premium Digital Marketing Services"
        });
        break;
      case "about":
        setGlobalData({
          title: "Driving Remarkable Results Through Strategic Advertising",
          description1: "Hey there! 👋 I'm Faiz Khan, your go-to Facebook Ads expert with a proven track record.",
          description2: "With years of hands-on experience, I understand the ever-evolving landscape of digital advertising.",
          mentorName: "Faiz Khan",
          mentorRole: "Facebook Ads Expert & Mentor",
          mentorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
        });
        setAboutFeatures([
          "Proven 50Cr+ Ad Spend Management",
          "Custom Funnel & ROAS Optimization",
          "1-on-1 Mentorship & Weekly Audits",
          "1000+ Completed Success Projects"
        ]);
        break;
      default:
        setGlobalData({});
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const colId = getCollectionId();
    const updatedItems = items.filter((i) => i.$id !== docId);
    setItems(updatedItems);
    setAdminCached(colId, updatedItems);

    try {
      await databases.deleteDocument(DATABASE_ID, colId, docId);
      showToast("Record deleted", "success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast("Delete failed: " + (error.message || error), "error");
      fetchItemsSWR(true);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const colId = getCollectionId();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {};
      Object.keys(formData).forEach((key) => {
        if (!key.startsWith("$")) {
          let val = formData[key];
          if (key.endsWith("_order") && val !== undefined) {
            val = parseInt(val, 10) || 0;
          }
          if (typeof val === "string" && (val === "true" || val === "false")) {
            val = val === "true";
          }
          payload[key] = val;
        }
      });

      if (activeTab === "packages") {
        payload.tpm_features = JSON.stringify(
          packageFeatures.filter((f) => f.text.trim() !== "")
        );
      } else if (activeTab === "courses") {
        payload.tcm_features = JSON.stringify(
          courseFeatures.filter((f) => f.trim() !== "")
        );
      } else if (activeTab === "globals") {
        const contentObj = { ...globalData };
        if (formData.tgm_slug === "about") {
          contentObj.features = aboutFeatures.filter((f) => f.trim() !== "");
        }
        payload.tgm_content = JSON.stringify(contentObj);

        // Clear all CMS localStorage cache
        if (typeof window !== "undefined") {
          localStorage.removeItem("cms_cache_site_branding");
          localStorage.removeItem("cms_cache_contact_info");
          localStorage.removeItem("cms_cache_social_links");
          localStorage.removeItem("cms_cache_intro_video");
          localStorage.removeItem("cms_cache_about_data");
          localStorage.removeItem("cms_cache_hero_data");
          localStorage.removeItem("cms_cache_globals");
        }
      }

      if (editingItem) {
        const updatedItems = items.map((i) => (i.$id === editingItem.$id ? { ...i, ...payload } : i));
        setItems(updatedItems);
        setAdminCached(colId, updatedItems);
      } else {
        const tempDoc = { $id: "temp_" + Date.now(), ...payload };
        const updatedItems = [tempDoc, ...items];
        setItems(updatedItems);
        setAdminCached(colId, updatedItems);
      }

      setIsModalOpen(false);

      if (editingItem) {
        await databases.updateDocument(DATABASE_ID, colId, editingItem.$id, payload);
        showToast("Record saved", "success");
      } else {
        await databases.createDocument(DATABASE_ID, colId, ID.unique(), payload);
        showToast("Record created", "success");
      }

      fetchItemsSWR();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast("Save failed: " + (error.message || error), "error");
      fetchItemsSWR(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultFormData = (tab: string) => {
    switch (tab) {
      case "services":
        return { tsm_title: "", tsm_description: "", tsm_icon: "TrendingUp", tsm_order: 1 };
      case "packages":
        return {
          tpm_name: "",
          tpm_price: "₹25,000 / mo",
          tpm_is_popular: false,
          tpm_order: 1
        };
      case "courses":
        return {
          tcm_title: "",
          tcm_main_price: "₹4,999",
          tcm_original_price: "₹14,999",
          tcm_save_badge: "67% OFF",
          tcm_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          tcm_link: "#contact"
        };
      case "stats":
        return { tsm_label: "", tsm_value: "100", tsm_prefix: "₹", tsm_suffix: "+", tsm_icon: "Users", tsm_order: 1 };
      case "results":
        return { tr_type: "image", tr_url: "", tr_thumbnail: "", tr_title: "", tr_metric: "", tr_order: 1 };
      case "globals":
        return { tgm_slug: "branding", tgm_content: "{}" };
      default:
        return {};
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-cyan-400 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" /> Loading Portal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden flex flex-col font-outfit">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#050510]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/70 hover:text-cyan-400 transition-colors text-xs font-medium shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Site</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 shrink-0" />
          <h1
            className="text-sm sm:text-base font-bold gradient-text tracking-wider truncate"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            FAIZ KHAN DIGITAL <span className="text-cyan-400 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30">PORTAL</span>
          </h1>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="btn-glass text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-red-400 hover:text-red-400 transition-colors ml-auto sm:ml-0"
          >
            <LogOut className="w-3.5 h-3.5" /> <span>Sign Out</span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 md:px-8 py-6 md:py-10 relative z-10">
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="max-w-md mx-auto my-6 sm:my-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8 border border-white/15 shadow-[0_0_50px_rgba(0,242,234,0.1)]"
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,242,234,0.2)]">
                  <Lock className="w-7 h-7" />
                </div>
                <h2
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  System Login
                </h2>
                <p className="text-white/60 text-sm">
                  Enter your administrator credentials to manage website content.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-semibold">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@faizkhandigital.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-2 font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glass w-full py-3 bg-cyan-400 text-black border-cyan-400 font-bold hover:bg-cyan-300 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 leading-relaxed flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Protected Management Portal. Authorized personnel only.</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="space-y-6 md:space-y-8">
            {/* Scrollable Horizontal Navigation Bar */}
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center gap-2 min-w-max p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                {[
                  { id: "services", label: "Services", icon: Layers },
                  { id: "packages", label: "Packages", icon: LayoutGrid },
                  { id: "courses", label: "Courses", icon: Award },
                  { id: "stats", label: "Stats", icon: BarChart3 },
                  { id: "results", label: "Results", icon: CheckCircle },
                  { id: "globals", label: "Site & Global Settings", icon: Globe }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,242,234,0.3)]"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-5 sm:p-6 border-white/10">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold text-white capitalize flex items-center gap-2"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  Manage {activeTab === "globals" ? "Site & Global Settings" : activeTab}
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">
                    Instant Sync
                  </span>
                </h2>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  {activeTab === "globals"
                    ? "Manage Branding, Site Name, Logo, Favicon, Contact Info, WhatsApp, Social Links, Intro Video, Hero, & About content."
                    : "Add, update, or remove records on the live website."}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => fetchItemsSWR(true)}
                  disabled={isLoadingItems}
                  className="btn-glass text-xs py-2.5 flex-1 sm:flex-initial justify-center flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingItems ? "animate-spin" : ""}`} /> Sync Latest
                </button>
                <button
                  onClick={openAddModal}
                  className="btn-glass bg-cyan-400 text-black border-cyan-400 hover:bg-cyan-300 text-xs py-2.5 flex-1 sm:flex-initial justify-center flex items-center gap-2 font-bold"
                >
                  <Plus className="w-4 h-4" /> {activeTab === "globals" ? "Add / Config Setting" : "Add Record"}
                </button>
              </div>
            </div>

            {/* Content Cards Grid */}
            {isLoadingItems && items.length === 0 ? (
              <div className="glass-card p-12 text-center text-cyan-400 font-semibold text-sm flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin" /> Fetching latest records...
              </div>
            ) : items.length === 0 ? (
              <div className="glass-card p-12 text-center text-white/50 space-y-4">
                <p className="text-sm">No records found in this category.</p>
                <button
                  onClick={openAddModal}
                  className="btn-glass text-xs bg-cyan-400 text-black border-cyan-400 font-bold"
                >
                  {activeTab === "globals" ? "Configure Setting" : "Add Record"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div
                    key={item.$id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all space-y-4"
                  >
                    <div className="space-y-4">
                      {/* Top Bar of Card */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                          {activeTab === "globals" ? `Slug: ${item.tgm_slug}` : item.$id}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.$id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 1. SERVICES CARD */}
                      {activeTab === "services" && (
                        <div>
                          <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                            {item.tsm_title}
                          </h3>
                          <p className="text-white/60 text-xs line-clamp-3 mb-2">{item.tsm_description}</p>
                          <div className="flex items-center gap-2 text-xs text-cyan-400">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Icon: {item.tsm_icon}</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Order: {item.tsm_order}</span>
                          </div>
                        </div>
                      )}

                      {/* 2. PACKAGES CARD */}
                      {activeTab === "packages" && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                              {item.tpm_name}
                            </h3>
                            {item.tpm_is_popular && (
                              <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="text-cyan-400 font-bold text-sm mb-3">{item.tpm_price}</div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-white/50 uppercase">Features:</span>
                            {(() => {
                              try {
                                const feats = typeof item.tpm_features === "string" ? JSON.parse(item.tpm_features) : item.tpm_features;
                                return Array.isArray(feats) ? (
                                  <ul className="space-y-1 text-xs">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {feats.map((f: any, i: number) => (
                                      <li key={i} className="flex items-center gap-1.5 text-white/70">
                                        {f.included ? <Check className="w-3 h-3 text-cyan-400 shrink-0" /> : <X className="w-3 h-3 text-white/30 shrink-0" />}
                                        <span className={f.included ? "" : "line-through opacity-50"}>{f.text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null;
                              } catch {
                                return <span className="text-xs text-white/50">{item.tpm_features}</span>;
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      {/* 3. COURSES CARD */}
                      {activeTab === "courses" && (
                        <div>
                          <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                            {item.tcm_title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-cyan-400 font-bold text-sm">{item.tcm_main_price}</span>
                            <span className="text-white/40 line-through text-xs">{item.tcm_original_price}</span>
                            <span className="text-xs text-purple-400 font-semibold">{item.tcm_save_badge}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-white/50 uppercase">Bullet Points:</span>
                            {(() => {
                              try {
                                const feats = typeof item.tcm_features === "string" ? JSON.parse(item.tcm_features) : item.tcm_features;
                                return Array.isArray(feats) ? (
                                  <ul className="space-y-1 text-xs text-white/70">
                                    {feats.map((f: string, i: number) => (
                                      <li key={i} className="flex items-center gap-1.5">
                                        <Check className="w-3 h-3 text-green-400 shrink-0" />
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null;
                              } catch {
                                return <span className="text-xs text-white/50">{item.tcm_features}</span>;
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      {/* 4. STATS CARD */}
                      {activeTab === "stats" && (
                        <div className="text-center py-2">
                          <div className="text-3xl font-bold text-white mb-1">
                            {item.tsm_prefix}{item.tsm_value}{item.tsm_suffix}
                          </div>
                          <div className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">
                            {item.tsm_label}
                          </div>
                        </div>
                      )}

                      {/* 5. RESULTS CARD */}
                      {activeTab === "results" && (
                        <div>
                          <h3 className="text-base font-bold text-white mb-1">{item.tr_title || item.tr_type}</h3>
                          <div className="text-xs text-cyan-400 font-semibold mb-2">{item.tr_metric}</div>
                          <p className="text-xs font-mono text-white/50 truncate">{item.tr_url}</p>
                        </div>
                      )}

                      {/* 6. GLOBALS / SITE SETTINGS CARD */}
                      {activeTab === "globals" && (
                        <div>
                          {(() => {
                            try {
                              const parsed = typeof item.tgm_content === "string" ? JSON.parse(item.tgm_content) : item.tgm_content;
                              
                              if (item.tgm_slug === "branding") {
                                return (
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                                      <span className="font-bold text-white text-sm">
                                        {parsed.siteName || "FAIZ KHAN"} <span className="text-purple-400">{parsed.siteNameHighlight || "DIGITAL"}</span>
                                      </span>
                                    </div>
                                    {parsed.logoUrl && (
                                      <p className="text-white/50 truncate font-mono text-[11px]">Logo: {parsed.logoUrl}</p>
                                    )}
                                    {parsed.faviconUrl && (
                                      <p className="text-white/50 truncate font-mono text-[11px]">Favicon: {parsed.faviconUrl}</p>
                                    )}
                                    {parsed.metaTitle && (
                                      <p className="text-cyan-400 text-[11px] line-clamp-1">SEO Title: {parsed.metaTitle}</p>
                                    )}
                                  </div>
                                );
                              }

                              if (item.tgm_slug === "contact") {
                                return (
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-white/80">
                                      <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                      <span className="truncate">{parsed.email || "faizkhandigital@gmail.com"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80">
                                      <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                      <span className="truncate">{parsed.phone || "Available on WhatsApp"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80">
                                      <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                      <span className="truncate">{parsed.location || "Based in India"}</span>
                                    </div>
                                  </div>
                                );
                              }

                              if (item.tgm_slug === "social") {
                                return (
                                  <div className="space-y-1.5 text-xs text-white/70">
                                    <div className="flex items-center gap-1.5 font-semibold text-cyan-400 mb-1">
                                      <Share2 className="w-3.5 h-3.5" /> Social Profiles
                                    </div>
                                    {parsed.facebook && <p className="truncate">FB: {parsed.facebook}</p>}
                                    {parsed.instagram && <p className="truncate">IG: {parsed.instagram}</p>}
                                    {parsed.youtube && <p className="truncate">YT: {parsed.youtube}</p>}
                                    {parsed.twitter && <p className="truncate">X: {parsed.twitter}</p>}
                                    {parsed.linkedin && <p className="truncate">IN: {parsed.linkedin}</p>}
                                  </div>
                                );
                              }

                              if (item.tgm_slug === "intro_video") {
                                return (
                                  <div className="space-y-1.5 text-xs">
                                    <div className="flex items-center gap-1.5 font-semibold text-cyan-400 mb-1">
                                      <Video className="w-3.5 h-3.5" /> Intro Video
                                    </div>
                                    <h4 className="font-bold text-white">{parsed.title || "Watch Introduction"}</h4>
                                    <p className="text-white/50 text-[11px] font-mono truncate">{parsed.videoUrl || "(No URL configured)"}</p>
                                  </div>
                                );
                              }

                              if (item.tgm_slug === "hero") {
                                return (
                                  <div className="space-y-1.5 text-xs">
                                    <div className="font-bold text-white text-sm">
                                      {parsed.titleLine1} {parsed.titleLine2}
                                    </div>
                                    <p className="text-white/60 line-clamp-2">{parsed.subtitle}</p>
                                    <div className="flex gap-2 text-cyan-400 font-mono text-[10px]">
                                      <span>CTA: {parsed.ctaPrimary}</span>
                                    </div>
                                  </div>
                                );
                              }

                              if (item.tgm_slug === "about") {
                                return (
                                  <div className="space-y-1.5 text-xs">
                                    <div className="font-bold text-white text-sm">{parsed.mentorName || "Faiz Khan"}</div>
                                    <div className="text-purple-400 font-medium text-xs">{parsed.mentorRole || "Mentor"}</div>
                                    <p className="text-white/60 line-clamp-2">{parsed.title}</p>
                                  </div>
                                );
                              }

                              // Default fallback rendering
                              return Object.keys(parsed).map((k) => (
                                <div key={k} className="flex flex-col text-xs">
                                  <span className="text-white/40 font-mono text-[10px] uppercase">{k}:</span>
                                  <span className="text-white/80 line-clamp-2">
                                    {Array.isArray(parsed[k]) ? parsed[k].join(", ") : String(parsed[k])}
                                  </span>
                                </div>
                              ));
                            } catch {
                              return <p className="text-xs text-white/60">{item.tgm_content}</p>;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* USER-FRIENDLY ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card w-full max-w-2xl p-6 sm:p-8 border-white/20 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h3
                  className="text-lg sm:text-xl font-bold text-white capitalize"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {editingItem ? `Edit ${activeTab === "globals" ? "Setting" : activeTab.slice(0, -1)} Record` : `Add / Configure ${activeTab === "globals" ? "Setting" : activeTab.slice(0, -1)}`}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-5">
                {/* 1. SERVICES FORM */}
                {activeTab === "services" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-cyan-400 mb-1">Service Title</label>
                      <input
                        type="text"
                        value={formData.tsm_title || ""}
                        onChange={(e) => setFormData({ ...formData, tsm_title: e.target.value })}
                        placeholder="e.g. Performance Marketing"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-cyan-400 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={formData.tsm_description || ""}
                        onChange={(e) => setFormData({ ...formData, tsm_description: e.target.value })}
                        placeholder="e.g. Laser-targeted Meta & Google ads..."
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Lucide Icon Name</label>
                        <input
                          type="text"
                          value={formData.tsm_icon || "TrendingUp"}
                          onChange={(e) => setFormData({ ...formData, tsm_icon: e.target.value })}
                          placeholder="TrendingUp, Target, Smartphone..."
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Display Order</label>
                        <input
                          type="number"
                          value={formData.tsm_order ?? 1}
                          onChange={(e) => setFormData({ ...formData, tsm_order: e.target.value })}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 2. PACKAGES FORM */}
                {activeTab === "packages" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Package Name</label>
                        <input
                          type="text"
                          value={formData.tpm_name || ""}
                          onChange={(e) => setFormData({ ...formData, tpm_name: e.target.value })}
                          placeholder="e.g. Growth Accelerate"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Pricing Label</label>
                        <input
                          type="text"
                          value={formData.tpm_price || ""}
                          onChange={(e) => setFormData({ ...formData, tpm_price: e.target.value })}
                          placeholder="e.g. ₹25,000 / mo"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Display Order</label>
                        <input
                          type="number"
                          value={formData.tpm_order ?? 1}
                          onChange={(e) => setFormData({ ...formData, tpm_order: e.target.value })}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <input
                          type="checkbox"
                          id="is_popular"
                          checked={formData.tpm_is_popular || false}
                          onChange={(e) => setFormData({ ...formData, tpm_is_popular: e.target.checked })}
                          className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                        />
                        <label htmlFor="is_popular" className="text-xs text-white cursor-pointer font-medium">
                          Highlight as Recommended / Popular
                        </label>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-cyan-400 uppercase">Package Features List</label>
                        <button
                          type="button"
                          onClick={() => setPackageFeatures([...packageFeatures, { text: "", included: true }])}
                          className="btn-glass text-[11px] py-1 px-2.5 flex items-center gap-1 border-cyan-400/50 text-cyan-400"
                        >
                          <Plus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>

                      {packageFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={feat.included}
                            onChange={(e) => {
                              const updated = [...packageFeatures];
                              updated[idx].included = e.target.checked;
                              setPackageFeatures(updated);
                            }}
                            title="Included in package?"
                            className="w-4 h-4 accent-cyan-400 rounded shrink-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={feat.text}
                            onChange={(e) => {
                              const updated = [...packageFeatures];
                              updated[idx].text = e.target.value;
                              setPackageFeatures(updated);
                            }}
                            placeholder="e.g. Weekly Strategy & Ad Performance Reports"
                            className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPackageFeatures(packageFeatures.filter((_, i) => i !== idx));
                            }}
                            className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 3. COURSES FORM */}
                {activeTab === "courses" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-cyan-400 mb-1">Course Title</label>
                      <input
                        type="text"
                        value={formData.tcm_title || ""}
                        onChange={(e) => setFormData({ ...formData, tcm_title: e.target.value })}
                        placeholder="e.g. Complete Meta Ads Mastery 2026"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Offer Price</label>
                        <input
                          type="text"
                          value={formData.tcm_main_price || ""}
                          onChange={(e) => setFormData({ ...formData, tcm_main_price: e.target.value })}
                          placeholder="₹4,999"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Original Price</label>
                        <input
                          type="text"
                          value={formData.tcm_original_price || ""}
                          onChange={(e) => setFormData({ ...formData, tcm_original_price: e.target.value })}
                          placeholder="₹14,999"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Save Badge</label>
                        <input
                          type="text"
                          value={formData.tcm_save_badge || ""}
                          onChange={(e) => setFormData({ ...formData, tcm_save_badge: e.target.value })}
                          placeholder="67% OFF"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Course Thumbnail Image URL</label>
                        <input
                          type="url"
                          value={formData.tcm_image || ""}
                          onChange={(e) => setFormData({ ...formData, tcm_image: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Checkout / Buy Link</label>
                        <input
                          type="text"
                          value={formData.tcm_link || ""}
                          onChange={(e) => setFormData({ ...formData, tcm_link: e.target.value })}
                          placeholder="#contact or https://..."
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Course Features */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-cyan-400 uppercase">Course Bullet Points</label>
                        <button
                          type="button"
                          onClick={() => setCourseFeatures([...courseFeatures, ""])}
                          className="btn-glass text-[11px] py-1 px-2.5 flex items-center gap-1 border-cyan-400/50 text-cyan-400"
                        >
                          <Plus className="w-3 h-3" /> Add Point
                        </button>
                      </div>

                      {courseFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updated = [...courseFeatures];
                              updated[idx] = e.target.value;
                              setCourseFeatures(updated);
                            }}
                            placeholder="e.g. Step-by-step Meta Ads setup & ROAS scaling"
                            className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCourseFeatures(courseFeatures.filter((_, i) => i !== idx));
                            }}
                            className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 4. STATS FORM */}
                {activeTab === "stats" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Stat Label</label>
                        <input
                          type="text"
                          value={formData.tsm_label || ""}
                          onChange={(e) => setFormData({ ...formData, tsm_label: e.target.value })}
                          placeholder="e.g. Ad Spend Managed"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Number Value</label>
                        <input
                          type="text"
                          value={formData.tsm_value || ""}
                          onChange={(e) => setFormData({ ...formData, tsm_value: e.target.value })}
                          placeholder="e.g. 50"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Prefix (e.g. ₹ or $)</label>
                        <input
                          type="text"
                          value={formData.tsm_prefix || ""}
                          onChange={(e) => setFormData({ ...formData, tsm_prefix: e.target.value })}
                          placeholder="₹"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Suffix (e.g. Cr+ or +)</label>
                        <input
                          type="text"
                          value={formData.tsm_suffix || ""}
                          onChange={(e) => setFormData({ ...formData, tsm_suffix: e.target.value })}
                          placeholder="Cr+"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Display Order</label>
                        <input
                          type="number"
                          value={formData.tsm_order ?? 1}
                          onChange={(e) => setFormData({ ...formData, tsm_order: e.target.value })}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 5. RESULTS FORM */}
                {activeTab === "results" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Title / Case Study Name</label>
                        <input
                          type="text"
                          value={formData.tr_title || ""}
                          onChange={(e) => setFormData({ ...formData, tr_title: e.target.value })}
                          placeholder="e.g. E-commerce Brand ROAS"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Metric Badge (e.g. 5.2x ROAS)</label>
                        <input
                          type="text"
                          value={formData.tr_metric || ""}
                          onChange={(e) => setFormData({ ...formData, tr_metric: e.target.value })}
                          placeholder="5.2x ROAS"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Type</label>
                        <select
                          value={formData.tr_type || "image"}
                          onChange={(e) => setFormData({ ...formData, tr_type: e.target.value })}
                          className="w-full p-3 bg-[#0a0a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        >
                          <option value="image">Image Proof</option>
                          <option value="video">Video Testimonial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Media URL</label>
                        <input
                          type="url"
                          value={formData.tr_url || ""}
                          onChange={(e) => setFormData({ ...formData, tr_url: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 6. GLOBALS / SITE SETTINGS FORM */}
                {activeTab === "globals" && (
                  <div className="space-y-4">
                    {/* Quick Preset Selector Buttons */}
                    <div>
                      <label className="block text-xs font-semibold text-cyan-400 mb-2">Setting Type / Section Preset</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "branding", label: "Branding & Identity", icon: Sparkles },
                          { id: "contact", label: "Contact Info", icon: Mail },
                          { id: "social", label: "Social Links", icon: Share2 },
                          { id: "intro_video", label: "Intro Video", icon: Video },
                          { id: "hero", label: "Hero Section", icon: FileText },
                          { id: "about", label: "About Mentor", icon: Award },
                          { id: "custom", label: "Custom Slug", icon: Globe }
                        ].map((preset) => {
                          const Icon = preset.icon;
                          const isSelected = formData.tgm_slug === preset.id || (preset.id === "custom" && !["branding", "contact", "social", "intro_video", "hero", "about"].includes(formData.tgm_slug));
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSlugPresetChange(preset.id === "custom" ? "custom_slug" : preset.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,242,234,0.3)]"
                                  : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1 font-mono">Slug Identifier (System Key)</label>
                      <input
                        type="text"
                        value={formData.tgm_slug || "branding"}
                        onChange={(e) => setFormData({ ...formData, tgm_slug: e.target.value })}
                        placeholder="branding, contact, social, intro_video, hero, about"
                        className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                        required
                      />
                    </div>

                    {/* BRANDING FORM */}
                    {formData.tgm_slug === "branding" && (
                      <div className="space-y-4 pt-1 border-t border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Site / Brand Name</label>
                            <input
                              type="text"
                              value={globalData.siteName || ""}
                              onChange={(e) => setGlobalData({ ...globalData, siteName: e.target.value })}
                              placeholder="FAIZ KHAN"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-purple-400 mb-1">Brand Name Highlight / Accent</label>
                            <input
                              type="text"
                              value={globalData.siteNameHighlight || ""}
                              onChange={(e) => setGlobalData({ ...globalData, siteNameHighlight: e.target.value })}
                              placeholder="DIGITAL"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Logo Image URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={globalData.logoUrl || ""}
                              onChange={(e) => setGlobalData({ ...globalData, logoUrl: e.target.value })}
                              placeholder="https://.../logo.png"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Favicon URL (Optional)</label>
                            <input
                              type="text"
                              value={globalData.faviconUrl || ""}
                              onChange={(e) => setGlobalData({ ...globalData, faviconUrl: e.target.value })}
                              placeholder="/favicon.ico or https://..."
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Hero Pill Tagline</label>
                          <input
                            type="text"
                            value={globalData.tagPill || ""}
                            onChange={(e) => setGlobalData({ ...globalData, tagPill: e.target.value })}
                            placeholder="Premium Digital Marketing Services"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">SEO Meta Title</label>
                          <input
                            type="text"
                            value={globalData.metaTitle || ""}
                            onChange={(e) => setGlobalData({ ...globalData, metaTitle: e.target.value })}
                            placeholder="Faiz Khan Digital | Premium Digital Marketing Services"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">SEO Meta Description</label>
                          <textarea
                            rows={2}
                            value={globalData.metaDescription || ""}
                            onChange={(e) => setGlobalData({ ...globalData, metaDescription: e.target.value })}
                            placeholder="Transform your digital presence with Faiz Khan Digital..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* CONTACT FORM */}
                    {formData.tgm_slug === "contact" && (
                      <div className="space-y-4 pt-1 border-t border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" /> Support / Contact Email
                            </label>
                            <input
                              type="email"
                              value={globalData.email || ""}
                              onChange={(e) => setGlobalData({ ...globalData, email: e.target.value })}
                              placeholder="faizkhandigital@gmail.com"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" /> Phone / WhatsApp Display Text
                            </label>
                            <input
                              type="text"
                              value={globalData.phone || ""}
                              onChange={(e) => setGlobalData({ ...globalData, phone: e.target.value })}
                              placeholder="Available on WhatsApp or +91 98765 43210"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">WhatsApp Chat Direct Link</label>
                            <input
                              type="url"
                              value={globalData.whatsappLink || ""}
                              onChange={(e) => setGlobalData({ ...globalData, whatsappLink: e.target.value })}
                              placeholder="https://wa.link/uwwdyh"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" /> Operating / Physical Location
                            </label>
                            <input
                              type="text"
                              value={globalData.location || ""}
                              onChange={(e) => setGlobalData({ ...globalData, location: e.target.value })}
                              placeholder="Based in India, Serving Worldwide"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Footer Bio Paragraph</label>
                          <textarea
                            rows={2}
                            value={globalData.footerBio || ""}
                            onChange={(e) => setGlobalData({ ...globalData, footerBio: e.target.value })}
                            placeholder="Transforming digital presence with cutting-edge marketing strategies..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Copyright Notice</label>
                          <input
                            type="text"
                            value={globalData.copyrightText || ""}
                            onChange={(e) => setGlobalData({ ...globalData, copyrightText: e.target.value })}
                            placeholder="Faiz Khan Digital. All rights reserved."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* SOCIAL LINKS FORM */}
                    {formData.tgm_slug === "social" && (
                      <div className="space-y-3 pt-1 border-t border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Facebook URL</label>
                            <input
                              type="url"
                              value={globalData.facebook || ""}
                              onChange={(e) => setGlobalData({ ...globalData, facebook: e.target.value })}
                              placeholder="https://facebook.com/..."
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Instagram URL</label>
                            <input
                              type="url"
                              value={globalData.instagram || ""}
                              onChange={(e) => setGlobalData({ ...globalData, instagram: e.target.value })}
                              placeholder="https://instagram.com/..."
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">YouTube URL</label>
                            <input
                              type="url"
                              value={globalData.youtube || ""}
                              onChange={(e) => setGlobalData({ ...globalData, youtube: e.target.value })}
                              placeholder="https://youtube.com/..."
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Twitter / X URL</label>
                            <input
                              type="url"
                              value={globalData.twitter || ""}
                              onChange={(e) => setGlobalData({ ...globalData, twitter: e.target.value })}
                              placeholder="https://twitter.com/..."
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">LinkedIn URL</label>
                          <input
                            type="url"
                            value={globalData.linkedin || ""}
                            onChange={(e) => setGlobalData({ ...globalData, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* INTRO VIDEO FORM */}
                    {formData.tgm_slug === "intro_video" && (
                      <div className="space-y-4 pt-1 border-t border-white/10">
                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5" /> Video URL (YouTube, Vimeo, or Direct Embed Link)
                          </label>
                          <input
                            type="url"
                            value={globalData.videoUrl || ""}
                            onChange={(e) => setGlobalData({ ...globalData, videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                          />
                          <p className="text-[11px] text-white/40 mt-1">
                            Paste standard YouTube watch or youtu.be links — they are automatically converted to embed players.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Video Section Heading</label>
                          <input
                            type="text"
                            value={globalData.title || ""}
                            onChange={(e) => setGlobalData({ ...globalData, title: e.target.value })}
                            placeholder="Watch Introduction"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Video Subtitle</label>
                          <input
                            type="text"
                            value={globalData.subtitle || ""}
                            onChange={(e) => setGlobalData({ ...globalData, subtitle: e.target.value })}
                            placeholder="Discover how we scale businesses through high-converting performance marketing"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* HERO FORM */}
                    {formData.tgm_slug === "hero" && (
                      <div className="space-y-3 pt-1 border-t border-white/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Title Line 1</label>
                            <input
                              type="text"
                              value={globalData.titleLine1 || ""}
                              onChange={(e) => setGlobalData({ ...globalData, titleLine1: e.target.value })}
                              placeholder="Digital Presence"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Title Line 2 (Gradient)</label>
                            <input
                              type="text"
                              value={globalData.titleLine2 || ""}
                              onChange={(e) => setGlobalData({ ...globalData, titleLine2: e.target.value })}
                              placeholder="Reimagined"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Subtitle</label>
                          <textarea
                            rows={2}
                            value={globalData.subtitle || ""}
                            onChange={(e) => setGlobalData({ ...globalData, subtitle: e.target.value })}
                            placeholder="Transform your brand with expert strategies..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Primary Button Text</label>
                            <input
                              type="text"
                              value={globalData.ctaPrimary || ""}
                              onChange={(e) => setGlobalData({ ...globalData, ctaPrimary: e.target.value })}
                              placeholder="Start Building"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Secondary Button Text</label>
                            <input
                              type="text"
                              value={globalData.ctaSecondary || ""}
                              onChange={(e) => setGlobalData({ ...globalData, ctaSecondary: e.target.value })}
                              placeholder="Explore Services"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Tag Pill Text</label>
                            <input
                              type="text"
                              value={globalData.tagPill || ""}
                              onChange={(e) => setGlobalData({ ...globalData, tagPill: e.target.value })}
                              placeholder="Premium Digital Marketing Services"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ABOUT FORM */}
                    {formData.tgm_slug === "about" && (
                      <div className="space-y-4 pt-1 border-t border-white/10">
                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={globalData.title || ""}
                            onChange={(e) => setGlobalData({ ...globalData, title: e.target.value })}
                            placeholder="Driving Remarkable Results Through Strategic Advertising"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Description Paragraph 1</label>
                          <textarea
                            rows={3}
                            value={globalData.description1 || ""}
                            onChange={(e) => setGlobalData({ ...globalData, description1: e.target.value })}
                            placeholder="Hey there! 👋 I'm Faiz Khan..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1">Description Paragraph 2</label>
                          <textarea
                            rows={3}
                            value={globalData.description2 || ""}
                            onChange={(e) => setGlobalData({ ...globalData, description2: e.target.value })}
                            placeholder="With years of hands-on experience..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Mentor Name</label>
                            <input
                              type="text"
                              value={globalData.mentorName || ""}
                              onChange={(e) => setGlobalData({ ...globalData, mentorName: e.target.value })}
                              placeholder="Faiz Khan"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-cyan-400 mb-1">Mentor Role</label>
                            <input
                              type="text"
                              value={globalData.mentorRole || ""}
                              onChange={(e) => setGlobalData({ ...globalData, mentorRole: e.target.value })}
                              placeholder="Facebook Ads Expert & Mentor"
                              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Mentor / Founder Image URL
                          </label>
                          <input
                            type="url"
                            value={globalData.mentorImage || ""}
                            onChange={(e) => setGlobalData({ ...globalData, mentorImage: e.target.value })}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* WHY CHOOSE US DYNAMIC BULLET LIST */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-cyan-400 uppercase">Why Choose Us? Bullet Points</label>
                            <button
                              type="button"
                              onClick={() => setAboutFeatures([...aboutFeatures, ""])}
                              className="btn-glass text-[11px] py-1 px-2.5 flex items-center gap-1 border-cyan-400/50 text-cyan-400"
                            >
                              <Plus className="w-3 h-3" /> Add Point
                            </button>
                          </div>

                          {aboutFeatures.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => {
                                  const updated = [...aboutFeatures];
                                  updated[idx] = e.target.value;
                                  setAboutFeatures(updated);
                                }}
                                placeholder="e.g. Proven 50Cr+ Ad Spend Management"
                                className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setAboutFeatures(aboutFeatures.filter((_, i) => i !== idx));
                                }}
                                className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CUSTOM SLUG FALLBACK */}
                    {!["branding", "contact", "social", "intro_video", "hero", "about"].includes(formData.tgm_slug) && (
                      <div className="space-y-3 pt-1 border-t border-white/10">
                        <label className="block text-xs font-semibold text-cyan-400 mb-1">Global Content (JSON Data)</label>
                        <textarea
                          rows={6}
                          value={typeof globalData === "object" ? JSON.stringify(globalData, null, 2) : globalData}
                          onChange={(e) => {
                            try {
                              setGlobalData(JSON.parse(e.target.value));
                            } catch {
                              // keep string if typing
                            }
                          }}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-glass text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-glass bg-cyan-400 text-black border-cyan-400 font-bold hover:bg-cyan-300 text-xs flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
