import React from "react";
import { NETWORK_MAP_IMAGE } from "./worldMapConfig.js";

export const WorldMapImage = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-white"
    data-testid="network-world-map-surface"
  >
    <img
      alt=""
      className="absolute inset-0 h-full w-full select-none object-contain [filter:grayscale(1)_brightness(1.12)_contrast(1.24)]"
      data-testid="network-world-map-image"
      decoding="async"
      draggable={false}
      src={NETWORK_MAP_IMAGE.src}
    />
    <div
      className="absolute inset-0 bg-white/30"
      data-testid="network-world-map-whitewash"
    />
  </div>
);
