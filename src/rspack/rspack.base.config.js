const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const { getLoaderPath } = require("../utils/index.js");
const { rspack, ProgressPlugin } = require("@rspack/core");

const projectRoot = process.cwd();

module.exports = {
	context: projectRoot,
	entry: path.join(projectRoot, "src/index.ts"), // 主入口，可改成 index.js
	output: {
		path: path.join(projectRoot, "dist"),
		filename: "static/js/[name].[contenthash].js",
		chunkFilename: "static/js/[name].[contenthash].js",
		publicPath: "/",
		clean: true,
	},
	cache: true,
	experiments: {
		cache: {
			type: 'persistent',
		},
  	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".vue", ".json"],
		alias: {
			"@": path.resolve(projectRoot, "src"),
			vue$: "vue/dist/vue.esm.js",
		},
		modules: ["node_modules", path.join(projectRoot, "node_modules")],
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				   loader: getLoaderPath('vue-loader'),
			},
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: "typescript",
								tsx: true,
								decorators: true
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true
							}
						}
					}
				}
			},
			// 图片
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 10kb 以下转 base64
					},
				},
			},
			// 字体文件
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
				type: "asset/resource",
			},
			// 音视频
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: path.join(projectRoot, "static"),
					to: "static",
					globOptions: {
						ignore: ["**/.*"],
					},
				},
			],
		}),
		new ProgressPlugin(),
	],
};
