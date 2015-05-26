var React = require('react');
var Login = require('./js/components/soundcloud-login.jsx');
var Genre = require('./js/components/genre.jsx');
var Player = require('./js/components/player.jsx');

require('./home.less');


var Home = React.createClass({

  render: function() {
    return (
            <div>
              <Login />
              <Player />
              <Genre />
            </div>
    );
  }
});

module.exports = Home;
