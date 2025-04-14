import { searchTrails } from "@/services/trails";

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { status: 400 }
      );
    }

    const trails = await searchTrails(query);
    return new Response(JSON.stringify(trails));
  } catch (error) {
    console.error("Error in search API:", error);
    return new Response(JSON.stringify({ error: "Failed to search trails" }), {
      status: 500,
    });
  }
}
