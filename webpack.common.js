const path = require("path");
let sourceMap;

module.exports = {
  entry: {
    chuck: "./src/images.ts",
    design: "./src/design.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: sourceMap,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: sourceMap,
            },
          },
        ],
      },
    ],
  },
};
