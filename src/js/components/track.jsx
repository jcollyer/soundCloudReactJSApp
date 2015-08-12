var React = require('react');
var PlayerActions = require('../actions/player-actions.js');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');

require('../../style/track.less');

var Track =
  React.createClass({
    handleClick: function () {
      oldActiveTrack = document.querySelector("._active-track");
      if (oldActiveTrack != null) oldActiveTrack.classList.remove("_active-track");
      event.target.classList.add("_active-track");

      PlayerActions.setTrack(this.props.id);
      PlayerActions.setTrackDuration(this.props.duration);
      PlayerActions.setTrackTitle(this.props.title);
      PlayerActions.setTrackAuthor(this.props.author);
      PlayerActions.setTrackArtwork(this.props.artwork);
    },
    addTrack: function() {
      var menu = document.getElementById("playlist-select-menu");
      menu.className = menu.className + "show";
      // this.addTrackToPlaylist();
    },
    addTrackToPlaylist: function(id, e) {
      var trackId = id;
      var trackIdsArray = [];
      var userId = AppStore.getUserId();

      // change!!!!
      var selectedPlaylist = "soma";

      SC.get('/users/'+userId+'/playlists', function(playlists) {

        playlists.forEach(function(playlist) {
          // Get selected playlist
          if (selectedPlaylist === playlist.title) {

            playlist.tracks.forEach(function (track){
              // Add existing tracks to array
              trackIdsArray.push(track.id);
            });
            // Add new track to array
            trackIdsArray.push(trackId);
            // Turn track array into objects
            var tracks = trackIdsArray.map(function(id) { return { id: id }; });
            // Add tracks to playlist
            SC.put(playlist.uri, { playlist: { tracks: tracks } }, function(response, error){
              if(error){
                console.log("Some error occured: " + error.message);
              }else{
                console.log("tracks added to playlist!");
              }
            });
          } // end if

        });
      });
    },
    clickAddToPlaylist: function(id, e) {
      var isLoggedIn = AppStore.isLoggedIn();
      if(isLoggedIn) {
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
      that = this;
      trackID = id;
      var playlistID = this.props.playlist;
      var trackToRemove;

      SC.get('http://api.soundcloud.com/playlists/'+playlistID+'?client_id=b5e21578d92314bc753b90ea7c971c1e', function(playlist) {
        var newTrackList = [];
        playlist.tracks.forEach(function(track) {
          if(trackID !== track.id) {
            newTrackList.push({id:track.id});
          }
        });
        // Update playlist with tracks minus deleted track
        SC.put(playlist.uri, { playlist: { tracks: newTrackList } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            var track = document.getElementById(trackID);
            track.className = track.className + " remove_track";
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
        <div className="track" id={this.props.id}>
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
            <button className="track-playlist-add" onClick={this.clickAddToPlaylist.bind(null, this.props.id)}>+Playlist</button>
          </div>
        </div>
      );
    }
  });
module.exports = Track;
