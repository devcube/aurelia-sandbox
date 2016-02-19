var path = require('path');
var webpack = require('webpack');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackMd5Hash = require('webpack-md5-hash');
var ENV = process.env.NODE_ENV = process.env.ENV = 'production';
var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8080;

var metadata = {
  title: 'Aurelia Sandbox by devcube',
  baseUrl: '/',
  host: HOST,
  port: PORT,
  ENV: ENV
};

module.exports = {
  // static data for index.html
  metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'eval',
  debug: false,

  entry: {
    'polyfills': './src/polyfills.ts',
    'main': './src/main.ts'
  },

  // Config for our build files
  output: {
    path: root('server/wwwroot'),
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },

  resolve: {
    cache: false,
    extensions: prepend(['.ts', '.js', '.json', '.css', '.html', '.ttf', '.eot', '.svg', '.woff', '.woff2'], '.async') // ensure .async.ts etc also works
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [
          root('node_modules')
        ]
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [
          root('node_modules/rxjs')
        ]
      }
    ],
    loaders: [
      // Support Angular 2 async routes via .async.ts
      {
        test: /\.async\.ts$/,
        loaders: ['es6-promise-loader', 'ts-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          // remove TypeScript helpers to be injected below by DefinePlugin
          'compilerOptions': {
            'removeComments': true,
            'noEmitHelpers': true,
          }
        },
        exclude: [/\.(spec|e2e|async)\.ts$/]
      },

      // Support for *.json files.
      { test: /\.json$/, loader: 'json-loader' },

      // Support for CSS as raw text
      { test: /\.css$/, loader: 'raw-loader', include: [ root('src/app') ] },

      // Support for CSS as loaded/bundled files (this is useful to cover all css files that aren't included otherwise, such as bootstrap.css)
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader"), exclude: [ root('src/app') ] },

      // support for .html as raw text
      { test: /\.html$/, loader: 'raw-loader' },

      // support for these files from e.g. bootstrap
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader' }

      // if you add a loader include the file extension
    ]
  },

  plugins: [
    new WebpackMd5Hash(),
    new DedupePlugin(),
    new OccurenceOrderPlugin(true),
    new CommonsChunkPlugin({
      name: 'polyfills',
      filename: 'polyfills.[chunkhash].bundle.js',
      chunks: Infinity
    }),
    new ExtractTextPlugin("styles.[contenthash].css"),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      hash: false
    }),
    new DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      // TypeScript helpers
      '__metadata': 'ts-helper/metadata',
      '__decorate': 'ts-helper/decorate',
      '__awaiter': 'ts-helper/awaiter',
      '__extends': 'ts-helper/extends',
      '__param': 'ts-helper/param',
      'Reflect': 'es7-reflect-metadata/src/global/browser'
    }),
    new UglifyJsPlugin({
      beautify: false,
      // disable mangling because of a bug in angular2 beta.1, beta.2 and beta.3 (haven't checked with aurelia yet)
      // TODO(mastertinner): enable mangling as soon as angular2 beta.4 is out (haven't checked with aurelia yet)
      // mangle: { screw_ie8 : true },
      mangle: false,
      compress: { screw_ie8: true },
      comments: false
    })
  ],
  // Other module loader config
  tslint: {
    emitErrors: true,
    failOnHint: true
  },

  // we need this due to problems with es6-shim
  node: {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function prepend(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce(function (memo, val) {
    return memo.concat(val, args.map(function (prefix) {
      return prefix + val
    }));
  }, ['']);
}
