import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { gender, occasion, style, products } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const productList = products
      .map((p: any) => `- ID: "${p.id}" | Title: "${p.title}" | Category: ${p.category} | Tags: [${p.tags.join(", ")}] | Price: ${p.price} ${p.currency}`)
      .join("\n");

    const systemPrompt = `You are an elite fashion stylist for a luxury old-money aesthetic brand. You create complete, cohesive outfits from the available product catalog.

RULES:
1. You can ONLY recommend products from the provided catalog — never invent items.
2. An outfit can have 1 to 4 pieces. Not every category needs to be filled.
3. If there are no pants, bottoms, or shoes in the catalog, do NOT mention them or suggest the user buy them. Simply build the best outfit from what's available.
4. Focus on color harmony, style cohesion, and the old-money aesthetic.
5. Consider the gender, occasion, and style preferences provided.
6. For each selected item, explain WHY it works in the outfit.

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "outfitName": "A creative, evocative name for this outfit",
  "selectedProductIds": ["id1", "id2"],
  "explanation": "2-3 sentences on the overall outfit vision and why these pieces work together",
  "piecesBreakdown": [
    {
      "productId": "id1",
      "role": "e.g. Base Layer, Statement Piece, Accent",
      "reason": "Why this piece was chosen"
    }
  ],
  "stylingTips": ["Actionable styling tip 1", "Tip 2"],
  "alternativeSwaps": [
    {
      "originalId": "id1",
      "alternativeId": "id2",
      "reason": "Why this swap works"
    }
  ]
}

If no good alternatives exist for a piece, leave alternativeSwaps as an empty array.
Only include products whose IDs exist in the catalog.`;

    const userMessage = `Build a complete outfit for a ${gender || "unisex"} look.
${occasion ? `Occasion: ${occasion}` : "Occasion: everyday casual-elegant"}
${style ? `Style preference: ${style}` : "Style preference: classic old-money"}

Available products:
${productList}`;

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
