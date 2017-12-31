var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const debug = require('debug')('app:webpack:config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')

function getConfig(isTest) {
  const mode = process.env.NODE_ENV || 'development'

  //
  //  the root tsconfig is configured to not emit JS files
  //  Webpack by default uses this file
  //  Below is an overwrite to allow JS emiting
  //
  var tsCompilerOptions = isTest ? {
    noEmit: false,
    sourceMap: true,
    noEmitHelpers: false,
    target: 'es5',
    lib: [ 'dom', 'es6' ]
  } : { noEmit: false }
  //
  //  Set chunk "lib" as a common chunk
  //
  var config = {
    //
    //  Each key creates a new chunk
    //
    entry: {
      lib: [
        'react',
        'react-dom',
        'react-router',
        'redux',
        'react-redux',
        'react-intl',
        'axios',
        'react-cookie',
        'bootstrap-sass',
        'react-bootstrap'
      ],
      app: './app/main.tsx'
    },

    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[id].[name].bundle.js',
      chunkFilename: '[id].[name].bundle.js',
      publicPath: '/'
    },

    resolve: {
      //
      //  default extensions in case of require("./file")
      //
      extensions: ['.ts', '.tsx', '.js']
    },

    //
    //  Create source maps
    //
    devtool: 'source-map',

    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        hash: true,
        filename: 'index.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true
        }
      }),
      new ExtractTextPlugin({filename: './css/[id].[name].css', allChunks: false, disable: isTest}),
      new FaviconsWebpackPlugin({
        logo: './app-logo.png',
        prefix: 'favcicons/'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // Ignore all optional deps of moment.js
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: tsCompilerOptions
          },
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            //  inject style tag into HTML
            fallback: 'style-loader',
            //  Handles resources (like images) and add support for CSS modules
            use: [{loader: 'css-loader', options: {modules: true, minimize: true, localIdentName: '[name]__[local]___[hash:base64:5]'}},
              // resolve url assetes in scss files
              'resolve-url-loader',
              //  Compiles SASS
              'sass-loader?sourceMap'
            ]
          })
        },
        { test: /\.woff(\?.*)?$/, loader: 'url-loader?limit=10000&name=./fonts/[name]-[hash].[ext]&mimetype=application/font-woff' },
        { test: /\.woff2(\?.*)?$/, loader: 'url-loader?limit=10000&name=./fonts/[name]-[hash].[ext]&mimetype=application/font-woff2' },
        { test: /\.otf(\?.*)?$/, loader: 'file-loader?limit=10000&name=./fonts/[name]-[hash].[ext]&mimetype=font/opentype' },
        { test: /\.ttf(\?.*)?$/, loader: 'url-loader?limit=10000&name=./fonts/[name]-[hash].[ext]&mimetype=application/octet-stream' },
        { test: /\.eot(\?.*)?$/, loader: 'file-loader?name=./fonts/[name]-[hash].[ext]' },
        { test: /\.svg(\?.*)?$/, loader: 'url-loader?limit=10000&name=./fonts/[name]-[hash].[ext]&mimetype=image/svg+xml' },
        {
          test: /.*\.(gif|png|jpe?g)$/i,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: './imgs/[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                quality: 65
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              svgo: {
                plugins: [{
                  removeViewBox: false
                },
                {
                  removeEmptyAttrs: false
                }
                ]
              }
            }
          }],
        },
      ],
    },
    node: {
      dns: 'mock',
      net: 'mock'
    },
  };

  if (!isTest) {
    var commonChunks = new webpack.optimize.CommonsChunkPlugin({
      names: ['lib'],
    });

    config.plugins.push(commonChunks);
  }
  else {
    debug('Set configuration for unit testing...')
    config.devtool = 'inline-source-map'
    config.externals = {};
    config.externals['jsdom'] = 'window';
    config.externals['cheerio'] = 'window';
    config.externals['react/lib/ExecutionEnvironment'] = true;
    config.externals['react/lib/ReactContext'] = true;
    config.externals['react/addons'] = true;

    config.module.rules.push({ //delays coverage til after tests are run, fixing transpiled source coverage error
      test: /\.tsx?$/,
      exclude: /(tests|node_modules)\/|.spec.tsx?/,
      loader: 'istanbul-instrumenter-loader',
      enforce: 'post'
    })
  }

  if (mode === 'production') {
    debug('Enable plugins for production...')
    config.plugins.push(
      new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        beautify: false,
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
          drop_console: true
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    )
    config.output.filename = '[name].bundle.min.js'
  }

  return config;
}

module.exports = getConfig;
