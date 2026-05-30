import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "studio";
  onViewChange: (view: "landing" | "studio") => void;
}

const NAV_LINKS = [
  { label: "定制", id: "features" },
  { label: "价格", id: "pricing" },
  { label: "作品", id: "gallery" },
  { label: "流程", id: "process" },
  { label: "疑问", id: "faq" },
];

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== "landing") {
      onViewChange("landing");
      setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#faf6f0]/85 backdrop-blur-[12px] transition-transform duration-[0.4s] ${
        navHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-16 flex justify-between items-center py-[1.2rem]">
        {/* Logo */}
        <button
          onClick={() => onViewChange("landing")}
          className="font-serif-sc text-2xl font-bold text-[#2c2416] cursor-pointer"
        >
          素织<span className="text-[#c4956a]">手作</span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-10 items-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="relative text-[#2c2416] font-sans text-[0.9rem] font-normal tracking-[0.05em] transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#c4956a] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          {currentView === "studio" ? (
            <button
              onClick={() => onViewChange("landing")}
              className="hidden sm:flex items-center gap-2 border border-[#2c2416] text-[#2c2416] px-[1.8rem] py-[0.6rem] rounded-full font-sans text-sm transition-all hover:bg-[#2c2416] hover:text-[#faf6f0]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              退出工作室
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onViewChange("studio");
              }}
              className="bg-[#2c2416] text-[#faf6f0] px-[1.8rem] py-[0.6rem] rounded-full font-sans text-sm transition-all hover:bg-[#c4956a] max-md:hidden"
            >
              开始定制
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-[5px] bg-none border-none cursor-pointer p-1 z-[101]"
            aria-label="菜单"
          >
            <span className={`block w-6 h-[2px] bg-[#2c2416] rounded-sm transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-x-[5px] translate-y-[5px]" : ""}`} />
            <span className={`block w-6 h-[2px] bg-[#2c2416] rounded-sm transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[2px] bg-[#2c2416] rounded-sm transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 translate-x-[5px] -translate-y-[5px]" : ""}`} />
          </button>
        </div>

        {/* Mobile Fullscreen Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-[#faf6f0]/98 flex flex-col items-center justify-center gap-8 z-[100]">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="font-sans text-lg text-[#2c2416] font-medium hover:text-[#c4956a] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
