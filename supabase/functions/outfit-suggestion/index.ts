import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { gender, vibe, products } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const productList = products
      .map((p: any) => `- ID: "${p.id}" | Title: "${p.title}" | Tags: [${p.tags.join(", ")}] | Price: ${p.price} ${p.currency}`)
      .join("\n");

    const systemPrompt = `You are an elite personal stylist with 20 years of experience in luxury old-money fashion. You have an extraordinary eye for color coordination, fabric pairing, and creating cohesive looks.

YOUR MISSION: Build a complete, wearable outfit from the given product catalog. Think like a real stylist — consider texture contrast, color harmony, layering potential, and silhouette balance.

CRITICAL RULES:
1. ONLY use products from the provided catalog. Never invent items.
2. Pick 2-4 pieces that genuinely look good together.
3. If no shoes, pants, or a certain category exists — that's fine. Build with what you have. Do NOT apologize or mention missing categories. A sweater + jacket combo IS a valid outfit suggestion.
4. Think about how the pieces ACTUALLY look together: color clashing, texture mixing, proportions.
5. Each piece must have a clear role: base layer, mid layer, outer layer, accent, footwear.
6. The outfit name should be evocative and aspirational — like a fashion editorial title.

PLACEMENT ZONES (for visual display on mannequin):
- "head": hats, caps, beanies
- "top": t-shirts, shirts, sweaters, hoodies (worn closest to body)
- "mid": cardigans, quarter-zips, light jackets (layered over top)
- "outer": coats, heavy jackets (outermost layer)
- "bottom": pants, trousers, shorts, skirts
- "feet": shoes, sneakers, boots
- "accessory": bags, scarves, watches, jewelry

Assign EXACTLY ONE zone per product. If a product could go in multiple zones, pick the most logical one based on layering.

RESPOND ONLY with valid JSON:
{
  "outfitName": "Editorial-style name",
  "selectedProductIds": ["id1", "id2"],
  "explanation": "2-3 sentences on the overall vision. Be specific about WHY these pieces work together — mention colors, textures, silhouettes.",
  "pieces": [
    {
      "productId": "id1",
      "zone": "top",
      "role": "Base Layer",
      "reason": "Specific reason this piece was chosen"
    }
  ],
  "stylingTips": ["Very specific, actionable tip 1", "Tip 2", "Tip 3"],
  "mood": "One-line mood/vibe description like 'Quiet luxury meets weekend ease'"
}`;

    const userMessage = `Style a ${gender === "women" ? "women's" : "men's"} outfit.
Vibe: ${vibe || "classic old-money elegance"}

Available products in our collection:
${productList}

Remember: build the BEST possible outfit from these exact products. Be creative with layering and combinations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const suggestion = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("outfit-suggestion error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
