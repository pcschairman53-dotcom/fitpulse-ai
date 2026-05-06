import React, { useState } from 'react';
import { 
  Zap, 
  CalendarCheck, 
  MessageSquareText, 
  ArrowRight,
  User,
  Phone,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Dashboard({ onOpenChat, onOpenTrial }: { onOpenChat: () => void, onOpenTrial: () => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', goal: 'Weight loss' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const message = `Hi, I want to join the gym.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nGoal: ${formData.goal}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/919330457995?text=${encodedMessage}`;
    setWhatsappUrl(url);

    // Redirect after a short delay to allow the user to see the state
    setTimeout(() => {
      window.open(url, '_blank');
    }, 1500);
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 md:pb-12">
      {/* Header Section */}
      <div className="space-y-3 md:space-y-4 px-1 md:px-0">
        <div className="flex items-center gap-2 mb-1">
           <div className="h-1 w-6 md:w-12 bg-blue-600 rounded-full" />
           <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-blue-600">Premium Fitness AI</span>
        </div>
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95] md:leading-[0.9]">
          WELCOME TO <br className="hidden md:block" />
          <span className="text-blue-600 underline decoration-4 decoration-blue-600/20 underline-offset-8">FITPULSE AI</span>
        </h1>
        <p className="text-base md:text-xl text-slate-600 font-bold max-w-xl border-l-4 border-orange-500 pl-4 py-1 mt-3 md:mt-6">
          Track your fitness. Transform your body. <br />
          <span className="text-slate-400 text-[10px] md:text-sm font-black uppercase tracking-widest mt-1 block">Let's push your limits today.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {[
          { 
            title: "Start Journey", 
            description: "Workout routines built by AI to match your level.",
            icon: Zap,
            action: onOpenChat,
            label: "Get Started",
            primary: false
          },
          { 
            title: "Book Free Trial", 
            description: "Experience our state-of-the-art facilities for free.",
            icon: CalendarCheck,
            action: () => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfVBjDSwwmt8w_P0NB4j_yC8aUrw3uEtU0gek4p1dnPCVGijA/viewform?usp=header", "_blank"),
            label: "Book Now",
            primary: true
          },
          { 
            title: "AI Chat Coach", 
            description: "Instant nutrition and training answers 24/7.",
            icon: MessageSquareText,
            action: onOpenChat,
            label: "Start Chat",
            primary: false
          }
        ].map((card, i) => (
          <div 
            key={i} 
            className={cn(
              "group p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all cursor-pointer min-h-[160px] md:min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-2xl active:scale-[0.98]",
              card.primary 
                ? "bg-slate-900 border-slate-900 text-white hover:bg-black" 
                : "bg-white border-slate-100 text-slate-900 hover:border-blue-600"
            )}
            onClick={card.action}
          >
            <div>
              <div className={cn(
                "w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-colors",
                card.primary ? "bg-blue-600 text-white" : "bg-slate-900 text-white group-hover:bg-blue-600"
              )}>
                <card.icon size={20} md:size={24} />
              </div>
              <h3 className="text-base md:text-xl font-black mb-1 md:mb-2">{card.title}</h3>
              <p className={cn(
                "text-[11px] md:text-sm font-medium leading-tight md:leading-relaxed mb-3 md:mb-6",
                card.primary ? "text-slate-300" : "text-slate-500"
              )}>{card.description}</p>
            </div>
            <div className={cn(
              "flex items-center gap-2 font-black text-[9px] md:text-xs uppercase tracking-widest group-hover:gap-4 transition-all",
              card.primary ? "text-blue-400 group-hover:text-blue-300" : "text-blue-600"
            )}>
              {card.label} <ArrowRight size={12} md:size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Lead Collection & CTA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simple Form */}
        <div className="bg-slate-50 border border-slate-100 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem]">
          {isSubmitting ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 md:py-8 space-y-4 md:space-y-6"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-12 md:h-12 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Redirecting... 💬</h3>
              <p className="text-slate-500 font-bold max-w-xs mx-auto text-xs md:text-base px-2">Please wait while we connect you to our team.</p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-emerald-500 text-white px-5 md:px-8 py-3.5 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 mt-3 md:mt-6 active:scale-95 text-xs md:text-base"
              >
                👉 Click here if it fails
              </a>
            </motion.div>
          ) : (
            <>
              <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-1">Join the Elite</h3>
              <p className="text-slate-500 font-bold text-[10px] md:text-sm mb-5 md:mb-8">Leave your details and get a customized plan.</p>
              
              <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-5">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} md:size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-white border-2 border-transparent focus:border-slate-900 rounded-xl md:rounded-2xl py-3 md:py-4 pl-11 md:pl-12 pr-6 outline-none transition-all font-bold text-slate-900 text-sm md:text-base placeholder:text-slate-400"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} md:size={18} />
                  <input 
                    required
                    type="tel" 
                    placeholder="Phone Number"
                    className="w-full bg-white border-2 border-transparent focus:border-slate-900 rounded-xl md:rounded-2xl py-3 md:py-4 pl-11 md:pl-12 pr-6 outline-none transition-all font-bold text-slate-900 text-sm md:text-base placeholder:text-slate-400"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} md:size={18} />
                  <select 
                    className="w-full bg-white border-2 border-transparent focus:border-slate-900 rounded-xl md:rounded-2xl py-3 md:py-4 pl-11 md:pl-12 pr-6 outline-none transition-all font-bold text-slate-900 appearance-none text-sm md:text-base"
                    value={formData.goal}
                    onChange={e => setFormData({...formData, goal: e.target.value})}
                  >
                    <option value="Weight loss">Weight loss</option>
                    <option value="Muscle gain">Muscle gain</option>
                    <option value="General fitness">General fitness</option>
                  </select>
                </div>
                <button className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-slate-900/20 mt-1 md:mt-4 text-[11px] md:text-sm min-h-[50px]">
                  Submit My Info
                </button>
              </form>
            </>
          )}
        </div>

        {/* Big CTA */}
        <div className="bg-blue-600 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] text-white flex flex-col justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-700" />
          
          <div className="relative z-10 space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic leading-[1] md:leading-none">
              Ready to <br /> Transform?
            </h2>
            <div className="grid grid-cols-1 gap-2.5 md:gap-4">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfVBjDSwwmt8w_P0NB4j_yC8aUrw3uEtU0gek4p1dnPCVGijA/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-sm md:text-xl uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98] border-b-4 border-slate-200 flex items-center justify-center min-h-[54px] md:min-h-[64px]"
              >
                👉 FREE TRIAL PASS
              </a>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-80 -mt-1">Limited availability per week</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4 mt-2">
                <a 
                  href="https://wa.me/919330457995?text=Hi%20I%20want%20to%20book%20a%20free%20gym%20trial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/30 active:scale-[0.98] min-h-[48px]"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WHATSAPP
                </a>
                <a 
                  href="tel:+919330457995"
                  className="bg-black text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/30 active:scale-[0.98] min-h-[48px]"
                >
                  <Phone size={14} />
                  CALL NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
