var React = require('react');
var AppStore = require('../stores/app-store.js');
var PlayerActions = require('../actions/player-actions.js');
var Track = require('./track.jsx');

var TrackList =
  React.createClass({
    getInitialState: function() {
      return {tracks: []};
    },
    displayTracks: function(tracksArr) {
      var that = this;
      var goodTracks = [];
      var trackIds = [];
      tracksArr.forEach(function(track){
        if (track.artwork_url != null){
          goodTracks.push(track);
        }
        //set tracks to display
        that.setState({tracks: goodTracks});
      });
      goodTracks.forEach(function(track){
        trackIds.push(track.id);
      });
      //set track ids for next/prev
      PlayerActions.setTrackIds(trackIds);
    },
    getTracks: function(genre) {
      var that = this;
      var tracksArr = [];
      // var url = 'https://api.soundcloud.com/tracks?'+genre+'&client_id=b5e21578d92314bc753b90ea7c971c1e';
      var url = 'https://api.soundcloud.com/tracks.json?client_id=b5e21578d92314bc753b90ea7c971c1e&tags='+genre+'&order=hotness&limit=10&offset=0';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var tracksArr = JSON.parse(xmlhttp.responseText);
          that.displayTracks(tracksArr);
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    },
    componentDidMount: function() {
      this.getTracks(AppStore.getGenre());
    },
    componentWillReceiveProps: function(){
      this.getTracks(AppStore.getGenre());
    },
    render: function() {
      return (
        <div id="tracklist">
          {this.state.tracks.map(function(track){
            var bigImage = track.artwork_url? track.artwork_url.replace('large', 't200x200') : "";
            var tags = track.tag_list.split(" ");
            return (
              <div className='col-md-3' key={track.id}>
                <Track
                      id={track.id}
                      title={track.title}
                      author={track.user.username}
                      artwork={bigImage}
                      duration={track.duration}
                      tags={tags}
                />
              </div>
            )
          })}
        </div>
      );
    }
  });
module.exports = TrackList;
