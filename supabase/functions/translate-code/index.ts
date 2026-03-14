import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { sourceCode, sourceLang, targetLang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a high-precision code transpiler. Your task is to translate code from ${sourceLang} to ${targetLang}.

RULES:
1. Preserve the EXACT same algorithmic logic, control flow, and variable structure.
2. Maintain identical time complexity and space complexity — do NOT introduce inefficiencies.
3. Output clean, idiomatic, well-formatted ${targetLang} code.
4. Do NOT add comments explaining the translation — only preserve original comments translated if needed.
5. Do NOT wrap the code in markdown code blocks.
6. After the translated code, output a JSON block on a new line starting with "---COMPLEXITY---" followed by a JSON object with this exact structure:
{"sourceTime":"O(...)","sourceSpace":"O(...)","targetTime":"O(...)","targetSpace":"O(...)"}

Only output the translated code followed by the complexity JSON. Nothing else.`;

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
          { role: "user", content: sourceCode },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content || "";

    // Parse complexity from the output
    let translatedCode = fullText;
    let sourceComplexity = { timeComplexity: "N/A", spaceComplexity: "N/A", linesOfCode: 0 };
    let targetComplexity = { timeComplexity: "N/A", spaceComplexity: "N/A", linesOfCode: 0 };

    const complexityMarker = "---COMPLEXITY---";
    const markerIndex = fullText.indexOf(complexityMarker);
    if (markerIndex !== -1) {
      translatedCode = fullText.substring(0, markerIndex).trim();
      const jsonStr = fullText.substring(markerIndex + complexityMarker.length).trim();
      try {
        const c = JSON.parse(jsonStr);
        sourceComplexity = {
          timeComplexity: c.sourceTime || "N/A",
          spaceComplexity: c.sourceSpace || "N/A",
          linesOfCode: sourceCode.split("\n").length,
        };
        targetComplexity = {
          timeComplexity: c.targetTime || "N/A",
          spaceComplexity: c.targetSpace || "N/A",
          linesOfCode: translatedCode.split("\n").length,
        };
      } catch {
        // Parsing failed, use defaults
      }
    } else {
      sourceComplexity.linesOfCode = sourceCode.split("\n").length;
      targetComplexity.linesOfCode = translatedCode.split("\n").length;
    }

    return new Response(JSON.stringify({ translatedCode, sourceComplexity, targetComplexity }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
