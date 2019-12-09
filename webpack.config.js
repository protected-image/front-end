const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(base, env) {
  const isDev = env.mode === 'development';

  return {
    devtool: isDev ? 'eval' : 'source-map',
    entry: ['babel-polyfill', './src/index.js'],
    mode: env.mode,
    devServer: {
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.html' },
          { from: /^\/\w+$/, to: '/image.html' },
          { from: /./, to: '/404.html' },
        ],
      },
    },
    output: {
      filename: 'js/[name].[hash].js',
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: 'public/[name].[ext]?[hash:7]',
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
                mozjpeg: {
                  progressive: true,
                  quality: 75,
                },
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        minify: !isDev && {
          collapseWhitespace: true,
          preserveLineBreaks: true,
          removeComments: true,
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/image.html',
        filename: 'image.html',
        minify: !isDev && {
          collapseWhitespace: true,
          preserveLineBreaks: true,
          removeComments: true,
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/404.html',
        filename: '404.html',
        minify: !isDev && {
          collapseWhitespace: true,
          preserveLineBreaks: true,
          removeComments: true,
        },
      }),
      new CopyWebpackPlugin([
        {
          from: './src/static',
          to: 'static',
        },
      ]),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[hash].[id].css',
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
  };
};
