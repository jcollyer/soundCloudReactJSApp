var React = require('react');
var HomeLink = require('./js/components/home-link.jsx');
var ViewSwitch = require('./js/components/view-switch.jsx');
var Login = require('./js/components/login.jsx');
var Playlist = require('./js/components/playlist.jsx');
var Player = require('./js/components/player.jsx');
var Favorites = require('./js/components/favorites.jsx');
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
            <div id="player-wrapper" className="hide">
              <Player />
            </div>
            <div id="side-nav">
              <HomeLink />
              <Login />
              <Search />
              <Playlist />
              <Favorites />
            </div>
          </div>
          <ViewSwitch />
        </div>
      );
    }
  });
module.exports = App;
