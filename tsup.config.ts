import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry points
  format: ['esm', 'cjs'], // Output formats for modern and Node.js compatibility
  dts: true, // Generate .d.ts files
  sourcemap: true, // Include source maps
  clean: true, // Clean dist folder before build
  target: 'es2020', // Target Node/browser version
  outDir: 'dist', // Output directory
});
