const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const CopyPlugin = require('copy-webpack-plugin');

const env = dotenv.config().parsed;
const envKeys = Object.keys( env ).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: path.resolve( __dirname, 'src', 'index.js' ),
  output: {
    path: path.resolve( __dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      hoc: path.resolve(__dirname, 'src', 'hoc'),
      pages: path.resolve(__dirname, 'src', 'pages'),
      components: path.resolve(__dirname, 'src', 'components'),
      containers: path.resolve(__dirname, 'src', 'containers'),
      actions: path.resolve(__dirname, 'src', 'actions'),
      reducers: path.resolve(__dirname, 'src', 'reducers'),
      middlewares: path.resolve(__dirname, 'src', 'middlewares'),
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.s?css$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve( __dirname, 'src', 'index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),
    new webpack.DefinePlugin( envKeys ),
    new CopyPlugin(
      {
        patterns: [
          {from: path.resolve(__dirname, 'server', 'data'), to: path.resolve(__dirname, 'dist', 'api')},
          {from: path.resolve(__dirname, 'src', 'favicon.ico'), to: path.resolve(__dirname, 'dist')},
          {from: path.resolve(__dirname, 'src', 'sw.js'), to: path.resolve(__dirname, 'dist')},
          {from: path.resolve(__dirname, 'src', 'manifest.json'), to: path.resolve(__dirname, 'dist')},
          {from: path.resolve(__dirname, 'src', 'serviceWorkerInit.js'), to: path.resolve(__dirname, 'dist')},
          {from: path.resolve(__dirname, 'src', 'assets', 'images'), to: path.resolve(__dirname, 'dist', 'images')},
        ],
      }),
  ],
  devServer: {
    historyApiFallback: true,
  },
};