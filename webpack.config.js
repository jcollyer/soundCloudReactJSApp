// module.exports = {
//   entry: ['./src/main.jsx'],
//   output: {
//     path: './build',
//     filename: 'bundle.js'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx$/, loader: 'jsx-loader'
//       }, {
//         test: /\.less$/, loader: 'style-loader!css-loader!less-loader'
//       }, {
//         test: /\.svg/,
//         loader: 'url-loader?limit=10000&minetype=image/svg+xml'
//       }, {
//         test: /\.eot/,
//         loader: 'url-loader?limit=10000&minetype=application/vnd.ms-fontobject'
//       }, {
//         test: /\.ttf|otf/,
//         loader: 'url-loader?limit=10000&minetype=application/font-sfnt'
//       }, {
//         test: /\.woff/,
//         loader: 'url-loader?limit=10000&minetype=application/font-woff'
//       }, {
//         test: /\.gif/,
//         loader: 'url-loader?limit=10000&minetype=image/gif'
//       }, {
//         test: /\.jpg/,
//         loader: 'url-loader?limit=10000&minetype=image/jpg'
//       }, {
//         test: /\.png/,
//         loader: 'url-loader?limit=10000&minetype=image/png'
//     }]
//   }
// };



var Webpack = require('webpack');
// var path = require('path');
// var nodeModulesPath = path.resolve(__dirname, 'node_modules');
// var buildPath = path.resolve(__dirname, 'build');
// var mainPath = path.resolve(__dirname, 'src', 'main.jsx');


module.exports = {
  devtool: 'eval',
  entry: [
    'webpack/hot/dev-server',
    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:8080',
    './src/main.jsx'
  ],
  output: {
    // path: buildPath,
    // filename: 'bundle.js',
    // publicPath: '/build/index.html'

    path: '/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/, loader: 'jsx-loader'
      }, {
        test: /\.less$/, loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.svg/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml'
      }, {
        test: /\.eot/,
        loader: 'url-loader?limit=10000&minetype=application/vnd.ms-fontobject'
      }, {
        test: /\.ttf|otf/,
        loader: 'url-loader?limit=10000&minetype=application/font-sfnt'
      }, {
        test: /\.woff/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&minetype=image/gif'
      }, {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&minetype=image/jpg'
      }, {
        test: /\.png/,
        loader: 'url-loader?limit=10000&minetype=image/png'
    }]
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
};
