import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
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
};

type Template = {
  estimatedTime: string;
  groups: { merchant: string; eta: string; items: Omit<CartItem, "merchant">[] }[];
};

const TEMPLATES: Record<MissionId, Template> = {
  dinner: {
    estimatedTime: "55–70 min",
    groups: [
      {
        merchant: "Rainbow Grocery",
        eta: "45 min",
        items: [
          { id: "d1", name: "Bone-in ribeye, dry-aged",   qtyPerGuest: 0.5, unit: "lb",   price: 28 },
          { id: "d2", name: "Heirloom potatoes",          qtyPerGuest: 0.4, unit: "lb",   price: 4 },
          { id: "d3", name: "Little gem lettuce",         qtyPerGuest: 0.3, unit: "head", price: 3 },
          { id: "d4", name: "Maldon flake salt",          qtyPerGuest: 0,   unit: "tin",  price: 8, },
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

function buildCart(missionId: MissionId, guests: number): CartItem[] {
  const t = TEMPLATES[missionId];
  return t.groups.flatMap((g) =>
    g.items.map((i) => ({
      ...i,
      merchant: g.merchant,
      // scaled qty (rounded up where it makes sense, min 1 for "shared" items with qtyPerGuest 0)
      qtyPerGuest: i.qtyPerGuest === 0 ? 1 : Math.max(1, Math.ceil(i.qtyPerGuest * guests)),
    }))
  );
}

// ---------- App ----------

type Step =
  | { name: "home" }
  | { name: "guests"; mission: MissionId }
  | { name: "date"; mission: MissionId; guests: number }
  | { name: "cart"; mission: MissionId; guests: number; date: string }
  | { name: "success"; mission: MissionId; guests: number; date: string }
  | { name: "stores" };

function App() {
  const [step, setStep] = useState<Step>({ name: "home" });

  return (
    <div className="min-h-screen w-full bg-surface-2 flex items-center justify-center p-0 md:p-8">
      {/* Phone frame */}
      <div className="relative w-full max-w-[420px] md:rounded-[44px] md:border md:border-hairline bg-background overflow-hidden md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] min-h-screen md:min-h-[860px] md:max-h-[860px] flex flex-col">
        <StatusBar />
        <div className="flex-1 overflow-y-auto">
          {step.name === "home" && (
            <HomeScreen
              onPick={(m) => setStep({ name: "guests", mission: m })}
              onDismiss={() => setStep({ name: "stores" })}
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
              onNext={(d) =>
                setStep({ name: "cart", mission: step.mission, guests: step.guests, date: d })
              }
            />
          )}
          {step.name === "cart" && (
            <CartScreen
              mission={step.mission}
              guests={step.guests}
              date={step.date}
              onBack={() => setStep({ name: "date", mission: step.mission, guests: step.guests })}
              onCheckout={() =>
                setStep({
                  name: "success",
                  mission: step.mission,
                  guests: step.guests,
                  date: step.date,
                })
              }
            />
          )}
          {step.name === "success" && (
            <SuccessScreen
              mission={step.mission}
              guests={step.guests}
              date={step.date}
              onDone={() => setStep({ name: "home" })}
            />
          )}
          {step.name === "stores" && (
            <StoreFallback onBack={() => setStep({ name: "home" })} />
          )}
        </div>
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
  onPick,
  onDismiss,
}: {
  onPick: (m: MissionId) => void;
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
          Pick a mission. We&rsquo;ll assemble one cart across the
          merchants that do it best — food, drinks, the small things
          that signal care.
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
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-3"
              style={{
                background: `color-mix(in oklch, ${m.accent} 12%, white)`,
              }}
            >
              {m.emoji}
            </div>
            <div className="font-semibold text-[15px] tracking-tight">
              {m.title}
            </div>
            <div className="text-[12px] text-ink-soft mt-0.5">{m.tagline}</div>
            <ChevronRight
              className="absolute top-4 right-4 h-4 w-4 text-ink-soft opacity-0 group-hover:opacity-100 transition"
            />
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
              Three taps and you&rsquo;re hosting — not project-managing
              five tabs at midnight.
            </div>
          </div>
        </div>
      </div>

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
          <Stepper value={g} onChange={(v) => setG(Math.max(2, Math.min(40, v)))} />
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
      </div>
      <BottomBar>
        <PrimaryBtn onClick={() => onNext(g)}>
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
    const out: { key: string; weekday: string; day: number; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const wk = d.toLocaleDateString("en-US", { weekday: "short" });
      const label =
        i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "long" });
      out.push({
        key: d.toISOString().slice(0, 10),
        weekday: wk,
        day: d.getDate(),
        label,
      });
    }
    return out;
  }, []);
  // pre-select first Saturday for that hosting feel, else today
  const defaultIdx = dates.findIndex((d) => d.weekday === "Sat");
  const [sel, setSel] = useState<string>(dates[defaultIdx >= 0 ? defaultIdx : 0].key);

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
                onClick={() => setSel(d.key)}
                className={`shrink-0 w-[68px] h-[88px] rounded-2xl border flex flex-col items-center justify-center transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-hairline bg-surface hover:border-foreground/40"
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider opacity-80">
                  {d.weekday}
                </div>
                <div className="text-[24px] font-semibold tabular-nums leading-none mt-1">
                  {d.day}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-4">
          <div className="text-[12px] text-ink-soft">Selected</div>
          <div className="font-semibold mt-0.5">
            {dates.find((d) => d.key === sel)?.label} ·{" "}
            {new Date(sel).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="mt-3 text-[12px] text-ink-soft flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />
            All 3 merchants available for this date
          </div>
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
  onCheckout: () => void;
}) {
  const m = MISSIONS.find((x) => x.id === mission)!;
  const [items, setItems] = useState<CartItem[]>(() => buildCart(mission, guests));

  const subtotal = items.reduce((s, i) => s + i.price * i.qtyPerGuest, 0);
  const fees = 5.99;
  const tax = subtotal * 0.0875;
  const total = subtotal + fees + tax;

  const grouped = useMemo(() => {
    const map = new Map<string, CartItem[]>();
    items.forEach((i) => {
      if (!map.has(i.merchant)) map.set(i.merchant, []);
      map.get(i.merchant)!.push(i);
    });
    return Array.from(map.entries());
  }, [items]);

  const update = (id: string, delta: number) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qtyPerGuest: Math.max(0, i.qtyPerGuest + delta) } : i
        )
        .filter((i) => i.qtyPerGuest > 0)
    );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const dateLabel = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

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

      <div className="px-4 pt-4 space-y-4 pb-6">
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
                  <div className="text-[11px] text-ink-soft">
                    Delivered together · {tmpl?.eta}
                  </div>
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
        </div>
      </div>

      <BottomBar>
        <PrimaryBtn onClick={onCheckout}>
          Checkout · ${total.toFixed(2)}
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
      <span className={bold ? "text-foreground tabular-nums" : "tabular-nums"}>
        {value}
      </span>
    </div>
  );
}

// ---------- Success ----------

function SuccessScreen({
  mission,
  guests,
  date,
  onDone,
}: {
  mission: MissionId;
  guests: number;
  date: string;
  onDone: () => void;
}) {
  const m = MISSIONS.find((x) => x.id === mission)!;
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
          Your {m.title.toLowerCase()} for {guests} on {dateLabel} is on its way.
          Show up. Be the host. We&rsquo;ll handle the rest.
        </p>

        <div className="mt-8 w-full rounded-2xl border border-hairline bg-surface p-4 text-left">
          <div className="text-[11px] uppercase tracking-wider text-ink-soft">
            How did the gathering go?
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 h-11 rounded-xl border border-hairline font-medium hover:bg-surface-2">
              👍 Worked
            </button>
            <button className="flex-1 h-11 rounded-xl border border-hairline font-medium hover:bg-surface-2">
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
        onBack={onBack}
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
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 rounded-full font-semibold text-[15px] active:scale-[0.99] transition"
      style={{
        background: "var(--brand)",
        color: "var(--brand-foreground)",
      }}
    >
      {children}
    </button>
  );
}
