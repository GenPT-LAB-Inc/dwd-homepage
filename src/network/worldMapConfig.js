export const NETWORK_MAP_IMAGE = {
  src: "/images/network/world-map-3.png",
  width: 1676,
  height: 938,
  aspectRatio: "1676/938",
};

export const NETWORK_MARKET_IDS = ["us", "eu", "japan", "china", "asia-pacific", "mena", "row"];

export const validateNetworkMapConfig = (marketIds) => {
  const configuredIds = new Set(NETWORK_MARKET_IDS);
  const contentIds = new Set(marketIds);
  const errors = [];

  if (NETWORK_MAP_IMAGE.src !== "/images/network/world-map-3.png") {
    errors.push("Network map image must use /images/network/world-map-3.png");
  }

  if (NETWORK_MAP_IMAGE.width !== 1676 || NETWORK_MAP_IMAGE.height !== 938) {
    errors.push("Network map image metadata must match 1676x938");
  }

  if (NETWORK_MAP_IMAGE.aspectRatio !== "1676/938") {
    errors.push("Network map image aspect ratio must be 1676/938");
  }

  if (/^https?:\/\//i.test(NETWORK_MAP_IMAGE.src)) {
    errors.push("Network map image must be a local public asset");
  }

  if (contentIds.size !== marketIds.length) {
    errors.push("Network map market ids must be unique");
  }

  for (const id of configuredIds) {
    if (!contentIds.has(id)) errors.push(`Network content is missing required market ${id}`);
  }

  for (const id of contentIds) {
    if (!configuredIds.has(id)) errors.push(`Network content includes unsupported market ${id}`);
  }

  if (marketIds.length !== NETWORK_MARKET_IDS.length) {
    errors.push(`Network map must contain exactly ${NETWORK_MARKET_IDS.length} markets`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};
