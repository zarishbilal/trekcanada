import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  // Use Google Places key for Vertex AI Generative Language (Gemini)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("Missing Google API key for Gemini, skipping AI insights.");
    return NextResponse.json({
      insights: "AI insights unavailable (no API key configured)",
    });
  }

  try {
    const { trail, reviews } = await request.json();

    // Build a prompt combining trail details and reviews
    const promptLines = [];
    promptLines.push(`Trail Name: ${trail.name}`);
    promptLines.push(`Park: ${trail.park}`);
    promptLines.push(`Province: ${trail.province}`);
    promptLines.push(`Length: ${trail.length} km`);
    promptLines.push(`Difficulty: ${trail.difficulty}`);
    promptLines.push(`Season: ${trail.season}`);
    promptLines.push(`Description: ${trail.description}`);
    promptLines.push("\nUser Reviews:");
    reviews?.forEach((r, idx) => {
      promptLines.push(`${idx + 1}. (${r.rating} stars) ${r.text}`);
    });
    promptLines.push("\nBased on the above, provide:");
    promptLines.push("1. Expected weather and wildlife encounters.");
    promptLines.push(
      "2. Essential packing list (including safety items like bear spray)."
    );
    promptLines.push("3. Summary of visitor experience insights.");

    // Build the final prompt text
    const promptText = [
      "You are a knowledgeable hiking guide who helps users prepare for trail adventures in Canadian national parks.",
      promptLines.join("\n"),
    ].join("\n\n");

    // Instantiate the official GenAI client and request Gemini Pro
    const ai = new GoogleGenAI({ apiKey });
    const genResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptText,
    });
    const insights = genResponse.text || "";

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("Error in AI Insights route:", err);
    // Fallback: return fallback insights instead of HTTP 500
    return NextResponse.json({
      insights: `AI insights unavailable (error: ${err.message})`,
    });
  }
}
