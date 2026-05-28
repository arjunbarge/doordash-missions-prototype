"use client";

import { useRouter } from "next/navigation";
import { useMissionStore } from "@/lib/store";
import { templates } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateMissionCart } from "@/app/actions/curate-cart";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const { guestCount, declaredMissionType, setSelectedTemplate, setCart, isCurating, setCurating, setDeclaredMission, missionDate } = useMissionStore();

  const handleSelectTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(template);

    // Determine the template's default guest count and dynamic datetime matching its vibe
    const templateGuests = templateId === "t2" ? 12 : templateId === "t3" ? 8 : 6;
    const templateDate = templateId === "t2" 
      ? "Friday, May 22 at 8 PM" 
      : templateId === "t3" 
        ? "Sunday, May 24 at 11 AM" 
        : "Saturday, May 23 at 6 PM";
    
    // Determine appropriate mission type to keep consistent with selected template
    const templateMissionType = templateId === "t2" ? "other" : templateId === "t3" ? "other" : "dinner-party";

    // Set updated parameters in store so the cart header matches
    setDeclaredMission(declaredMissionType || templateMissionType, templateGuests, templateDate);

    // If it's a template we have mock data for but we want AI curation
    if (declaredMissionType) {
      setCurating(true);
      try {
        const aiCuratedCart = await generateMissionCart(declaredMissionType, templateGuests);
        setCart(aiCuratedCart);
        router.push("/cart");
      } catch (error) {
        toast.success("Using Mission Template logic (AI offline)");
        setCart(template.defaultItems);
        router.push("/cart");
      } finally {
        setCurating(false);
      }
    } else {
      setCart(template.defaultItems);
      router.push("/cart");
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pt-6 relative">
      {/* Loading Overlay */}
      {isCurating && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[47px]">
          <div className="relative flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">AI is curating your mission...</h2>
          <p className="text-muted-foreground mt-2 text-sm text-center max-w-[250px]">
            Selecting the perfect items from local merchants for your {guestCount} guests.
          </p>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Curated Templates
        </h1>
        <p className="text-muted-foreground text-sm">
          Based on your mission for {guestCount} guests
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 no-scrollbar -mx-6 px-6">
        {templates.map((template, index) => {
          const isRecommended = index === 0;

          return (
            <Card key={template.id} className={`w-[85%] shrink-0 snap-center flex flex-col justify-between overflow-hidden transition-all ${isRecommended ? 'border-[#EB1700] ring-1 ring-[#EB1700]/20 shadow-md' : 'border-border'}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{template.vibe}</CardDescription>
                  </div>
                  {isRecommended && (
                    <Badge variant="default" className="bg-accent text-accent-foreground hover:bg-accent border-none font-semibold">
                      Recommended
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-foreground/80 mb-4">{template.summary}</p>
                <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Estimated Total</span>
                  <span className="font-semibold text-foreground">
                    ~${template.estimatedTotal} from {template.merchantCount} merchants
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectTemplate(template.id)}
                  disabled={isCurating}
                  className={`w-full ${isRecommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  size="lg"
                >
                  Use this template
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
