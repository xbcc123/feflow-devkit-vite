const { mergeConfig } = require("vite");
const baseConfig = require("./vite.base.config");
const path = require("path");

const projectRoot = process.cwd();

const prodConfig = {
	mode: "production",
	build: {
		outDir: path.join(projectRoot, "dist"),
		assetsDir: "static",
		sourcemap: false,
		minify: "terser",
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				chunkFileNames: "static/js/[name].[hash].js",
				entryFileNames: "static/js/[name].[hash].js",
				assetFileNames: (assetInfo) => {
					const extType = assetInfo.name.split('.').pop();
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						return `static/images/[name].[hash].[ext]`;
					}
					if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
						return `static/fonts/[name].[hash].[ext]`;
					}
					return `static/[ext]/[name].[hash].[ext]`;
				},
				manualChunks: {
					"vue-vendor": ["vue", "vue-router", "vuex"],
				},
			},
		},
	},
};

module.exports = mergeConfig(baseConfig, prodConfig);
