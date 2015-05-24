/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');

getTrack = function(){
  return {track: AppStore.getTrack()}
};
var Player =
  React.createClass({
    player: '',
    widgetIframe: '',
    getInitialState: function() {
      return getTrack();
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
      player.getVolume(function(vol){
        if(vol == 1 ) {
          player.setVolume(0);
        } else {
          player.setVolume(1);
        }
      });
    },
    getPlayer: function() {
      // debugger;
      widgetIframe = document.getElementById('soundcloud_widget');
      player = SC.Widget(widgetIframe);
    },
    updateTrack:function(){
      this.setState({track: AppStore.getTrack()});
      this.getPlayer();

      player.bind(SC.Widget.Events.READY, function() {
        player.load(AppStore.getTrack());

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
        <div>
          <div id="current_time"></div>
          <button id="toggle" onClick={this.toggleTrack}>toggle</button>
          <button id="next" onClick={this.nextTrack}>Next</button>
          <button id="prev" onClick={this.prevTrack}>Prev</button>
          <button id="mute" onClick={this.muteToggleTrack}>Mute</button>


          <iframe id="soundcloud_widget" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1848538&show_artwork=true"></iframe>
        </div>
      );
    }
  });
module.exports = Player;







