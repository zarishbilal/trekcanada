"use client";

import Link from "next/link";
import Card from "./ui/Card";
import Button from "./ui/Button";

// Helper function to calculate estimated duration
function calculateDuration(length) {
  // Average hiking speed: 4 km/h
  const hours = length / 4;
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${Math.round(hours * 10) / 10} h`;
}

export default function TrailCard({ trail }) {
  const duration = calculateDuration(trail.length);

  return (
    <Link href={`/trails/${trail.id}`} className="block">
      <Card variant="elevated" className="h-full">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <img
            src={trail.image || "/trail-placeholder.jpg"}
            alt={trail.name}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
        <h4 className="font-semibold text-lg text-gray-800">{trail.name}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{trail.park}</span>
          <span>•</span>
          <span>{trail.province}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Difficulty</span>
            <span className="font-medium text-gray-800 capitalize">
              {trail.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Distance</span>
            <span className="font-medium text-gray-800">{trail.length} km</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="font-medium text-gray-800">{duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {trail.surface && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {trail.surface}
            </span>
          )}
          {trail.season && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {trail.season}
            </span>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </Card>
    </Link>
  );
}
