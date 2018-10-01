
// https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1
// https://www.valentinog.com/blog/webpack-tutorial/

const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const lib = require('./server.lib');
const mockRoot = path.join(__dirname, 'mockdata');
const delayResponse = 0;
const DEV_MODE = (process.env.NODE_ENV === 'dev');

module.exports = {
  devtool: DEV_MODE ? 'eval' : 'source-map',
  entry: './src/js/ai.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: DEV_MODE ? '[name].js' : '[name].min.js',
    library: 'accelerate-innovation',
    libraryTarget: 'umd',
    publicPath: '/dist/', 
    umdNamedDefine: true 
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    open: false,
    port: 9000,
    clientLogLevel: "info",
    before: function(app) {

      app.get('/portalfront/*', function(req, res) {
        lib.log('GET for ' + req.originalUrl);
        return lib.getMockFileAndSendToClient(mockRoot, req, res, delayResponse);
      });
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      DEV_MODE ? {
            test: /\.scss/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          }
        : {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
          },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebPackPlugin({
      template  : 'index.html',
      hash      : true
    }),
    new ExtractTextPlugin('styles.css')
  ]
}
