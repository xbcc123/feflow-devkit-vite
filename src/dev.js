import Builder from "./build/index.js";
import { deepCloneUnique } from "./tools/index.js";
const { rspack } = require("@rspack/core");
const { RspackDevServer } = require("@rspack/dev-server");
const currentConfig = require("./rspack/rspack.dev.config")
const merge = require('webpack-merge');

let config = {}, importConfig = {};



let build = new Builder();

function setSingleConfig(options) {
	for (let key in options.devkit.commands) {
		let single = merge.smart(
			options.devkit.commons,
			options.devkit.commands[key].options
		);
		single = deepCloneUnique(single, "optionsId");
		single.currentEnv = key;
		Object.assign(options.devkit.commands[key].options, single);
	}
	return options;
}

function getConfig(options, env) {
	options = setSingleConfig(options);
	return options.devkit.commands[env].options;
}

module.exports = async (ctx) => {
	importConfig = getConfig(ctx.projectConfig, "dev")
	config = merge(currentConfig, build.createDevConfig(importConfig))
	const compiler = rspack(config)
	const devServerOptions = Object.assign({}, config.devServer, {
		open: true,
	})
	const server = new RspackDevServer(devServerOptions, compiler);
	await server.start();
};
