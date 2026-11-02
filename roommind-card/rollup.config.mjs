import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/roommind-card.js",
  output: {
    file: "dist/roommind-card.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    resolve(),
    terser({
      format: { comments: false },
    }),
  ],
};
