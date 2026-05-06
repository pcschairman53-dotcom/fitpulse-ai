/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Activity, 
  Menu,
  X,
  CreditCard,
  Bell,
  Search,
  ChevronRight,
  Plus,
  Sparkles,
  Phone,
  Target,
  TrendingUp,
  Zap,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import Dashboard from './components/dashboard/Dashboard';
import FitnessChat from './components/chat/FitnessChat';
import VoiceBot from './components/voice/VoiceBot';

type Tab = 'dashboard' | 'assistant' | 'membership' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inquiryContext, setInquiryContext] = useState<{ name: string; phone: string; query: string; type?: 'inquiry' | 'trial' } | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'hot', title: 'Hot Lead Active', desc: 'User interested in Muscle Gain Plan', time: '2m ago', icon: Sparkles, color: 'text-rose-500 bg-rose-50' },
    { id: 2, type: 'trial', title: 'New Trial Booking', desc: 'Sarah J. booked a free trial session', time: '15m ago', icon: Zap, color: 'text-blue-500 bg-blue-50' },
    { id: 3, type: 'whatsapp', title: 'WhatsApp Inquiry', desc: 'Pending response for "Elite Membership"', time: '1h ago', icon: Phone, color: 'text-emerald-500 bg-emerald-50' },
    { id: 4, type: 'callback', title: 'Callback Request', desc: 'Requested for 5:30 PM today', time: '2h ago', icon: Bell, color: 'text-amber-500 bg-amber-50' },
  ]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const suggestions = [
    { label: 'Weight Loss Plan', icon: Target, action: () => { setActiveTab('assistant'); setSearchQuery(''); } },
    { label: 'Gain Muscle', icon: TrendingUp, action: () => { setActiveTab('assistant'); setSearchQuery(''); } },
    { label: 'Book Free Trial', icon: Zap, action: () => { setIsBookingModalOpen(true); setSearchQuery(''); } },
    { label: 'Membership Pricing', icon: CreditCard, action: () => { setActiveTab('membership'); setSearchQuery(''); } },
  ];

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('weight') || q.includes('fat') || q.includes('lose')) {
      setActiveTab('assistant');
    } else if (q.includes('muscle') || q.includes('gain') || q.includes('bulk')) {
      setActiveTab('assistant');
    } else if (q.includes('membership') || q.includes('price') || q.includes('plan')) {
      setActiveTab('membership');
    } else if (q.includes('trial') || q.includes('book')) {
      setIsBookingModalOpen(true);
    } else if (q.includes('pt') || q.includes('coach') || q.includes('training')) {
      setActiveTab('assistant');
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'membership', label: 'Membership', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 overflow-hidden">
      {/* Mobile Header Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? '280px' : (window.innerWidth < 1024 ? '0px' : '88px'),
          x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -280
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#0F172A] text-slate-400 flex flex-col transition-all duration-300 lg:relative border-r border-slate-800 shadow-2xl lg:shadow-none",
          !isSidebarOpen && "lg:items-center overflow-hidden"
        )}
      >
        {/* Branding */}
        <div className={cn("h-24 shrink-0 flex items-center gap-4 px-8 border-b border-slate-800", !isSidebarOpen && "lg:justify-center lg:px-0")}>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
            <Activity className="text-white" size={28} strokeWidth={3} />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black text-white tracking-tighter"
            >
              FitPulse<span className="text-blue-500">AI</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-10 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/40" 
                  : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "shrink-0 transition-all group-hover:scale-110",
                activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-blue-400"
              )} size={24} />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-black text-sm tracking-widest uppercase italic"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer - Support Section */}
        <div className="p-4 border-t border-slate-800/50 space-y-4">
          {isSidebarOpen ? (
            <div className="bg-slate-800/40 rounded-3xl p-5 border border-slate-700/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 shadow-inner">
                    <Phone size={16} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-widest italic">Contact Support</span>
                </div>
                
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                  Need help? Our team is ready to assist you.
                </p>

                <a 
                  href="tel:+919330457995"
                  className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95"
                >
                  👉 CALL NOW
                </a>

                <div className="pt-1 text-center">
                  <a 
                    href="https://wa.me/919330457995"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-tight flex items-center justify-center gap-1.5"
                  >
                    <span>Or connect on WhatsApp</span>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <a 
                href="tel:+919330457995"
                className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-90"
                title="Call Support"
              >
                <Phone size={20} />
              </a>
              <a 
                href="https://wa.me/919330457995"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 transition-all"
                title="WhatsApp Support"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 md:h-24 shrink-0 bg-white border-b border-slate-200 px-4 md:px-12 flex items-center justify-between z-40 relative sticky top-0">
          <div className="flex items-center gap-3 md:gap-8 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 md:p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-900 lg:hidden border border-slate-200 shadow-sm shrink-0"
              aria-label="Toggle menu"
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            <div className="hidden md:flex relative group max-w-xs xl:max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search fitness plans, workouts, memberships..." 
                className="bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-full outline-none text-slate-900 shadow-sm"
              />

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</span>
                    </div>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={s.action}
                        className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl transition-all group/item text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 group-hover/item:bg-blue-100 text-slate-500 group-hover/item:text-blue-600 rounded-lg flex items-center justify-center transition-colors">
                            <s.icon size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover/item:text-blue-900">{s.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover/item:text-blue-400 group-hover/item:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6 shrink-0 ml-auto">
            <a 
              href="tel:+919330457995"
              className="hidden xs:flex items-center gap-2 bg-blue-600 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Phone size={14} />
              <span className="hidden sm:inline">Call Now</span>
            </a>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 md:p-3 bg-white hover:bg-slate-50 rounded-2xl transition-all text-slate-600 border border-slate-200 shadow-sm active:scale-95 group"
              >
                <Bell size={20} strokeWidth={2.5} />
                <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-3 h-3 bg-rose-600 border-2 border-white rounded-full shadow-lg shadow-rose-500/30" />
                <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsNotificationsOpen(false)}
                      className="fixed inset-0 z-[60]"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-72 md:w-96 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-300/30 overflow-hidden z-[70] origin-top-right"
                    >
                      <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400 shadow-lg shrink-0">
                            <Bot size={18} strokeWidth={3} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[10px] md:text-sm font-black text-slate-900 uppercase tracking-widest leading-none truncate">Lead Alert Center</h3>
                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">AI CRM Real-Time Feed</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full shrink-0">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">4 New</span>
                        </div>
                      </div>
                      
                      <div className="max-h-[350px] md:max-h-[450px] overflow-y-auto p-3 space-y-1 custom-scrollbar bg-white">
                        {notifications.map((n) => (
                          <button 
                            key={n.id}
                            className="w-full flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-all group text-left border border-transparent hover:border-slate-100"
                          >
                            <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-sm", n.color)}>
                              <n.icon size={18} md:size={20} />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className={cn(
                                  "text-xs md:text-sm font-black truncate",
                                  n.type === 'hot' ? "text-rose-600" : "text-slate-900"
                                )}>
                                  {n.type === 'hot' && "🔥 "}{n.title}
                                </span>
                                <span className="text-[9px] font-black text-slate-300 whitespace-nowrap uppercase tracking-tighter">{n.time}</span>
                              </div>
                              <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">{n.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95">
                          Open All Activity
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="h-6 md:h-10 w-[1px] bg-slate-100 mx-0.5 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-4 pl-0.5 md:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] md:text-[15px] font-black text-slate-900 leading-none tracking-tight">ARJUN</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-[7px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Coach</p>
                </div>
              </div>
              <div className="w-9 h-9 md:w-13 md:h-13 rounded-lg md:rounded-2xl bg-slate-900 overflow-hidden ring-2 md:ring-4 ring-slate-50 shadow-md transform hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&mode=grid" alt="Trainer" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar scroll-smooth">
          <div className={cn(
            "px-3 py-6 md:px-10 md:py-12 transition-all duration-500", 
            activeTab === 'assistant' ? "h-full p-0 md:p-10" : "max-w-7xl mx-auto w-full"
          )}>
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Dashboard 
                    onOpenChat={() => setActiveTab('assistant')} 
                    onOpenTrial={() => setIsBookingModalOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'assistant' && (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full"
                >
                  <FitnessChat 
                    onOpenTrial={() => setIsBookingModalOpen(true)}
                    initialInquiry={inquiryContext} 
                    onContextCleared={() => setInquiryContext(null)} 
                  />
                </motion.div>
              )}

              {activeTab === 'membership' && (
                <motion.div
                  key="membership"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MembershipPlans 
                    onOpenTrial={() => setIsBookingModalOpen(true)}
                    setActiveTab={setActiveTab}
                    setInquiryContext={setInquiryContext}
                    onInquirySubmit={(data) => {
                      setInquiryContext({ ...data, type: 'inquiry' });
                      setActiveTab('assistant');
                    }} 
                  />
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 text-center space-y-4">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
                      <User size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black">Profile Management</h2>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                      Sync your wearables and customize your AI Assistant personality in the upcoming Pro Update.
                    </p>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                      Sync Device
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <TrialBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        onSubmit={(data) => {
          setIsBookingModalOpen(false);
          setInquiryContext({ ...data, query: `I'd like to book a trial session for the ${data.timeslot} slot.`, type: 'trial' });
          setActiveTab('assistant');
        }}
      />

      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-[45] px-4 pb-4 pointer-events-none">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex gap-3 pointer-events-auto"
        >
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfVBjDSwwmt8w_P0NB4j_yC8aUrw3uEtU0gek4p1dnPCVGijA/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center shadow-xl shadow-blue-500/30 active:scale-95 border-b-4 border-blue-800"
          >
            FREE TRIAL Pass
          </a>
          <a 
            href="https://wa.me/919330457995?text=Hi%20I%20want%20to%20book%20a%20free%20gym%20trial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-95 border-b-4 border-emerald-700"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 h-14 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsSidebarOpen(false);
            }}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-all",
              activeTab === item.id ? "text-blue-600" : "text-slate-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Floating WhatsApp Button (Hidden on Mobile due to sticky CTA) */}
      <a 
        href="https://wa.me/919330457995?text=Hi%20I%20want%20to%20book%20a%20free%20gym%20trial"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-8 right-8 z-[60] bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-500/40 hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 group items-center gap-3"
      >
        <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
          <span className="font-black text-sm uppercase tracking-widest px-1">WhatsApp Now</span>
        </div>
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Voice Assistant */}
      <VoiceBot onOpenTrial={() => setIsBookingModalOpen(true)} />
    </div>
  );
}

function MembershipPlans({ onInquirySubmit, onOpenTrial, setActiveTab, setInquiryContext }: { onInquirySubmit?: (data: { name: string; phone: string; query: string }) => void; onOpenTrial: () => void; setActiveTab: (tab: any) => void; setInquiryContext: (ctx: any) => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', query: '' });
  
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "1,999",
      desc: "Perfect for those starting their fitness journey.",
      features: ["Gym floor access", "Locker room & Sauna", "Basic AI guidance", "Weekly newsletter"],
      cta: "Join Now",
      hot: false,
      onClick: () => {
        setInquiryContext({ name: '', phone: '', query: "I'm a beginner looking for fitness guidance and I'm interested in the Starter membership plan. Can you help me get started?", type: 'inquiry' });
        setActiveTab('assistant');
      }
    },
    {
      id: "performance",
      name: "Performance",
      price: "3,999",
      desc: "The most popular choice for dedicated athletes.",
      features: ["All locations access", "Personal training session (1/mo)", "Advanced AI Analysis", "Free guest pass (2/mo)", "Recovery lounge"],
      cta: "Get Performance",
      hot: true,
      onClick: () => {
        const el = document.getElementById('inquiry-form');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight effect
          el.classList.add('ring-4', 'ring-blue-500/20');
          setTimeout(() => el.classList.remove('ring-4', 'ring-blue-500/20'), 2000);
        }
      }
    },
    {
      id: "elite",
      name: "Elite",
      price: "7,999",
      desc: "Maximum results with personalized expert coaching.",
      features: ["Ultra-luxury facilities", "Unlimited PT sessions", "Custom diet protocols", "Executive locker", "Private workout zone"],
      cta: "Go Elite",
      hot: false,
      onClick: () => {
        window.open("https://wa.me/919330457995?text=Hi,%20I’m%20interested%20in%20the%20Elite%20membership%20plan.", "_blank");
      }
    }
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic mb-3">Choose Your Pulse</h2>
        <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-bold">Invest in your health. FitPulse memberships are engineered for results.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-12">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            onClick={plan.onClick}
            className={cn(
              "relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border transition-all duration-500 hover:shadow-2xl flex flex-col group cursor-pointer",
              plan.hot 
                ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/20 ring-4 ring-blue-50 md:mt-[-10px] md:mb-[10px] hover:shadow-blue-500/40" 
                : "bg-white text-slate-900 border-slate-200 hover:-translate-y-2 shadow-sm hover:border-blue-400 hover:shadow-blue-100"
            )}
          >
            {plan.hot && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border-4 border-white whitespace-nowrap shadow-xl">
                Most Popular
              </div>
            )}
            
            <div className="mb-6 md:mb-8">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-70 mb-2 md:mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-black">₹{plan.price}</span>
                <span className="text-xs md:text-sm font-bold opacity-60">/mo</span>
              </div>
              <p className={cn("mt-3 md:mt-4 text-xs md:text-sm leading-relaxed font-bold", plan.hot ? "text-blue-100" : "text-slate-500")}>
                {plan.desc}
              </p>
            </div>

            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-3 md:gap-4">
                  <div className={cn(
                    "w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm",
                    plan.hot ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                  )}>
                    <Plus size={12} strokeWidth={4} />
                  </div>
                  <span className="text-xs md:text-sm font-black tracking-tight">{f}</span>
                </li>
              ))}
            </ul>

            <button className={cn(
              "w-full py-4 md:py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95",
              plan.hot 
                ? "bg-white text-blue-600 group-hover:bg-slate-100 shadow-white/20" 
                : "bg-slate-900 text-white group-hover:bg-slate-800 shadow-slate-900/20"
            )}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>


      {/* Inquiry Form Section */}
      <div id="inquiry-form" className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-slate-200">
        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-6">Visit Us</h3>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            Our experts are ready to help you find the perfect plan. Visit our Belgharia facility for a personalized tour of our world-class gym.
          </p>
          
          <div className="space-y-6">
            {[
              { label: "Call Now", value: "+91 93304 57995", icon: Phone },
              { label: "Email Inquiries", value: "memberships@fitpulse.ai", icon: MessageSquare },
              { label: "Visit Us", value: "Kolkata - 700056, Belgharia", icon: Activity }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="font-bold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onInquirySubmit?.({
                name: formData.name,
                phone: formData.phone,
                query: formData.query
              }); 
            }}
            className="space-y-6 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe" 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-slate-900 shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 93304 57995" 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-slate-900 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com" 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-slate-900 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Your Questions or Goals</label>
              <textarea 
                required
                rows={4}
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                placeholder="Tell us about your fitness targets or any specific question about our tiers..." 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-slate-900 shadow-inner resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-3"
            >
              <Sparkles size={20} />
              Submit Inquiry to AI
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
              Secured & Analyzed by FitPulse Intelligence
            </p>
          </form>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-all" />
        <div className="relative z-10 space-y-4 text-center md:text-left">
          <h3 className="text-3xl font-black text-white">Trial FitPulse Today?</h3>
          <p className="text-slate-400 font-medium max-w-lg">Get 3 days of unrestricted access to our facilities and the AI personal trainer for free.</p>
        </div>
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSfVBjDSwwmt8w_P0NB4j_yC8aUrw3uEtU0gek4p1dnPCVGijA/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95 flex items-center justify-center"
        >
          Book Free Trial
        </a>
      </div>
    </div>
  );
}

function TrialBookingModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', timeslot: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="bg-slate-900 p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Plus className="text-white rotate-45" size={20} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Trial Booking</h3>
          </div>
          <button onClick={onClose} className="bg-slate-800 text-slate-400 hover:text-white p-2 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="p-10 space-y-7"
        >
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="First & Last Name"
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl p-4.5 outline-none transition-all font-bold text-slate-900 shadow-inner"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Contact Number</label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 93304 57995"
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl p-4.5 outline-none transition-all font-bold text-slate-900 shadow-inner"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Preferred Time Slot</label>
            <select 
              required
              value={formData.timeslot}
              onChange={e => setFormData({...formData, timeslot: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl p-4.5 outline-none transition-all font-bold text-slate-900 shadow-inner appearance-none relative z-10"
            >
              <option value="" disabled>Select a valid time...</option>
              <option value="Early Morning (06:00 - 09:00)">Early Morning (06:00 - 09:00)</option>
              <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
              <option value="Afternoon (12:00 - 15:00)">Afternoon (12:00 - 15:00)</option>
              <option value="Evening (15:00 - 18:00)">Evening (15:00 - 18:00)</option>
              <option value="Night (18:00 - 21:00)">Night (18:00 - 21:00)</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            <Activity size={20} />
            Confirm Trial Session
          </button>
        </form>
      </motion.div>
    </div>
  );
}
