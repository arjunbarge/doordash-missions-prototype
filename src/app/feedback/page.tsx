"use client";

import { useMissionStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedbackPage() {
  const router = useRouter();
  const { cart, declaredMissionType, missionDate, guestCount, addCompletedMission, resetMission } = useMissionStore();
  const [missionRating, setMissionRating] = useState<"up" | "down" | null>(null);
  const [itemRatings, setItemRatings] = useState<Record<string, "up" | "down">>({});
  const [notes, setNotes] = useState("");

  const getMissionTitle = (type: string | null) => {
    if (type === "dinner-party") return "dinner party";
    if (type === "sick-day") return "sick-day spread";
    if (type === "45-min-dinner") return "45-minute dinner";
    return "mission";
  };

  const handleSave = () => {
    const title = declaredMissionType === "dinner-party" ? "Saturday Dinner Party" : declaredMissionType === "sick-day" ? "Sick-day Spread" : "45-min Dinner";
    addCompletedMission({
      id: `miss-${Date.now()}`,
      title,
      type: declaredMissionType || "dinner-party",
      date: missionDate,
      guestCount,
      status: "completed",
      rating: missionRating || undefined,
      items: cart
    });
    
    toast.success("Mission notes saved");
    resetMission();
    router.push("/missions");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-6 pb-4 border-b border-border sticky top-0 z-10 bg-white">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Mission Complete
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          How did your {guestCount}-guest {getMissionTitle(declaredMissionType)} go?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-8">
        
        {/* Overall Rating */}
        <div className="flex gap-4">
          <Button 
            variant={missionRating === "up" ? "default" : "outline"} 
            className={`flex-1 h-16 rounded-2xl ${missionRating === "up" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-red-50 text-foreground"}`}
            onClick={() => setMissionRating("up")}
          >
            <ThumbsUp className={`w-6 h-6 mr-2 ${missionRating === "up" ? "fill-current" : ""}`} />
            Nailed it
          </Button>
          <Button 
            variant={missionRating === "down" ? "default" : "outline"} 
            className={`flex-1 h-16 rounded-2xl ${missionRating === "down" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-red-50 text-foreground"}`}
            onClick={() => setMissionRating("down")}
          >
            <ThumbsDown className={`w-6 h-6 mr-2 ${missionRating === "down" ? "fill-current" : ""}`} />
            Missed
          </Button>
        </div>

        {/* Item Level Feedback */}
        {cart.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Item feedback</h3>
            <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-border">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-white overflow-hidden shrink-0 border border-border">
                      <img src={item.product.image} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium truncate leading-tight">
                      {item.product.name}
                    </span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button 
                      onClick={() => setItemRatings(prev => ({ ...prev, [item.product.id]: "up" }))}
                      className={`p-2 rounded-full transition-colors ${itemRatings[item.product.id] === "up" ? "bg-green-100 text-green-700" : "bg-white border border-border text-muted-foreground hover:bg-gray-50"}`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${itemRatings[item.product.id] === "up" ? "fill-current" : ""}`} />
                    </button>
                    <button 
                      onClick={() => setItemRatings(prev => ({ ...prev, [item.product.id]: "down" }))}
                      className={`p-2 rounded-full transition-colors ${itemRatings[item.product.id] === "down" ? "bg-red-100 text-red-700" : "bg-white border border-border text-muted-foreground hover:bg-gray-50"}`}
                    >
                      <ThumbsDown className={`w-4 h-4 ${itemRatings[item.product.id] === "down" ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free Text */}
        <div className="space-y-3">
          <label className="font-semibold text-lg block">
            What would have made this mission feel like a 10 out of 10?
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us what worked, what didn't, and what you'd change next time..."
            className="w-full min-h-[120px] p-4 rounded-2xl border border-border bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

      </div>

      <div className="absolute bottom-20 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-border/50 flex flex-col items-center">
        <Button 
          className="w-[calc(100%-2rem)] max-w-[361px] h-14 rounded-full text-lg font-semibold shadow-lg shadow-primary/25"
          onClick={handleSave}
          disabled={!missionRating}
        >
          Save mission notes
        </Button>
      </div>
    </div>
  );
}
