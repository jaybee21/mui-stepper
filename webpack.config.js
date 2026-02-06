const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    assetModuleFilename: 'images/[hash][ext][query]',
    publicPath: '/apply-online/'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json", ".png", ".jpg", ".jpeg"],
    fallback: {
      "path": false,
      "stream": false,
      "zlib": false,
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, "src"),
        use: "babel-loader",
      },
      {
        test: /\.(js|jsx)$/,
        // Only transpile specific ESM deps that need it (keep this list tight).
        include: /node_modules[\\/](recharts|d3-*)[\\/]/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3001,
    hot: true,
    historyApiFallback: {
      index: '/apply-online/index.html'
    },
    devMiddleware: {
      publicPath: '/apply-online/'
    }
  },
};
