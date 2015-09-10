var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var PlayerStore = require('../stores/player-store.js');
var Track = require('./track.jsx');
require('../../style/playlist.less');
require('../../style/playlists-menu.less');

var Playlist =
  React.createClass({
    getInitialState: function() {
      return {playlists:[], newPlaylistName: 'Playlist', track: ""};
    },
    logIn: function() {
      var isLoggedIn = AppStore.isLoggedIn();
      if(!isLoggedIn) {
        AppActions.login();
      }
    },
    getPlaylists: function() {
      var that = this;
      this.logIn();

      document.getElementById('playlist-wrapper').classList.remove('close');

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
    namePlaylist: function() {
      document.getElementById('new-playlist').classList.add('show');
    },
    newPlaylist: function() {
      var that = this;
      var playlistName = document.getElementById('playlist-name').value;
      var track = PlayerStore.getTrack().id;
      var tracks = [track].map(function(id) { return { id: id }; });
      SC.post('/playlists', { playlist: { title: playlistName, tracks: tracks } }, function(response, error){
        if(error){
          console.log("Some error occured: " + error.message);
        }else{
          // hide "choose playlist menu"
          document.getElementById("playlist-select-menu").classList.remove("show");
          //hide "new playlist" menu
          document.getElementById('new-playlist').classList.remove('show');
          that.getPlaylists();
        }
      });

    },
    cancelSelectPlaylist: function() {
      document.getElementById("playlist-select-menu").classList.remove('show');
    },
    closePlaylistPane: function(e) {
      document.getElementById('playlist-wrapper').classList.add('close');
    },
    removeTrack: function(trackId, playlistId) {
      var that = this;
      var trackID = trackId;
      var playlistID = playlistId;
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
            track.classList.add("remove_track");
          }
        });
      });
    },
    deleteTrack: function(trackId, playlistId, e) {
      var id = id;
      var isLoggedIn = AppStore.isLoggedIn();
      if(isLoggedIn) {
        this.removeTrack(trackId, playlistId);
      } else {
        login();
      }
    },
    deletePlaylist: function(id) {
      var playlistId = id;
      var url = 'https://api.soundcloud.com/playlists/'+playlistId+'?client_id=b5e21578d92314bc753b90ea7c971c1e';
      SC.connect(function() {
        SC.get('/me', function(me) {
          SC.delete(url, function(response, error){
            if(error){
              console.log("Some error occured: " + error.message);
            }else{
              console.log("playlist deleted");
              var playlist = document.getElementById(playlistId);
              playlist.classList.add("remove_playlist");

              //TODO remove playlist cookie

            }
          });
        });
      });
    },
    render: function() {
      var that = this;
      return (
        <div>
          <button onClick={this.getPlaylists}>My playlists</button>

          <div id="playlist-wrapper" className="close">
            <button onClick={this.closePlaylistPane}>X</button>
            {this.state.playlists.map(function(playlist){
              return (
                <div className="row playlist" key={playlist.id} id={playlist.id}>
                  <h1>{playlist.title}</h1>
                  <button onClick={that.deletePlaylist.bind(null, playlist.id)}>delete</button>
                  {playlist.tracks.map(function(track){
                    return (
                      <div className='col-md-12 playlist-track-wrapper' key={track.id} id={track.id}>
                        <Track
                              title={track.title}
                              artwork={track.artwork_url}
                              id={track.id}
                              duration={track.duration}
                              author={track.user.username}
                              playlist={playlist.id}
                        />
                        <div className="playlist-actions">
                          <button className="track-delete" onClick={that.deleteTrack.bind(null, track.id, playlist.id)}>Delete</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      );
    }
  });
module.exports = Playlist;
