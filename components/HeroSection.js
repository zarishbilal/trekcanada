"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/trails?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeywordSearch = (keyword) => {
    router.push(`/trails?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] flex items-center pt-16 sm:pt-12 md:pt-8">
      {/* Background Image from blob */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-1.jpg" // Replace with your image path
          alt="Canadian Rockies"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>
      <div className="custom-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Discover Canada&apos;s National Parks
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Explore breathtaking trails, stunning landscapes, and unforgettable
            adventures in Canada&apos;s most beautiful natural spaces.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative mb-8 max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search trails, parks, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-24 sm:pr-28 py-4 rounded-full bg-white/90 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 sm:px-6 py-2 rounded-full hover:bg-primary-dark transition-colors text-sm sm:text-base"
            >
              Search
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 px-4">
            <button
              onClick={() => handleKeywordSearch("easy")}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 min-h-[44px] flex items-center justify-center"
            >
              Easy Trails
            </button>
            <button
              onClick={() => handleKeywordSearch("family friendly")}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 min-h-[44px] flex items-center justify-center"
            >
              Family Friendly
            </button>
            <button
              onClick={() => handleKeywordSearch("scenic views")}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 min-h-[44px] flex items-center justify-center"
            >
              Scenic Views
            </button>
            <button
              onClick={() => handleKeywordSearch("dog friendly")}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 min-h-[44px] flex items-center justify-center"
            >
              Dog Friendly
            </button>
            <button
              onClick={() => handleKeywordSearch("wheelchair accessible")}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 min-h-[44px] flex items-center justify-center"
            >
              Accessible
            </button>
            <button
              onClick={() => handleKeywordSearch("bike friendly")}
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 min-h-[44px] flex items-center justify-center"
            >
              Bike Trails
            </button>
          </div>

          {/* Featured Parks */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
