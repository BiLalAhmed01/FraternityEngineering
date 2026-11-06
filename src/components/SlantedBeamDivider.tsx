import React from "react";

interface SlantedBeamDividerProps {
  fromColor?: "charcoal" | "navy" | "cream";
  toColor?: "charcoal" | "navy" | "cream";
  flip?: boolean;
}

export const SlantedBeamDivider: React.FC<SlantedBeamDividerProps> = ({
  fromColor = "charcoal",
  toColor = "cream",
  flip = false,
}) => {
  const colorMap = {
    charcoal: "#1F2A37",
    navy: "#0B1F3A",
    cream: "#F4EDE0",
  };

  const bgStyle = {
    backgroundColor: colorMap[fromColor],
  };

  return (
    <div className="relative w-full overflow-hidden select-none" style={bgStyle} aria-hidden="true">
      <div className={`relative h-12 md:h-16 w-full ${flip ? "scale-x-[-1]" : ""}`}>
        <svg
          viewBox="0 0 1440 64"
          className="absolute inset-0 w-full h-full"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Target section fill */}
          <path
            d="M0 64L1440 64L1440 24L0 64Z"
            fill={colorMap[toColor]}
          />
          {/* Signature Industrial Orange Slanted Accent Line (14 deg) */}
          <path
            d="M0 64L1440 24"
            stroke="#FF6B00"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Secondary architectural dashed beam */}
          <path
            d="M0 58L1440 18"
            stroke="#FF6B00"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="8 6"
          />
        </svg>
      </div>
    </div>
  );
};
