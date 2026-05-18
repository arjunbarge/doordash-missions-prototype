"use client";

import { useRouter } from "next/navigation";
import { useMissionStore } from "@/lib/store";
import { MissionType } from "@/lib/types";
import { Switch } from "@/components/ui/switch"; // Need to install switch maybe? Wait, I didn't install switch. I'll use a standard toggle or just a button for 'Simulate next day'.
import { Button } from "@/components/ui/button";
import { Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { generateMissionCart } from "@/app/actions/curate-cart";
import { toast } from "sonner";
import { templates } from "@/lib/mock-data";

export default function HomePage() {
  const router = useRouter();
  const setDeclaredMission = useMissionStore((state) => state.setDeclaredMission);
  const setCart = useMissionStore((state) => state.setCart);
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);

  const handleMissionSelect = (type: MissionType) => {
    setDeclaredMission(type, 6, "Saturday, May 16, 2026");
    router.push("/templates");
  };

  const simulateNextDay = () => {
    router.push("/feedback");
  };

  const startVoiceAssistant = () => {
    setVoiceSheetOpen(true);
    setIsListening(true);
    setTranscript("");
    setIsProcessing(false);
    
    // Simulate listening
    setTimeout(() => {
      setTranscript("I'm hosting 6 people for an intimate dinner party this Saturday.");
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate processing and directly route to AI cart
      setTimeout(async () => {
        setDeclaredMission("dinner-party", 6, "Saturday, May 16, 2026");
        try {
          const aiCuratedCart = await generateMissionCart("dinner-party", 6);
          setCart(aiCuratedCart);
          setVoiceSheetOpen(false);
          router.push("/cart");
        } catch (error) {
          toast.success("Using Mission Template logic (AI offline)");
          setCart(templates[0].defaultItems);
          setVoiceSheetOpen(false);
          router.push("/cart");
        }
      }, 2000);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full px-6 relative">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.1664 10.6033C23.1664 4.74728 18.4191 0 12.5631 0C6.7071 0 1.9598 4.74728 1.9598 10.6033H13.6263C14.7335 10.6033 15.631 11.5008 15.631 12.608C15.631 13.7152 14.7335 14.6127 13.6263 14.6127H0V16.3533H13.6263C15.6946 16.3533 17.3713 14.6766 17.3713 12.6083C17.3713 10.54 15.6946 8.86333 13.6263 8.86333H3.8598C4.54247 4.93121 7.95471 1.89066 12.0631 1.89066C16.8529 1.89066 20.7363 5.774 20.7363 10.5638V24H23.1664V10.6033Z" fill="#EB1700"/>
          </svg>
          <h1 className="text-[26px] font-black text-[#EB1700] tracking-tighter">DOORDASH</h1>
        </div>
        {/* Simulate Next Day Toggle Button - prototype only */}
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100 hover:text-orange-900 h-8 text-[10px] rounded-full px-3"
          onClick={simulateNextDay}
        >
          Simulate next day
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center pb-12">
        <h1 className="text-4xl font-semibold tracking-tight leading-tight text-foreground mb-8">
          What are you trying to pull off today?
        </h1>

        <div className="space-y-4 flex flex-col">
          <button
            onClick={() => handleMissionSelect("dinner-party")}
            className="w-full text-left p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98] active:bg-red-50 focus:outline-none focus:ring-2 focus:ring-primary/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-active:from-red-50 group-active:to-red-100 transition-colors" />
            <h2 className="text-xl font-semibold relative z-10">Host a dinner party</h2>
          </button>

          <button
            onClick={() => handleMissionSelect("sick-day")}
            className="w-full text-left p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98] active:bg-red-50 focus:outline-none focus:ring-2 focus:ring-primary/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-active:from-red-50 group-active:to-red-100 transition-colors" />
            <h2 className="text-xl font-semibold relative z-10">Pull together a sick-day spread</h2>
          </button>

          <button
            onClick={() => handleMissionSelect("45-min-dinner")}
            className="w-full text-left p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98] active:bg-red-50 focus:outline-none focus:ring-2 focus:ring-primary/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-active:from-red-50 group-active:to-red-100 transition-colors" />
            <h2 className="text-xl font-semibold relative z-10">Get dinner on the table in 45 minutes</h2>
          </button>

          <div
            className="w-full text-left p-6 rounded-2xl bg-muted/50 border border-transparent shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-primary/20"
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("mission") as HTMLInputElement;
              if (input.value.trim()) {
                handleMissionSelect("other");
              }
            }}>
              <input 
                name="mission"
                type="text" 
                placeholder="Other mission..." 
                className="w-full bg-transparent outline-none text-xl font-semibold placeholder:text-muted-foreground text-foreground"
              />
            </form>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          Pick what you're doing, we'll handle the orchestration
        </p>
      </div>

      {/* Voice Assistant FAB */}
      <button 
        onClick={startVoiceAssistant}
        className="absolute bottom-[90px] right-6 w-14 h-14 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-20"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Voice Assistant Overlay (Mobile Contained) */}
      {voiceSheetOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-[32px] p-6 pb-16 min-h-[40vh] flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-300">
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              {isListening ? (
                <>
                  <div className="absolute inset-0 bg-[#EB1700]/20 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-[#EB1700]/40 rounded-full animate-pulse" />
                  <div className="relative bg-[#EB1700] text-white w-16 h-16 rounded-full flex items-center justify-center">
                    <Mic className="w-8 h-8" />
                  </div>
                </>
              ) : isProcessing ? (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-[#EB1700]/20 border-t-[#EB1700] animate-spin" />
                  <div className="relative bg-[#EB1700]/10 text-[#EB1700] w-16 h-16 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                </>
              ) : null}
            </div>
            
            <h2 className="text-2xl font-semibold mb-2 text-center transition-all">
              {isListening ? "Listening..." : isProcessing ? "Orchestrating mission..." : ""}
            </h2>
            
            <p className="text-lg text-center text-muted-foreground min-h-[60px] max-w-[280px]">
              {transcript}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
