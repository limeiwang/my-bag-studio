import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import StudioPage from "./components/StudioPage";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "studio">("landing");

  const handleEnterStudio = () => {
    setCurrentView("studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewChange = (view: "landing" | "studio") => {
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
      {currentView === "landing" ? (
        <LandingPage onEnterStudio={handleEnterStudio} />
      ) : (
        <StudioPage />
      )}
    </div>
  );
}
