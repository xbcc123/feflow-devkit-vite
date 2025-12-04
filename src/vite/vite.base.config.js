const path = require("path");
const vue = require('@vitejs/plugin-vue2');
const vueJsx = require('@vitejs/plugin-vue2-jsx');

const projectRoot = process.cwd();
const srcPath = path.resolve(projectRoot, "src");

console.log('📦 Vite Base Config - srcPath:', srcPath);

module.exports = {
	root: projectRoot,
	publicDir: path.join(projectRoot, "static"),
	resolve: {
		extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
		alias: {
			"@": srcPath,
			"vue": path.resolve(projectRoot, "node_modules/vue/dist/vue.esm.js"),
		},
	},
	plugins: [
		vue(),
		vueJsx(),
	],
	build: {
		outDir: path.join(projectRoot, "dist"),
		assetsDir: "static",
		sourcemap: false,
		rollupOptions: {
			output: {
				chunkFileNames: "static/js/[name].[hash].js",
				entryFileNames: "static/js/[name].[hash].js",
				assetFileNames: "static/[ext]/[name].[hash].[ext]",
			},
		},
	},
};
