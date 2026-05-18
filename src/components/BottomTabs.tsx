"use client";

import { Home, LayoutTemplate, ShoppingBag, Clock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMissionStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BottomTabs() {
  const pathname = usePathname();
  const declaredMissionType = useMissionStore((state) => state.declaredMissionType);
  const cart = useMissionStore((state) => state.cart);

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { 
      name: "Templates", 
      href: "/templates", 
      icon: LayoutTemplate,
      disabled: !declaredMissionType 
    },
    { 
      name: "Cart", 
      href: "/cart", 
      icon: ShoppingBag,
      badge: cart.length > 0 ? cart.reduce((acc, item) => acc + item.quantity, 0) : null
    },
    { name: "Missions", href: "/missions", icon: Clock },
    { name: "Account", href: "/account", icon: User },
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 h-20 bg-background/95 backdrop-blur-md border-t border-border flex items-start justify-between px-6 pt-3 pb-8 z-40 rounded-b-[47px]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.disabled) {
          return (
            <div key={tab.name} className="flex flex-col items-center gap-1 opacity-40 cursor-not-allowed">
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </div>
          );
        }

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 relative transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {tab.badge && (
                <div className="absolute -top-1 -right-1.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                  {tab.badge}
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
