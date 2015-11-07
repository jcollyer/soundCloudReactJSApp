var React = require('react');
var Login = require('./js/components/login.jsx');
var Genre = require('./js/components/genre.jsx');
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


var Home =
  React.createClass({
    getInitialState() {
      return {
        route: window.location.hash.substr(1)
      }
    },
    componentDidMount() {
      window.addEventListener('hashchange', () => {
        this.setState({
          route: window.location.hash.substr(1)
        })
      })
    },
    render: function() {
      var Child;
      switch (this.state.route) {
        // case '/about': Child = About; break;
        case '/track': Child = Track; break;
        default:      Child = TrackList;
      }
      return (
        <div>
          <Overlay />
          <PlaylistModal />
           <a href="#/track">Inbox</a>
          <div id="fixed-frame">
            <div id="player-wrapper" className="close">
              <Player />
            </div>
            <div id="side-nav">
              <div id="image-placeholder"></div>
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
