var React = require('react');
var PlaylistModalActions = require('../actions/playlistModal-actions.js');
var AppActions = require('../actions/app-actions.js');
var PlaylistsActions = require('../actions/playlists-actions.js');
var PlaylistModalStore = require('../stores/playlistModal-store.js');
var PlaylistsStore = require('../stores/playlists-store.js');
var PlayerStore = require('../stores/player-store.js');
var AppStore = require('../stores/app-store.js');

var PlaylistModal =
  React.createClass({
    getInitialState: function() {
      return {playlists:[]}
    },
    open: function() {
      var that = this;
      setTimeout(function(){ //this hack is required for some reason when user signs in with cleared cache and localStorage
        var playlists = PlaylistsStore.getPlaylists();
        that.setState({playlists:playlists});
      },500)
      document.getElementById("playlist-select-modal").classList.add("show");
    },
    selectPlaylist: function(playlistId) {
      PlaylistsActions.addPlaylistTrack(playlistId);
    },
    namePlaylist: function() {
      document.getElementById('new-playlist').classList.add('show');
    },
    addPlaylist: function() {
      var playlistName = document.getElementById('playlist-name').value;
      var userId = AppStore.getUserId();
      PlaylistsActions.addPlaylist(userId, playlistName);
    },
    cancelSelectPlaylist: function() {
      document.getElementById("playlist-select-modal").classList.remove('show');
    },
    componentDidMount: function(){
      PlaylistModalStore.on('change', this.open);
    },
    componentWillUnmount: function() {
      PlaylistModalStore.removeListener('change', this.open);
    },
    render:function(){
      var that = this;
      return (

        <div id="playlist-select-modal">
          <button onClick={this.cancelSelectPlaylist} className='close-button'>
            <i className='icon-circle-cross'></i>
          </button>

          <h3>select playlist</h3>

          {this.state.playlists.map(function(playlist){
            return (
              <button key={playlist.id} onClick={that.selectPlaylist.bind(null, playlist.id)} className='add-to-playlist'>
                <i className='icon-circle-plus'></i>
                {playlist.permalink}
              </button>
            )
          })}
          <hr />

          <div className="new-playlist-wrapper">
            <h4>create new playlist</h4>
            <button onClick={this.namePlaylist} className='new-playlist-button'>+ New Playlist</button>
            <div id="new-playlist">
              <input type="text" id="playlist-name" />
              <button onClick={this.addPlaylist}>Create</button>
            </div>
          </div>
        </div>
      )
    }
  });
module.exports = PlaylistModal;
