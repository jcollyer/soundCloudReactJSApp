var React = require('react');
var AppStore = require('../stores/app-store.js');
require('../../style/player.less');

var Player =
  React.createClass({
    player: '',
    widgetIframe: '',

    getInitialState: function() {
      return {
        track: AppStore.getTrack(),
        duration: AppStore.getTrackDuration(),
        title: AppStore.getTrackTitle(),
        author: AppStore.getTrackAuthor(),
        artwork: AppStore.getTrackArtwork(),
        time: '',
        playing: false,
        mute: false
      };
    },
    toggleTrack: function() {
      player.toggle();
    },
    nextTrack: function() {
      var player = player || this.getPlayer();
      player.next();
    },
    prevTrack: function() {
      var player = player || this.getPlayer();
      player.prev();
    },
    muteToggleTrack: function() {
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
      widgetIframe = document.getElementById('soundcloud_widget');
      player = SC.Widget(widgetIframe);
    },
    updateTrack:function() {
      that = this;
      this.setState({
        track: AppStore.getTrack(),
        title: AppStore.getTrackTitle(),
        author: AppStore.getTrackAuthor(),
        artwork: AppStore.getTrackArtwork(),
        duration: AppStore.getTrackDuration(),
        playing: false,
        mute: false
      });
      this.getPlayer();

      player.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
        var duration = that.state.duration;

        player.getPosition(function(time){
          var currentTime = time;
          var time = (currentTime / (duration/10))*10;
          that.setState({time: time});
        })
      });

      player.bind(SC.Widget.Events.READY, function() {
        that.setState({playing: false});
        player.load(AppStore.getTrack(), {
          auto_play: true
        });

        player.bind(SC.Widget.Events.PLAY, function() {
          that.setState({playing: true});
        });

        player.bind(SC.Widget.Events.PAUSE, function() {
          that.setState({playing: false});
        });


        player.bind(SC.Widget.Events.SEEK, function() {

        });

        player.bind(SC.Widget.Events.FINISH, function() {
          console.log("track finished");
          // player.load(newSoundUrl, {
          //    how_artwork: false
          // });
        });
      });


    },
    componentDidMount: function(){
      AppStore.on('change', this.updateTrack);
      // this.getTrack(AppStore.getTrack());
    },
    componentWillUnmount: function() {
      AppStore.removeListener('change', this.updateTrack);
    },
    render: function() {
      return (
        <div className="player">
          <h1>{this.state.title}</h1>
          <h1>{this.state.author}</h1>
          <img src={this.state.artwork} />
          <div className="progress" style={{width: this.state.time + '%'}}></div>
          <button id="toggle" onClick={this.toggleTrack} className={this.state.playing ? 'fa fa-pause' : 'fa fa-play'}></button>
          <button id="next" onClick={this.nextTrack}>Next</button>
          <button id="prev" onClick={this.prevTrack}>Prev</button>
          <button id="mute" onClick={this.muteToggleTrack} className={this.state.mute ? 'fa fa-volume-up' : 'fa fa-volume-off'}>Mute</button>

          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>
        </div>
      );
    }
  });
module.exports = Player;
