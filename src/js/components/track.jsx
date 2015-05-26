var React = require('react');
var AppActions = require('../actions/app-actions.js');

var Track =
  React.createClass({
    handleClick: function() {
      AppActions.setTrack(this.props.id);
      AppActions.setTrackDuration(this.props.duration);
    },
    removeTrack: function(id) {
      SC.get('/me/playlists', { limit: 1 }, function(playlist) {
        var oTracksIds = [];
        var oTracks = playlist[0].tracks;
        oTracks.forEach(function (track){
          var stringifyIDs = JSON.stringify(track.id)
          oTracksIds.push(stringifyIDs);
        });

        var i = oTracksIds.indexOf(id);
        if (i > -1) oTracksIds.splice(i, 1);

        var tracks = oTracksIds.map(function(id) { return { id: id }; });
        SC.put(playlist[0].uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            console.log("track removed from playlist!");
          }
        });
      });
    },
    deleteTrack: function() {
      id = event.target.getAttribute("data-id");
      if(isLoggedIn) {
        this.removeTrack(id);
      } else {
        login();
      }
    },
    render: function() {
      return (
        <div className="track" key={this.props.id}>
          <p>{this.props.title}</p>
          <img src={this.props.artwork} data-id={this.props.id} onClick={this.handleClick} />
          <br />
          <button data-id={this.props.id} onClick={this.deleteTrack}>Delete Track</button>
        </div>
      );
    }
  });
module.exports = Track;
