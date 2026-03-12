const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "monitor.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // 监控是先执行的，所以要放在前面
    new htmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head",
    }),
  ],
};
