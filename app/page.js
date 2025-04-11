import React from "react";
import Header from "../components/ui/Header";
import HeroSection from "../components/ui/HeroSection";
// import FeaturedTrails from "../components/FeaturedTrails";
// import AppFeatures from "../components/AppFeatures";
// import ParkHighlights from "../components/ParkHighlights";
import Footer from "../components/ui/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <FeaturedTrails />
        <AppFeatures />
        <ParkHighlights />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
