import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Mr.Sagasu",
  description: "search bookmark in the address bar",
  version: "1.0.1",
  omnibox: {
    keyword: "b",
  },
  permissions: ["bookmarks", "storage"],
  background: { service_worker: "src/background/index.ts" },
  icons: {
    "16": "icons/icon-16x16.png",
    "32": "icons/icon-32x32.png",
    "48": "icons/icon-48x48.png",
    "128": "icons/icon-128x128.png",
  },
});
