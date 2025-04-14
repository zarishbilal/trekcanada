"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TrailCard from "@/components/TrailCard";
import { searchTrails, fetchTrails } from "@/services/trails";

export default function TrailsPage() {
  const searchParams = useSearchParams();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchQuery = searchParams.get("search");

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
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-600">
              {trails.length} {trails.length === 1 ? "trail" : "trails"} found
            </p>
          </div>
        )}

        {trails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery
                ? "No trails found matching your search."
                : "No trails available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
