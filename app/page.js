"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

        // Filter trails for current season, length < 2km, and sort by length (as a proxy for popularity)
        const seasonalTrails = allTrails
          .filter((trail) => {
            const trailSeason = trail.season.toLowerCase();
            const isSeasonMatch =
              currentSeason === "summer"
                ? trailSeason.includes("summer") || trailSeason.includes("all")
                : trailSeason.includes("winter") || trailSeason.includes("all");

            // Only include trails less than 2 km
            const trailLength = parseFloat(trail.length);
            const isShortTrail = trailLength < 2;

            console.log(
              `Trail: ${trail.name}, Length: ${trail.length} (${trailLength}), Is Short: ${isShortTrail}, Season Match: ${isSeasonMatch}`
            );

            return isSeasonMatch && isShortTrail;
          })
          .sort((a, b) => parseFloat(b.length) - parseFloat(a.length)) // Sort by length as a proxy for popularity
          .slice(0, 3); // Get top 3 trails

        console.log(
          "Featured trails:",
          seasonalTrails.map((t) => ({ name: t.name, length: t.length }))
        );

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
              Discover the most visited trails this season across Canada&apos;s
              National Parks.
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredTrails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>

              {/* View All Trails Button */}
              <div className="text-center">
                <Link
                  href="/trails"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                >
                  View All Trails
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
