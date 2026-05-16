import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Info,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "DoorDash · Mission-First Home" },
      { name: "description", content: "Declare a hosting mission. Get one curated multi-merchant cart." },
    ],
  }),
});

// ---------- Domain ----------

type MissionId = "dinner" | "brunch" | "gameday" | "cocktail" | "casual";

type Mission = {
  id: MissionId;
  title: string;
  tagline: string;
  emoji: string;
  accent: string;
};

const MISSIONS: Mission[] = [
  { id: "dinner",   title: "Dinner party",     tagline: "Plated, intentional, hosted",  emoji: "🍷", accent: "oklch(0.55 0.18 25)" },
  { id: "brunch",   title: "Saturday brunch",  tagline: "Slow morning, full table",     emoji: "🥐", accent: "oklch(0.78 0.15 75)" },
  { id: "gameday",  title: "Game day",         tagline: "Snacks, beer, big screen",     emoji: "🏈", accent: "oklch(0.55 0.16 145)" },
  { id: "cocktail", title: "Cocktail night",   tagline: "Drinks, bites, low lighting",  emoji: "🍸", accent: "oklch(0.45 0.18 290)" },
  { id: "casual",   title: "Casual gathering", tagline: "Friends over, nothing fussy",  emoji: "🧀", accent: "oklch(0.65 0.14 50)" },
];

type CartItem = {
  id: string;
  name: string;
  qtyPerGuest: number; // template scale
  unit: string;
  price: number;
  merchant: string;
  substitutedFrom?: string;
};

type Template = {
  estimatedTime: string;
  priceCeilingPerGuest: number;
  groups: { merchant: string; eta: string; items: Omit<CartItem, "merchant">[] }[];
};

const TEMPLATES: Record<MissionId, Template> = {
  dinner: {
    estimatedTime: "55–70 min",
    priceCeilingPerGuest: 75,
    groups: [
      {
        merchant: "Rainbow Grocery",
        eta: "45 min",
        items: [
          { id: "d1", name: "Bone-in ribeye, dry-aged",   qtyPerGuest: 0.5, unit: "lb",   price: 28 },
          { id: "d2", name: "Heirloom potatoes",          qtyPerGuest: 0.4, unit: "lb",   price: 4 },
          { id: "d3", name: "Little gem lettuce",         qtyPerGuest: 0.3, unit: "head", price: 3 },
          { id: "d4", name: "Maldon flake salt",          qtyPerGuest: 0,   unit: "tin",  price: 8 },
        ],
      },
      {
        merchant: "Ferry Building Wine",
        eta: "55 min",
        items: [
          { id: "d5", name: "Chianti Classico, 2021",     qtyPerGuest: 0.4, unit: "btl",  price: 32 },
          { id: "d6", name: "Sparkling water, 1L",        qtyPerGuest: 0.5, unit: "btl",  price: 4 },
        ],
      },
      {
        merchant: "Bloomwell Florals",
        eta: "70 min",
        items: [
          { id: "d7", name: "Seasonal table arrangement", qtyPerGuest: 0,   unit: "ea",   price: 38 },
          { id: "d8", name: "Beeswax taper candles",      qtyPerGuest: 0,   unit: "set",  price: 18 },
        ],
      },
    ],
  },
  brunch: {
    estimatedTime: "40–55 min",
    priceCeilingPerGuest: 40,
    groups: [
      { merchant: "Tartine Bakery", eta: "40 min", items: [
        { id: "b1", name: "Morning bun",            qtyPerGuest: 1,   unit: "ea",  price: 5 },
        { id: "b2", name: "Country loaf",           qtyPerGuest: 0.3, unit: "ea",  price: 12 },
      ]},
      { merchant: "Bi-Rite Market", eta: "45 min", items: [
        { id: "b3", name: "Pasture-raised eggs",    qtyPerGuest: 2,   unit: "ea",  price: 0.85 },
        { id: "b4", name: "Smoked salmon",          qtyPerGuest: 0.2, unit: "lb",  price: 18 },
        { id: "b5", name: "Avocados, ripe",         qtyPerGuest: 0.5, unit: "ea",  price: 3 },
        { id: "b6", name: "Fresh OJ, 32oz",         qtyPerGuest: 0.3, unit: "btl", price: 9 },
      ]},
      { merchant: "Blue Bottle", eta: "55 min", items: [
        { id: "b7", name: "Cold brew growler",      qtyPerGuest: 0.25, unit: "ea", price: 14 },
      ]},
    ],
  },
  gameday: {
    estimatedTime: "35–50 min",
    priceCeilingPerGuest: 35,
    groups: [
      { merchant: "Safeway", eta: "35 min", items: [
        { id: "g1", name: "Wings, party platter",   qtyPerGuest: 6,   unit: "pc",  price: 1.5 },
        { id: "g2", name: "Tortilla chips, family", qtyPerGuest: 0.25, unit: "bag", price: 5 },
        { id: "g3", name: "Fresh guacamole, 16oz",  qtyPerGuest: 0.2, unit: "tub", price: 8 },
        { id: "g4", name: "Salsa verde",            qtyPerGuest: 0.2, unit: "jar", price: 6 },
      ]},
      { merchant: "Healthy Spirits", eta: "50 min", items: [
        { id: "g5", name: "Local IPA 6-pack",       qtyPerGuest: 0.5, unit: "6pk", price: 14 },
        { id: "g6", name: "Sparkling water variety",qtyPerGuest: 0.4, unit: "can", price: 2 },
      ]},
    ],
  },
  cocktail: {
    estimatedTime: "50–65 min",
    priceCeilingPerGuest: 55,
    groups: [
      { merchant: "Cask Spirits", eta: "60 min", items: [
        { id: "c1", name: "Mezcal, Vida 750ml",     qtyPerGuest: 0.2, unit: "btl", price: 38 },
        { id: "c2", name: "Gin, Junipero 750ml",    qtyPerGuest: 0.2, unit: "btl", price: 36 },
        { id: "c3", name: "Tonic, 4-pack",          qtyPerGuest: 0.5, unit: "4pk", price: 9 },
      ]},
      { merchant: "Bi-Rite Market", eta: "45 min", items: [
        { id: "c4", name: "Marcona almonds",        qtyPerGuest: 0.2, unit: "bag", price: 9 },
        { id: "c5", name: "Castelvetrano olives",   qtyPerGuest: 0.2, unit: "tub", price: 7 },
        { id: "c6", name: "Cured salami board",     qtyPerGuest: 0.3, unit: "pkg", price: 12 },
        { id: "c7", name: "Fresh limes",            qtyPerGuest: 1,   unit: "ea",  price: 0.7 },
      ]},
    ],
  },
  casual: {
    estimatedTime: "40–55 min",
    priceCeilingPerGuest: 30,
    groups: [
      { merchant: "Bi-Rite Market", eta: "45 min", items: [
        { id: "k1", name: "Cheese board trio",      qtyPerGuest: 0.3, unit: "pkg", price: 14 },
        { id: "k2", name: "Crackers, seedy",        qtyPerGuest: 0.3, unit: "box", price: 6 },
        { id: "k3", name: "Honeycrisp apples",      qtyPerGuest: 0.5, unit: "ea",  price: 1.5 },
        { id: "k4", name: "Local honey jar",        qtyPerGuest: 0,   unit: "jar", price: 9 },
      ]},
      { merchant: "Healthy Spirits", eta: "50 min", items: [
        { id: "k5", name: "Natural wine, red",      qtyPerGuest: 0.4, unit: "btl", price: 24 },
        { id: "k6", name: "N/A spritz, 4-pack",     qtyPerGuest: 0.4, unit: "4pk", price: 12 },
      ]},
    ],
  },
};

// Pre-approved fallback substitutions (item-id → replacement)
const SUBSTITUTIONS: Record<string, { name: string; price: number; unit: string }> = {
  d1: { name: "NY strip steak (sub for ribeye)", price: 24, unit: "lb" },
  b4: { name: "House-cured trout (sub for salmon)", price: 16, unit: "lb" },
  c1: { name: "Mezcal Bozal 750ml (sub for Vida)", price: 42, unit: "btl" },
};

// Items that are "out of stock" for a given (mock) date scenario.
// Demonstrates the substitution + drop edge cases.
function unavailableItemsFor(date: string): Set<string> {
  // Make it date-driven so users can see different behaviors
  const day = new Date(date).getDay(); // 0..6
  if (day === 0) return new Set(["d1", "d8"]); // Sun: ribeye subbed, candles dropped
  if (day === 6) return new Set(["b4"]);       // Sat: salmon subbed
  return new Set();
}

// Mock "merchant unavailable for date" (entire merchant down for region/date).
function unavailableMerchantsFor(date: string): Set<string> {
  const day = new Date(date).getDay();
  if (day === 1) return new Set(["Bloomwell Florals"]); // Mon: florist closed
  return new Set();
}

type BuildResult = {
  items: CartItem[];
  notices: { kind: "sub" | "drop" | "merchant"; message: string }[];
};

function buildCart(missionId: MissionId, guests: number, date: string): BuildResult {
  const t = TEMPLATES[missionId];
  const oos = unavailableItemsFor(date);
  const oosMerchants = unavailableMerchantsFor(date);
  const items: CartItem[] = [];
  const notices: BuildResult["notices"] = [];

  for (const g of t.groups) {
    if (oosMerchants.has(g.merchant)) {
      notices.push({
        kind: "merchant",
        message: `${g.merchant} isn't delivering on this date — items removed.`,
      });
      continue;
    }
    for (const i of g.items) {
      const scaled = i.qtyPerGuest === 0 ? 1 : Math.max(1, Math.ceil(i.qtyPerGuest * guests));
      if (oos.has(i.id)) {
        const sub = SUBSTITUTIONS[i.id];
        if (sub) {
          items.push({
            id: i.id,
            name: sub.name,
            qtyPerGuest: scaled,
            unit: sub.unit,
            price: sub.price,
            merchant: g.merchant,
            substitutedFrom: i.name,
          });
          notices.push({
            kind: "sub",
            message: `${i.name} → ${sub.name}`,
          });
        } else {
          notices.push({
            kind: "drop",
            message: `${i.name} unavailable — no fallback. Item removed.`,
          });
        }
        continue;
      }
      items.push({ ...i, qtyPerGuest: scaled, merchant: g.merchant });
    }
  }
  return { items, notices };
}

// ---------- Analytics (in-memory event log) ----------

type AnalyticsEvent = {
  ts: number;
  name:
    | "mission_home_impression"
    | "mission_declared"
    | "mission_dismissed"
    | "mission_replaced"
    | "mission_abandoned"
    | "checkout_started"
    | "checkout_failed"
    | "checkout_completed"
    | "mission_feedback";
  props?: Record<string, unknown>;
};

// ---------- App ----------

type ActiveMission = {
  mission: MissionId;
  guests: number;
  date: string;
};

type CompletedMission = ActiveMission & { completedAt: number; rating?: "up" | "down" };

type Step =
  | { name: "home" }
  | { name: "guests"; mission: MissionId }
  | { name: "date"; mission: MissionId; guests: number }
  | { name: "cart"; mission: MissionId; guests: number; date: string }
  | { name: "checkoutError"; mission: MissionId; guests: number; date: string; failedMerchant: string }
  | { name: "success"; mission: MissionId; guests: number; date: string }
  | { name: "stores" };

function App() {
  const [step, setStep] = useState<Step>({ name: "home" });
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const [active, setActive] = useState<ActiveMission | null>(null);
  const [history, setHistory] = useState<CompletedMission[]>([]);
  const [pendingReplace, setPendingReplace] = useState<MissionId | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [showEvents, setShowEvents] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const log = (name: AnalyticsEvent["name"], props?: AnalyticsEvent["props"]) =>
    setEvents((e) => [...e, { ts: Date.now(), name, props }]);

  useEffect(() => {
    if (step.name === "home" && !dismissedThisSession) log("mission_home_impression");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.name, dismissedThisSession]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const pickMission = (m: MissionId) => {
    if (active && active.mission !== m) {
      setPendingReplace(m);
      return;
    }
    if (active && active.mission === m) {
      // resume
      setStep({ name: "cart", mission: active.mission, guests: active.guests, date: active.date });
      return;
    }
    setStep({ name: "guests", mission: m });
  };

  const confirmReplace = () => {
    if (!pendingReplace) return;
    log("mission_replaced", { from: active?.mission, to: pendingReplace });
    setActive(null);
    setStep({ name: "guests", mission: pendingReplace });
    setPendingReplace(null);
  };

  return (
    <div className="min-h-screen w-full bg-surface-2 flex items-center justify-center p-0 md:p-8">
      <div className="relative w-full max-w-[420px] md:rounded-[44px] md:border md:border-hairline bg-background overflow-hidden md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] min-h-screen md:min-h-[860px] md:max-h-[860px] flex flex-col">
        <StatusBar />
        <div className="flex-1 overflow-y-auto">
          {step.name === "home" && !dismissedThisSession && (
            <HomeScreen
              active={active}
              history={history}
              onPick={pickMission}
              onResume={() =>
                active &&
                setStep({ name: "cart", mission: active.mission, guests: active.guests, date: active.date })
              }
              onAbandon={() => {
                if (!active) return;
                log("mission_abandoned", { mission: active.mission });
                setActive(null);
                setToast("Mission abandoned.");
              }}
              onDismiss={() => {
                log("mission_dismissed");
                setDismissedThisSession(true);
                setStep({ name: "stores" });
              }}
            />
          )}
          {step.name === "home" && dismissedThisSession && (
            <StoreFallback
              onBack={() => {
                // User asked to go back to missions explicitly — allow re-entry
                setDismissedThisSession(false);
                setStep({ name: "home" });
              }}
            />
          )}
          {step.name === "guests" && (
            <GuestsScreen
              mission={step.mission}
              onBack={() => setStep({ name: "home" })}
              onNext={(g) => setStep({ name: "date", mission: step.mission, guests: g })}
            />
          )}
          {step.name === "date" && (
            <DateScreen
              mission={step.mission}
              guests={step.guests}
              onBack={() => setStep({ name: "guests", mission: step.mission })}
              onNext={(d) => {
                log("mission_declared", { mission: step.mission, guests: step.guests, date: d });
                setActive({ mission: step.mission, guests: step.guests, date: d });
                setStep({ name: "cart", mission: step.mission, guests: step.guests, date: d });
              }}
            />
          )}
          {step.name === "cart" && (
            <CartScreen
              mission={step.mission}
              guests={step.guests}
              date={step.date}
              onBack={() => setStep({ name: "date", mission: step.mission, guests: step.guests })}
              onCheckout={(simulateFailure) => {
                log("checkout_started", { mission: step.mission });
                if (simulateFailure) {
                  log("checkout_failed", { merchant: "Ferry Building Wine" });
                  setStep({
                    name: "checkoutError",
                    mission: step.mission,
                    guests: step.guests,
                    date: step.date,
                    failedMerchant: "Ferry Building Wine",
                  });
                  return;
                }
                log("checkout_completed", { mission: step.mission, guests: step.guests });
                setActive(null);
                setHistory((h) => [
                  { mission: step.mission, guests: step.guests, date: step.date, completedAt: Date.now() },
                  ...h,
                ]);
                setStep({ name: "success", mission: step.mission, guests: step.guests, date: step.date });
              }}
            />
          )}
          {step.name === "checkoutError" && (
            <CheckoutErrorScreen
              merchant={step.failedMerchant}
              onRetry={() =>
                setStep({ name: "cart", mission: step.mission, guests: step.guests, date: step.date })
              }
              onPartial={() => {
                log("checkout_completed", { mission: step.mission, partial: true });
                setActive(null);
                setHistory((h) => [
                  { mission: step.mission, guests: step.guests, date: step.date, completedAt: Date.now() },
                  ...h,
                ]);
                setStep({ name: "success", mission: step.mission, guests: step.guests, date: step.date });
              }}
            />
          )}
          {step.name === "success" && (
            <SuccessScreen
              mission={step.mission}
              guests={step.guests}
              date={step.date}
              onRate={(r) => {
                log("mission_feedback", { rating: r });
                setHistory((h) =>
                  h.map((m, i) => (i === 0 ? { ...m, rating: r } : m))
                );
              }}
              onDone={() => setStep({ name: "home" })}
            />
          )}
          {step.name === "stores" && (
            <StoreFallback
              onBack={() => {
                setDismissedThisSession(false);
                setStep({ name: "home" });
              }}
            />
          )}
        </div>

        {/* Replace mission modal */}
        {pendingReplace && active && (
          <ConfirmModal
            title="Replace your active mission?"
            body={`You already have an active ${MISSIONS.find((m) => m.id === active.mission)?.title.toLowerCase()} for ${active.guests} guests. Starting a new mission will discard it.`}
            confirmLabel="Replace mission"
            onCancel={() => setPendingReplace(null)}
            onConfirm={confirmReplace}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background text-[12.5px] px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}

        {/* Analytics debug toggle */}
        <button
          onClick={() => setShowEvents((v) => !v)}
          className="absolute top-2 right-2 text-[10px] uppercase tracking-wider text-ink-soft hover:text-foreground bg-surface/80 backdrop-blur border border-hairline rounded-full px-2 py-1"
          aria-label="Toggle analytics log"
        >
          {showEvents ? "Hide" : "Events"} ({events.length})
        </button>
        {showEvents && <EventsPanel events={events} onClose={() => setShowEvents(false)} />}
      </div>
    </div>
  );
}

// ---------- Chrome ----------

function StatusBar() {
  return (
    <div className="hidden md:flex h-7 items-center justify-between px-6 text-[11px] font-semibold text-foreground/80 bg-background">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span>●●●●</span>
        <span>5G</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function TopBar({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-hairline">
      <div className="h-12 px-4 flex items-center justify-between">
        <div className="w-10">
          {onBack && (
            <button
              onClick={onBack}
              className="h-9 w-9 -ml-2 rounded-full flex items-center justify-center hover:bg-surface-2 active:scale-95 transition"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        <div className="w-10 flex justify-end">{right}</div>
      </div>
    </div>
  );
}

// ---------- Home ----------

function HomeScreen({
  active,
  history,
  onPick,
  onResume,
  onAbandon,
  onDismiss,
}: {
  active: ActiveMission | null;
  history: CompletedMission[];
  onPick: (m: MissionId) => void;
  onResume: () => void;
  onAbandon: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-brand-foreground font-bold"
            style={{ background: "var(--brand)" }}
          >
            D
          </div>
          <div className="text-[13px] leading-tight">
            <div className="font-semibold">Deliver to Home</div>
            <div className="text-ink-soft">123 Valencia St · 25 min</div>
          </div>
        </div>
        <div className="text-[11px] uppercase tracking-wider text-ink-soft">DashPass</div>
      </div>

      {/* Search */}
      <div className="px-5">
        <div className="h-11 rounded-full bg-surface-2 border border-hairline flex items-center px-4 gap-2 text-ink-soft text-sm">
          <Search className="h-4 w-4" />
          <span>Search DoorDash</span>
        </div>
      </div>

      {/* Active mission banner */}
      {active && (
        <div className="px-5 pt-5">
          <div
            className="rounded-2xl border border-hairline bg-surface p-4 flex items-center gap-3"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: `color-mix(in oklch, ${MISSIONS.find((m) => m.id === active.mission)?.accent} 14%, white)`,
              }}
            >
              {MISSIONS.find((m) => m.id === active.mission)?.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-ink-soft">Active mission</div>
              <div className="font-semibold text-[14px] truncate">
                {MISSIONS.find((m) => m.id === active.mission)?.title} · {active.guests} guests
              </div>
            </div>
            <button
              onClick={onResume}
              className="h-9 px-3 rounded-full text-[12.5px] font-semibold text-brand-foreground"
              style={{ background: "var(--brand)" }}
            >
              Resume
            </button>
            <button
              onClick={onAbandon}
              className="h-9 w-9 rounded-full flex items-center justify-center text-ink-soft hover:text-foreground hover:bg-surface-2"
              aria-label="Abandon mission"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="px-5 pt-8">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          <Sparkles className="h-3 w-3" style={{ color: "var(--brand)" }} />
          Hosting this weekend?
        </div>
        <h1 className="mt-3 text-[34px] leading-[1.05] font-semibold tracking-tight font-[family-name:var(--font-display)]">
          What are you{" "}
          <span style={{ color: "var(--brand)" }}>hosting</span>?
        </h1>
        <p className="mt-3 text-[14px] text-ink-soft leading-relaxed">
          Pick a mission. We&rsquo;ll assemble one cart across the merchants that do it best.
        </p>
      </div>

      {/* Mission chips */}
      <div className="px-5 pt-6 grid grid-cols-2 gap-3">
        {MISSIONS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onPick(m.id)}
            className={`group relative text-left rounded-2xl border border-hairline bg-surface p-4 active:scale-[0.98] transition hover:border-foreground/20 ${
              i === 0 ? "col-span-2" : ""
            }`}
            style={{ boxShadow: "var(--shadow-card)" }}
            aria-label={`Declare ${m.title} mission`}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-3"
              style={{
                background: `color-mix(in oklch, ${m.accent} 12%, white)`,
              }}
            >
              {m.emoji}
            </div>
            <div className="font-semibold text-[15px] tracking-tight">{m.title}</div>
            <div className="text-[12px] text-ink-soft mt-0.5">{m.tagline}</div>
            <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-ink-soft opacity-0 group-hover:opacity-100 transition" />
          </button>
        ))}
      </div>

      {/* Why this exists */}
      <div className="px-5 pt-6">
        <div className="rounded-2xl bg-brand-soft border border-hairline p-4 flex gap-3">
          <div
            className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center"
            style={{ background: "var(--brand)", color: "var(--brand-foreground)" }}
          >
            <Utensils className="h-4 w-4" />
          </div>
          <div className="text-[12.5px] leading-snug">
            <div className="font-semibold">One cart. Multiple merchants.</div>
            <div className="text-ink-soft">
              Three taps and you&rsquo;re hosting — not project-managing five tabs at midnight.
            </div>
          </div>
        </div>
      </div>

      {/* Mission history */}
      {history.length > 0 && (
        <div className="px-5 pt-8">
          <div className="text-[11px] uppercase tracking-wider text-ink-soft mb-2">
            Past missions
          </div>
          <div className="space-y-2">
            {history.slice(0, 3).map((h, idx) => {
              const m = MISSIONS.find((x) => x.id === h.mission)!;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-hairline bg-surface p-3 flex items-center gap-3"
                >
                  <span className="text-xl">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{m.title}</div>
                    <div className="text-[11px] text-ink-soft">
                      {h.guests} guests ·{" "}
                      {new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  {h.rating === "up" && <span className="text-[12px]">👍</span>}
                  {h.rating === "down" && <span className="text-[12px]">👎</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback */}
      <div className="px-5 pt-8 text-center">
        <button
          onClick={onDismiss}
          className="inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-foreground transition"
        >
          <Store className="h-4 w-4" />
          Just browsing — show me stores
        </button>
      </div>
    </div>
  );
}

// ---------- Guests ----------

function GuestsScreen({
  mission,
  onBack,
  onNext,
}: {
  mission: MissionId;
  onBack: () => void;
  onNext: (g: number) => void;
}) {
  const [g, setG] = useState(6);
  const m = MISSIONS.find((x) => x.id === mission)!;
  const tooSmall = g < 2;
  const tooBig = g > 40;
  const edgeWarn = g >= 25 && g <= 40;

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Step 1 of 2" onBack={onBack} />
      <div className="px-5 pt-6 flex-1">
        <MissionPill mission={m} />
        <h2 className="mt-5 text-[26px] leading-tight font-semibold tracking-tight">
          How many guests?
        </h2>
        <p className="text-[13px] text-ink-soft mt-1">
          We&rsquo;ll scale the cart to match. You can adjust anything later.
        </p>

        <div className="mt-10 flex items-center justify-center gap-6">
          <Stepper value={g} onChange={(v) => setG(Math.max(1, Math.min(50, v)))} />
        </div>

        <div className="mt-10 grid grid-cols-4 gap-2">
          {[4, 6, 8, 12].map((n) => (
            <button
              key={n}
              onClick={() => setG(n)}
              className={`h-10 rounded-full text-[13px] font-medium border transition ${
                g === n
                  ? "border-foreground bg-foreground text-background"
                  : "border-hairline bg-surface text-foreground hover:border-foreground/40"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {(tooSmall || tooBig || edgeWarn) && (
          <div className="mt-6 rounded-xl border border-hairline bg-warn-soft p-3 flex gap-2 items-start">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--warn)" }} />
            <div className="text-[12.5px] leading-snug">
              {tooSmall && "Mission carts need at least 2 guests. Try the store grid for solo orders."}
              {tooBig && "For more than 40 guests, we recommend Catering. Contact ops to scale this template."}
              {edgeWarn && "Large party — quantities will round up. Double-check before checkout."}
            </div>
          </div>
        )}
      </div>
      <BottomBar>
        <PrimaryBtn disabled={tooSmall || tooBig} onClick={() => onNext(g)}>
          Continue · {g} guests
        </PrimaryBtn>
      </BottomBar>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={() => onChange(value - 1)}
        className="h-12 w-12 rounded-full border border-hairline flex items-center justify-center hover:bg-surface-2 active:scale-95 transition"
        aria-label="Decrease"
      >
        <Minus className="h-5 w-5" />
      </button>
      <div className="text-[64px] font-semibold tabular-nums tracking-tight w-24 text-center">
        {value}
      </div>
      <button
        onClick={() => onChange(value + 1)}
        className="h-12 w-12 rounded-full text-brand-foreground flex items-center justify-center active:scale-95 transition"
        style={{ background: "var(--brand)" }}
        aria-label="Increase"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}

// ---------- Date ----------

function DateScreen({
  mission,
  guests,
  onBack,
  onNext,
}: {
  mission: MissionId;
  guests: number;
  onBack: () => void;
  onNext: (d: string) => void;
}) {
  const m = MISSIONS.find((x) => x.id === mission)!;
  const dates = useMemo(() => {
    const out: { key: string; weekday: string; day: number; label: string; isPast: boolean }[] = [];
    const now = new Date();
    for (let i = -1; i < 8; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const wk = d.toLocaleDateString("en-US", { weekday: "short" });
      const label =
        i === -1 ? "Yesterday" :
        i === 0 ? "Today" :
        i === 1 ? "Tomorrow" :
        d.toLocaleDateString("en-US", { weekday: "long" });
      out.push({
        key: d.toISOString().slice(0, 10),
        weekday: wk,
        day: d.getDate(),
        label,
        isPast: i < 0,
      });
    }
    return out;
  }, []);
  const firstValid = dates.findIndex((d) => !d.isPast && d.weekday === "Sat");
  const [sel, setSel] = useState<string>(
    dates[firstValid >= 0 ? firstValid : dates.findIndex((d) => !d.isPast)].key
  );

  const oosMerchants = unavailableMerchantsFor(sel);
  const oosItems = unavailableItemsFor(sel);
  const hasSubs = Array.from(oosItems).some((id) => SUBSTITUTIONS[id]);
  const hasDrops = Array.from(oosItems).some((id) => !SUBSTITUTIONS[id]);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Step 2 of 2" onBack={onBack} />
      <div className="px-5 pt-6 flex-1">
        <MissionPill mission={m} sub={`${guests} guests`} />
        <h2 className="mt-5 text-[26px] leading-tight font-semibold tracking-tight">
          When&rsquo;s the gathering?
        </h2>
        <p className="text-[13px] text-ink-soft mt-1">
          We&rsquo;ll check merchant availability for that day.
        </p>

        <div className="mt-6 -mx-5 px-5 flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => {
            const active = sel === d.key;
            return (
              <button
                key={d.key}
                onClick={() => !d.isPast && setSel(d.key)}
                disabled={d.isPast}
                className={`shrink-0 w-[68px] h-[88px] rounded-2xl border flex flex-col items-center justify-center transition ${
                  d.isPast
                    ? "border-hairline bg-surface-2 text-ink-soft opacity-50 cursor-not-allowed"
                    : active
                    ? "border-foreground bg-foreground text-background"
                    : "border-hairline bg-surface hover:border-foreground/40"
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider opacity-80">{d.weekday}</div>
                <div className="text-[24px] font-semibold tabular-nums leading-none mt-1">{d.day}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-4">
          <div className="text-[12px] text-ink-soft">Selected</div>
          <div className="font-semibold mt-0.5">
            {dates.find((d) => d.key === sel)?.label} ·{" "}
            {new Date(sel).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </div>

          {oosMerchants.size === 0 && oosItems.size === 0 && (
            <div className="mt-3 text-[12px] text-ink-soft flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
              All merchants available for this date
            </div>
          )}
          {oosMerchants.size > 0 && (
            <div className="mt-3 text-[12px] flex items-start gap-1.5" style={{ color: "var(--warn)" }}>
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5" />
              <span>{Array.from(oosMerchants).join(", ")} unavailable — those items will be removed.</span>
            </div>
          )}
          {hasSubs && (
            <div className="mt-2 text-[12px] flex items-start gap-1.5 text-ink-soft">
              <RefreshCw className="h-3.5 w-3.5 mt-0.5" />
              <span>Some items will be substituted with pre-approved alternates.</span>
            </div>
          )}
          {hasDrops && (
            <div className="mt-2 text-[12px] flex items-start gap-1.5" style={{ color: "var(--warn)" }}>
              <Info className="h-3.5 w-3.5 mt-0.5" />
              <span>Some items have no fallback and will be dropped.</span>
            </div>
          )}
        </div>

        <div className="mt-3 text-[11px] text-ink-soft px-1">
          Try different days to see substitution / merchant-down behavior.
        </div>
      </div>
      <BottomBar>
        <PrimaryBtn onClick={() => onNext(sel)}>Build my cart</PrimaryBtn>
      </BottomBar>
    </div>
  );
}

// ---------- Cart ----------

function CartScreen({
  mission,
  guests,
  date,
  onBack,
  onCheckout,
}: {
  mission: MissionId;
  guests: number;
  date: string;
  onBack: () => void;
  onCheckout: (simulateFailure: boolean) => void;
}) {
  const m = MISSIONS.find((x) => x.id === mission)!;
  const template = TEMPLATES[mission];
  const initial = useMemo(() => buildCart(mission, guests, date), [mission, guests, date]);
  const [items, setItems] = useState<CartItem[]>(initial.items);
  const [notices, setNotices] = useState(initial.notices);

  // Rebuild when date/guests change (e.g., back/forward)
  useEffect(() => {
    setItems(initial.items);
    setNotices(initial.notices);
  }, [initial]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qtyPerGuest, 0);
  const fees = items.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.0875;
  const total = subtotal + fees + tax;

  const ceiling = template.priceCeilingPerGuest * guests;
  const overCeiling = total > ceiling;

  const grouped = useMemo(() => {
    const map = new Map<string, CartItem[]>();
    items.forEach((i) => {
      if (!map.has(i.merchant)) map.set(i.merchant, []);
      map.get(i.merchant)!.push(i);
    });
    return Array.from(map.entries());
  }, [items]);

  // Delivery-window analysis: do merchant ETAs overlap?
  const etaMinutes = grouped
    .map(([merchant]) => template.groups.find((g) => g.merchant === merchant)?.eta)
    .filter(Boolean)
    .map((s) => parseInt(s!.match(/\d+/)?.[0] ?? "0", 10));
  const etaSpread = etaMinutes.length ? Math.max(...etaMinutes) - Math.min(...etaMinutes) : 0;
  const windowMismatch = etaSpread > 20;

  const update = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qtyPerGuest: Math.max(0, i.qtyPerGuest + delta) } : i))
          .filter((i) => i.qtyPerGuest > 0)
    );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const dateLabel = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const cartEmpty = items.length === 0;

  return (
    <div className="flex flex-col min-h-full bg-surface-2">
      <TopBar title="Your mission" onBack={onBack} />
      <div className="px-5 pt-5 pb-4 bg-background border-b border-hairline">
        <MissionPill mission={m} sub={`${guests} guests · ${dateLabel}`} />
        <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-soft">
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
          Curated by DoorDash · Edit anything below
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3 pb-6">
        {/* Notices */}
        {notices.length > 0 && (
          <div className="rounded-2xl border border-hairline bg-warn-soft p-3 space-y-2">
            <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--warn)" }}>
              Heads up — {notices.length} change{notices.length > 1 ? "s" : ""} for your date
            </div>
            {notices.map((n, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[12.5px] leading-snug">
                {n.kind === "sub" && <RefreshCw className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
                {n.kind === "drop" && <Trash2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
                {n.kind === "merchant" && <Store className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
                <span>{n.message}</span>
              </div>
            ))}
          </div>
        )}

        {windowMismatch && !cartEmpty && (
          <div className="rounded-2xl border border-hairline bg-surface p-3 flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 shrink-0 text-ink-soft" />
            <div className="text-[12.5px] leading-snug">
              <span className="font-medium">Delivery windows don&rsquo;t fully overlap</span>
              <span className="text-ink-soft"> — items will arrive in waves over ~{etaSpread} min.</span>
            </div>
          </div>
        )}

        {cartEmpty && (
          <div className="rounded-2xl border border-hairline bg-surface p-6 text-center">
            <div className="text-[14px] font-semibold">No items available</div>
            <div className="text-[12.5px] text-ink-soft mt-1">
              Required merchants are down for this date. Try another date or browse stores.
            </div>
          </div>
        )}

        {grouped.map(([merchant, list]) => {
          const tmpl = TEMPLATES[mission].groups.find((g) => g.merchant === merchant);
          return (
            <div
              key={merchant}
              className="rounded-2xl bg-surface border border-hairline overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-hairline">
                <div>
                  <div className="font-semibold text-[14px]">{merchant}</div>
                  <div className="text-[11px] text-ink-soft">Delivered together · {tmpl?.eta}</div>
                </div>
                <Store className="h-4 w-4 text-ink-soft" />
              </div>
              <ul>
                {list.map((i) => (
                  <li
                    key={i.id}
                    className="px-4 py-3 flex items-center gap-3 border-b border-hairline last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium truncate">{i.name}</div>
                      <div className="text-[11.5px] text-ink-soft">
                        ${i.price.toFixed(2)} / {i.unit}
                        {i.substitutedFrom && (
                          <span className="ml-1.5 inline-flex items-center gap-1" style={{ color: "var(--warn)" }}>
                            · <RefreshCw className="h-3 w-3 inline" /> sub
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => update(i.id, -1)}
                        className="h-7 w-7 rounded-full border border-hairline flex items-center justify-center hover:bg-surface-2"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <div className="w-6 text-center text-[13px] font-semibold tabular-nums">
                        {i.qtyPerGuest}
                      </div>
                      <button
                        onClick={() => update(i.id, +1)}
                        className="h-7 w-7 rounded-full border border-hairline flex items-center justify-center hover:bg-surface-2"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="w-16 text-right text-[13px] font-semibold tabular-nums">
                      ${(i.price * i.qtyPerGuest).toFixed(2)}
                    </div>
                    <button
                      onClick={() => remove(i.id)}
                      className="ml-1 h-7 w-7 rounded-full flex items-center justify-center text-ink-soft hover:text-foreground"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Totals */}
        {!cartEmpty && (
          <div
            className="rounded-2xl bg-surface border border-hairline p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row label="Delivery & service" value={`$${fees.toFixed(2)}`} />
            <Row label="Estimated tax" value={`$${tax.toFixed(2)}`} />
            <div className="h-px bg-hairline my-2" />
            <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            <div className="mt-2 text-[11.5px] text-ink-soft">
              All fees shown upfront. Single checkout across {grouped.length} merchants.
            </div>
            {overCeiling && (
              <div className="mt-3 rounded-xl bg-warn-soft p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--warn)" }} />
                <div className="text-[12px] leading-snug">
                  This cart is above the typical ceiling for {guests} guests
                  (${ceiling.toFixed(0)}). Flagged for ops review — consider trimming.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demo failure trigger */}
        {!cartEmpty && (
          <button
            onClick={() => onCheckout(true)}
            className="w-full text-[11.5px] text-ink-soft hover:text-foreground py-2"
          >
            ⚠ Demo: simulate one merchant failing at checkout
          </button>
        )}
      </div>

      <BottomBar>
        <PrimaryBtn disabled={cartEmpty} onClick={() => onCheckout(false)}>
          {cartEmpty ? "No items to checkout" : `Checkout · $${total.toFixed(2)}`}
        </PrimaryBtn>
      </BottomBar>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-1 text-[13px] ${
        bold ? "font-semibold text-[15px]" : "text-ink-soft"
      }`}
    >
      <span>{label}</span>
      <span className={bold ? "text-foreground tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}

// ---------- Checkout Error ----------

function CheckoutErrorScreen({
  merchant,
  onRetry,
  onPartial,
}: {
  merchant: string;
  onRetry: () => void;
  onPartial: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Checkout issue" />
      <div className="flex-1 px-6 pt-10 flex flex-col items-center text-center">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center"
          style={{ background: "var(--warn-soft)", color: "var(--warn)" }}
        >
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-[22px] font-semibold tracking-tight">
          One merchant didn&rsquo;t go through
        </h2>
        <p className="mt-2 text-[13.5px] text-ink-soft max-w-[300px]">
          <span className="font-medium text-foreground">{merchant}</span> closed before we could
          confirm. Your other merchants are ready. No payment has been charged yet.
        </p>

        <div className="mt-6 w-full rounded-2xl border border-hairline bg-surface p-4 text-left text-[12.5px] space-y-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
            <span>Rainbow Grocery — ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
            <span>Bloomwell Florals — ready</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: "var(--warn)" }}>
            <X className="h-4 w-4" />
            <span>{merchant} — unavailable</span>
          </div>
        </div>
      </div>
      <BottomBar>
        <div className="space-y-2">
          <PrimaryBtn onClick={onPartial}>Continue without {merchant}</PrimaryBtn>
          <button
            onClick={onRetry}
            className="w-full h-11 rounded-full border border-hairline font-medium text-[14px] hover:bg-surface-2"
          >
            Back to cart & swap
          </button>
        </div>
      </BottomBar>
    </div>
  );
}

// ---------- Success ----------

function SuccessScreen({
  mission,
  guests,
  date,
  onRate,
  onDone,
}: {
  mission: MissionId;
  guests: number;
  date: string;
  onRate: (r: "up" | "down") => void;
  onDone: () => void;
}) {
  const m = MISSIONS.find((x) => x.id === mission)!;
  const [rated, setRated] = useState<"up" | "down" | null>(null);
  const dateLabel = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-6 pt-16 flex flex-col items-center text-center">
        <div
          className="h-16 w-16 rounded-full flex items-center justify-center"
          style={{ background: "var(--brand)", color: "var(--brand-foreground)" }}
        >
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <h2 className="mt-6 text-[28px] font-semibold tracking-tight leading-tight">
          Mission accepted.
        </h2>
        <p className="mt-3 text-[14px] text-ink-soft max-w-[300px]">
          Your {m.title.toLowerCase()} for {guests} on {dateLabel} is on its way. Show up. Be the
          host. We&rsquo;ll handle the rest.
        </p>

        <div className="mt-8 w-full rounded-2xl border border-hairline bg-surface p-4 text-left">
          <div className="text-[11px] uppercase tracking-wider text-ink-soft">
            How did the gathering go?
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => { setRated("up"); onRate("up"); }}
              className={`flex-1 h-11 rounded-xl border font-medium transition ${
                rated === "up" ? "border-foreground bg-foreground text-background" : "border-hairline hover:bg-surface-2"
              }`}
            >
              👍 Worked
            </button>
            <button
              onClick={() => { setRated("down"); onRate("down"); }}
              className={`flex-1 h-11 rounded-xl border font-medium transition ${
                rated === "down" ? "border-foreground bg-foreground text-background" : "border-hairline hover:bg-surface-2"
              }`}
            >
              👎 Missed
            </button>
          </div>
          <div className="mt-2 text-[11.5px] text-ink-soft">
            Mission-level feedback. Helps us learn what hosts actually need.
          </div>
        </div>
      </div>
      <BottomBar>
        <PrimaryBtn onClick={onDone}>Back to home</PrimaryBtn>
      </BottomBar>
    </div>
  );
}

// ---------- Store fallback ----------

function StoreFallback({ onBack }: { onBack: () => void }) {
  const stores = [
    { name: "Tartine Bakery", tag: "Bakery · $", eta: "20 min" },
    { name: "Bi-Rite Market", tag: "Grocery · $$", eta: "30 min" },
    { name: "Rainbow Grocery", tag: "Grocery · $$", eta: "35 min" },
    { name: "Blue Bottle", tag: "Coffee · $", eta: "15 min" },
    { name: "Healthy Spirits", tag: "Wine & Beer · $$", eta: "40 min" },
    { name: "Bloomwell Florals", tag: "Florist · $$", eta: "55 min" },
  ];
  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="Stores near you"
        right={
          <button
            onClick={onBack}
            className="text-[12px] font-semibold"
            style={{ color: "var(--brand)" }}
          >
            Missions
          </button>
        }
      />
      <div className="px-5 pt-4">
        <div className="h-11 rounded-full bg-surface-2 border border-hairline flex items-center px-4 gap-2 text-ink-soft text-sm">
          <Search className="h-4 w-4" />
          <span>Search DoorDash</span>
        </div>
        <div className="mt-3 text-[11.5px] text-ink-soft px-1">
          Mission-First Home dismissed for this session. Tap &ldquo;Missions&rdquo; to reopen.
        </div>
      </div>
      <div className="px-4 pt-4 space-y-2 pb-6">
        {stores.map((s) => (
          <div
            key={s.name}
            className="rounded-2xl border border-hairline bg-surface p-4 flex items-center gap-3"
          >
            <div className="h-12 w-12 rounded-xl bg-surface-2 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-ink-soft" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px]">{s.name}</div>
              <div className="text-[12px] text-ink-soft">{s.tag}</div>
            </div>
            <div className="text-[12px] text-ink-soft">{s.eta}</div>
          </div>
        ))}
        <div className="pt-4 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[13px] font-medium"
            style={{ color: "var(--brand)" }}
          >
            <X className="h-4 w-4" />
            Back to mission home
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Bits ----------

function MissionPill({ mission, sub }: { mission: Mission; sub?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface pl-2 pr-4 py-1.5">
      <span
        className="h-7 w-7 rounded-full flex items-center justify-center text-base"
        style={{ background: `color-mix(in oklch, ${mission.accent} 14%, white)` }}
      >
        {mission.emoji}
      </span>
      <div className="text-[12.5px] leading-tight">
        <div className="font-semibold">{mission.title}</div>
        {sub && <div className="text-ink-soft text-[11px]">{sub}</div>}
      </div>
    </div>
  );
}

function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-hairline px-5 py-4">
      {children}
    </div>
  );
}

function PrimaryBtn({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-full font-semibold text-[15px] active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: "var(--brand)",
        color: "var(--brand-foreground)",
      }}
    >
      {children}
    </button>
  );
}

function ConfirmModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-end md:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[360px] rounded-3xl bg-background p-5 shadow-xl">
        <div className="text-[17px] font-semibold tracking-tight">{title}</div>
        <p className="mt-2 text-[13.5px] text-ink-soft leading-snug">{body}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={onCancel}
            className="h-11 rounded-full border border-hairline font-medium text-[14px] hover:bg-surface-2"
          >
            Keep current
          </button>
          <button
            onClick={onConfirm}
            className="h-11 rounded-full font-semibold text-[14px] text-brand-foreground"
            style={{ background: "var(--brand)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsPanel({
  events,
  onClose,
}: {
  events: AnalyticsEvent[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-10 right-2 z-30 w-[260px] max-h-[60vh] overflow-y-auto rounded-xl border border-hairline bg-background shadow-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-soft">
          Analytics events
        </div>
        <button onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {events.length === 0 ? (
        <div className="text-[12px] text-ink-soft">No events yet.</div>
      ) : (
        <ul className="space-y-1.5">
          {events.slice().reverse().map((e, idx) => (
            <li key={idx} className="text-[11px] font-mono leading-tight">
              <div className="font-semibold">{e.name}</div>
              {e.props && (
                <div className="text-ink-soft truncate">
                  {Object.entries(e.props).map(([k, v]) => `${k}=${String(v)}`).join(" ")}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
