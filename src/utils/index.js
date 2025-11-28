const path = require('path');

/**
 * 获取 node_modules 下 loader 的绝对路径
 * @param {string} loaderName 例如 'css-loader'
 * @param {string} [baseDir] 可选，基于哪个目录查找，默认 __dirname
 * @returns {string}
 */
function getLoaderPath(loaderName, baseDir = __dirname) {
  return loaderName
//   return path.resolve(baseDir, '../../node_modules', loaderName);
}

module.exports = {
  getLoaderPath,
};
