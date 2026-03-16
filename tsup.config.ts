import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  esbuildOptions(options) {
    // Preserve "use client" directives in the output bundle.
    // esbuild strips banner-like directives by default; this re-injects them.
    options.banner = {
      js: '"use client";',
    }
  },
})
