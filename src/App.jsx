var React = require('react');
var Home = require('./js/components/home.jsx');
var Login = require('./js/components/login.jsx');
var Playlist = require('./js/components/playlist.jsx');
var Player = require('./js/components/player.jsx');
var Favorites = require('./js/components/favorites.jsx');
var TrackList = require('./js/components/tracklist.jsx');
var Search = require('./js/components/search.jsx');
var Overlay = require('./js/components/overlay.jsx');
var PlaylistModal = require('./js/components/playlistModal.jsx');
require('./style/grid.min.less');
require('./style/home.less');
require('./style/side-nav.less');
require('./style/icon-fonts.css');
require('./style/overlay.less');


var App =
  React.createClass({
    render: function() {
      return (
        <div>
          <Overlay />
          <PlaylistModal />
          <div id="fixed-frame">
            <div id="player-wrapper" className="close">
              <Player />
            </div>
            <div id="side-nav">
              <div id="image-placeholder"></div>
              <Home />
              <Login />
              <Search />
              <Playlist />
              <Favorites />
            </div>
          </div>
          <TrackList />

        </div>
      );
    }
  });
module.exports = App;
