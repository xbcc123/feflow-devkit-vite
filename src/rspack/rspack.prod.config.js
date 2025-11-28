const path = require("path");
const { rspack } = require("@rspack/core");
const merge = require("webpack-merge")
const baseConfig = require("./rspack.base.config");

const projectRoot = process.cwd();

const prodConfig = {
  mode: "production",
  devtool: false,
  plugins: [
    new rspack.HtmlRspackPlugin({
      filename: "index.html",
      template: path.join(projectRoot, "index.html"),
      inject: true,
      minify: true
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 80 * 1024,
      maxSize: 200 * 1024,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
    },
    minimize: true,
    // rspack 内置 terser，无需单独配置 minimizer
  },
};

module.exports = merge.smart(baseConfig, prodConfig);
