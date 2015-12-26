var React = require('react');
var HomeLink = require('./js/components/home-link.jsx');
var ViewSwitch = require('./js/components/view-switch.jsx');
var Home = require('./js/components/home.jsx');
var Tracklist = require('./js/components/tracklist.jsx');
var Login = require('./js/components/login.jsx');
var Playlist = require('./js/components/playlist.jsx');
var Player = require('./js/components/player.jsx');
var Favorites = require('./js/components/favorites.jsx');
var Search = require('./js/components/search.jsx');
var Overlay = require('./js/components/overlay.jsx');
var PlaylistModal = require('./js/components/playlistModal.jsx');
var AppStore = require('./js/stores/app-store');
require('./style/grid.min.less');
require('./style/home.less');
require('./style/side-nav.less');
require('./style/icon-fonts.css');
require('./style/overlay.less');

var App =
  React.createClass({
    getInitialState: function() {
      return {
        showHome: 'true'
      }
    },
    showHome: function() {
      var showHome = AppStore.shouldShowHome();
      this.setState({showHome: showHome});
    },
    componentDidMount: function(){
      AppStore.on('change', this.showHome);
    },
    componentWillUnmount: function() {
      AppStore.removeListener('change', this.showHome);
    },
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
          <div id="home-wrapper" className={this.state.showHome ? '' : 'hide'}>
            <Home />
          </div>
          <Tracklist />

        </div>
      );
    }
  });
module.exports = App;
