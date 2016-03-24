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
        timeInSeconds: 0,
        durationInSeconds: 0,
        currentVolume: 70,
        playing: false,
        tags: [],
        uPlaylistNames: [],
        connectedToSoundCloud: false,
        playbackInterval: 0,
        volumeDragging: false,
        progressDragging: false
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
      this.state.playbackInterval = setInterval(function(){
        that.getCurrentTime();
      }, 300);
    },
    pauseTrack: function() {
      if (this.state.playbackInterval > 0) clearInterval(this.state.playbackInterval);
      player.pause();
      this.setState({playing: false});
    },
    volumeMoving:function(e) {
      var volumeOffset = document.getElementById("volume-container").offsetTop;
      var playerHeight = document.getElementById("player-wrapper").clientHeight;
      var yOffset = e.clientY - volumeOffset;
      var max = 100;
      var min = 0;
      var volume = 0;

      //TODO find a more dynamic way to calculate this
      volume = (52 - yOffset) * 2;

      if(volume > max ) {
        volume = max;
      } else if(volume < min){
        volume = min;
      }

      player.setVolume(volume/100);
      this.setState({currentVolume: volume});
    },
    updateTrackVolumeMouseUp:function(e) {
      this.setState({volumeDragging: false});
    },
    updateTrackVolume:function(e) {
      this.setState({volumeDragging: true});
    },
    getPlayer: function() {
      var that = this;
      if (this.state.playbackInterval) clearInterval(this.state.playbackInterval);

      var widgetIframe = document.getElementById('soundcloud_widget');
      player = SC.Widget(widgetIframe);

      player.bind(SC.Widget.Events.READY, function(){
        player.load("https://api.soundcloud.com/tracks/"+that.state.id, {
          auto_play: true
        });
      });

      player.bind(SC.Widget.Events.FINISH, function() {
        clearInterval(that.state.playbackInterval);
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
          var artwork = track.artwork_url? track.artwork_url.replace('large', 't200x200') : "";
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
        var currentTime = 100 * (time / duration);
        var timeInSeconds = that.toHHMMSS(time);
        that.setState({currentTime: currentTime, timeInSeconds: timeInSeconds});
      })
    },
    toHHMMSS: function (time) {
      time = Number(time)/1000;
      var h = Math.floor(time / 3600);
      var m = Math.floor(time % 3600 / 60);
      var s = Math.floor(time % 3600 % 60);

      return (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s;
    },
    updateTrack:function() {
      var track = PlayerStore.getTrack();
      this.setState({
        id: track.id,
        title: track.title,
        author: track.author,
        artwork: track.artwork,
        duration: track.duration,
        durationInSeconds: this.toHHMMSS(track.duration),
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
    updateStopTrackProgress:function(e) {
      this.setState({progressDragging: false});
    },
    updateTrackProgress:function(e) {
      this.setState({progressDragging: true});
    },
    stopTrackUpdateProgress:function() {

    },
    updateTrackTime: function(event) {
      var progress = document.getElementById("progress-container");
      var width = progress.clientWidth;
      var targetOffest = progress.offsetLeft;
      var xoffset = event.clientX - targetOffest;
      var duration = this.state.duration;
      var max = 100;
      var min = 0;
      var currentTime;
      var currentTimePercentage;
      var timeInSeconds;

      // current time in percentage
      currentTime = Math.floor((xoffset / width) * duration);

      // update progress bar - this is here so it works while track is paused
      var currentTimePercentage = 100 * (currentTime / duration);
      if(currentTimePercentage > 99) {
        currentTimePercentage = max;
        currentTime = duration - 1;
      } else if(currentTimePercentage < 1) {
        currentTimePercentage = min;
        currentTime = 0;
      }

      // update the timeInSeconds, eg: "2:33"
      timeInSeconds = this.toHHMMSS(this.state.duration * Math.floor(currentTimePercentage)/100);

      // update UI
      this.setState({currentTime: currentTimePercentage, timeInSeconds: timeInSeconds});

      // update SoundCloud player
      player.seekTo(currentTime);
    },
    displayArtistTracks: function(author) {
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
            <img className={this.state.playing ? "track-artwork record-spin" : "track-artwork"} src={this.state.artwork} />
            <div className="playlist-controls">
              <button id="prev" onClick={this.clickPrevTrack}>
                <div className="icon-skip-back"></div>
              </button>
              <button id="toggle" onClick={this.toggleTrack}>
                <i className={this.state.playing ? 'icon-pause2' : 'icon-play2'}></i>
              </button>
              <button id="next" onClick={this.clickNextTrack}>
                <div className="icon-skip-forward"></div>
              </button>
            </div>
          </div>
          <div className="player-box">
            <div className="player-info">
              <div className="player-actions">
                <button onClick={this.favoriteTrack.bind(null, this.state.id)}>
                  <i className="icon-heart"></i>
                </button>
                <button onClick={this.clickAddToPlaylist.bind(null, this.state.id)}>
                  <i className="icon-circle-plus"></i>
                </button>
              </div>
              <div className="player-details">
                <h4>{this.state.title}</h4>
                <h3 onClick={this.displayArtistTracks.bind(null, this.state.user_id)}>{this.state.author}</h3>
                <div id="progress-data">
                  <span>{ this.state.timeInSeconds}</span>
                  <div id="progress-container"
                       onClick={this.updateTrackTime}
                       onMouseDown={this.updateTrackProgress}
                       onMouseUp={this.updateStopTrackProgress}
                       onMouseLeave={this.updateStopTrackProgress}>
                    <div className="progress" onMouseMove={this.state.progressDragging ? this.updateTrackTime : null} style={{width: this.state.currentTime + '%'}}></div>
                  </div>
                  <span>{this.state.durationInSeconds}</span>
                </div>
              </div>
            </div>
            <div className="player-tags">
              <div className="player-tag-buttons">
                {this.state.tags.map(function(tag){
                  var cleanTag = tag.replace(/['"]+/g, '');
                  return (
                    <button onClick={that.setTags} data-genre={cleanTag} key={tag}>{cleanTag}</button>
                  )
                })}
              </div>
            </div>
            <div className="track-options">
              <div className="player-volume">
                <i className='icon-volume noselect'></i>
                <div id="volume-container" onClick={this.volumeMoving} onMouseDown={this.updateTrackVolume} onMouseUp={this.updateTrackVolumeMouseUp}>
                  <div id="volume-bar" onMouseMove={this.state.volumeDragging ? this.volumeMoving : null} style={{height: this.state.currentVolume + '%'}}></div>
                </div>
                <i className='icon-mute noselect'></i>
              </div>
            </div>
          </div>

          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameBorder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>

        </div>
      );
    }
  });
module.exports = Player;
