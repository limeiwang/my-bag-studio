import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import StudioPage from "./components/StudioPage";

type View = "landing" | "studio";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");

  const handleEnterStudio = () => {
    setCurrentView("studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnterBrand = () => {
    setCurrentView("landing");
    setTimeout(() => {
      document.getElementById("brand-story")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] font-sans">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Structured Multi-Screen Routing */}
      {currentView === "landing" && (
        <LandingPage onEnterStudio={handleEnterStudio} onEnterBrand={handleEnterBrand} />
      )}
      {currentView === "studio" && <StudioPage />}
    </div>
  );
}
