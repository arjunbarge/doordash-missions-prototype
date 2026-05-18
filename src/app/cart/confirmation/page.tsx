"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useMissionStore } from "@/lib/store";

export default function ConfirmationPage() {
  const router = useRouter();
  const { guestCount, missionDate, setOrderStatus } = useMissionStore();

  useEffect(() => {
    setOrderStatus("placed");
  }, [setOrderStatus]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-white">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
        Mission Initiated
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8">
        We've routed your orders to 4 local merchants. Your {guestCount}-guest dinner party is scheduled for {missionDate}.
      </p>

      <Button 
        className="w-full h-14 rounded-xl text-lg font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
        onClick={() => router.push("/")}
      >
        Return to Home
      </Button>
    </div>
  );
}
