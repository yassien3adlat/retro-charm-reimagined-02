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

    const systemPrompt = `You are an expert garment sizing consultant with deep knowledge of body proportions, fabric behavior, and fit standards across international sizing systems.

Your task: Given body measurements, recommend the BEST size from the available options.

Available clothing sizes and their standard body measurements (in cm):
- XS: Chest 84-88, Waist 68-72, Hips 88-92, Height 160-165
- S:  Chest 88-92, Waist 72-76, Hips 92-96, Height 165-170
- M:  Chest 92-96, Waist 76-80, Hips 96-100, Height 170-175
- L:  Chest 96-100, Waist 80-84, Hips 100-104, Height 175-180
- XL: Chest 100-104, Waist 84-88, Hips 104-108, Height 180-185

SIZING LOGIC:
1. If exact measurements (chest/waist/hips) are provided, match them directly to the size chart. The chest measurement is the primary indicator for tops, waist for bottoms.
2. If only height and weight are provided, estimate body measurements using BMI and proportional body models:
   - BMI < 20: lean build, lean toward smaller sizes
   - BMI 20-23: average, use height-based chart directly
   - BMI 23-26: slightly above average, consider sizing up
   - BMI > 26: size up from height-based recommendation
3. Body type adjustments:
   - Slim: stay true to size or size down
   - Athletic: may need to size up for chest/shoulders while waist is smaller
   - Regular: true to size
   - Broad: size up, especially for chest and shoulders
4. When between sizes, recommend the LARGER size for comfort.
5. If very little data is given, use height as primary indicator and set confidence to "low".

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "recommendedSize": "M",
  "confidence": "high",
  "explanation": "Brief 1-2 sentence explanation of why this size fits best",
  "tips": ["Specific actionable fit tip 1", "Specific actionable fit tip 2"]
}

confidence levels:
- "high": 3+ measurements provided OR height+weight+body type
- "medium": height+weight OR 1-2 measurements
- "low": only 1 field provided`;

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
