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
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error("webpack-dev-server is not available");
      }

      devServer.app.get("/success", (req, res) => res.json({ id: 1 }));
      devServer.app.post("/error", (req, res) => res.sendStatus(500));

      return middlewares;
    },
  },
  plugins: [
    // 监控是先执行的，所以要放在前面
    new htmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head",
      scriptLoading: "blocking", // 改为阻塞加载，确保监听器先注册
    }),
  ],
};
