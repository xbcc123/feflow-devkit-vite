import Builder from "./build/index.js";
import { deepCloneUnique } from "./tools/index.js";
const { rspack } = require("@rspack/core");
const chalk = require("chalk");
const currentConfig = require("./rspack/rspack.prod.config");
const merge = require("webpack-merge");
const fs = require("fs");
const build = new Builder();
let config = {}, importConfig = {};

// 将公共配置绑定到各个环境
function setSingleConfig(options) {
	for (let key in options.devkit.commands) {
		// 单独配置的选项会覆盖公共配置
		// let single = Object.assign(options.devkit.commons, options.devkit.commands[key].options)
		let single = merge(
			options.devkit.commons,
			options.devkit.commands[key].options
		)
		single = deepCloneUnique(single, "optionsId")
		// 设置当前当前执行的环境变量
		single.currentEnv = key
		Object.assign(options.devkit.commands[key].options, single)
	}
	return options
}

// 获取配置的config
function getConfig(options, env) {
	options = setSingleConfig(options)
	return options.devkit.commands[env].options
}

/**
 * @function run
 * @desc     创建用于开发过程中的webpack打包配置
 *
 * @param {Object}  options                         参数
 *
 * @example
 */

export function run(ctx, options) {
	importConfig = getConfig(ctx.projectConfig, options.env);
	config = merge(currentConfig, build.createProdConfig(importConfig));
	// 导出config到config.json
	rspack(config, (err, stats) => {
		if (err) throw err;
		process.stdout.write(
			stats.toString({
				publicPath: true,
				entrypoints: true,
				colors: true,
				assets: false,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false,
				builtAt: true,
				cached: true,
			}) + "\n\n"
		);
		if (stats.hasErrors()) {
			console.log(chalk.red("  Build failed with errors.\n"));
			process.exit(1);
		}
		console.log(chalk.cyan("  Build complete.\n"));
	});
}
