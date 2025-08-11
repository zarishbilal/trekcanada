"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dist/shared/lib/dynamic";

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import("react-map-gl").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

const Source = dynamic(() => import("react-map-gl").then((mod) => mod.Source), {
  ssr: false,
});

const Layer = dynamic(() => import("react-map-gl").then((mod) => mod.Layer), {
  ssr: false,
});

const Marker = dynamic(() => import("react-map-gl").then((mod) => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import("react-map-gl").then((mod) => mod.Popup), {
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

const TrailsMapView = ({ trails }) => {
  const router = useRouter();
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [hoveredTrail, setHoveredTrail] = useState(null);

  // Calculate the center of all trails for initial map view
  const mapCenter = useMemo(() => {
    if (!trails || trails.length === 0) {
      return {
        latitude: 51.0447,
        longitude: -114.0719, // Calgary, Alberta as default center for Canadian trails
        zoom: 5,
      };
    }

    const validTrails = trails.filter(
      (trail) => trail.geometry?.coordinates?.length > 0
    );

    if (validTrails.length === 0) {
      return {
        latitude: 51.0447,
        longitude: -114.0719,
        zoom: 5,
      };
    }

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    validTrails.forEach((trail) => {
      trail.geometry.coordinates.forEach(([lng, lat]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate zoom level based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 5;
    if (maxDiff < 0.01) zoom = 13;
    else if (maxDiff < 0.1) zoom = 10;
    else if (maxDiff < 1) zoom = 8;
    else if (maxDiff < 5) zoom = 6;

    return {
      latitude: centerLat,
      longitude: centerLng,
      zoom: zoom,
    };
  }, [trails]);

  const [viewState, setViewState] = useState(mapCenter);

  // Handle trail marker click
  const handleTrailClick = useCallback(
    (trail) => {
      router.push(`/trails/${trail.id}`);
    },
    [router]
  );

  // Get trail start coordinates for markers
  const trailMarkers = useMemo(() => {
    if (!trails) return [];

    return trails
      .filter((trail) => trail.geometry?.coordinates?.length > 0)
      .map((trail) => {
        const [lng, lat] = trail.geometry.coordinates[0];
        return {
          ...trail,
          lat,
          lng,
        };
      });
  }, [trails]);

  // Create GeoJSON for trail paths
  const trailsGeoJSON = useMemo(() => {
    if (!trails) return null;

    const features = trails
      .filter((trail) => trail.geometry?.coordinates?.length > 0)
      .map((trail) => ({
        type: "Feature",
        properties: {
          id: trail.id,
          name: trail.name,
          difficulty: trail.difficulty,
        },
        geometry: {
          type: "LineString",
          coordinates: trail.geometry.coordinates,
        },
      }));

    return {
      type: "FeatureCollection",
      features,
    };
  }, [trails]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">
          Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your
          .env.local file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {/* Trail paths */}
        {trailsGeoJSON && (
          <Source type="geojson" data={trailsGeoJSON}>
            <Layer
              id="trails"
              type="line"
              paint={{
                "line-color": [
                  "case",
                  ["==", ["get", "difficulty"], "easy"],
                  "#10B981", // green
                  ["==", ["get", "difficulty"], "moderate"],
                  "#F59E0B", // yellow
                  ["==", ["get", "difficulty"], "difficult"],
                  "#EF4444", // red
                  "#6B7280", // gray default
                ],
                "line-width": 3,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}

        {/* Trail markers */}
        {trailMarkers.map((trail) => (
          <Marker
            key={trail.id}
            longitude={trail.lng}
            latitude={trail.lat}
            anchor="bottom"
          >
            <div
              className={`cursor-pointer transition-transform duration-200 ${
                hoveredTrail === trail.id ? "scale-125" : "scale-100"
              }`}
              onMouseEnter={() => setHoveredTrail(trail.id)}
              onMouseLeave={() => setHoveredTrail(null)}
              onClick={() => handleTrailClick(trail)}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                  trail.difficulty === "easy"
                    ? "bg-green-500"
                    : trail.difficulty === "moderate"
                    ? "bg-yellow-500"
                    : trail.difficulty === "difficult"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              />
            </div>
          </Marker>
        ))}

        {/* Popup for hovered trail */}
        {hoveredTrail && (
          <Popup
            longitude={trailMarkers.find((t) => t.id === hoveredTrail)?.lng}
            latitude={trailMarkers.find((t) => t.id === hoveredTrail)?.lat}
            anchor="top"
            onClose={() => setHoveredTrail(null)}
            closeButton={false}
            className="trail-popup"
          >
            {(() => {
              const trail = trailMarkers.find((t) => t.id === hoveredTrail);
              return (
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-sm text-gray-900">
                    {trail?.name}
                  </h3>
                  <div className="text-xs text-gray-600 mt-1">
                    <p>
                      {trail?.length} km • {trail?.difficulty}
                    </p>
                    <p>{trail?.park}</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Click to view details
                  </p>
                </div>
              );
            })()}
          </Popup>
        )}

        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-right" />
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Trail Difficulty
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Difficult</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailsMapView;
