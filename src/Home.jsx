var React = require('react');
var Login = require('./js/components/login.jsx');
var Genre = require('./js/components/genre.jsx');
var Playlist = require('./js/components/playlist.jsx');
var Player = require('./js/components/player.jsx');
var Favorites = require('./js/components/favorites.jsx');
var TrackList = require('./js/components/tracklist.jsx');
var Search = require('./js/components/search.jsx');
var Overlay = require('./js/components/overlay.jsx');
require('./style/grid.min.less');
require('./style/home.less');
require('./style/side-nav.less');
require('./style/icon-fonts.css');
require('./style/overlay.less');


var Home =
  React.createClass({
    render: function() {
      return (
        <div>
          <Overlay />
          <div id="fixed-frame">
            <div id="player-wrapper" className="close">
              <Player />
            </div>
            <div id="side-nav">
              <div id="image-placeholder">
                <img src="https://i1.sndcdn.com/artworks-000001876940-w2l3qc-large.jpg" />
              </div>
              <Login />
              <Search />
              <Playlist />
              <Favorites />
              <Genre />
            </div>
          </div>
          <TrackList />
        </div>
      );
    }
  });
module.exports = Home;
