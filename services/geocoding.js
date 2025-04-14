export const reverseGeocode = async (longitude, latitude) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,place,region`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // Get the most relevant feature (usually the first one)
      const feature = data.features[0];
      return {
        address: feature.place_name,
        place: feature.text,
        region: feature.context?.find((ctx) => ctx.id.includes("region"))?.text,
        country: feature.context?.find((ctx) => ctx.id.includes("country"))
          ?.text,
      };
    }

    return null;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return null;
  }
};
