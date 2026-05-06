import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Phone, UserRound, Target, CalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getChatResponse } from '../../services/gemini';
import { cn } from '../../lib/utils';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface FitnessChatProps {
  initialInquiry?: { name: string; phone: string; query: string; type?: 'inquiry' | 'trial' } | null;
  onContextCleared?: () => void;
  onOpenTrial?: () => void;
}

export default function FitnessChat({ initialInquiry, onContextCleared, onOpenTrial }: FitnessChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: "Hey! Ready to transform your body? 💪🔥\n\nI'm EliteTrainer Arjun's AI Assistant. To get you started, what is your name and what's your big goal for today?\n\n👉 Are you looking for Weight Loss, Muscle Gain, or General Fitness?" }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handledInquiryRef = useRef(false);

  useEffect(() => {
    if (initialInquiry && !handledInquiryRef.current) {
      handledInquiryRef.current = true;
      const processInquiry = async () => {
        let userPrompt = "";
        if (initialInquiry.type === 'trial') {
          userPrompt = `I'd like to book a free trial session! \nName: ${initialInquiry.name}\nPhone: ${initialInquiry.phone}\nPreferred Slot: ${initialInquiry.query.replace("I'd like to book a trial session for the ", "").replace(" slot.", "")}`;
        } else {
          userPrompt = `Hi, my name is ${initialInquiry.name}. I'm interested in membership. My phone number is ${initialInquiry.phone}. Here is my specific question: ${initialInquiry.query}`;
        }
        
        const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: userPrompt }] }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
          const response = await getChatResponse(userPrompt, messages);
          setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
          onContextCleared?.();
        }
      };
      processInquiry();
    }
  }, [initialInquiry]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const [mode, setMode] = useState<'general' | 'diet' | 'workout'>('general');
  const [leadScore, setLeadScore] = useState<'cold' | 'warm' | 'hot'>('cold');

  const updateLeadScore = (text: string) => {
    const q = text.toLowerCase();
    const hotKeywords = ['pricing', 'membership', 'trial', 'phone', 'join', 'urgent', 'cost', 'how much', 'book', 'sign up', 'slots'];
    const warmKeywords = ['workout', 'plan', 'exercise', 'routine', 'diet', 'how to', 'tips', 'guidance'];

    if (hotKeywords.some(key => q.includes(key))) {
      setLeadScore('hot');
    } else if (warmKeywords.some(key => q.includes(key)) && leadScore !== 'hot') {
      setLeadScore('warm');
    }
  };

  const dietResponses: Record<string, string> = {
    "Weight Loss Diet": "For weight loss, focus on high-protein meals, hydration, and reducing processed foods. Consistency is key 💪\n\n👉 Click 'Book Free Trial' for personalized gym guidance\n👉 Or tap 'WhatsApp Now' for support",
    "Muscle Gain Diet": "For muscle gain, increase protein intake and maintain a balanced calorie surplus with proper training 🔥\n\n👉 Click 'Book Free Trial' for personalized gym guidance\n👉 Or tap 'WhatsApp Now' for support",
    "General Fitness Diet": "A balanced diet with clean nutrition and regular workouts will help maintain overall fitness ⚡\n\n👉 Click 'Book Free Trial' for personalized gym guidance\n👉 Or tap 'WhatsApp Now' for support"
  };

  const workoutResponses: Record<string, string> = {
    "Weight Loss Workout": "🔥 Weight Loss Workout:\n20 mins cardio\n3 sets squats\n3 sets jumping jacks\n15 mins treadmill\n\n👉 Book your FREE trial for personalized coaching\n👉 Or tap WhatsApp Now for support",
    "Muscle Gain Workout": "💪 Muscle Gain Workout:\nBench Press – 4 sets\nDeadlift – 4 sets\nDumbbell Curl – 3 sets\n\n👉 Book your FREE trial for personalized coaching\n👉 Or tap WhatsApp Now for support",
    "Beginner Workout": "⚡ Beginner Workout:\n10 mins walking\n3 sets pushups\nStretching exercises\n\n👉 Book your FREE trial for personalized coaching\n👉 Or tap WhatsApp Now for support"
  };

  const handleSend = async (overrideInput?: string) => {
    const userMessage = (overrideInput || input).trim();
    if (!userMessage || isLoading) return;

    updateLeadScore(userMessage);
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newMessages);
    setIsLoading(true);

    // Filter responses
    const interceptResponse = dietResponses[userMessage] || workoutResponses[userMessage];

    if (interceptResponse) {
      setTimeout(() => {
        setMessages([...newMessages, { role: 'model', parts: [{ text: interceptResponse }] }]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await getChatResponse(userMessage, messages);
      setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] bg-white rounded-t-[1.5rem] md:rounded-[2.5rem] border-x md:border border-slate-200 shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white px-4 md:px-8 py-3 md:py-6 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-slate-900 rounded-lg md:rounded-2xl flex items-center justify-center shadow-md">
              <Bot className="text-white" size={18} md:size={24} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0">
            <h3 className="text-slate-900 font-black text-sm md:text-lg tracking-tight leading-tight truncate">AI Fitness Concierge</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em]">Online</p>
              </div>
              <div className="w-[1px] h-2 bg-slate-200" />
              <div className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-full border",
                leadScore === 'hot' ? "bg-rose-50 border-rose-100 text-rose-600" :
                leadScore === 'warm' ? "bg-orange-50 border-orange-100 text-orange-600" :
                "bg-blue-50 border-blue-100 text-blue-600"
              )}>
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter">
                  {leadScore === 'hot' ? "🔥 Hot Lead" : leadScore === 'warm' ? "⚡ Warm Lead" : "❄️ Cold Lead"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 md:p-3 rounded-lg md:rounded-xl transition-all border border-slate-200 shadow-sm">
            <Phone size={16} md:size={18} />
          </button>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfVBjDSwwmt8w_P0NB4j_yC8aUrw3uEtU0gek4p1dnPCVGijA/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <CalendarCheck size={16} md:size={18} />
            Trial
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 md:p-10 space-y-4 md:space-y-8 scroll-smooth bg-white custom-scrollbar" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: m.role === 'user' ? 8 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-2 md:gap-4 max-w-[95%] md:max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                m.role === 'user' ? "bg-white text-slate-400 border-slate-100" : "bg-slate-900 text-white border-slate-900"
              )}>
                {m.role === 'user' ? <UserRound size={14} md:size={18} /> : <Sparkles size={14} md:size={18} />}
              </div>
              <div className={cn(
                "flex flex-col gap-1 min-w-0",
                m.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-3.5 py-3 md:px-6 md:py-5 rounded-[1.2rem] md:rounded-[2rem] text-[12px] md:text-[15px] leading-snug md:leading-relaxed whitespace-pre-wrap shadow-sm border break-words w-full",
                  m.role === 'user' 
                    ? "bg-blue-600 text-white border-blue-600 rounded-tr-none font-black" 
                    : "bg-slate-50 text-slate-900 border-slate-100 rounded-tl-none font-bold"
                )}>
                  {m.parts[0].text}
                </div>
                {m.role === 'user' && (
                  <div className="flex justify-end items-center gap-1 mt-0.5 pr-1">
                    <span className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Read</span>
                    <div className="flex -space-x-1">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 text-blue-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 text-blue-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5 md:gap-4 mr-auto"
            >
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <Loader2 className="animate-spin text-white" size={14} md:size={20} />
              </div>
              <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-6 rounded-2xl rounded-tl-none border border-slate-100 h-10 md:h-16 w-24 md:w-36 flex items-center justify-center shadow-sm">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-200 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-300 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Actions */}
      <div className="px-4 md:px-10 py-3 md:py-5 bg-white flex flex-col gap-2 md:gap-4 border-t border-slate-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="h-px bg-slate-100 flex-1" />
          <span className="px-3 text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {mode === 'diet' ? "AI Diet Planner" : mode === 'workout' ? "AI Workout Generator" : "General Suggestions"}
          </span>
          <div className="h-px bg-slate-100 flex-1" />
        </div>
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 flex-nowrap md:flex-wrap items-center">
          {mode === 'general' ? (
            <>
              {[
                "Weight Loss",
                "Muscle Gain",
                "Book a Trial",
                "Elite Membership",
              ].map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-white border-2 border-slate-100 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-slate-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => setMode('diet')}
                className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-emerald-600 border-2 border-emerald-600 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-95 shrink-0"
              >
                Diet Planner 🍱
              </button>
              <button
                onClick={() => setMode('workout')}
                className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-blue-600 border-2 border-blue-600 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-white hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
              >
                Workout Gen 🏋️
              </button>
            </>
          ) : mode === 'diet' ? (
            <>
              <button
                onClick={() => setMode('general')}
                className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-slate-100 border-2 border-slate-200 px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-slate-600 hover:bg-slate-200 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                ← Back
              </button>
              {[
                "Weight Loss Diet",
                "Muscle Gain Diet",
                "General Fitness Diet"
              ].map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-white border-2 border-emerald-100 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  {s} 🥑
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => setMode('general')}
                className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-slate-100 border-2 border-slate-200 px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-slate-600 hover:bg-slate-200 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                ← Back
              </button>
              {[
                "Weight Loss Workout",
                "Muscle Gain Workout",
                "Beginner Workout"
              ].map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[8px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest bg-white border-2 border-blue-100 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  {s} ⚡
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-10 bg-white border-t border-slate-100 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type goal..."
            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-4 md:pl-7 pr-14 md:pr-24 outline-none transition-all placeholder:text-slate-400 font-bold text-xs md:text-base text-slate-900 shadow-inner"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-slate-900 text-white p-2 md:p-3 rounded-lg md:rounded-xl transition-all hover:bg-blue-600 shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center min-h-[36px] md:min-h-[48px] min-w-[36px] md:min-w-[48px]"
            >
              <Send size={18} md:size={22} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 md:mt-6 px-1">
          <div className="flex items-center gap-1 md:gap-2">
            <Sparkles size={10} className="text-blue-500 shrink-0" />
            <p className="text-[7px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">FitPulse Core AI</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {leadScore === 'hot' ? (
              <>
                <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
                <p className="text-[7px] md:text-[9px] text-rose-500 font-bold uppercase tracking-widest leading-none">🔥 Limited slots available! Book Now</p>
              </>
            ) : leadScore === 'warm' ? (
              <>
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                <p className="text-[7px] md:text-[9px] text-orange-500 font-bold uppercase tracking-widest leading-none">💪 Want guidance? Tap Book Free Trial</p>
              </>
            ) : (
              <>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-[7px] md:text-[9px] text-blue-500 font-bold uppercase tracking-widest leading-none">⚡ Explore fitness plans anytime</p>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
