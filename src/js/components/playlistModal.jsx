var React = require('react');
var PlaylistModalActions = require('../actions/playlistModal-actions.js');
var PlaylistModalStore = require('../stores/playlistModal-store.js');
var PlaylistsStore = require('../stores/playlists-store.js');

var PlaylistModal =
  React.createClass({
    getInitialState: function() {
      return {uPlaylistNames:["red","green"]}
    },
    open: function() {
      var titles = PlaylistsStore.getPlaylistsTitles();
      this.setState({uPlaylistNames:titles});
      document.getElementById("playlist-select-menu").classList.add("show");
    },
    selectPlaylist: function(playlist) {
      var that = this;
      var trackId = PlayerStore.getTrack().id;
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
                document.getElementById("playlist-select-menu").classList.remove("show");
                alert("track added to playlist!");
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
          {this.state.uPlaylistNames.map(function(playlist){
            return (
              <button onClick={that.selectPlaylist.bind(null, playlist.name)} className='add-to-playlist'>
                <i className='icon-circle-plus'></i>
                {playlist.name}
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
