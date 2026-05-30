import { motion } from "motion/react";
import { BagConfiguration } from "../types";

interface BagVisualizerProps {
  config: BagConfiguration;
  angle?: "front" | "side" | "interior";
}

export default function BagVisualizer({ config, angle = "front" }: BagVisualizerProps) {
  const { canvas, leather, hardware, size, monogram, shoulderStrap, keyClasp, atmosphere } = config;

  // Render variables
  const canvasColor = canvas.color;
  const leatherColor = leather.color;

  // Metallic gradients based on hardware choice
  const getHardwareGradient = () => {
    if (hardware.id === "brushed-brass") {
      return (
        <linearGradient id="hardwareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e5c180" />
          <stop offset="50%" stopColor="#b4934a" />
          <stop offset="100%" stopColor="#ecd39c" />
        </linearGradient>
      );
    } else if (hardware.id === "polished-silver") {
      return (
        <linearGradient id="hardwareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="50%" stopColor="#9e9e9e" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
      );
    } else {
      // Matte Black
      return (
        <linearGradient id="hardwareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f4f4f" />
          <stop offset="50%" stopColor="#212121" />
          <stop offset="100%" stopColor="#3d3d3d" />
        </linearGradient>
      );
    }
  };

  // Leather Gradients for volumetric curves
  const getLeatherGradient = (id: string, color: string) => {
    return (
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={adjustColorBrightness(color, -25)} />
        <stop offset="15%" stopColor={color} />
        <stop offset="85%" stopColor={color} />
        <stop offset="100%" stopColor={adjustColorBrightness(color, -30)} />
      </linearGradient>
    );
  };

  // Helper to darken/lighten hex colors for realistic depth
  function adjustColorBrightness(hex: string, percent: number) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt(((R * (100 + percent)) / 100).toString());
    G = parseInt(((G * (100 + percent)) / 100).toString());
    B = parseInt(((B * (100 + percent)) / 100).toString());

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = R > 0 ? R : 0;
    G = G > 0 ? G : 0;
    B = B > 0 ? B : 0;

    const rgb = (R << 16) | (G << 8) | B;
    return "#" + (0x1000000 + rgb).toString(16).slice(1);
  }

  // Get Monogram Color Styles
  const getMonogramStyle = () => {
    if (monogram.style === "Gold Foil") {
      return {
        fill: "url(#goldFoilGrad)",
        filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.15))",
        stroke: "#dfba6b",
        strokeWidth: "0.2px"
      };
    } else if (monogram.style === "Silver Foil") {
      return {
        fill: "url(#silverFoilGrad)",
        filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.15))",
        stroke: "#d0d0d0",
        strokeWidth: "0.2px"
      };
    } else {
      // Debossed (indented) look
      return {
        fill: adjustColorBrightness(leatherColor, -35),
        filter: "drop-shadow(inset 0px 1px 2px rgba(0,0,0,0.5))",
        opacity: 0.85
      };
    }
  };

  const getMonogramFont = () => {
    if (monogram.font === "Serif") return "font-serif tracking-widest uppercase font-extrabold";
    if (monogram.font === "Sans") return "font-sans tracking-widest uppercase font-black";
    return "font-mono tracking-wider uppercase font-bold";
  };

  // Ambient backgrounds matching active lighting atmosphere
  const isAtmosphereDark = atmosphere.id === "atelier";

  // Size scale multiplier
  const sizeScale = size.id === "petit" ? 0.88 : size.id === "grand" ? 1.08 : 1.0;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Background ambient lighting effects inside the preview container */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-700 ${atmosphere.bgColor} relative overflow-hidden flex items-center justify-center`}>
        {/* Radiating Light source glowing overhead */}
        <div className={`absolute top-0 w-[150%] aspect-square rounded-full bg-gradient-to-b ${atmosphere.ambientLight} blur-3xl pointer-events-none transform -translate-y-1/2`} />

        {/* Visualizer canvas */}
        <div className="relative z-10 w-full max-w-[420px] aspect-square flex items-center justify-center">
          <motion.div
            animate={{ scale: sizeScale }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-full h-full"
          >
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.06)] overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Core Gradients */}
                {getHardwareGradient()}
                {getLeatherGradient("strapGrad", leatherColor)}
                {getLeatherGradient("pocketTrimGrad", adjustColorBrightness(leatherColor, -5))}
                {getLeatherGradient("tagGrad", leatherColor)}

                <linearGradient id="goldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff3d1" />
                  <stop offset="30%" stopColor="#dfba6b" />
                  <stop offset="70%" stopColor="#a37c2b" />
                  <stop offset="100%" stopColor="#ffd885" />
                </linearGradient>

                <linearGradient id="silverFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#ababab" />
                  <stop offset="70%" stopColor="#6e6e6e" />
                  <stop offset="100%" stopColor="#dadada" />
                </linearGradient>

                {/* Ambient dynamic shadow filter depending on intensity */}
                <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="15" />
                </filter>

                {/* Canvas Canvas Fabric noise overlay */}
                <filter id="fabricNoise" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
                  <feComposite operator="in" in2="SourceGraphic" />
                </filter>
                
                {/* Leather noise overlay */}
                <filter id="leatherNoise" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" />
                  <feComposite operator="in" in2="SourceGraphic" />
                </filter>
              </defs>

              {/* Dynamic Bottom Contact Shadow */}
              <ellipse
                cx="250"
                cy="435"
                rx="180"
                ry="18"
                fill={isAtmosphereDark ? "black" : "#2b2a26"}
                opacity={isAtmosphereDark ? 0.65 : 0.22}
                filter="url(#softBlur)"
              />

              {/* DETACHABLE SHOULDER STRAP (Falls in background) */}
              {shoulderStrap && (
                <g id="shoulder-strap-bg">
                  {/* Curving long strap */}
                  <path
                    d="M 175 180 C 130 180, 80 250, 80 340 C 80 410, 130 450, 175 425 C 190 415, 175 390, 160 395 C 130 410, 105 380, 105 330 C 105 260, 140 200, 180 200 Z"
                    fill="url(#strapGrad)"
                    filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.12))"
                  />
                  {/* Shoulder strap stitching */}
                  <path
                    d="M 175 180 C 130 180, 80 250, 80 340 C 80 410, 130 450, 175 425"
                    fill="none"
                    stroke={adjustColorBrightness(leatherColor, -35)}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.4"
                  />
                </g>
              )}

              {/* MAIN CANVAS BODY BACKGROUND GRID */}
              <g id="bag-canvas-body">
                {/* Trapezoid Tote shape with generous corner rounding */}
                <path
                  d="M 125 180 L 375 180 C 390 180, 395 190, 392 202 L 362 405 C 360 415, 348 425, 335 425 L 165 425 C 152 425, 140 415, 138 405 L 108 202 C 105 190, 110 180, 125 180 Z"
                  fill={canvasColor}
                />
                
                {/* Fabric canvas tactile noise layer */}
                <path
                  d="M 125 180 L 375 180 C 390 180, 395 190, 392 202 L 362 405 C 360 415, 348 425, 335 425 L 165 425 C 152 425, 140 415, 138 405 L 108 202 C 105 190, 110 180, 125 180 Z"
                  fill={canvasColor}
                  filter="url(#fabricNoise)"
                  opacity="1"
                />

                {/* Canvas shade/crease shadows to convey 3D depth */}
                <path
                  d="M 125 180 L 155 425 L 165 425 L 135 180 Z"
                  fill="black"
                  opacity="0.04"
                />
                <path
                  d="M 375 180 L 345 425 L 335 425 L 365 180 Z"
                  fill="black"
                  opacity="0.05"
                />
                <path
                  d="M 135 180 L 365 180 C 375 180, 380 185, 380 190 L 378 198 L 122 198 L 120 190 C 120 185, 125 180, 135 180 Z"
                  fill="white"
                  opacity="0.12"
                />
              </g>

              {/* LEATHER FITTINGS - BOTTOM CORNER REINFORCEMENTS */}
              <g id="bottom-reinforcements">
                {/* Left corner */}
                <path
                  d="M 108 202 L 115 250 C 117 265, 142 270, 150 250 L 125 180 Z"
                  fill="none" // Just visual guide
                />
                {/* Soft leather side piping */}
                <path
                  d="M 125 180 L 108 202 L 138 405 C 140 415, 152 425, 165 425 M 375 180 L 392 202 L 362 405 C 360 415, 348 425, 335 425"
                  fill="none"
                  stroke="url(#strapGrad)"
                  strokeWidth="5"
                  opacity="0.85"
                />
              </g>

              {/* FRONT CANVAS POCKET */}
              <g id="front-pouch">
                <path
                  d="M 152 250 L 348 250 C 352 250, 356 254, 355 259 L 339 385 C 338 392, 332 398, 325 398 L 175 398 C 168 398, 162 392, 161 385 L 145 259 C 144 254, 148 250, 152 250 Z"
                  fill={canvasColor}
                  filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.06))"
                />
                {/* Pocket texture overlay */}
                <path
                  d="M 152 250 L 348 250 C 352 250, 356 254, 355 259 L 339 385 C 338 392, 332 398, 325 398 L 175 398 C 168 398, 162 392, 161 385 L 145 259 C 144 254, 148 250, 152 250 Z"
                  fill={canvasColor}
                  filter="url(#fabricNoise)"
                />
                
                {/* Double stitched seam line around pocket */}
                <path
                  d="M 156 256 L 344 256 M 344 256 L 333 392 C 332 395, 330 394, 325 394 L 175 394 C 170 394, 168 395, 167 392 L 156 256"
                  fill="none"
                  stroke={adjustColorBrightness(canvasColor, -30)}
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.4"
                />

                {/* LEATHER TRIM ON POCKET opening */}
                <path
                  d="M 151 250 C 151 247, 154 245, 157 245 L 343 245 C 346 245, 349 247, 349 250 L 349 254 C 349 256, 346 258, 343 258 L 157 258 C 154 258, 151 256, 151 254 Z"
                  fill="url(#pocketTrimGrad)"
                />
                {/* Trim leather stitching */}
                <line
                  x1="154"
                  y1="251"
                  x2="346"
                  y2="251"
                  stroke={adjustColorBrightness(leatherColor, -40)}
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                  opacity="0.5"
                />
              </g>

              {/* LEATHER HANDLES & LOOP ATTACHMENTS (Drawn Over Canvas) */}
              <g id="leather-handles">
                {/* Left handle */}
                {/* Outer/under back strap */}
                <path
                  d="M 185 245 L 185 150 C 185 90, 230 40, 250 40 C 270 40, 315 90, 315 150 L 315 245"
                  fill="none"
                  stroke={adjustColorBrightness(leatherColor, -15)}
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                {/* Front handle volume */}
                <path
                  d="M 185 245 L 185 150 C 185 90, 230 40, 250 40 C 270 40, 315 90, 315 150 L 315 245"
                  fill="none"
                  stroke="url(#strapGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.15))"
                />

                {/* Fine dual stitching line along handles */}
                {/* Left stitch */}
                <path
                  d="M 182 245 L 182 150 C 182 93, 227 44, 250 44 C 273 44, 318 93, 318 150 L 318 245"
                  fill="none"
                  stroke={adjustColorBrightness(leatherColor, -45)}
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                  opacity="0.6"
                />
                {/* Right stitch */}
                <path
                  d="M 188 245 L 188 150 C 188 87, 233 36, 250 36 C 267 36, 312 87, 312 150 L 312 245"
                  fill="none"
                  stroke={adjustColorBrightness(leatherColor, -45)}
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                  opacity="0.6"
                />

                {/* Leather loops holding handles to the pocket body */}
                {/* Left loops anchor */}
                <path
                  d="M 177 245 L 193 245 C 196 245, 198 247, 198 250 L 194 300 C 194 303, 190 305, 187 305 L 183 305 C 180 305, 176 303, 176 300 L 172 250 C 172 247, 174 245, 177 245 Z"
                  fill="url(#strapGrad)"
                  filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.1))"
                />
                {/* Right loop anchor */}
                <path
                  d="M 307 245 L 323 245 C 326 245, 328 247, 328 250 L 324 300 C 324 303, 320 305, 317 305 L 313 305 C 310 305, 306 303, 306 300 L 302 250 C 302 247, 304 245, 307 245 Z"
                  fill="url(#strapGrad)"
                  filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.1))"
                />

                {/* Double stitched seams for anchor loops */}
                <path
                  d="M 179 248 L 179 301 M 191 248 L 191 301 M 309 248 L 309 301 M 321 248 L 321 301"
                  fill="none"
                  stroke={adjustColorBrightness(leatherColor, -35)}
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                  opacity="0.6"
                />
              </g>

              {/* BRUSHED METAL HARDWARE STUDS */}
              <g id="hardware-staples">
                {/* Left rivet studs */}
                <circle cx="185" cy="265" r="5" fill="url(#hardwareGrad)" filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.18))" />
                <circle cx="185" cy="265" r="5" fill="url(#hardwareGrad)" opacity="0.3" />
                <circle cx="185" cy="285" r="5" fill="url(#hardwareGrad)" filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.18))" />
                <circle cx="185" cy="285" r="5" fill="url(#hardwareGrad)" opacity="0.3" stroke="white" strokeWidth="0.2" />

                {/* Right rivet studs */}
                <circle cx="315" cy="265" r="5" fill="url(#hardwareGrad)" filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.18))" />
                <circle cx="315" cy="265" r="5" fill="url(#hardwareGrad)" opacity="0.3" />
                <circle cx="315" cy="285" r="5" fill="url(#hardwareGrad)" filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.18))" />
                <circle cx="315" cy="285" r="5" fill="url(#hardwareGrad)" opacity="0.3" stroke="white" strokeWidth="0.2" />
              </g>

              {/* ACTIVE DYNAMIC MONOGRAMMING CONTAINER */}
              {monogram.text.trim() && (
                <g id="monogram-rendering">
                  {monogram.position === "Pocket Center" ? (
                    // Center pocket foil engraving
                    <g transform="translate(250, 315)">
                      <text
                        textAnchor="middle"
                        className={getMonogramFont()}
                        style={getMonogramStyle()}
                        fontSize="20"
                        letterSpacing="0.2em"
                      >
                        {monogram.text}
                      </text>
                    </g>
                  ) : (
                    // Luggage Tag hanging off left strap
                    <g id="monogram-luggage-tag" transform="translate(195, 140) rotate(15)">
                      {/* Leather hanging ribbon */}
                      <path
                        d="M -5 -25 L -5 0 Q -5 10, -2 15 L 2 15 Q 5 10, 5 0 L 5 -25 Z"
                        fill={adjustColorBrightness(leatherColor, -15)}
                      />
                      {/* Luggage leather body rect */}
                      <rect
                        x="-20"
                        y="15"
                        width="40"
                        height="65"
                        rx="6"
                        fill="url(#tagGrad)"
                        filter="drop-shadow(2px 5px 8px rgba(0,0,0,0.22))"
                      />
                      {/* Luggage tag stitching */}
                      <rect
                        x="-17"
                        y="18"
                        width="34"
                        height="59"
                        rx="4"
                        fill="none"
                        stroke={adjustColorBrightness(leatherColor, -35)}
                        strokeWidth="0.8"
                        strokeDasharray="2 2"
                        opacity="0.5"
                      />
                      {/* Hardware loop link */}
                      <circle
                        cx="0"
                        cy="15"
                        r="4"
                        fill="none"
                        stroke="url(#hardwareGrad)"
                        strokeWidth="2"
                      />
                      <circle
                        cx="0"
                        cy="15"
                        r="2"
                        fill={isAtmosphereDark ? "#252523" : "#fbf9f5"}
                      />

                      {/* Engraved monogram inside luggage tag */}
                      <g transform="translate(0, 55)">
                        <text
                          textAnchor="middle"
                          className={getMonogramFont()}
                          style={getMonogramStyle()}
                          fontSize="13"
                          letterSpacing="0.05em"
                        >
                          {monogram.text}
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              )}

              {/* DETACHABLE KEY CLASP RING (Floating on loop right corner) */}
              {keyClasp && (
                <g id="key-clasp-dangle" transform="translate(328, 245) rotate(-22)">
                  {/* Metal Lobster claw latch ring */}
                  <path
                    d="M 0 0 L 0 10 M -4 10 L 4 10 L 4 25 L -4 25 Z"
                    fill="url(#hardwareGrad)"
                    stroke={adjustColorBrightness(hardware.color, -40)}
                    strokeWidth="0.5"
                    filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.15))"
                  />
                  {/* Dangling leather strap loop with rivet */}
                  <path
                    d="M -3 25 L 3 25 L 2 55 L -2 55 Z"
                    fill="url(#strapGrad)"
                  />
                  <circle cx="0" cy="40" r="2" fill="url(#hardwareGrad)" />
                </g>
              )}
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
