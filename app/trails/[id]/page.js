"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchTrailById } from "@/services/trails";
import { searchTrailPlace } from "@/services/googlePlaces";
import TrailMap from "@/components/TrailMap";
import { reverseGeocode } from "@/services/geocoding";
import Image from "next/image";

export default function TrailPage() {
  const params = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [googleData, setGoogleData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch trail data...");

        const trailData = await fetchTrailById(params.id);
        console.log("Fetched trail data:", trailData);
        setTrail(trailData);

        // If we have coordinates but no address, try to get the address
        if (trailData.geometry?.coordinates && !trailData.address) {
          console.log("Fetching address from coordinates...");
          const firstCoord = trailData.geometry.coordinates[0];
          const address = await reverseGeocode(firstCoord[0], firstCoord[1]);
          console.log("Fetched address:", address);
          setLocationDetails(address);
        }

        // Fetch Google Places data if API key is available
        if (
          trailData.geometry?.coordinates &&
          process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
        ) {
          console.log("Starting Google Places fetch...");
          const firstCoord = trailData.geometry.coordinates[0];
          const googleData = await searchTrailPlace(
            trailData.name,
            trailData.park,
            firstCoord
          );
          console.log("Google Places data received:", googleData);
          if (googleData?.photos) {
            console.log("Number of photos:", googleData.photos.length);
            console.log("First photo data:", googleData.photos[0]);
          }
          setGoogleData(googleData);
        } else {
          console.log("Skipping Google Places fetch:", {
            hasCoordinates: !!trailData.geometry?.coordinates,
            hasApiKey: !!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
          });
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Trail not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Trail Header */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{trail.name}</h1>
            <div className="mt-2 flex items-center text-gray-600">
              <span className="mr-4">{trail.park}</span>
              <span className="mr-4">{trail.province}</span>
              <span className="mr-4">{trail.length} km</span>
              <span className="mr-4">{trail.difficulty}</span>
              <span>{trail.surface}</span>
            </div>
          </div>

          {/* Trail Map */}
          <div className="h-[400px] w-full">
            <TrailMap trail={trail} />
          </div>

          {/* Trail Description */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600">{trail.description}</p>
          </div>

          {/* Location Details */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location
            </h2>
            <div className="flex items-start">
              <svg
                className="h-6 w-6 text-gray-400 mr-2 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-gray-900 font-medium">{trail.park}</p>
                <p className="text-gray-600">{trail.province}</p>
                {locationDetails && (
                  <p className="text-gray-600">{locationDetails.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Google Places Photos */}
          {googleData?.photos && googleData.photos.length > 0 ? (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Photos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {googleData.photos.map((photo, index) => {
                  console.log(`Rendering photo ${index}:`, photo);

                  if (!photo.photo_reference) {
                    console.warn(`Photo ${index} has no photo_reference`);
                    return null;
                  }

                  const imageUrl = `/api/places?endpoint=photo&photo_reference=${photo.photo_reference}&maxwidth=800`;
                  console.log(
                    `Generated image URL for photo ${index}:`,
                    imageUrl
                  );

                  return (
                    <div
                      key={index}
                      className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${trail.name} photo ${index + 1}`}
                        fill
                        className="object-cover z-10 opacity-0 duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 2}
                        quality={75}
                        onLoad={(e) => {
                          console.log(`Photo ${index} loaded successfully`);
                          e.target.classList.add("image-loaded");
                        }}
                        onError={(e) => {
                          console.error(`Error loading photo ${index}:`, {
                            error: e,
                            url: e.target.src,
                            photoData: photo,
                          });
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? (
            <div className="p-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                To view trail photos and reviews, please add your Google Places
                API key to the .env.local file.
              </p>
            </div>
          ) : null}

          {/* Google Places Reviews */}
          {googleData?.reviews && googleData.reviews.length > 0 ? (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Reviews
              </h2>
              <div className="space-y-4">
                {googleData.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 image-container">
                        {review.profilePhoto && (
                          <Image
                            src={review.profilePhoto}
                            alt={review.author}
                            fill
                            className="object-cover z-10 opacity-0 duration-300"
                            sizes="40px"
                            quality={75}
                            onLoad={(e) => {
                              e.target.classList.add("image-loaded");
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.author}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            {review.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
