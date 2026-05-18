"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { CartItem, MissionType, Product } from "@/lib/types";
import { products, merchants } from "@/lib/mock-data";

export async function generateMissionCart(missionType: MissionType, guestCount: number): Promise<CartItem[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Convert products record to array for prompt
    const availableProducts = Object.values(products).map(p => {
      const merchant = merchants.find(m => m.id === p.merchantId);
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        merchantName: merchant?.name || "Unknown"
      };
    });

    const missionContext = `You are a professional local mission orchestrator. 
The user is planning a mission. Mission type: ${missionType}. Guest count: ${guestCount}.
Your job is to select the perfect items from our local merchants to build a multi-merchant cart.

AVAILABLE PRODUCTS CATALOG:
${JSON.stringify(availableProducts, null, 2)}

INSTRUCTIONS:
1. Return exactly a JSON array of cart items.
2. Only select products from the AVAILABLE PRODUCTS CATALOG using their exact 'id'. Do not invent products.
3. Include a short, thoughtful 1-sentence 'reasoning' for why you selected each item based on the mission type and guest count. This will be shown to the user as 'AI Curated' reasoning.
4. Provide appropriate quantities for ${guestCount} guests.
5. Select a balanced mix of 4-6 items across different merchants to demonstrate a multi-merchant cart.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: missionContext,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.STRING },
              quantity: { type: Type.INTEGER },
              reasoning: { type: Type.STRING }
            },
            required: ["productId", "quantity", "reasoning"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const aiSelections: { productId: string, quantity: number, reasoning: string }[] = JSON.parse(response.text);

    // Map AI selections back to full Product objects for the cart
    const curatedCart: CartItem[] = aiSelections.map(selection => {
      const product = products[selection.productId];
      if (!product) return null;
      return {
        product,
        quantity: selection.quantity,
        reasoning: selection.reasoning
      };
    }).filter((item): item is CartItem => item !== null);

    return curatedCart;
  } catch (error) {
    console.error("AI Curation Error:", error);
    throw new Error("Failed to generate mission cart.");
  }
}
