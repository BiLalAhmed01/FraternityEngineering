import React from "react";

interface BrandLogoProps {
  variant?: "header" | "footer" | "hero";
  className?: string;
  isBlueBg?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "header",
  className = "",
  isBlueBg = true,
}) => {
  // Use the new logo mark for both header and footer
  const logoSrc = "/assets/logo-mark.webp";

  return (
    <a
      href="/"
      className={`inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-sm ${className}`}
      aria-label="Fraternity Engineering & Co. homepage"
    >
      {/* Logo mark image - larger and more visible */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={logoSrc}
          alt="Fraternity Engineering Logo Mark"
          className="h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </a>
  );
};
