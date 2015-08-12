var React = require('react');
var Login = require('./js/components/login.jsx');
var Genre = require('./js/components/genre.jsx');
var Playlist = require('./js/components/playlist.jsx');
var PlaylistMenu = require('./js/components/playlists-menu.jsx');
require('./style/grid.min.less');
require('./style/home.less');

var Home =
  React.createClass({
    render: function() {
      return (
        <div>
          <PlaylistMenu />
          <Playlist />
          <Login />
          <Genre />
        </div>
      );
    }
  });
module.exports = Home;
