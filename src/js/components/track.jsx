var React = require('react');
var PlayerActions = require('../actions/player-actions.js');
var AppActions = require('../actions/app-actions.js');

require('../../style/track.less');


var Track =
  React.createClass({
    handleClick: function() {
      oldActiveTrack = document.querySelector("._active-track");
      if (oldActiveTrack != null) oldActiveTrack.classList.remove("_active-track");
      event.target.classList.add("_active-track");

      PlayerActions.setTrack(this.props.id);
      PlayerActions.setTrackDuration(this.props.duration);
      PlayerActions.setTrackTitle(this.props.title);
      PlayerActions.setTrackAuthor(this.props.author);
      PlayerActions.setTrackArtwork(this.props.artwork);
    },
    addTrack: function(id, e) {
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
        this.addTrack(id, e);
      } else {
        AppActions.login();
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
        AppActions.login();

      }
    },
    removeTrack: function(id, e) {
      SC.get('/me/playlists', { limit: 1 }, function(playlist) {
        var oTracksIds = [];
        var oTracks = playlist[0].tracks;
        oTracks.forEach(function (track){
          // var stringifyIDs = JSON.stringify(track.id)
          oTracksIds.push(track.id);
        });

        var i = oTracksIds.indexOf(id);
        debugger;
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
          <div className="track-image">
            <img src={this.props.artwork} onClick={this.handleClick} />
          </div>
          <div className="track-info">
            <p className="title">{this.props.title}</p>
            <p className="author">{this.props.author}</p>
          </div>
          <div className="track-actions">
            <button className="track-delete" onClick={this.deleteTrack.bind(null, this.props.id)}>Delete</button>
            <button className="track-favorite-add" onClick={this.favoriteTrack.bind(null, this.props.id)}>Favorite</button>
            <button className="track-playlist-add" onClick={this.addTrackToPlaylist.bind(null, this.props.id)}>+Playlist</button>
          </div>
        </div>
      );
    }
  });
module.exports = Track;
