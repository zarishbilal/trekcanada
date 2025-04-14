const fs = require("fs");
const path = require("path");

const BASE_URL =
  "https://services2.arcgis.com/wCOMu5IS7YdSyPNx/arcgis/rest/services/vw_Trails_Sentiers_APCA_V2_FGP/FeatureServer/0";

async function fetchApiData() {
  try {
    const response = await fetch(
      `${BASE_URL}/query?where=1=1&outFields=*&f=json&returnGeometry=true`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Get the first trail's data
    const firstTrail = data.features[0];

    const output = {
      apiResponseStructure: {
        totalTrails: data.features.length,
        firstTrail: {
          attributes: firstTrail.attributes,
          geometry: {
            type: firstTrail.geometry.type,
            coordinateCount: firstTrail.geometry.paths[0].length,
            firstCoordinate: firstTrail.geometry.paths[0][0],
          },
        },
        availableFields: Object.keys(firstTrail.attributes),
      },
    };

    // Save to file
    const outputPath = path.join(__dirname, "api-response.json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`API response saved to ${outputPath}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchApiData();
