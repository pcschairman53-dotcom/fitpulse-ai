import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Bot, Sparkles, X, Activity, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getChatResponse } from '../../services/gemini';
import { cn } from '../../lib/utils';

interface VoiceBotProps {
  onOpenTrial?: () => void;
  onOpenWhatsApp?: () => void;
}

export default function VoiceBot({ onOpenTrial, onOpenWhatsApp }: VoiceBotProps) {
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreetingPlayed, setHasGreetingPlayed] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        handleVoiceQuery(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          const errorMsg = "I can't hear you! Please allow microphone access in your browser settings and try again.";
          setResponse(errorMsg);
          speak(errorMsg);
        } else {
          setResponse("Oops! Something went wrong with the voice recognition. Can you try again?");
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Stop any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to find a good voice (more "natural" sounding ones if available)
    const voices = synthRef.current.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
    if (googleVoice) utterance.voice = googleVoice;

    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceQuery = async (query: string) => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    try {
      const aiResponse = await getChatResponse(query);
      setResponse(aiResponse);
      speak(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = "I'm sorry, I couldn't process that. Can you say it again?";
      setResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasGreetingPlayed) {
      const greeting = "Hey! Welcome to FitPulse AI. Ready to transform your body? 💪";
      setResponse(greeting);
      setTimeout(() => {
        speak(greeting);
        setHasGreetingPlayed(true);
      }, 500);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsListening(false);
    recognitionRef.current?.stop();
    synthRef.current?.cancel();
  };

  return (
    <div className="fixed bottom-24 right-6 lg:bottom-10 lg:right-32 z-[70] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-72 md:w-80 bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden pointer-events-auto flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-xs uppercase tracking-widest">Voice Assistant</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Ready to listen</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar bg-slate-50">
              {transcript && (
                <div className="flex justify-end">
                  <div className="bg-white px-4 py-2 rounded-2xl rounded-tr-none border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold leading-snug italic">"{transcript}"</p>
                  </div>
                </div>
              )}

              {isProcessing ? (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                    <Sparkles className="animate-spin text-white" size={14} />
                  </div>
                  <div className="bg-blue-50 px-4 py-3 rounded-2xl rounded-tl-none border border-blue-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75" />
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              ) : response && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                    <Sparkles className="text-white" size={14} />
                  </div>
                  <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tl-none border border-blue-500 shadow-lg shadow-blue-600/20">
                    <p className="text-[13px] font-bold leading-relaxed">{response}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-white border-t border-slate-100 flex flex-col items-center gap-4">
              <div className="relative">
                <AnimatePresence>
                  {isListening && (
                    <motion.div 
                      layoutId="mic-wave"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-blue-500 rounded-full"
                    />
                  )}
                </AnimatePresence>
                
                <button
                  onClick={toggleListening}
                  className={cn(
                    "relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95",
                    isListening 
                      ? "bg-rose-500 text-white shadow-rose-500/40" 
                      : "bg-blue-600 text-white shadow-blue-500/40 hover:bg-blue-700"
                  )}
                >
                  {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                </button>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isListening ? "Listening..." : "Tap to Speak"}
                </p>
                {response && !isListening && (
                  <button 
                    onClick={() => speak(response)}
                    className="mt-2 text-[9px] font-black text-blue-600 uppercase tracking-tighter hover:underline"
                  >
                    Repeat Last Response
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={cn(
          "pointer-events-auto w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 group relative overflow-hidden",
          isOpen 
            ? "bg-slate-900 border-2 border-slate-800 text-white rotate-90" 
            : "bg-white border-2 border-slate-100 text-blue-600 hover:border-blue-500"
        )}
      >
        {!isOpen && (
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
        )}
        
        {/* Neon Glow */}
        {!isOpen && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl bg-blue-400/30" />
        )}

        <div className="relative z-10">
          {isOpen ? <X size={28} /> : <div className="relative"><Mic size={28} /><div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white animate-pulse" /></div>}
        </div>
      </button>
    </div>
  );
}
