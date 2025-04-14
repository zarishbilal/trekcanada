"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import TrailCard from "@/components/TrailCard";
import { fetchTrails } from "@/services/trails";

export default function Home() {
  const [featuredTrails, setFeaturedTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedTrails = async () => {
      try {
        setLoading(true);
        const allTrails = await fetchTrails();

        // Get current season
        const currentMonth = new Date().getMonth();
        const currentSeason =
          currentMonth >= 5 && currentMonth <= 9 ? "summer" : "winter";

        // Filter trails for current season and sort by length (as a proxy for popularity)
        const seasonalTrails = allTrails
          .filter((trail) => {
            const trailSeason = trail.season.toLowerCase();
            return currentSeason === "summer"
              ? trailSeason.includes("summer") || trailSeason.includes("all")
              : trailSeason.includes("winter") || trailSeason.includes("all");
          })
          .sort((a, b) => b.length - a.length) // Sort by length as a proxy for popularity
          .slice(0, 3); // Get top 3 trails

        setFeaturedTrails(seasonalTrails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTrails();
  }, []);

  return (
    <div>
      <HeroSection />

      {/* Featured Trails Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Most Popular{" "}
              {new Date().getMonth() >= 5 && new Date().getMonth() <= 9
                ? "Summer"
                : "Winter"}{" "}
              Trails
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the most visited trails this season across Canada's
              national parks.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-text-primary">
                Loading featured trails...
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">
                Error loading featured trails: {error}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTrails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
