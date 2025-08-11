"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TrailCard from "@/components/TrailCard";
import SearchBar from "@/components/SearchBar";
import TrailsMapView from "@/components/TrailsMapView";
import { searchTrails, fetchTrails } from "@/services/trails";
import { ListBulletIcon, MapIcon } from "@heroicons/react/24/outline";

export default function TrailsPage() {
  const searchParams = useSearchParams();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const searchQuery = searchParams.get("search");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [lengthFilter, setLengthFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [accessibleFilter, setAccessibleFilter] = useState(false);
  const [activityFilter, setActivityFilter] = useState("");

  const filteredTrails = trails.filter((trail) => {
    if (difficultyFilter && trail.difficulty !== difficultyFilter) return false;
    if (
      seasonFilter &&
      !trail.season.toLowerCase().includes(seasonFilter.toLowerCase())
    )
      return false;
    if (lengthFilter) {
      if (lengthFilter === "short" && trail.length > 5) return false;
      if (lengthFilter === "medium" && (trail.length < 5 || trail.length > 10))
        return false;
      if (lengthFilter === "long" && trail.length < 10) return false;
    }
    if (timeFilter) {
      const durationMin = (trail.length / 4) * 60;
      if (timeFilter === "short" && durationMin > 30) return false;
      if (timeFilter === "medium" && (durationMin < 30 || durationMin > 60))
        return false;
      if (timeFilter === "long" && durationMin < 60) return false;
    }
    if (accessibleFilter) {
      const isAccessible =
        trail.width >= 1 && ["Paved", "Boardwalk"].includes(trail.surface);
      if (!isAccessible) return false;
    }
    if (activityFilter === "bike") {
      const bikeableSurfaces = ["Paved", "Gravel", "Boardwalk", "Mixed"];
      if (!bikeableSurfaces.includes(trail.surface)) return false;
    }
    return true;
  });
  const displayedTrails = searchQuery ? filteredTrails : trails;

  useEffect(() => {
    const fetchTrailsData = async () => {
      try {
        setLoading(true);
        let data;

        if (searchQuery) {
          console.log("Searching for:", searchQuery);
          data = await searchTrails(searchQuery);
          console.log("Search results:", data);
        } else {
          console.log("Fetching all trails");
          data = await fetchTrails();
          console.log("All trails:", data);
        }

        setTrails(data);
      } catch (err) {
        console.error("Error fetching trails:", err);
        setError("Failed to load trails");
      } finally {
        setLoading(false);
      }
    };

    fetchTrailsData();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Canadian Trails
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover amazing hiking trails across Canada&apos;s beautiful
            landscapes
          </p>
          {/* Search Bar */}
          <SearchBar />

          {/* View Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
                List View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MapIcon className="h-5 w-5" />
                Map View
              </button>
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results for &quot;{searchQuery}&quot;
            </h2>
            <p className="text-gray-600">
              {displayedTrails.length}{" "}
              {displayedTrails.length === 1 ? "trail" : "trails"} found
            </p>
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Filters</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <option value="">All</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Season
                  </label>
                  <select
                    value={seasonFilter}
                    onChange={(e) => setSeasonFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <option value="">All</option>
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="year-round">Year-round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Length
                  </label>
                  <select
                    value={lengthFilter}
                    onChange={(e) => setLengthFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <option value="">All</option>
                    <option value="short">0-5 km</option>
                    <option value="medium">5-10 km</option>
                    <option value="long">10+ km</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration
                  </label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <option value="">All</option>
                    <option value="short">0-30 min</option>
                    <option value="medium">30-60 min</option>
                    <option value="long">60+ min</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Activity
                  </label>
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <option value="">All</option>
                    <option value="walk">Walk</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="accessibleFilter"
                    checked={accessibleFilter}
                    onChange={(e) => setAccessibleFilter(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="accessibleFilter"
                    className="text-sm font-medium"
                  >
                    Accessible
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">All Trails</h2>
            <p className="text-gray-600">
              Browse {displayedTrails.length} trails across Canada
            </p>
          </div>
        )}

        {/* Content Area - List or Map View */}
        {viewMode === "list" ? (
          // List View
          displayedTrails.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery
                  ? "No trails match your search and selected filters."
                  : "No trails available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTrails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          )
        ) : (
          // Map View
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {searchQuery
                  ? `${displayedTrails.length} trails found for "${searchQuery}"`
                  : `${displayedTrails.length} trails on map`}
              </h3>
              <p className="text-sm text-gray-600">
                Click on markers to view trail details
              </p>
            </div>
            {displayedTrails.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  {searchQuery
                    ? "No trails match your search and selected filters."
                    : "No trails available to display on map."}
                </p>
              </div>
            ) : (
              <TrailsMapView trails={displayedTrails} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
