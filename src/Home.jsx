var React = require('react');
var Login = require('./js/components/login.jsx');
var Genre = require('./js/components/genre.jsx');
var Playlist = require('./js/components/playlist.jsx');
var TrackList = require('./js/components/tracklist.jsx');
require('./style/grid.min.less');
require('./style/home.less');

var Home =
  React.createClass({
    render: function() {
      return (
        <div>
          <Playlist />
          <Login />
          <Genre />
          <TrackList />
        </div>
      );
    }
  });
module.exports = Home;
