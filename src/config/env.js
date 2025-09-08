import NodeCache from "node-cache";

const cache = new NodeCache();

export function setConfig(config) {
  cache.set("config", config);
}

export function getConfig() {
  return cache.get("config") || {};
}
