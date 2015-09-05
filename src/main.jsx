var React = require('react');
var Home = require('./Home.jsx');
var Player = require('./js/components/player.jsx');
require('./sc-player.jsx');

App = React.render(<Home />, document.getElementById('home'));
App = React.render(<Player />, document.getElementById('player'));
alert("hi");
