import React from "react";

interface ServiceIconProps {
  className?: string;
  size?: number;
}

export const ConstructionIcon: React.FC<ServiceIconProps> = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Crane Mast & Tower */}
    <path
      d="M12 56V18M12 18H38M12 18L6 26H18L12 18ZM12 28L18 36M12 36L18 44M12 44L18 52M6 56H20"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 18L24 10H36L38 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Crane Hook & Cable */}
    <path
      d="M32 18V28M32 28C30.5 28 30 29.5 30 31C30 32.5 32 33 32 34.5C32 35.5 31 36 30 36"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Structural Beams under construction */}
    <rect
      x="36"
      y="38"
      width="22"
      height="18"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M36 44H58M44 38V56M50 38V56"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="2 2"
    />
    {/* Signature Industrial Orange Slanted Beam lifted */}
    <path
      d="M26 31L48 24L50 28L28 35Z"
      fill="#FF6B00"
      stroke="#FF6B00"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const CivilWorksIcon: React.FC<ServiceIconProps> = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Bridge Abutment Pillars */}
    <path
      d="M48 38V56M54 38V56M46 56H56"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Main Civil Roadway Arc */}
    <path
      d="M8 44C20 30 40 26 56 32"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    {/* Lower Roadway Boundary */}
    <path
      d="M10 52C22 38 42 34 58 40"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Orange Roadway Centerline / Bridge Deck Accent */}
    <path
      d="M14 47C24 35 38 31 46 34"
      stroke="#FF6B00"
      strokeWidth="3.5"
      strokeDasharray="4 3"
      strokeLinecap="round"
    />
    <path
      d="M20 44L18 51M28 37L26 47M36 33L35 44"
      stroke="#FF6B00"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Ground Plane */}
    <path
      d="M6 56H42"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ElectricalIcon: React.FC<ServiceIconProps> = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Circular Shield Housing */}
    <circle
      cx="32"
      cy="32"
      r="24"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    {/* Circuit Crosshairs / Nodes */}
    <path
      d="M32 4V8M32 56V60M4 32H8M56 32H60"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Circuit Tracks */}
    <circle cx="32" cy="8" r="2" fill="currentColor" />
    <circle cx="32" cy="56" r="2" fill="currentColor" />
    <circle cx="8" cy="32" r="2" fill="currentColor" />
    <circle cx="56" cy="32" r="2" fill="currentColor" />
    {/* Prominent High-Voltage Lightning Bolt with Orange Accent */}
    <path
      d="M34 16L20 34H33L29 48L45 28H32L34 16Z"
      fill="#FF6B00"
      stroke="#FF6B00"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const FireSafetyIcon: React.FC<ServiceIconProps> = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Safety Shield Outline */}
    <path
      d="M32 8L14 16V30C14 43 22 52 32 56C42 52 50 43 50 30V16L32 8Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Fire Extinguisher Body */}
    <rect
      x="34"
      y="24"
      width="9"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M36 24V20H41V24M38.5 20V17"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M41 19H45V25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Orange Flame / Safety Beacon */}
    <path
      d="M26 42C21.5 42 20 38.5 21 35C21.5 33 23.5 32 24 30C24.5 28 24 26 26 23C27.5 26.5 30 28 30 32C30 34 29 35.5 29 37C29 40 28 42 26 42Z"
      fill="#FF6B00"
      stroke="#FF6B00"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const GeneralSupplyIcon: React.FC<ServiceIconProps> = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Base Left Isometric Box */}
    <path
      d="M10 39L24 32L38 39L24 46L10 39Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M10 39V51L24 58V46M38 39V51L24 58"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Base Right Isometric Box */}
    <path
      d="M38 39L52 32L66 39L52 46L38 39Z"
      transform="translate(-14, 0)"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M38 39V51L52 58V46M66 39V51L52 58"
      transform="translate(-14, 0)"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Top Center Box with Industrial Orange Seal */}
    <path
      d="M18 21L32 14L46 21L32 28L18 21Z"
      stroke="#FF6B00"
      strokeWidth="2.2"
      fill="#FF6B00"
      fillOpacity="0.2"
      strokeLinejoin="round"
    />
    <path
      d="M18 21V33L32 40V28M46 21V33L32 40"
      stroke="#FF6B00"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Box Packaging Straps */}
    <path
      d="M32 14V28M25 17.5L39 24.5"
      stroke="#FF6B00"
      strokeWidth="1.6"
    />
  </svg>
);

export function getServiceIcon(id: string, className = "", size = 48) {
  switch (id) {
    case "construction":
      return <ConstructionIcon className={className} size={size} />;
    case "civil":
      return <CivilWorksIcon className={className} size={size} />;
    case "electrical":
      return <ElectricalIcon className={className} size={size} />;
    case "fire-safety":
      return <FireSafetyIcon className={className} size={size} />;
    case "general-supply":
      return <GeneralSupplyIcon className={className} size={size} />;
    default:
      return <ConstructionIcon className={className} size={size} />;
  }
}
