const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  // mode: "development",

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[hash][ext][query]",
    // publicPath: "/",
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "public", "assets"),
      // directory: path.join(__dirname, "./", "public"),
    },
    // stats: {
    //   colores: true,
    // },
    compress: true,
    port: 3000,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // Asset Modules
      {
        test: /\.txt/,
        type: "asset/source",
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext]",
        },
      },
      {
        test: /\.svg$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/icon/[name][ext]",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "sign-in.html",
      template: "src/sign-in.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "sign-up.html",
      template: "src/sign-up.html",
      chunks: ["main"],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
