var React = require('react');
var PlaylistModalActions = require('../actions/playlistModal-actions.js');
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
      document.getElementById("playlist-select-menu").classList.add("show");
    },
    selectPlaylist: function(playlistId) {
      PlaylistsActions.addPlaylist(playlistId);
    },
    namePlaylist: function() {
      document.getElementById('new-playlist').classList.add('show');
    },
    newPlaylist: function() {
      if(!this.state.connectedToSoundCloud) {
        this.setState({connectedToSoundCloud: true});
        var playlistTitle = document.getElementById("playlist-name").value;

        AppActions.login("playlistTitle", null, playlistTitle);
      } else {
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
            alert('track added to newly created playlist!');
          }
        });
      }
    },
    cancelSelectPlaylist: function() {
      document.getElementById("playlist-select-menu").classList.remove('show');
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

        <div id="playlist-select-menu">
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
              <input type="text" value="" id="playlist-name" />
              <button onClick={this.newPlaylist}>Create</button>
            </div>
          </div>
        </div>
      )
    }
  });
module.exports = PlaylistModal;
