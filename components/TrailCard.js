"use client";

import Link from "next/link";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function TrailCard({ trail }) {
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
        <p className="text-sm text-gray-600 mb-2">{trail.park}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Difficulty</span>
            <span className="font-medium text-gray-800">
              {trail.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Distance</span>
            <span className="font-medium text-gray-800">{trail.distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="font-medium text-gray-800">{trail.duration}</span>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <span className="text-yellow-400">
            {"★".repeat(Math.floor(trail.rating))}
            {"☆".repeat(5 - Math.floor(trail.rating))}
          </span>
          <span className="text-sm text-gray-600 ml-2">({trail.rating})</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {trail.features?.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
            >
              {feature}
            </span>
          ))}
          {trail.features?.length > 3 && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              +{trail.features.length - 3} more
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
