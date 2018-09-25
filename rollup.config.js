import babel from "rollup-plugin-babel";
import pkg from "./package.json";

// https://github.com/rollup/rollup-plugin-babel#modules
const babelOptions = {
  babelrc: false,
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
      name: "Reduxstate"
    },
    plugins: [babel(babelOptions)]
  },
  {
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [babel(babelOptions)]
  }
];
