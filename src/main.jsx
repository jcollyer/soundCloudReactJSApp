var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App.jsx');

require('./sc-player.jsx');

App = ReactDOM.render(<App />, document.getElementById('app'));
