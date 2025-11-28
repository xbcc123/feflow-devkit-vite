import { rspack } from "@rspack/core";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const projectRoot = process.cwd();

module.exports = {
	context: projectRoot,
	entry: path.join(projectRoot, "src/index.tsx"), // 主入口，可改成 index.js
	output: {
		path: path.resolve(projectRoot, "dist"),
		filename: "static/js/[name].[contenthash].js",
		chunkFilename: "static/js/[name].[contenthash].js",
		publicPath: "/",
		clean: true,
	},
	cache: true,
	experiments: {
		cache: true,
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".vue", ".json"],
		alias: {
			"@": path.resolve(projectRoot, "src"),
			vue$: "vue/dist/vue.esm.js",
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: path.resolve(__dirname, "../../node_modules/vue-loader"),
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
			{
				test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.css$/,
				use: [
					path.resolve(__dirname, '../../node_modules/vue-style-loader'),
					// rspack.CssExtractRspackPlugin.loader,
					{
						loader: path.resolve(__dirname, '../../node_modules/css-loader'),
					},
					{
						loader: path.resolve(__dirname, '../../node_modules/postcss-loader'),
						options: {
							postcssOptions: {
								plugins: [require('autoprefixer')],
							},
						},
					},
				],
			},
			{
				test: /\.less$/,
				use: [
					path.resolve(__dirname, '../../node_modules/vue-style-loader'),
					// rspack.CssExtractRspackPlugin.loader,
					{
						loader: path.resolve(__dirname, '../../node_modules/css-loader'),
					},
					{
						loader: path.resolve(__dirname, '../../node_modules/postcss-loader'),
						options: {
							postcssOptions: {
								plugins: [require('autoprefixer')],
							},
						},
					},
					{
						loader: path.resolve(__dirname, '../../node_modules/less-loader'),
						options: { lessOptions: { javascriptEnabled: true } },
					},
				],
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					path.resolve(__dirname, '../../node_modules/vue-style-loader'),
					// rspack.CssExtractRspackPlugin.loader,
					{
						loader: path.resolve(__dirname, '../../node_modules/css-loader'),
					},
					{
						loader: path.resolve(__dirname, '../../node_modules/postcss-loader'),
						options: {
							postcssOptions: {
								plugins: [require('autoprefixer')],
							},
						},
					},
					path.resolve(__dirname, '../../node_modules/sass-loader')
				],
			},
			{
				test: /\.sty(l|us)$/,
				use: [
					path.resolve(__dirname, '../../node_modules/vue-style-loader'),
					// rspack.CssExtractRspackPlugin.loader,
					{
						loader: path.resolve(__dirname, '../../node_modules/css-loader'),
					},
					{
						loader: path.resolve(__dirname, '../../node_modules/postcss-loader'),
						options: {
							postcssOptions: {
								plugins: [require('autoprefixer')],
							},
						},
					},
					path.resolve(__dirname, '../../node_modules/stylus-loader')
				],
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new CleanWebpackPlugin(),
		new rspack.HtmlRspackPlugin({
			template: path.resolve(projectRoot, "index.html"),
			filename: "index.html",
			inject: true,
		}),
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
		new rspack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
				// NODE_ENV: JSON.stringify("production"),
				// API_HOST: JSON.stringify("/api"),
				// API_IMG: JSON.stringify("/image/"),
				// API_HOST_WWW: JSON.stringify("/api"),
				// API_IMG_WWW: JSON.stringify("/image/"),
			},
		}),
		new rspack.CssExtractRspackPlugin({
			filename: "static/css/[name].[contenthash].css",
		}),
	],
};
