"use client";

import { useMissionStore } from "@/lib/store";
import { merchants, products } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { MapPin, Clock, Info, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, swapCartItem, missionDate, guestCount } = useMissionStore();
  const [substitutionSheetOpen, setSubstitutionSheetOpen] = useState(false);

  // Group items by merchant
  const cartByMerchant = cart.reduce((acc, item) => {
    const mId = item.product.merchantId;
    if (!acc[mId]) {
      acc[mId] = [];
    }
    acc[mId].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const handleSwap = (oldId: string, newId: string) => {
    const newProduct = products[newId];
    if (newProduct) {
      swapCartItem(oldId, {
        product: newProduct,
        quantity: 1,
        reasoning: "Swapped to alternative option."
      });
      setSubstitutionSheetOpen(false);
      toast.success("Swap accepted, mission preserved", {
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
      });
    }
  };

  const handleCheckout = () => {
    router.push("/cart/confirmation");
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Declare a mission to start orchestrating.</p>
        <Button onClick={() => router.push("/")}>Go to Home</Button>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const deliveryFees = 11.96; // $2.99 * 4 merchants (simulated)
  const orchestrationFee = 4.99;
  const total = subtotal + deliveryFees + orchestrationFee;

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="bg-white border-b border-border px-6 pt-6 pb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
          Smart Mission Cart
        </h1>
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Saturday, May 23 at 6 PM</p>
            <p className="text-xs text-primary/80">Boss + {guestCount - 1} guests</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary h-8 px-2 text-xs font-semibold">
            Edit
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
        {Object.entries(cartByMerchant).map(([merchantId, items]) => {
          const merchant = merchants.find(m => m.id === merchantId);
          if (!merchant) return null;

          return (
            <div key={merchant.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base">{merchant.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {merchant.distance}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {merchant.deliveryWindow}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full">
                  Edit
                </Button>
              </div>

              <div className="divide-y divide-border">
                {items.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50 relative">
                        <img src={item.product.image} alt={item.product.name} className="object-cover w-full h-full" />
                        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          {item.quantity}x
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-sm leading-tight text-foreground">{item.product.name}</h4>
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-sm shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-muted-foreground">${item.product.price} / ea</span>
                            )}
                          </div>
                        </div>
                        
                        {item.product.id === "p1" && (
                          <button onClick={() => setSubstitutionSheetOpen(true)} className="inline-flex items-center justify-center whitespace-nowrap mt-2 h-8 rounded-full px-4 text-xs font-bold bg-red-50 text-[#EB1700] hover:bg-red-100 border border-red-200">
                              Try a substitution
                          </button>
                        )}

                        <Accordion type="single" className="w-full mt-2 border-none">
                          <AccordionItem value="reasoning" className="border-none">
                            <AccordionTrigger className="py-1 hover:no-underline text-xs text-primary font-medium flex gap-1 justify-start">
                              <Sparkles className="w-3.5 h-3.5 mr-1" />
                              Why these picks?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg mt-1 border border-border">
                              <div className="flex gap-1.5 mb-1 items-center">
                                <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">AI Curated</span>
                              </div>
                              {item.reasoning}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-border p-5 mt-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-base">Mission Summary</h3>
          <div className="space-y-2.5 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fees (4 merchants)</span>
              <span className="text-foreground">${deliveryFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mission orchestration fee</span>
              <span className="text-foreground">${orchestrationFee.toFixed(2)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold text-lg text-foreground pb-1">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-border/50 flex flex-col items-center">
         <Button 
          className="w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/25 bg-[#EB1700] hover:bg-[#EB1700]/90 text-white"
          onClick={handleCheckout}
        >
          Place Mission Order
        </Button>
      </div>

      {/* Substitution Overlay (Mobile Contained) */}
      {substitutionSheetOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-[32px] p-6 pb-16 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="text-left mb-6">
              <h2 className="text-2xl font-semibold">Substitution Logic</h2>
              <p className="text-base mt-2 text-muted-foreground">
                This wine is out of stock at Bin 36 Wine Shop. Based on your party mission (intimate dinner, seafood-leaning menu, {guestCount} guests), we'd swap to a <strong className="text-foreground">Sancerre</strong> from Bin 36 ($28), or hold the slot and pull a <strong className="text-foreground">Vouvray</strong> from Pastoral ($24).
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-2xl flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0">
                    <img src={products.p4.image} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{products.p4.name}</h4>
                    <p className="text-sm text-muted-foreground">Bin 36 Wine Shop</p>
                  </div>
                </div>
                <span className="font-semibold">${products.p4.price}</span>
              </div>
              
              <Button className="w-full text-lg h-14 rounded-xl" onClick={() => handleSwap("p1", "p4")}>
                Accept Sancerre swap
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-xl text-muted-foreground border-border" onClick={() => setSubstitutionSheetOpen(false)}>
                See all alternatives
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
