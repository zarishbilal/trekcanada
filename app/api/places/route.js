import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const query = searchParams.get("query");
  const location = searchParams.get("location");
  const placeId = searchParams.get("placeId");
  const photoReference = searchParams.get("photo_reference");

  const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const BASE_URL = "https://maps.googleapis.com/maps/api/place";

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    let url;
    if (endpoint === "textsearch") {
      url = `${BASE_URL}/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${location}&radius=5000&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      return NextResponse.json(data);
    } else if (endpoint === "details") {
      url = `${BASE_URL}/details/json?place_id=${placeId}&fields=name,photos,reviews,rating,formatted_address&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      // Process reviews to include full profile photo URLs
      if (data.result?.reviews) {
        data.result.reviews = data.result.reviews.map((review) => ({
          ...review,
          profilePhoto: review.profile_photo_url,
        }));
      }

      return NextResponse.json(data);
    } else if (endpoint === "photo") {
      // Try both parameter names for backward compatibility
      const photoReference =
        searchParams.get("photoReference") ||
        searchParams.get("photo_reference");
      const maxwidth = searchParams.get("maxwidth") || "800";

      console.log("Photo request received:", {
        photoReference,
        maxwidth,
        endpoint,
        searchParams: Object.fromEntries(searchParams.entries()),
      });

      if (!photoReference) {
        console.error("No photo reference provided");
        return NextResponse.json(
          { error: "Photo reference is required" },
          { status: 400 }
        );
      }

      try {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
        console.log("Fetching photo from Google Places API:", photoUrl);

        const response = await fetch(photoUrl);
        console.log("Google Places API response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch photo: ${response.status} ${response.statusText}`
          );
        }

        // Get the content type from the response
        const contentType = response.headers.get("content-type");
        console.log("Response content type:", contentType);

        // Return the image data with proper headers
        return new NextResponse(response.body, {
          headers: {
            "Content-Type": contentType || "image/jpeg",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      } catch (error) {
        console.error("Error fetching photo:", error);
        return NextResponse.json(
          { error: "Failed to fetch photo" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error proxying Google Places API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
