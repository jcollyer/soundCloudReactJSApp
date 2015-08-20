var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var Track = require('./track.jsx');
require('../../style/playlist.less');
require('../../style/playlists-menu.less');

var isLoggedIn = false;
var titleNames = [];

var Playlist =
  React.createClass({
    getInitialState: function() {
      return {playlists:[]};
    },
    getUsersPlaylists: function() {
      var isLoggedIn = AppStore.isLoggedIn();
      if(isLoggedIn) {
        SC.get('/me/playlists', function(playlists) {
          playlists.forEach(function(playlist){
            var title = playlist.title;
            titleNames.push(title);
          });
        });
      } else {
        isLoggedIn = true;
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
                alert("tracks added to playlist!");
                that.getPlaylists();
              }
            });
          } // end if
        });
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
            <button onClick={that.cancelSelectPlaylist}>Cancel</button>
          </div>
        </div>
      );
    }
  });
module.exports = Playlist;
