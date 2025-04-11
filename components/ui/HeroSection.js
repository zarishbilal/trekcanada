"use client";
import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1621491527329-0c1f53f4ab38')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative container mx-auto px-4 py-32 md:py-48 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Discover Canada's Most Beautiful{" "}
          <span className="text-park-yellow">Trails</span>
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mb-10">
          Explore national parks, find the perfect hiking routes, and plan your
          next adventure with real-time trail conditions.
        </p>

        <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row p-1">
            <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="block text-sm font-medium text-gray-500 mb-1 text-left">
                Park
              </label>
              <div className="flex">
                <select className="block w-full bg-transparent text-gray-900 focus:outline-none">
                  <option>Banff National Park</option>
                  <option>Jasper National Park</option>
                  <option>Yoho National Park</option>
                  <option>Pacific Rim National Park</option>
                </select>
                <ChevronDown size={20} className="text-gray-400 mt-1" />
              </div>
            </div>

            <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200">
              <label className="block text-sm font-medium text-gray-500 mb-1 text-left">
                Difficulty
              </label>
              <div className="flex">
                <select className="block w-full bg-transparent text-gray-900 focus:outline-none">
                  <option>Any Difficulty</option>
                  <option>Easy</option>
                  <option>Moderate</option>
                  <option>Difficult</option>
                </select>
                <ChevronDown size={20} className="text-gray-400 mt-1" />
              </div>
            </div>

            <div className="flex-1 p-3">
              <label className="block text-sm font-medium text-gray-500 mb-1 text-left">
                Trail Length
              </label>
              <div className="flex">
                <select className="block w-full bg-transparent text-gray-900 focus:outline-none">
                  <option>Any Length</option>
                  <option>Under 3 km</option>
                  <option>3-7 km</option>
                  <option>Over 7 km</option>
                </select>
                <ChevronDown size={20} className="text-gray-400 mt-1" />
              </div>
            </div>

            <Button className="m-1 bg-park-green hover:bg-park-green-light text-white py-6 px-6">
              <Search className="mr-2" size={20} /> Find Trails
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-bounce-subtle">
          <ChevronDown size={40} className="text-white" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
