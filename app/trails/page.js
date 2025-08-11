"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TrailCard from "@/components/TrailCard";
import SearchBar from "@/components/SearchBar";
import TrailsMapView from "@/components/TrailsMapView";
import { searchTrails, fetchTrails } from "@/services/trails";
import {
  MapIcon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function TrailsPage() {
  const searchParams = useSearchParams();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchQuery = searchParams.get("search");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [lengthFilter, setLengthFilter] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [accessibleFilter, setAccessibleFilter] = useState(false);
  const [activityFilter, setActivityFilter] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "map"
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrails = trails.filter((trail) => {
    if (difficultyFilter && trail.difficulty !== difficultyFilter) return false;
    if (
      seasonFilter &&
      !trail.season.toLowerCase().includes(seasonFilter.toLowerCase())
    )
      return false;

    // Length filtering with custom range
    if (lengthFilter === "custom") {
      const min = parseFloat(minLength) || 0;
      const max = parseFloat(maxLength) || Infinity;
      if (trail.length < min || trail.length > max) return false;
    } else if (lengthFilter) {
      if (lengthFilter === "short" && trail.length > 5) return false;
      if (lengthFilter === "medium" && (trail.length < 5 || trail.length > 15))
        return false;
      if (lengthFilter === "long" && trail.length < 15) return false;
    }

    if (timeFilter) {
      const durationMin = (trail.length / 4) * 60; // Estimate: 4 km/h hiking speed

      if (timeFilter === "custom") {
        const min = parseFloat(minDuration) || 0;
        const max = parseFloat(maxDuration) || Infinity;
        if (durationMin < min || durationMin > max) return false;
      } else {
        if (timeFilter === "short" && durationMin > 30) return false;
        if (timeFilter === "medium" && (durationMin < 30 || durationMin > 120))
          return false;
        if (timeFilter === "long" && durationMin < 120) return false;
      }
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
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ListBulletIcon className="h-4 w-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <MapIcon className="h-4 w-4" />
              Map View
            </button>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Search Results for &quot;{searchQuery}&quot;
                </h2>
                <p className="text-gray-600">
                  {displayedTrails.length}{" "}
                  {displayedTrails.length === 1 ? "trail" : "trails"} found
                </p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {showFilters && (
              <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="flex flex-wrap gap-4 items-start">
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
                      onChange={(e) => {
                        setLengthFilter(e.target.value);
                        // Reset custom inputs when switching away from custom
                        if (e.target.value !== "custom") {
                          setMinLength("");
                          setMaxLength("");
                        }
                      }}
                      className="border border-gray-300 rounded-md p-1 mb-2"
                    >
                      <option value="">All</option>
                      <option value="short">Short (0-5 km)</option>
                      <option value="medium">Medium (5-15 km)</option>
                      <option value="long">Long (15+ km)</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    {lengthFilter === "custom" && (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Min km"
                          value={minLength}
                          onChange={(e) => setMinLength(e.target.value)}
                          className="border border-gray-300 rounded-md p-1 w-20 text-sm"
                          min="0"
                          step="0.1"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <input
                          type="number"
                          placeholder="Max km"
                          value={maxLength}
                          onChange={(e) => setMaxLength(e.target.value)}
                          className="border border-gray-300 rounded-md p-1 w-20 text-sm"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration
                    </label>
                    <select
                      value={timeFilter}
                      onChange={(e) => {
                        setTimeFilter(e.target.value);
                        // Reset custom inputs when switching away from custom
                        if (e.target.value !== "custom") {
                          setMinDuration("");
                          setMaxDuration("");
                        }
                      }}
                      className="border border-gray-300 rounded-md p-1 mb-2"
                    >
                      <option value="">All</option>
                      <option value="short">Short (0-30 min)</option>
                      <option value="medium">Medium (30min-2h)</option>
                      <option value="long">Long (2+ hours)</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    {timeFilter === "custom" && (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minDuration}
                          onChange={(e) => setMinDuration(e.target.value)}
                          className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                          min="0"
                          step="5"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxDuration}
                          onChange={(e) => setMaxDuration(e.target.value)}
                          className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                          min="0"
                          step="5"
                        />
                        <span className="text-xs text-gray-500">min</span>
                      </div>
                    )}
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
                  <div className="flex items-center gap-2 mt-6">
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
            )}
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
