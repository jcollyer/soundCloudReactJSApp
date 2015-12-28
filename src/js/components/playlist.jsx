var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var PlaylistsStore = require('../stores/playlists-store.js');
var PlayerStore = require('../stores/player-store.js');
var PlaylistsActions = require('../actions/playlists-actions.js');
var Track = require('./track.jsx');
require('../../style/playlists-menu.less');

var Playlist =
  React.createClass({
    getInitialState: function() {
      return {playlists:[], newPlaylistName: 'Playlist', track: ""};
    },
    getUserPlaylists: function() {
      var userId = AppStore.getUserId();
      if(!userId) {
        AppActions.login("playlist", null);
      } else {
        this.setPlaylists();
        PlaylistsActions.openPlaylists();
      }
    },
    setPlaylists: function() {
      var userPlaylists = PlaylistsStore.getPlaylists();
      this.setState({playlists: userPlaylists});
    },
    closePlaylistPane: function(e) {
      document.getElementById('playlist-wrapper').classList.remove('active-panel');
      document.getElementById("get-playlist-button").classList.remove("active-side-nav-button");
    },
    deleteTrack: function(trackId, playlistId, e) {
      if(!isLoggedInSC) {
        AppActions.login("playlist", trackId, "delete", playlistId);
      } else {
        var userId = AppStore.getUserId();
        PlaylistsActions.deletePlaylistTrack(userId, trackId, playlistId);
      }
    },
    deletePlaylist: function(playlistId) {
      if(!isLoggedInSC) {
        AppActions.login("playlist", 1, "delete", playlistId);
      } else {
        var userId = AppStore.getUserId();
        PlaylistsActions.deletePlaylist(userId, playlistId);
      }
    },
    componentDidMount: function(){
      PlaylistsStore.on('change', this.setPlaylists);
    },
    componentWillUnmount: function() {
      PlaylistsStore.removeListener('change', this.setPlaylists);
    },
    render: function() {
      var that = this;
      return (
        <div>
          <div onClick={this.getUserPlaylists} id="get-playlist-button" className="side-nav-link">
            <i className="side-nav-icon icon-folder"></i>
            <p className="side-nav-link-text">playlists</p>
          </div>

          <div id="playlist-wrapper" className="panel-box close">
            <div onClick={this.closePlaylistPane} className="playlist-close-button">
              <i className="icon-circle-cross"></i>
            </div>
            {this.state.playlists.reverse().map(function(playlist){
              return (
                <div className="playlist" key={playlist.id} id={playlist.id}>
                  <div className="playlist-title">
                    <div className="header-container">
                      <div className="header-line"></div>
                      <h3>{playlist.title}</h3>
                    </div>
                    <button onClick={that.deletePlaylist.bind(null, playlist.id)}>
                    delete
                    <i className="icon-trash"></i>
                    </button>
                  </div>

                  {playlist.tracks.reverse().map(function(track){
                    return (
                      <div className='playlist-track-wrapper' key={track.id} id={track.id}>
                        <Track
                              title={track.title}
                              artwork={track.artwork_url}
                              id={track.id}
                              duration={track.duration}
                              author={track.user.username}
                              playlist={playlist.id}
                              tags={track.tag_list}
                              user_id={track.user_id}
                        />
                        <div className="playlist-actions">
                          <div className="track-delete" onClick={that.deleteTrack.bind(null, track.id, playlist.id)}>
                            <i className="icon-trash"></i>
                          </div>
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
