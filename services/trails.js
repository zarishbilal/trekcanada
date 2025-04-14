const BASE_URL =
  "https://services2.arcgis.com/wCOMu5IS7YdSyPNx/arcgis/rest/services/vw_Trails_Sentiers_APCA_V2_FGP/FeatureServer/0";

export const fetchTrails = async (params = {}) => {
  try {
    // Default parameters
    const defaultParams = {
      where: "1=1",
      outFields: "*", // Request all fields to see what's available
      f: "json",
      returnGeometry: true,
    };

    // Merge default and provided parameters
    const queryParams = new URLSearchParams({ ...defaultParams, ...params });
    const url = `${BASE_URL}/query?${queryParams.toString()}`;

    console.log("🔍 Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch trails: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Log the complete response structure
    console.log("📦 API Response Structure:", {
      hasFeatures: !!data.features,
      hasResults: !!data.results,
      featureCount: data.features?.length || 0,
      resultCount: data.results?.length || 0,
      firstFeatureKeys: data.features?.[0] ? Object.keys(data.features[0]) : [],
      firstFeatureAttributes: data.features?.[0]?.attributes
        ? Object.keys(data.features[0].attributes)
        : [],
    });

    // Check if the response has the expected structure
    if (!data) {
      console.error("❌ Empty API response");
      throw new Error("Empty API response");
    }

    // Check for error in response
    if (data.error) {
      console.error("❌ API Error:", data.error);
      throw new Error(data.error.message || "API Error");
    }

    // The response might have a different structure than expected
    const features = data.features || data.results || [];
    if (!Array.isArray(features)) {
      console.error("❌ Unexpected features format:", features);
      throw new Error("Invalid features format");
    }

    // Log the first feature's attributes if available
    if (features.length > 0) {
      const firstFeature = features[0];
      console.log("🔍 First Feature Attributes:", {
        ...firstFeature.attributes,
        geometry: firstFeature.geometry ? "Geometry present" : "No geometry",
      });

      // Log all available field names
      console.log("📋 Available Fields:", Object.keys(firstFeature.attributes));

      // Log the geometry structure
      if (firstFeature.geometry) {
        console.log("🗺️ Geometry Structure:", {
          type: firstFeature.geometry.type,
          hasCoordinates: !!firstFeature.geometry.coordinates,
          coordinateCount: firstFeature.geometry.coordinates?.length,
          firstCoordinate: firstFeature.geometry.coordinates?.[0],
        });
      }
    }

    // Transform the data into our application's format
    return features.map((feature) => {
      const attributes = feature.attributes || feature.properties || {};

      // Extract coordinates from geometry
      let coordinates = null;
      if (feature.geometry?.paths) {
        // ArcGIS polyline format
        coordinates = feature.geometry.paths[0];
      } else if (feature.geometry?.coordinates) {
        // GeoJSON format
        coordinates = feature.geometry.coordinates;
      }

      // Transform coordinates from ArcGIS format to standard lat/lng
      if (coordinates) {
        coordinates = coordinates.map((coord) => {
          // Convert from Web Mercator to WGS84 (standard lat/lng)
          const x = coord[0];
          const y = coord[1];

          // Transformation formula for Web Mercator to WGS84
          const lng = (x / 20037508.34) * 180;
          const lat =
            (Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * 360) / Math.PI -
            90;

          return [lng, lat];
        });

        // Log the first coordinate for debugging
        console.log("Original coordinate:", coordinates[0]);
        console.log("Transformed coordinate:", coordinates[0]);
      }

      // Log the raw length value from the first feature
      if (feature === features[0]) {
        console.log("📏 Raw Length Values:", {
          allAttributes: attributes,
          potentialLengthFields: Object.entries(attributes).filter(
            ([key, value]) =>
              key.toLowerCase().includes("length") ||
              key.toLowerCase().includes("km") ||
              key.toLowerCase().includes("meters")
          ),
        });
      }

      // Try to find a valid length value by checking all numeric fields
      const numericFields = Object.entries(attributes)
        .filter(([_, value]) => typeof value === "number" && value > 0)
        .map(([key, value]) => ({ key, value }));

      console.log("🔢 Numeric Fields:", numericFields);

      const length = numericFields.length > 0 ? numericFields[0].value : 0;

      return {
        id: attributes.OBJECTID || Math.random().toString(36).substr(2, 9),
        name:
          attributes.Name_Official_e ||
          attributes.Nom_Officiel_f ||
          "Unnamed Trail",
        description:
          attributes.Comments_Commentaires || "No description available",
        length: length,
        width: attributes.Width_Largeur_m || 0,
        surface: getSurfaceType(attributes.Surface),
        difficulty: getDifficulty(
          attributes.Profile_Pente,
          attributes.Obstacles
        ),
        season: getSeason(
          attributes.Summer_Type_Été,
          attributes.Winter_Type_Hiver
        ),
        url: attributes.URL_e || attributes.URL_f || "",
        geometry: coordinates
          ? {
              type: "LineString",
              coordinates: coordinates,
            }
          : null,
        park:
          attributes.Park_Name_e ||
          attributes.Park_Name_f ||
          attributes.ParkName ||
          attributes.Park ||
          "Unknown Park",
        province:
          attributes.Province ||
          attributes.Province_Territory ||
          attributes.ProvinceTerritory ||
          "Unknown Province",
        address: attributes.Address || attributes.Location || null,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching trails:", error);
    throw error;
  }
};

export const fetchTrailById = async (id) => {
  try {
    const trails = await fetchTrails({
      where: `OBJECTID=${id}`,
    });

    if (trails.length === 0) {
      throw new Error("Trail not found");
    }

    return trails[0];
  } catch (error) {
    console.error("Error fetching trail by ID:", error);
    throw error;
  }
};

// Helper functions to transform API data
const getSurfaceType = (code) => {
  if (code === undefined || code === null) return "Unknown";

  const types = {
    1: "Paved",
    2: "Gravel",
    3: "Natural",
    4: "Boardwalk",
    5: "Mixed",
  };
  return types[code] || "Unknown";
};

const getDifficulty = (profile, obstacles) => {
  if (profile === undefined || obstacles === undefined) return "moderate";

  if (profile === 1 && obstacles === 1) return "easy";
  if (profile === 3 || obstacles === 3) return "difficult";
  return "moderate";
};

const getSeason = (summer, winter) => {
  const seasons = [];
  if (summer) seasons.push("Summer");
  if (winter) seasons.push("Winter");
  return seasons.join(", ") || "Year-round";
};

export async function searchTrails(query) {
  try {
    // Get all trails first
    const allTrails = await fetchTrails();

    // Filter trails based on the search query
    const searchResults = allTrails.filter((trail) => {
      const searchLower = query.toLowerCase();
      return (
        trail.name.toLowerCase().includes(searchLower) ||
        trail.park.toLowerCase().includes(searchLower) ||
        trail.province.toLowerCase().includes(searchLower) ||
        trail.description.toLowerCase().includes(searchLower)
      );
    });

    return searchResults;
  } catch (error) {
    console.error("Error searching trails:", error);
    throw error;
  }
}
