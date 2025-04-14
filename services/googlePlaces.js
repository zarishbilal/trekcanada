const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export const searchTrailPlace = async (trailName, parkName, coordinates) => {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn(
      "Google Places API key is missing. Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your .env.local file."
    );
    return null;
  }

  try {
    // Construct search query using trail name and park name
    const query = `${trailName} ${parkName} trail`;
    const location = `${coordinates[1]},${coordinates[0]}`; // lat,lng format

    console.log("Searching for place:", { query, location });

    // First, search for the place using our proxy
    const searchResponse = await fetch(
      `/api/places?endpoint=textsearch&query=${encodeURIComponent(
        query
      )}&location=${location}`
    );

    if (!searchResponse.ok) {
      console.error(
        "Search request failed:",
        searchResponse.status,
        searchResponse.statusText
      );
      throw new Error(
        `Search request failed: ${searchResponse.status} ${searchResponse.statusText}`
      );
    }

    const searchData = await searchResponse.json();
    console.log("Search response:", searchData);

    if (searchData.status !== "OK") {
      console.warn("No results found for:", query);
      return null;
    }

    if (!searchData.results || searchData.results.length === 0) {
      console.warn("No results in search data");
      return null;
    }

    // Get the first result's place_id
    const placeId = searchData.results[0].place_id;
    console.log("Found place ID:", placeId);

    // Get detailed place information including photos and reviews
    const detailsResponse = await fetch(
      `/api/places?endpoint=details&placeId=${placeId}`
    );

    if (!detailsResponse.ok) {
      console.error(
        "Details request failed:",
        detailsResponse.status,
        detailsResponse.statusText
      );
      throw new Error(
        `Details request failed: ${detailsResponse.status} ${detailsResponse.statusText}`
      );
    }

    const detailsData = await detailsResponse.json();
    console.log("Details response:", detailsData);

    if (detailsData.status !== "OK") {
      console.warn("Failed to get place details:", detailsData.status);
      return null;
    }

    if (!detailsData.result) {
      console.warn("No result in details data");
      return null;
    }

    // Process photos
    const photos =
      detailsData.result.photos?.map((photo) => {
        console.log("Processing photo:", photo);
        return {
          photo_reference: photo.photo_reference,
          url: `/api/places?endpoint=photo&photo_reference=${photo.photo_reference}`,
          width: photo.width,
          height: photo.height,
        };
      }) || [];

    console.log("Processed photos:", photos);

    // Process reviews
    const reviews =
      detailsData.result.reviews?.map((review) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
        profilePhoto: review.profile_photo_url,
      })) || [];

    console.log("Processed reviews:", reviews);

    return {
      name: detailsData.result.name,
      address: detailsData.result.formatted_address,
      rating: detailsData.result.rating,
      photos,
      reviews,
    };
  } catch (error) {
    console.error("Error fetching Google Places data:", error);
    return null;
  }
};
