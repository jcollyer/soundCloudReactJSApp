var React = require('react');
var PlayerStore = require('../stores/player-store.js');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');
var GenreActions = require('../actions/genre-actions.js');
var PlayerActions = require('../actions/player-actions.js');
var GenreActions = require('../actions/genre-actions.js');
require('../../style/player.less');
require('../../style/player.css');
var player = '';
var interval = 0;

var Player =
  React.createClass({
    widgetIframe: '',

    getInitialState: function() {
      return {
        id: "",
        title: "",
        author: "",
        artwork: "",
        user_id: "",
        duration: 0,
        currentTime: 0,
        playing: false,
        mute: false,
        tags: ["jelly","jamz"],
        uPlaylistNames: []
      };
    },
    toggleTrack: function() {
      var that = this;
      player.isPaused(function(paused){
        if(paused == true ) {
          that.playTrack();
        } else {
          that.pauseTrack();
        }
      });
    },
    playTrack: function() {
      player.play();
      this.setState({playing: true});
      this.getCurrentTimeInterval();
    },
    getCurrentTimeInterval: function() {
      var that = this;
      interval = setInterval(function(){
        console.log("hi");
        that.getCurrentTime();
      }, 300);
    },
    pauseTrack: function() {
      if (interval > 0) clearInterval(interval);
      player.pause();
      this.setState({playing: false});
    },
    muteToggle: function() {
      var that = this;
      player.getVolume(function(vol){
        if(vol == 1 ) {
          player.setVolume(0);
          that.setState({mute: true});
        } else {
          player.setVolume(1);
          that.setState({mute: false});
        }
      });
    },
    getPlayer: function() {
      var that = this;
      if (interval) clearInterval(interval);

      var widgetIframe = document.getElementById('soundcloud_widget');
      player = SC.Widget(widgetIframe);

      player.bind(SC.Widget.Events.READY, function(){
        player.load("https://api.soundcloud.com/tracks/"+that.state.id, {
          auto_play: true
        });
      });

      player.bind(SC.Widget.Events.FINISH, function() {
        clearInterval(interval);
        that.playNextTrack();
      });

      that.setState({playing: true});
      this.getCurrentTimeInterval();
    },
    playNextTrack: function() {
      var currentId = this.state.id;
      var tracks = PlayerStore.getTrackIds().ids;
      var index = tracks.indexOf(currentId)
      var nextTrack = tracks[index + 1];

      var url = 'https://api.soundcloud.com/tracks/'+nextTrack+'?client_id=b5e21578d92314bc753b90ea7c971c1e'
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var track = JSON.parse(xmlhttp.responseText);
          var artwork = track.artwork_url;
          PlayerActions.setTrack(nextTrack, track.duration, track.title, track.user.username, artwork);
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    },
    getCurrentTime: function() {
      var that = this;
      var duration = this.state.duration;
      player.getPosition(function(time){
        var currentTime = 100 * (time / duration);
        that.setState({currentTime: currentTime});
      })
    },
    updateTrack:function() {
      var track = PlayerStore.getTrack();
      this.setState({
        id: track.id,
        title: track.title,
        author: track.author,
        artwork: track.artwork,
        duration: track.duration,
        user_id: track.user_id,
        currentTime: 0,
        playing: false,
        mute: false
      });
      this.getPlayer();
      this.updateTags();

      // this seems smelly
      // var oldActiveTrack = document.querySelector("._active-track");
      // if (oldActiveTrack != null) oldActiveTrack.classList.remove("_active-track");
      // document.getElementById(track.id).classList.add("_active-track");
    },
    updateTrackTime: function(event) {
      var width = window.innerWidth;
      var xoffset = event.clientX;
      var duration = this.state.duration;
      var currentTime = (xoffset / width) * duration;
      var time = Math.floor(currentTime);
      player.seekTo(time);
    },
    favoriteTrack: function(id, e) {
      id = id;
      var isLoggedIn = AppStore.isLoggedIn();
      if(isLoggedIn) {
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
    displayArtistTracks: function(author) {
      GenreActions.setGenre({type: "author", name: author});
    },
    clickAddToPlaylist: function(id, e) {
      this.setState({uPlaylistNames:AppStore.getUserPlaylists()});
      var isLoggedIn = AppStore.isLoggedIn();
      if(isLoggedIn) {
        document.getElementById("playlist-select-menu").classList.add("show");
      } else {
        AppActions.login();
      }
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
    setTags: function() {
      var genre = {type: "genre", name: event.target.getAttribute("data-genre")};
      GenreActions.setGenre(genre);
      this.updateTags();
    },
    updateTags: function() {
      var tags = PlayerStore.getTags();
      this.setState({tags: tags});
    },
    componentDidMount: function(){
      PlayerStore.on('change', this.updateTrack);
    },
    componentWillUnmount: function() {
      PlayerStore.removeListener('change', this.updateTrack);
    },
    render: function() {
      var that = this;
      return (
        <div className="player">
          <div className="player-image">
            <img className="track-artwork" src={this.state.artwork} />
          </div>
          <div className="player-box">
            <div className="player-info">
              <div className="progress-container" onClick={this.updateTrackTime}>
                <div className="progress" style={{width: this.state.currentTime + '%'}} onClick={this.updateTrackTime}></div>
              </div>
              <p>{this.state.title}</p>
              <button onClick={this.displayArtistTracks.bind(null, this.state.user_id)}>{this.state.author}</button>
              <button id="toggle" onClick={this.toggleTrack} className={this.state.playing ? 'fa fa-pause' : 'fa fa-play'}></button>
              <button id="next" onClick={this.playNextTrack}>Next</button>
              <button id="prev" onClick={this.prevTrack}>Prev</button>
              <button id="mute" onClick={this.muteToggle} className={this.state.mute ? 'fa fa-volume-up' : 'fa fa-volume-off'}>Mute</button>

              <button className="track-favorite-add" onClick={this.favoriteTrack.bind(null, this.state.id)}>Favorite</button>
              <button className="track-playlist-add" onClick={this.clickAddToPlaylist}>+Playlist</button>
            </div>
            <div className="player-tags">
              {this.state.tags.map(function(tag){
                var cleanTag = tag.replace(/['"]+/g, '');
                return (
                  <button onClick={that.setTags} data-genre={tag}>{cleanTag}</button>
                )
              })}
            </div>
          </div>

          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>
          <div id="playlist-select-menu">
            {this.state.uPlaylistNames.map(function(playlist){
              return (
                <button onClick={that.selectPlaylist.bind(null, playlist.name)}>{playlist.name}</button>
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
module.exports = Player;
