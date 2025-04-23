"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import { getFavorites } from "../_utils/favorites";
import { fetchTrailById } from "@/services/trails";
import TrailCard from "@/components/TrailCard";

export default function FavoritesPage() {
  const { user } = useUserAuth();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setTrails([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const favIds = await getFavorites(user.uid);
      const trailPromises = favIds.map((id) => fetchTrailById(id));
      const results = await Promise.all(trailPromises);
      setTrails(results);
      setLoading(false);
    }
    loadFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-700">
          Please sign in to view your favorite trails.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-700">Loading favorites...</p>
      </div>
    );
  }

  if (trails.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-700">
          You haven&apos;t added any favorites yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Your Favorite Trails
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      </div>
    </div>
  );
}
