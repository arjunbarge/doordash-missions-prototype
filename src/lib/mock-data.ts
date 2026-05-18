import { Merchant, Mission, Product, Template } from "./types";

export const merchants: Merchant[] = [
  { id: "m1", name: "Bin 36 Wine Shop", distance: "0.8 mi", deliveryWindow: "30-45 min" },
  { id: "m2", name: "Pastoral Cheese", distance: "1.2 mi", deliveryWindow: "40-55 min" },
  { id: "m3", name: "Flowers for Dreams", distance: "2.1 mi", deliveryWindow: "50-65 min" },
  { id: "m4", name: "Mariano's", distance: "1.5 mi", deliveryWindow: "35-50 min" },
];

export const products: Record<string, Product> = {
  p1: { id: "p1", merchantId: "m1", name: "Sauvignon Blanc, Marlborough", price: 28, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=300&q=80" },
  p2: { id: "p2", merchantId: "m1", name: "Pinot Noir, Willamette", price: 34, image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=300&q=80" },
  p3: { id: "p3", merchantId: "m1", name: "Prosecco Superiore", price: 30, image: "https://images.unsplash.com/photo-1578326457388-37d4e3e3bba5?w=300&q=80" },
  p4: { id: "p4", merchantId: "m1", name: "Sancerre (Alternative)", price: 28, image: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=300&q=80" },
  p5: { id: "p5", merchantId: "m2", name: "Aged Cheddar & Gouda Board", price: 24, image: "https://images.unsplash.com/photo-1631379578987-1959725f1b5c?w=300&q=80" },
  p6: { id: "p6", merchantId: "m2", name: "Soft Cheeses & Fig Jam", price: 24, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80" },
  p7: { id: "p7", merchantId: "m2", name: "Vouvray (Alternative)", price: 24, image: "https://images.unsplash.com/photo-1565551329241-d5f0e34c6e18?w=300&q=80" },
  p8: { id: "p8", merchantId: "m3", name: "Seasonal Peony Bouquet", price: 32, image: "https://images.unsplash.com/photo-1563241598-6ce2b7936a28?w=300&q=80" },
  p9: { id: "p9", merchantId: "m4", name: "Artisan Baguette & Crackers", price: 12, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&q=80" },
  p10: { id: "p10", merchantId: "m4", name: "Sparkling Water & Ice", price: 16, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80" },
};

export const templates: Template[] = [
  {
    id: "t1",
    name: "Intimate Dinner for 6",
    vibe: "Warm, conversational, mid-week dinner energy",
    summary: "3 wines, 2 cheese boards, charcuterie, a bouquet, dessert",
    estimatedTotal: 185,
    merchantCount: 4,
    defaultItems: [
      { product: products.p1, quantity: 1, reasoning: "Picked because the menu skews seafood and you mentioned salmon." },
      { product: products.p2, quantity: 1, reasoning: "A versatile crowd-pleaser for the table." },
      { product: products.p3, quantity: 1, reasoning: "To start the evening with a toast." },
      { product: products.p5, quantity: 1, reasoning: "Perfect savory start for 6 guests." },
      { product: products.p6, quantity: 1, reasoning: "Adds variety to the appetizer spread." },
      { product: products.p8, quantity: 1, reasoning: "Sets a warm tablescape vibe." },
      { product: products.p9, quantity: 1, reasoning: "Essential pairings for the cheeses." },
      { product: products.p10, quantity: 1, reasoning: "The basics so you don't have to run out." },
    ]
  },
  {
    id: "t2",
    name: "Cocktail Night for 12",
    vibe: "High energy, standing room, easy bites",
    summary: "Batched cocktails, abundant appetizers, lots of ice",
    estimatedTotal: 320,
    merchantCount: 3,
    defaultItems: [],
  },
  {
    id: "t3",
    name: "Casual Brunch for 8",
    vibe: "Slow Sunday morning, coffee and pastries",
    summary: "Cold brew, bagels, lox, fresh fruit",
    estimatedTotal: 145,
    merchantCount: 2,
    defaultItems: [],
  }
];

export const mockPastMissions: Mission[] = [
  {
    id: "miss-1",
    title: "Holiday brunch",
    type: "other",
    date: "December 2025",
    guestCount: 12,
    status: "completed",
    rating: "up",
    items: []
  },
  {
    id: "miss-2",
    title: "Sick-day spread",
    type: "sick-day",
    date: "February 2026",
    guestCount: 1,
    status: "completed",
    rating: "up",
    items: []
  }
];
