// @/components/ProtectedImage.tsx
import React from "react";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  className,
}) => (
  <div
    className="relative"
    onContextMenu={(e) => e.preventDefault()}
    style={{ userSelect: "none" }}
  >
    {/* Image */}
    <img
      src={src}
      alt={alt}
      className={`${className} pointer-events-none`}
      draggable="false"
    />
    <div className="absolute inset-0 bg-transparent"></div>
  </div>
);

export default ProtectedImage;
