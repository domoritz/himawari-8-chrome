import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "bundle.js",
    format: "iife",
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    typescript({
      tsconfig: "tsconfig.json"
    }),
    terser()
  ]
};
