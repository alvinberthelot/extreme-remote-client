const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const app = require("./app.config")

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 4200,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: app.name,
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                require("tailwindcss")("./tailwind.config.js"),
                require("autoprefixer"),
              ],
            },
          },
        ],
      },
    ],
  },
}
