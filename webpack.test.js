const webpack = require('webpack');

const paths = require('./paths');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [{
      test: /\.html$/,
      use: 'raw-loader',
    }, {
      test: /\.s?css$/,
      include: paths.APP,
      use: ['to-string-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.s?css$/,
      include: paths.STYLES,
      use: 'null-loader',
    }, {
      test: /\.ts$/,
      use: ['awesome-typescript-loader', 'angular2-template-loader'],
    }, {
      test: /\.(?:gif|png|jpe?g|svg|ttf|eof|woff2?|mp3)$/,
      use: 'null-loader',
    }],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ContextReplacementPlugin(
      /@angular(?:\\|\/)core(?:\\|\/)esm5/,
      paths.SRC,
      {}
    ),
  ],
};
