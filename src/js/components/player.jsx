var React = require('react');
var PlayerStore = require('../stores/player-store.js');
require('../../style/player.less');

var Player =
  React.createClass({
    player: '',
    widgetIframe: '',
    interval: 0,

    getInitialState: function() {
      return {
        track: PlayerStore.getTrack(),
        duration: PlayerStore.getTrackDuration(),
        title: PlayerStore.getTrackTitle(),
        author: PlayerStore.getTrackAuthor(),
        artwork: PlayerStore.getTrackArtwork(),
        currentTime: 0,
        playing: false,
        mute: false
      };
    },
    toggleTrack: function() {
      that = this;
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
      that.interval = setInterval(function(){
        console.log("hi");
        that.getCurrentTime();
      }, 100);
    },
    pauseTrack: function() {
      if (that.interval > 0) clearInterval(that.interval);
      player.pause();
      that.setState({playing: false});
    },
    muteToggle: function() {
      that = this;
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
      if (that.interval) clearInterval(that.interval);

      that = this;

      widgetIframe = document.getElementById('soundcloud_widget');
      player = SC.Widget(widgetIframe);

      player.bind(SC.Widget.Events.READY, function(){
        player.load("http://api.soundcloud.com/tracks/"+that.state.track, {
          auto_play: true
        });
      });

      that.setState({playing: true});

      that.interval = setInterval(function(){
        console.log("hi");
        that.getCurrentTime();
      }, 100);

    },
    getCurrentTime: function() {
      var duration = that.state.duration;
      player.getPosition(function(time){
        var currentTime = 100 * (time / duration);
        that.setState({currentTime: currentTime});
      })
    },
    updateTrack:function() {
      that = this;
      console.log(PlayerStore.getTrackTitle())
      this.setState({
        track: PlayerStore.getTrack(),
        title: PlayerStore.getTrackTitle(),
        author: PlayerStore.getTrackAuthor(),
        artwork: PlayerStore.getTrackArtwork(),
        duration: PlayerStore.getTrackDuration(),
        currentTime: 0,
        playing: false,
        mute: false
      });

      //hack - i need to figure out my syncronys situation
      window.setTimeout(function(){
        that.getPlayer();
      }, 1);

    },
    updateTrackTime: function() {
      var width = window.innerWidth;
      var xoffset = event.clientX;
      var duration = this.state.duration;
      currentTime = (xoffset / width) * duration;
      time = Math.floor(currentTime);
      player.seekTo(time);
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
              <h1>{this.state.title}</h1>
              <h1>{this.state.author}</h1>
              <button id="toggle" onClick={this.toggleTrack} className={this.state.playing ? 'fa fa-pause' : 'fa fa-play'}></button>
              <button id="next" onClick={this.nextTrack}>Next</button>
              <button id="prev" onClick={this.prevTrack}>Prev</button>
              <button id="mute" onClick={this.muteToggle} className={this.state.mute ? 'fa fa-volume-up' : 'fa fa-volume-off'}>Mute</button>
            </div>
          </div>

          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>
        </div>
      );
    }
  });
module.exports = Player;
