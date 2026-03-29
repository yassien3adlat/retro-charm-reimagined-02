import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { height, weight, bodyType, chest, waist, hips, productCategory } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a fashion sizing expert for an old-money style clothing brand. 
Given body measurements, recommend the best size from the available sizes.

For clothing: XS, S, M, L, XL
For sneakers: 39, 40, 41, 42, 43, 44, 45

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "recommendedSize": "M",
  "confidence": "high",
  "explanation": "Brief 1-2 sentence explanation",
  "tips": ["Optional fit tip 1", "Optional fit tip 2"]
}

confidence can be "high", "medium", or "low" depending on how much data was provided.
If very little info is given, still make a reasonable guess but set confidence to "low".`;

    const userMessage = `Please recommend a size for ${productCategory || "clothing"} based on these measurements:
${height ? `- Height: ${height} cm` : "- Height: not provided"}
${weight ? `- Weight: ${weight} kg` : "- Weight: not provided"}
${bodyType ? `- Body type: ${bodyType}` : "- Body type: not provided"}
${chest ? `- Chest: ${chest} cm` : "- Chest: not provided"}
${waist ? `- Waist: ${waist} cm` : "- Waist: not provided"}
${hips ? `- Hips: ${hips} cm` : "- Hips: not provided"}`;

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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const recommendation = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("size-recommendation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
