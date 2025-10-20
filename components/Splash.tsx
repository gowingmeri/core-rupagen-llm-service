// @/components/Splash.tsx
import React from "react";

const Splash = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[url('/background/bg-white.png')] bg-cover bg-center z-50">
      <div
        className="relative"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: "none" }}
      >
        {/* Image */}
        <img
          src="./favicon/icon.png"
          alt="Logo"
          className="w-[256px] pointer-events-none"
          draggable="false"
        />

        {/* Background */}
        <div className="absolute inset-0 bg-transparent"></div>
      </div>
    </div>
  );
};

export default Splash;
