var React = require('react');
var PlayerActions = require('../actions/player-actions.js');
var AppActions = require('../actions/app-actions.js');

require('../../style/track.less');


var Track =
  React.createClass({
    handleClick: function() {
      PlayerActions.setTrack(this.props.id);
      PlayerActions.setTrackDuration(this.props.duration);
      PlayerActions.setTrackTitle(this.props.title);
      PlayerActions.setTrackAuthor(this.props.author);
      PlayerActions.setTrackArtwork(this.props.artwork);
    },
    add: function(id, e) {

      id = id;
      SC.get('/me/playlists', function(playlist) {
        var oTracksIds = [];
        var titleNames = [];

        //hardcoding first playlist tracks
        var oTracks = playlist[0].tracks;

        //get all the tracks from selected playlist
        oTracks.forEach(function (track){
          oTracksIds.push(track.id);
        });

        //add new track to selected playlist
        oTracksIds.push(id);

        //i don't know how to add to playlist, so i'm setting the tracks equal to all the existing tracks, plus the new track.
        var tracks = oTracksIds.map(function(id) { return { id: id }; });
        SC.put(playlist[0].uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            console.log("tracks added to playlist!");
          }
        });

      });
    },
    addTrackToPlaylist: function(id, e) {
      if(window.isLoggedIn) {
        this.add(id, e);
      } else {
        window.isLoggedIn = true;
        AppActions.login();
        this.add(id, e);
      }
    },
    favoriteTrack: function(id, e) {
      id = id;
      if(window.isLoggedIn) {
        SC.put('/me/favorites/'+id, function(status, error) {
          if (error) {
            alert("Error: " + error.message);
          } else {
            alert("Favorite:  " + id);
          }
        });
      } else {
        window.isLoggedIn = true;
        AppActions.login();
      }
    },
    removeTrack: function(id, e) {
      SC.get('/me/playlists', { limit: 1 }, function(playlist) {
        var oTracksIds = [];
        var oTracks = playlist[0].tracks;
        oTracks.forEach(function (track){
          var stringifyIDs = JSON.stringify(track.id)
          oTracksIds.push(stringifyIDs);
        });

        var i = oTracksIds.indexOf(id);
        if (i > -1) oTracksIds.splice(i, 1);

        var tracks = oTracksIds.map(function(id) { return { id: id }; });
        SC.put(playlist[0].uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            console.log("track removed from playlist!");
          }
        });
      });
    },
    deleteTrack: function(id, e) {
      id = id;
      if(isLoggedIn) {
        this.removeTrack(id);
      } else {
        login();
      }
    },
    render: function() {
      return (
        <div className="track">
          <img src={this.props.artwork} onClick={this.handleClick} />
          <p>{this.props.title}</p>
          <p><b>{this.props.author}</b></p>
          <button onClick={this.deleteTrack.bind(null, this.props.id)}>Delete</button>
          <button onClick={this.favoriteTrack.bind(null, this.props.id)}>Favorite</button>
          <button onClick={this.addTrackToPlaylist.bind(null, this.props.id)}>+Playlist</button>
        </div>
      );
    }
  });
module.exports = Track;
