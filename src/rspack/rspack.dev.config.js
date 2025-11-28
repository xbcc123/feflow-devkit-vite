
const merge = require("webpack-merge");
const path = require("path");
const baseConfig = require("./rspack.base.config");
const { rspack } = require("@rspack/core");

const projectRoot = process.cwd();

const devConfig = {
  mode: "development",
  target: "web",
  plugins: [
	new rspack.HtmlRspackPlugin({
		template: path.resolve(projectRoot, "index.html"),
		filename: "index.html",
		inject: true,
	}),
  ],
  devServer: {
    static: {
      directory: path.join(projectRoot, "./dist"),
    },
    hot: true,
    host: "0.0.0.0",
    open: true,
    client: {
      overlay: false,
      logging: "warn",
    },
  },
  devtool: "eval-cheap-source-map",
};

module.exports = merge.smart(baseConfig, devConfig);
