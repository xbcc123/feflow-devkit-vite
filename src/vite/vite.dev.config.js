const { mergeConfig } = require("vite");
const baseConfig = require("./vite.base.config");

const devConfig = {
	mode: "development",
	server: {
		host: "0.0.0.0",
		port: 8080,
		open: true,
		cors: true,
		hmr: true,
	},
	build: {
		sourcemap: true,
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
	},
};

module.exports = mergeConfig(baseConfig, devConfig);
