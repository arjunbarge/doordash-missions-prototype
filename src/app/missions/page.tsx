"use client";

import { useMissionStore } from "@/lib/store";
import { Mission } from "@/lib/types";
import { templates } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Clock, RotateCw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function MissionsPage() {
  const router = useRouter();
  const { pastMissions, declaredMissionType, missionDate, guestCount, setDeclaredMission, setSelectedTemplate, cart } = useMissionStore();

  const handleRunAgain = (mission: Mission) => {
    setDeclaredMission(mission.type, mission.guestCount, "Next Saturday, 7 PM");
    
    // For prototype purposes, just select the first template if running again
    // In a real app we'd load the specific historical cart
    if (templates.length > 0) {
      setSelectedTemplate(templates[0]);
    }
    
    router.push("/templates");
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <div className="bg-white px-6 pt-6 pb-4 border-b border-border sticky top-0 z-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your missions
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-6">
        
        {/* Current In-Progress Mission */}
        {(declaredMissionType && cart.length > 0) && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">In Progress</h2>
            <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {declaredMissionType === "dinner-party" ? "Saturday Dinner Party" : declaredMissionType === "sick-day" ? "Sick-day Spread" : "45-min Dinner"}
                  </h3>
                  <Badge variant="outline" className="text-primary border-primary/30 bg-white">Active</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-3 mb-4">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {missionDate}</span>
                  <span>•</span>
                  <span>{guestCount} guests</span>
                </div>
                <Button 
                  className="w-full bg-white text-primary hover:bg-white/90 border border-primary/20 shadow-sm"
                  onClick={() => router.push("/cart")}
                >
                  View Mission Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Past Missions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Past Missions</h2>
          
          {pastMissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past missions yet.</p>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
              {pastMissions.map((mission, index) => (
                <div key={mission.id} className="relative flex items-center justify-between group is-active">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-muted text-muted-foreground shrink-0 shadow-sm z-10">
                    {mission.rating === "up" ? (
                      <div className="bg-green-100 w-full h-full rounded-full flex items-center justify-center text-green-700">
                        <ThumbsUp className="w-4 h-4 fill-current" />
                      </div>
                    ) : mission.rating === "down" ? (
                      <div className="bg-red-100 w-full h-full rounded-full flex items-center justify-center text-red-700">
                        <ThumbsDown className="w-4 h-4 fill-current" />
                      </div>
                    ) : (
                      <div className="bg-gray-100 w-full h-full rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  {/* Card */}
                  <Card className="w-[calc(100%-3rem)] ml-4 shadow-sm border-border overflow-hidden">
                    <div className="bg-muted/30 p-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span>{mission.date}</span>
                        {mission.guestCount > 1 && (
                          <>
                            <span>•</span>
                            <span>{mission.guestCount} guests</span>
                          </>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-white border-border text-[10px] uppercase font-bold text-muted-foreground">Completed</Badge>
                    </div>
                    <CardContent className="p-4 pt-3">
                      <h3 className="font-bold text-[17px] mb-4 text-foreground">{mission.title}</h3>
                      <Button 
                        className="w-full h-10 rounded-full font-bold bg-muted hover:bg-muted/80 text-foreground"
                        onClick={() => handleRunAgain(mission)}
                      >
                        <RotateCw className="w-4 h-4 mr-2 text-foreground" />
                        Run this mission again
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
