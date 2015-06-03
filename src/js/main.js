/** @jsx React.DOM */
var APP = require('./components/app');
var React = require('react');

// React.render(
//   <APP />,
//   document.getElementById('main'));


var titleNames = [];
var getUsersPlaylists = function() {
  SC.get('/me/playlists', function(playlists) {

    playlists.forEach(function(playlist){
      var title = playlist.title;
      titleNames.push(title);
    });
  });
};

var player;
playerReady = function() {
  console.log("track ready!");
};

var MyTracksButton = React.createClass({
  getInitialState: function() {
    return {tracks:[]};
  },
  handleClick: function() {
    getUsersPlaylists();
    $.ajax({
      // url: this.props.url,
      url: 'https://api.soundcloud.com/users/143543661/playlists.json?client_id=b5e21578d92314bc753b90ea7c971c1e',
      dataType: 'json',
      success: function(playlists) {
        this.setState({tracks: playlists[0].tracks});
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
        console.error('http://api.soundcloud.com/playlists/405726.json?client_id=b5e21578d92314bc753b90ea7c971c1e', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <button onClick={this.handleClick}>My Tracks</button>
        <MyTracks tracks={this.state.tracks} />
      </div>
    );
  }
});

