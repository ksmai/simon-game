const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const paths = require('./paths');

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    polyfills: paths.POLYFILLS,
    main: paths.MAIN,
  },

  output: {
    filename: '[name].bundle.js',
    path: paths.DOCS,
    publicPath: paths.PUBLIC_PATH,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [{
      test: /\.html$/,
      use: 'raw-loader',
    }, {
      test: /\.(?:sa|s?c)ss$/,
      include: paths.APP,
      use: ['to-string-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(?:sa|s?c)ss$/,
      include: paths.STYLES,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.ts$/,
      use: ['awesome-typescript-loader', 'angular2-template-loader'],
    }, {
      test: /\.(?:gif|png|jpe?g|svg|ttf|eof|woff2?)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    }],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(
      /@angular(?:\\|\/)core(?:\\|\/)esm5/,
      paths.SRC,
      {}
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills',
      minChunks: Infinity,
    }),
    new HTMLWebpackPlugin({
      template: paths.INDEX,
    }),
  ],

  devServer: {
    hot: true,
    noInfo: true,
    historyApiFallback: {
      index: paths.PUBLIC_PATH,
    },
  },
};
