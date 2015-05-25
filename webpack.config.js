module.exports = {
  entry: {
    main: './src/app.jsx'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
    publicPath: '/bundle/'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loaders: [
        'react-hot', 'jsx-loader?insertPragma=React.DOM&stripTypes'
      ]
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
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
  }
}
