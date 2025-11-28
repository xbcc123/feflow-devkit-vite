const path = require("path");
const merge = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { deepCopy } = require("../tools/index.js");
const { getLoaderPath } = require("../utils/index.js");
const fs = require("fs");
const { rspack } = require("@rspack/core");

function getPath(filename) {
	let currDir = process.cwd()
	while (!fs.existsSync(path.join(currDir, filename))) {
		currDir = path.join(currDir, "../")

		// unix跟目录为/， win32系统根目录为 C:\\格式的
		if (currDir === "/" || /^[a-zA-Z]:\\$/.test(currDir)) {
			return ""
		}
	}
	return currDir
}

// 当前运行的时候的根目录
let projectRoot = getPath(".feflowrc.json")

if (!projectRoot) {
	projectRoot = getPath(".feflowrc.js")
}

const baseConfig = {
	module: {},
	resolve: {},
};

class Builder {
	// 创建dev配置
	createDevConfig(options) {
		const devConfig = deepCopy(baseConfig);
		devConfig.mode = "development";
		// 设置打包规则
		const devRules = [];

		// 设置CSS解析规则  isMinicss是否开启css抽离  isModule是否开启css Modules
		devRules.push(this.setCssRule(options.isModule, options.isMinicss));
		devRules.push(this.setLessRule(options.isModule, options.isMinicss));
		devRules.push(this.setSassRule(options.isModule, options.isMinicss));
		devRules.push(this.setStylusRule(options.isModule, options.isMinicss));

		// 设置打包插件
		let devPlugins = [];
		// 设置提取CSS为一个单独的文件的插件
		if (options.isMinicss) {
			devPlugins.push(this.setMiniCssExtractPlugin());
		}

		devConfig.module.rules = devRules;
		devConfig.plugins = devPlugins;

		// 设置启动服务端口号 本地服务配置
		devConfig.devServer = this.setDevServer(options.devServer);
		return merge(this.mixCreateConfig(options), devConfig);
	}

	// 创建prod配置
	createProdConfig(options) {
		const prodConfig = deepCopy(baseConfig);
		prodConfig.mode = "production";
		// 设置打包规则
		const prodRules = [];
		prodRules.push(this.setCssRule(options.isModule, options.isMinicss));
		prodRules.push(this.setLessRule(options.isModule, options.isMinicss));
		prodRules.push(this.setSassRule(options.isModule, options.isMinicss));
		prodRules.push(this.setStylusRule(options.isModule, options.isMinicss));
		let prodPlugins = [];
		if (options.isMinicss) {
			prodPlugins.push(this.setMiniCssExtractPlugin());
		}
		prodConfig.module.rules = prodRules;
		prodConfig.plugins = prodPlugins;
		return merge(this.mixCreateConfig(options), prodConfig);
	}

	// 公用配置
	mixCreateConfig(options) {
		const mixConfig = deepCopy(baseConfig);
		let minRules = [];
		let mixPlugins = [];
		mixPlugins.push(this.setDefinePlugin(options.envs, options.currentEnv));
		// 是否启动打包性能分析
		if (options.hasAnalyzer) {
			mixPlugins.push(this.setBundleSnalyzerPlugin(options.analyzer));
		}
		mixConfig.entry = this.setEntry(options.entry);
		mixConfig.resolve.alias = this.setAlias(options.alias);
		mixConfig.module.rules = minRules;
		mixConfig.plugins = mixPlugins;
		return mixConfig;
	}

	/**
	 * externals 配置
	 * @private
	 */
	// Rspack 暂无官方 externals 插件，建议直接在 config.externals 配置
	setExternalPlugin(externals) {
		// 这里保留方法结构，实际 externals 建议直接在 config.externals 配置
		return null;
	}

	// 设置打包优化
	setBundleSnalyzerPlugin(analyzer) {
		if (!analyzer || JSON.stringify(analyzer) === "{}") {
			analyzer = {
				analyzerPort: "4321",
			};
		}
		return new BundleAnalyzerPlugin(analyzer);
	}

	// 设置别名
	setAlias(alias) {
		let aliasObj = {}
		if (Object.prototype.toString.call(alias) !== "[object Object]") {
			return aliasObj
		}
		for (let key in alias) {
			aliasObj[key] = path.join(projectRoot, `${alias[key]}`)
		}
		return aliasObj
	}

	// 设置入口
	setEntry(entry) {
		return path.join(projectRoot, `./src/${entry}`)
	}

	// isMinicss 是否开启css抽离  isModule 是否开启css Modules
	setCssRule(isModule, isMinicss) {
		return {
			test: /\.css$/,
			use: [
				    getLoaderPath('style-loader'),
				   {
					   loader: getLoaderPath('css-loader'),
					options: {
						modules: isModule
							? {
								mode: "local",
								exportGlobals: true,
								localIdentName:
									"[path][name]__[local]--[hash:base64:5]",
							  }
							: false,
					},
				},
		 {
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: 'ie 10',
            },
          },
			],
		}
	}

	setLessRule(isModule,isMinicss) {
		return {
			test: /\.less$/,
			use: [
				    getLoaderPath('style-loader'),
				   {
					   loader: getLoaderPath('css-loader'),
					options: {
						modules: isModule
							? {
								mode: "local",
								exportGlobals: true,
								localIdentName:
									"[path][name]__[local]--[hash:base64:5]",
							  }
							: false,
					},
				},
		 {
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: 'ie 10',
            },
          },
				   {
					   loader: getLoaderPath('less-loader'),
					options: { lessOptions: { javascriptEnabled: true } },
				},
			],
		}
	}

	setSassRule(isModule, isMinicss) {
		return {
			test: /\.s[ac]ss$/,
			use: [
				    getLoaderPath('style-loader'),
				   {
					   loader: getLoaderPath('css-loader'),
					options: {
						modules: isModule
							? {
								mode: "local",
								exportGlobals: true,
								localIdentName:
									"[path][name]__[local]--[hash:base64:5]",
							  }
							: false,
					},
				},
			 {
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: 'ie 10',
            },
          },
				   getLoaderPath('sass-loader'),
			],
		}
	}

	setStylusRule(isModule, isMinicss) {
		return {
			test: /\.sty(l|lus)$/,
			use: [
				    getLoaderPath('style-loader'),
				   {
					   loader: getLoaderPath('css-loader'),
					options: {
						modules: isModule
							? {
								mode: "local",
								exportGlobals: true,
								localIdentName:
									"[path][name]__[local]--[hash:base64:5]",
							  }
							: false,
					},
				},
			 {
            loader: 'builtin:lightningcss-loader',
            options: {
              targets: 'ie 10',
            },
          },
				   getLoaderPath('stylus-loader'),
			],
		}
	}

	setMiniCssExtractPlugin() {
		return new rspack.CssExtractRspackPlugin({
			filename: "static/css/[name].[contenthash].css",
		})
	}

	setDevServer(devServer) {
		return (
			devServer || {
				port: 1234,
			}
		)
	}

	setDefinePlugin(envs, currentEnv) {
		return new rspack.DefinePlugin({
			"process.env": envs[currentEnv].envObj,
		});
	}
}

export default Builder
