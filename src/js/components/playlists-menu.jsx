var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');
require('../../style/playlists-menu.less');
var PlaylistsMenu =
  React.createClass({
    getInitialState: function() {
      var userPlaylists = AppStore.getUserPlaylists();
      return {
        userPlaylists: userPlaylists
      }
    },
    handleClick: function(playlist) {
      var track = AppStore.getTrack();
      this.addTrackToPlaylist(playlist, track);
    },
    addTrackToPlaylist: function(playlist, track) {
      var trackId = track;
      var selectedPlaylist = playlist;
      var trackIdsArray = [];
      var userId = AppStore.getUserId();
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
                var menu = document.getElementById("playlist-select-menu");
                menu.className = "";
                alert("tracks added to playlist!");

              }
            });
          } // end if

        });
      });
    },
    render: function(){
      that = this;
      return (
        <div id="playlist-select-menu">
          {
            this.state.userPlaylists.map(function(playlist){
              return (
                <button onClick={that.handleClick.bind(null, playlist)}>{playlist}</button>
              )
            })
          }
        </div>
      )
    }
  });
module.exports = PlaylistsMenu;
