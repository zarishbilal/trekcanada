"use client";

import { useState } from "react";

export default function TrailDetail({ params }) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isOfflineMapDownloaded, setIsOfflineMapDownloaded] = useState(false);

  // This would be fetched from an API in a real implementation
  const trailData = {
    name: "Johnston Canyon Trail",
    park: "Banff National Park",
    difficulty: "Moderate",
    distance: "5.2 km",
    duration: "2 hours",
    elevationGain: "120 m",
    rating: 4.2,
    reviews: 128,
    description:
      "A beautiful trail featuring waterfalls, canyon views, and forested areas. The trail is well-maintained and suitable for most skill levels.",
    features: [
      "Waterfalls",
      "Canyon Views",
      "Forested Areas",
      "Wildlife Viewing",
    ],
    conditions: {
      status: "Open",
      weather: "Sunny",
      temperature: "18°C",
      crowdLevel: "Moderate",
    },
    accessibility: [
      "No stairs",
      "Dog-friendly",
      "Kid-friendly",
      "Stroller accessible",
    ],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {trailData.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{trailData.park}</p>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-yellow-400 text-2xl">★★★★☆</span>
              <span className="text-gray-600">
                ({trailData.rating}) • {trailData.reviews} reviews
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-semibold">{trailData.difficulty}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Distance</p>
                <p className="font-semibold">{trailData.distance}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{trailData.duration}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Elevation Gain</p>
                <p className="font-semibold">{trailData.elevationGain}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600">{trailData.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Trail Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {trailData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Accessibility
              </h2>
              <div className="flex flex-wrap gap-2">
                {trailData.accessibility.map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="sticky top-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Current Conditions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold text-green-600">
                      {trailData.conditions.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weather</span>
                    <span className="font-semibold">
                      {trailData.conditions.weather}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="font-semibold">
                      {trailData.conditions.temperature}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crowd Level</span>
                    <span className="font-semibold">
                      {trailData.conditions.crowdLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Trail Map
                </h3>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src="/trail-map-placeholder.jpg"
                    alt="Trail Map"
                    className={`rounded-lg object-cover ${
                      isMapExpanded ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                  />
                </div>
                <button
                  className={`w-full py-2 px-4 rounded-md ${
                    isOfflineMapDownloaded
                      ? "bg-gray-200 text-gray-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  onClick={() => setIsOfflineMapDownloaded(true)}
                  disabled={isOfflineMapDownloaded}
                >
                  {isOfflineMapDownloaded
                    ? "Map Downloaded"
                    : "Download Offline Map"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
