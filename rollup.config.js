import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

// https://github.com/rollup/rollup-plugin-babel#modules
const babelOptions = {
  babelrc: false,
  babelHelpers: "bundled",
  exclude: "node_modules/**",
  presets: ["@babel/env"]
};

export default [
  // browser-friendly UMD build
  {
    input: "src/index.js",
    output: {
      file: pkg.browser,
      format: "umd",
      name: "RSC"
    },
    plugins: [babel(babelOptions), resolve(), commonjs()]
  },
  {
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [babel(babelOptions), resolve(), commonjs()]
  }
];
