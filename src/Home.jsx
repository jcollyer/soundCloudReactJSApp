var React = require('react');
var Login = require('./js/components/login.jsx');
var Genre = require('./js/components/genre.jsx');
var Playlist = require('./js/components/playlist.jsx');
var Player = require('./js/components/player.jsx');
var Favorites = require('./js/components/favorites.jsx');
var TrackList = require('./js/components/tracklist.jsx');
require('./style/grid.min.less');
require('./style/home.less');

var Home =
  React.createClass({
    render: function() {
      return (
        <div>
          <div id="player-wrapper" className="close">
            <Player />
          </div>
          <Playlist />
          <Favorites />
          <Login />
          <Genre />
          <TrackList />
        </div>
      );
    }
  });
module.exports = Home;
