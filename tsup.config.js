import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.jsx"],
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"], // 👈 don't bundle React
  dts: false,
});
