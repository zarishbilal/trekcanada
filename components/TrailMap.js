"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dist/shared/lib/dynamic";

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import("react-map-gl").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse" />
  ),
});

const Source = dynamic(() => import("react-map-gl").then((mod) => mod.Source), {
  ssr: false,
});

const Layer = dynamic(() => import("react-map-gl").then((mod) => mod.Layer), {
  ssr: false,
});

const NavigationControl = dynamic(
  () => import("react-map-gl").then((mod) => mod.NavigationControl),
  {
    ssr: false,
  }
);

const FullscreenControl = dynamic(
  () => import("react-map-gl").then((mod) => mod.FullscreenControl),
  {
    ssr: false,
  }
);

const ScaleControl = dynamic(
  () => import("react-map-gl").then((mod) => mod.ScaleControl),
  {
    ssr: false,
  }
);

const TrailMap = ({ trail }) => {
  // Default to Ottawa coordinates if no trail coordinates are available
  const defaultCoordinates = {
    latitude: 45.4215,
    longitude: -75.6972,
    zoom: 12,
  };

  // Safely get the first coordinate from the trail geometry
  const firstCoordinate = trail.geometry?.coordinates?.[0];
  const initialViewState = firstCoordinate
    ? {
        latitude: firstCoordinate[1], // latitude is the second value
        longitude: firstCoordinate[0], // longitude is the first value
        zoom: 12,
      }
    : defaultCoordinates;

  const [viewState, setViewState] = useState(initialViewState);

  // Convert trail geometry to GeoJSON format
  const trailGeoJSON = useMemo(() => {
    if (!trail.geometry?.coordinates) {
      console.log("No coordinates available for trail:", trail);
      return null;
    }

    // Validate coordinates
    const validCoordinates = trail.geometry.coordinates.filter((coord) => {
      const [lng, lat] = coord;
      return (
        typeof lng === "number" &&
        typeof lat === "number" &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });

    if (validCoordinates.length === 0) {
      console.log("No valid coordinates found in trail geometry");
      return null;
    }

    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: validCoordinates,
      },
    };
  }, [trail, trail.geometry]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">
          Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your
          .env.local file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {trailGeoJSON && (
          <Source type="geojson" data={trailGeoJSON}>
            <Layer
              id="trail"
              type="line"
              paint={{
                "line-color": "#1D7477",
                "line-width": 3,
              }}
            />
          </Source>
        )}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-right" />
      </Map>
    </div>
  );
};

export default TrailMap;
