const webpack = require('webpack');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const paths = require('./paths');

module.exports = {
  devtool: 'source-map',

  entry: {
    polyfills: paths.POLYFILLS,
    main: paths.MAIN,
  },

  output: {
    filename: '[name].[chunkhash].js',
    publicPath: paths.publicPath,
    path: paths.DOCS,
  },
    
  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [{
      test: /\.html$/,
      use: {
        loader: 'html-loader',
        options: {
          minimize: true,
          conservativeCollapse: false,
          caseSensitive: true,
          removeAttributeQuotes: false,
        },
      },
    }, {
      test: /\.s?css$/,
      include: paths.APP,
      use: [
        'to-string-loader',
        {
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        },
        'postcss-loader',
        'sass-loader',
      ],
    }, {
      test: /\.s?css$/,
      include: paths.STYLES,
      use: ExtractTextWebpackPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      }),
    }, {
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: '@ngtools/webpack',
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
    new webpack.ContextReplacementPlugin(
      /@angular(?:\\|\/)core(?:\\|\/)esm5/,
      paths.SRC,
      {}
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.[chunkhash].js',
      minChunks: function(module) {
        return module.context &&
          module.context.indexOf('node_modules') !== -1;
      },
      chunks: ['main'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.[chunkhash].js',
      minChunks: Infinity,
    }),
    new AngularCompilerPlugin({
      tsConfigPath: paths.TSCONFIG,
      entryModule: paths.APP_MODULE,
      sourceMap: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
    new ExtractTextWebpackPlugin('styles.[contenthash].css'),
    new HtmlWebpackPlugin({
      template: paths.INDEX,
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: false,
        caseSensitive: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: paths.INDEX,
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: false,
        caseSensitive: true,
      },
    }),
    new FaviconsWebpackPlugin(paths.FAVICON),
  ],
};
