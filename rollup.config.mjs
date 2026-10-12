import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/hacard-tabs.js",
  output: {
    file: "dist/hacardtabs.js",
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
