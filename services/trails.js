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
      console.log("🔍 Raw First Feature:", firstFeature);
      console.log("🔍 All Attributes:", firstFeature.attributes);

      // Log all available field names
      const allFields = Object.keys(firstFeature.attributes);
      console.log("📋 All Available Fields:", allFields);

      // Log any fields that might contain park or location information
      const locationFields = allFields.filter(
        (field) =>
          field.toLowerCase().includes("park") ||
          field.toLowerCase().includes("location") ||
          field.toLowerCase().includes("province") ||
          field.toLowerCase().includes("territory")
      );
      console.log("📍 Potential Location Fields:", locationFields);

      // Log the values of these fields
      const locationValues = {};
      locationFields.forEach((field) => {
        locationValues[field] = firstFeature.attributes[field];
      });
      console.log("📍 Location Field Values:", locationValues);
    }

    // Transform the data into our application's format
    return features.map((feature) => {
      const attributes = feature.attributes || feature.properties || {};

      // Extract coordinates from geometry
      let coordinates = null;
      if (feature.geometry?.paths) {
        coordinates = feature.geometry.paths[0];
      } else if (feature.geometry?.coordinates) {
        coordinates = feature.geometry.coordinates;
      }

      // Transform coordinates from ArcGIS format to standard lat/lng
      if (coordinates) {
        coordinates = coordinates.map((coord) => {
          const x = coord[0];
          const y = coord[1];
          const lng = (x / 20037508.34) * 180;
          const lat =
            (Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * 360) / Math.PI -
            90;
          return [lng, lat];
        });
      }

      // Use Shape__Length (in meters) to determine total length and convert to kilometers
      const lengthMeters =
        typeof attributes.Shape__Length === "number"
          ? attributes.Shape__Length
          : 0;
      const length = Number((lengthMeters / 1000).toFixed(1));

      // Get park and province information based on coordinates
      let parkName = null;
      let provinceName = null;

      if (coordinates && coordinates.length > 0) {
        // Get the first coordinate (start of trail)
        const [longitude, latitude] = coordinates[0];

        // Map of park boundaries (simplified for now)
        const parkBoundaries = {
          "Banff National Park": {
            minLat: 51.0,
            maxLat: 52.0,
            minLng: -116.5,
            maxLng: -115.0,
            province: "Alberta",
          },
          "Jasper National Park": {
            minLat: 52.5,
            maxLat: 53.5,
            minLng: -118.5,
            maxLng: -117.0,
            province: "Alberta",
          },
          "Yoho National Park": {
            minLat: 51.0,
            maxLat: 52.0,
            minLng: -117.0,
            maxLng: -116.0,
            province: "British Columbia",
          },
          "Kootenay National Park": {
            minLat: 50.5,
            maxLat: 51.5,
            minLng: -116.5,
            maxLng: -115.0,
            province: "British Columbia",
          },
          "Waterton Lakes National Park": {
            minLat: 48.5,
            maxLat: 49.5,
            minLng: -114.0,
            maxLng: -113.0,
            province: "Alberta",
          },
          "Pacific Rim National Park": {
            minLat: 48.5,
            maxLat: 49.5,
            minLng: -125.5,
            maxLng: -124.0,
            province: "British Columbia",
          },
          "Gros Morne National Park": {
            minLat: 49.0,
            maxLat: 50.0,
            minLng: -58.0,
            maxLng: -57.0,
            province: "Newfoundland and Labrador",
          },
        };

        // Find which park the coordinates fall within
        for (const [park, bounds] of Object.entries(parkBoundaries)) {
          if (
            latitude >= bounds.minLat &&
            latitude <= bounds.maxLat &&
            longitude >= bounds.minLng &&
            longitude <= bounds.maxLng
          ) {
            parkName = park;
            provinceName = bounds.province;
            break;
          }
        }
      }

      // Log the raw values for debugging
      console.log("📍 Trail Location Info:", {
        name: attributes.Name_Official_e || attributes.Nom_Officiel_f,
        parkName,
        provinceName,
        coordinates: coordinates ? coordinates[0] : null,
        allAttributes: attributes,
      });

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
        park: parkName || "Unknown Park",
        province: provinceName || "Unknown Province",
        trailSystem: attributes.Trail_system_reseau_de_sentiers || null,
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

      // Search in basic trail information
      const basicSearch =
        trail.name.toLowerCase().includes(searchLower) ||
        trail.park.toLowerCase().includes(searchLower) ||
        trail.province.toLowerCase().includes(searchLower) ||
        trail.description.toLowerCase().includes(searchLower) ||
        trail.difficulty.toLowerCase().includes(searchLower) ||
        trail.surface.toLowerCase().includes(searchLower) ||
        trail.season.toLowerCase().includes(searchLower);

      // Search for specific keywords and attributes
      const keywordSearch =
        // Dog-friendly trails (assume paved/boardwalk surfaces are more dog-friendly)
        (searchLower.includes("dog") &&
          ["paved", "boardwalk", "gravel"].includes(
            trail.surface.toLowerCase()
          )) ||
        // Family-friendly (easy difficulty, shorter trails)
        (searchLower.includes("family") &&
          (trail.difficulty === "easy" || trail.length <= 5)) ||
        // Wheelchair accessible
        ((searchLower.includes("wheelchair") ||
          searchLower.includes("accessible")) &&
          ["paved", "boardwalk"].includes(trail.surface.toLowerCase()) &&
          trail.width >= 1) ||
        // Bike-friendly trails
        ((searchLower.includes("bike") || searchLower.includes("cycling")) &&
          ["paved", "gravel", "boardwalk", "mixed"].includes(
            trail.surface.toLowerCase()
          )) ||
        // Water features (check if description mentions water-related terms)
        ((searchLower.includes("water") ||
          searchLower.includes("lake") ||
          searchLower.includes("river") ||
          searchLower.includes("falls") ||
          searchLower.includes("creek")) &&
          (trail.description.toLowerCase().includes("water") ||
            trail.description.toLowerCase().includes("lake") ||
            trail.description.toLowerCase().includes("river") ||
            trail.description.toLowerCase().includes("falls") ||
            trail.description.toLowerCase().includes("creek") ||
            trail.name.toLowerCase().includes("lake") ||
            trail.name.toLowerCase().includes("river") ||
            trail.name.toLowerCase().includes("falls") ||
            trail.name.toLowerCase().includes("creek"))) ||
        // Mountain/scenic views
        ((searchLower.includes("mountain") ||
          searchLower.includes("scenic") ||
          searchLower.includes("view")) &&
          (trail.description.toLowerCase().includes("mountain") ||
            trail.description.toLowerCase().includes("scenic") ||
            trail.description.toLowerCase().includes("view") ||
            trail.name.toLowerCase().includes("mountain") ||
            trail.name.toLowerCase().includes("view"))) ||
        // City/location based searches (check coordinates against major Canadian cities)
        (searchLower.includes("calgary") && isNearCity(trail, "calgary")) ||
        (searchLower.includes("vancouver") && isNearCity(trail, "vancouver")) ||
        (searchLower.includes("toronto") && isNearCity(trail, "toronto")) ||
        (searchLower.includes("montreal") && isNearCity(trail, "montreal")) ||
        (searchLower.includes("ottawa") && isNearCity(trail, "ottawa")) ||
        (searchLower.includes("edmonton") && isNearCity(trail, "edmonton")) ||
        // Province searches
        (searchLower.includes("alberta") &&
          trail.province.toLowerCase().includes("alberta")) ||
        (searchLower.includes("bc") &&
          trail.province.toLowerCase().includes("british columbia")) ||
        (searchLower.includes("british columbia") &&
          trail.province.toLowerCase().includes("british columbia")) ||
        (searchLower.includes("ontario") &&
          trail.province.toLowerCase().includes("ontario")) ||
        (searchLower.includes("quebec") &&
          trail.province.toLowerCase().includes("quebec"));

      return basicSearch || keywordSearch;
    });

    return searchResults;
  } catch (error) {
    console.error("Error searching trails:", error);
    throw error;
  }
}

// Helper function to check if trail is near a major city
function isNearCity(trail, city) {
  if (!trail.geometry?.coordinates || trail.geometry.coordinates.length === 0) {
    return false;
  }

  const [lng, lat] = trail.geometry.coordinates[0];

  const cityCoordinates = {
    calgary: { lat: 51.0447, lng: -114.0719, radius: 1.5 }, // 150km radius
    vancouver: { lat: 49.2827, lng: -123.1207, radius: 1.5 },
    toronto: { lat: 43.6532, lng: -79.3832, radius: 1.5 },
    montreal: { lat: 45.5017, lng: -73.5673, radius: 1.5 },
    ottawa: { lat: 45.4215, lng: -75.6972, radius: 1.0 },
    edmonton: { lat: 53.5461, lng: -113.4938, radius: 1.5 },
  };

  const cityData = cityCoordinates[city];
  if (!cityData) return false;

  // Simple distance calculation (rough approximation)
  const latDiff = Math.abs(lat - cityData.lat);
  const lngDiff = Math.abs(lng - cityData.lng);

  return latDiff <= cityData.radius && lngDiff <= cityData.radius;
}
