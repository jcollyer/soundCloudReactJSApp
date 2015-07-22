var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  contentBase: './build',
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(process.env.PORT || 3000, '0.0.0.0', function (err, result) {
  if (err) console.log(err);
  console.log('Listening at 0.0.0.0:3000');
});

