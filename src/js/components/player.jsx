var React = require('react');
var PlayerStore = require('../stores/player-store.js');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');
require('../../style/player.less');

var Player =
  React.createClass({
    player: '',
    widgetIframe: '',
    interval: 0,

    getInitialState: function() {
      return {
        title: "",
        author: "",
        artwork: "",
        duration: "",
        currentTime: "",
        playing: false,
        mute: false
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
      that.setState({playing: true});
      this.getCurrentTimeInterval();
    },
    getCurrentTimeInterval: function() {
      this.interval = setInterval(function(){
        console.log("hi");
        // that.getCurrentTime();
      }, 100);
    },
    pauseTrack: function() {
      if (that.interval > 0) clearInterval(that.interval);
      player.pause();
      that.setState({playing: false});
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
      if (that.interval) clearInterval(that.interval);

      var widgetIframe = document.getElementById('soundcloud_widget');
      var player;
      player = SC.Widget(widgetIframe);
      player.bind(SC.Widget.Events.READY, function(){
        player.load("https://api.soundcloud.com/tracks/"+this.state.track.id, {
          auto_play: true
        });
      });

      that.setState({playing: true});
      this.getCurrentTimeInterval();

    },
    getCurrentTime: function() {
      var duration = that.state.duration;
      player.getPosition(function(time){
        var currentTime = 100 * (time / duration);
        that.setState({currentTime: currentTime});
      })
    },
    updateTrack:function() {
      var track = PlayerStore.getTrack();
      this.setState({
        title: track.title,
        author: track.author,
        artwork: track.artwork,
        duration: track.duration,
        currentTime: 0,
        playing: false,
        mute: false
      });

      this.getPlayer();
    },
    updateTrackTime: function() {
      var width = window.innerWidth;
      var xoffset = event.clientX;
      var duration = this.state.duration;
      currentTime = (xoffset / width) * duration;
      time = Math.floor(currentTime);
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
    componentDidMount: function(){
      PlayerStore.on('change', this.updateTrack);
    },
    componentWillUnmount: function() {
      PlayerStore.removeListener('change', this.updateTrack);
    },
    render: function() {
      return (
        <div className="player">
          <div className="progress-container" onClick={this.updateTrackTime}>
            <div className="progress" style={{width: this.state.currentTime + '%'}} onClick={this.updateTrackTime}></div>
          </div>
          <div className="player-box">
            <div className="player-image">
              <img className="track-artwork" src={this.state.artwork} />
            </div>
            <div className="player-info">
              <p>{this.state.title}</p>
              <h1>{this.state.author}</h1>
              <button id="toggle" onClick={this.toggleTrack} className={this.state.playing ? 'fa fa-pause' : 'fa fa-play'}></button>
              <button id="next" onClick={this.nextTrack}>Next</button>
              <button id="prev" onClick={this.prevTrack}>Prev</button>
              <button id="mute" onClick={this.muteToggle} className={this.state.mute ? 'fa fa-volume-up' : 'fa fa-volume-off'}>Mute</button>

              <button className="track-favorite-add" onClick={this.favoriteTrack.bind(null, this.state.track)}>Favorite</button>


            </div>
          </div>

          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>
        </div>
      );
    }
  });
module.exports = Player;
