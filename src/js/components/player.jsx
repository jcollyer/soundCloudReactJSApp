var React = require('react');
var PlayerStore = require('../stores/player-store.js');
var PlaylistsStore = require('../stores/playlists-store.js');
var AppActions = require('../actions/app-actions.js');
var GenreActions = require('../actions/genre-actions.js');
var PlayerActions = require('../actions/player-actions.js');
var PlaylistModalActions = require('../actions/playlistModal-actions.js');
var FavoritesActions = require('../actions/favorites-actions.js');
require('../../style/player.less');
require('../../style/player.css');
var player = '';
var interval = 0;
var nextTrack = "";

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
        currentVolume: 70,
        playing: false,
        tags: [],
        uPlaylistNames: [],
        connectedToSoundCloud: false
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
      player.setVolume(this.state.currentVolume);
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
    lowerTrackVolume: function() {
      var newVolume = this.state.currentVolume - 10;
      var newSCVolume = newVolume/100;
      player.setVolume(newSCVolume);
      this.setState({currentVolume: newVolume});
    },
    increaseTrackVolume: function() {
      var newVolume = this.state.currentVolume + 10;
      var newSCVolume = newVolume/100;
      player.setVolume(newSCVolume);
      this.setState({currentVolume: newVolume});
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
        that.clickNextTrack();
      });

      that.setState({playing: true});
      this.getCurrentTimeInterval();
    },
    clickPrevTrack: function() {
      var currentId = this.state.id;
      var tracks = PlayerStore.getTrackIds().ids;
      var index = tracks.indexOf(currentId)
      nextTrack = tracks[index - 1];
      this.playNextOrPrevTrack();
    },
    clickNextTrack: function() {
      var currentId = this.state.id;
      var tracks = PlayerStore.getTrackIds().ids;
      var index = tracks.indexOf(currentId)
      nextTrack = tracks[index + 1];
      this.playNextOrPrevTrack();
    },
    playNextOrPrevTrack: function() {
      var url = 'https://api.soundcloud.com/tracks/'+nextTrack+'?client_id=b5e21578d92314bc753b90ea7c971c1e'
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var track = JSON.parse(xmlhttp.responseText);
          var artwork = track.artwork_url;
          PlayerActions.setTags(track.tag_list);
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
        // not sure if i like this
        if (time > 0 && time < 2000){
          document.getElementById("overlay").classList.remove("show");
        }
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
        playing: false
      });
      this.getPlayer();
      this.updateTags();

      // this seems smelly
      // var oldActiveTrack = document.querySelector("._active-track");
      // if (oldActiveTrack != null) oldActiveTrack.classList.remove("_active-track");
      // document.getElementById(track.id).classList.add("_active-track");
    },
    updateTrackTime: function(event) {
      var width = document.getElementById("progress-container").clientWidth;
      var xoffset = event.clientX - 110;
      var duration = this.state.duration;
      var currentTime = (xoffset / width) * duration;
      var time = Math.floor(currentTime);
      // update SoundCloud player
      player.seekTo(time);

      // update progress bar - this is here so it works while track is paused
      var currentTime = 100 * (time / duration);
      this.setState({currentTime: currentTime});
    },
    displayArtistTracks: function(author) {
      window.location.hash = "";
      GenreActions.setGenre({type: "author", name: author});
    },
    favoriteTrack: function(id, e) {
      if(!this.state.connectedToSoundCloud) {
        this.setState({connectedToSoundCloud: true});
        AppActions.login("favorite", id);
      } else {
        FavoritesActions.addFavorite(id);
      }
    },
    clickAddToPlaylist: function(id, e) {
      if(!this.state.connectedToSoundCloud) {
        this.setState({connectedToSoundCloud: true});
        AppActions.login("playlistModal");
      } else {
        PlaylistModalActions.open();
      }
    },
    setTags: function() {
      window.location.hash = "";
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
            <img className="track-artwork record-spin" src={this.state.artwork} />
          </div>
          <div className="player-box">
            <div className="player-info">
              <div className="player-actions">
                <button className="track-favorite-add" onClick={this.favoriteTrack.bind(null, this.state.id)}>
                  <div className="icon-heart"></div>
                </button>
                <button className="track-playlist-add" onClick={this.clickAddToPlaylist.bind(null, this.state.id)}>
                  <div className="icon-circle-plus"></div>
                </button>
              </div>
              <div className="player-details">
                <h4>{this.state.title}</h4>
                <h3 onClick={this.displayArtistTracks.bind(null, this.state.user_id)}>{this.state.author}</h3>
              </div>
              <div className="playlist-controls">
                <div className="player-seek">
                  <button id="prev" onClick={this.clickPrevTrack}>
                    <div className="icon-skip-back"></div>
                  </button>
                  <button id="toggle" onClick={this.toggleTrack}>
                    <i className={this.state.playing ? 'icon-pause' : 'icon-play'}></i>
                  </button>
                  <button id="next" onClick={this.clickNextTrack}>
                    <div className="icon-skip-forward"></div>
                  </button>
                </div>
              </div>
            </div>
            <div className="player-tags">
              <h3>tags</h3>
              <div className="player-tag-buttons">
                {this.state.tags.map(function(tag){
                  var cleanTag = tag.replace(/['"]+/g, '');
                  return (
                    <button onClick={that.setTags} data-genre={cleanTag} key={tag}>{cleanTag}</button>
                  )
                })}
              </div>
            </div>
            <div className="player-volume">
              <div id="volume-container">
                <div id="volume-bar" style={{height: this.state.currentVolume + '%'}}></div>
              </div>
              <button onClick={this.increaseTrackVolume} className='icon-volume'></button>
              <button onClick={this.lowerTrackVolume} className='icon-mute'></button>
            </div>
            <div id="progress-container" onClick={this.updateTrackTime}>
              <div className="progress" style={{width: this.state.currentTime + '%'}}></div>
            </div>
          </div>

          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>

        </div>
      );
    }
  });
module.exports = Player;
