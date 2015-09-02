var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var Track = require('./track.jsx');
require('../../style/playlist.less');
require('../../style/playlists-menu.less');

var Playlist =
  React.createClass({
    getInitialState: function() {
      return {playlists:[], newPlaylistName: 'Playlist'};
    },
    getUsersPlaylists: function() {
      var isLoggedIn = AppStore.isLoggedIn();
      if(isLoggedIn) {
        AppStore.getUserPlaylists();
      } else {
        AppActions.login();
      }
    },
    getPlaylists: function() {
      that = this;
      this.getUsersPlaylists();

      var userId = AppStore.getUserId();
      var url = 'https://api.soundcloud.com/users/'+userId+'/playlists.json?client_id=b5e21578d92314bc753b90ea7c971c1e';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var playlistArr = JSON.parse(xmlhttp.responseText);
          that.setState({playlists: playlistArr});
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    },
    selectPlaylist: function(playlist) {
      that = this;
      var trackId = AppStore.getTrack();
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
                that.getPlaylists();
              }
            });
          } // end if
        });
      });
    },
    namePlaylist: function() {
      document.getElementById('new-playlist').classList.add('show');
    },
    newPlaylist: function() {
      var playlistName = document.getElementById('playlist-name').value;
      var track = AppStore.getTrack();
      var tracks = [track].map(function(id) { return { id: id }; });

      SC.post('/playlists', { playlist: { title: playlistName, tracks: tracks } }, function(response, error){
        if(error){
          console.log("Some error occured: " + error.message);
        }else{
          var menu = document.getElementById("playlist-select-menu");
          menu.className = "";
          that.getPlaylists();
        }
      });

    },
    cancelSelectPlaylist: function() {
      document.getElementById("playlist-select-menu").classList.remove('show');
    },
    render: function() {
      that = this;
      return (
        <div>
          <button onClick={this.getPlaylists}>My playlists</button>

          <div className="playlist-wrapper">
            {this.state.playlists.map(function(playlist){
              return (
                <div className="row playlist" key={playlist.id}>
                  <h1>{playlist.title}</h1>
                  {playlist.tracks.map(function(track){
                    return (
                      <div className='col-md-12' key={track.id}>
                        <Track
                              title={track.title}
                              artwork={track.artwork_url}
                              id={track.id}
                              duration={track.duration}
                              author={track.user.username}
                              playlist={playlist.id}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <div id="playlist-select-menu">
            {this.state.playlists.map(function(playlist){
              return (
                <button onClick={that.selectPlaylist.bind(null, playlist.title)}>{playlist.title}</button>
              )
            })}
            <div id="new-playlist">
              <input type="text" value={this.state.newPalylist} id="playlist-name" />;
              <button onClick={that.newPlaylist}>Create</button>
            </div>
            <button onClick={that.namePlaylist}>+ New Playlist</button>
            <button onClick={that.cancelSelectPlaylist}>Cancel</button>
          </div>
        </div>
      );
    }
  });
module.exports = Playlist;
