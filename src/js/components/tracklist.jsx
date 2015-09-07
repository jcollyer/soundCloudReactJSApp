var React = require('react');
var GenreStore = require('../stores/genre-store.js');
var PlayerActions = require('../actions/player-actions.js');
var PlayerStore = require('../stores/player-store.js');
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
    getTracks: function() {
      var genre = GenreStore.getGenre();
      var authorId = PlayerStore.getTrack().user_id || "";
      
      if (genre.type == "author") {
        var url = 'http://api.soundcloud.com/users/'+authorId+'/tracks?client_id=b5e21578d92314bc753b90ea7c971c1e';
      } else {
        var url = 'https://api.soundcloud.com/tracks.json?client_id=b5e21578d92314bc753b90ea7c971c1e&tags='+genre.name+'&order=hotness&limit=10&offset=0';
      }

      var that = this;
      var tracksArr = [];
      // var url = 'https://api.soundcloud.com/tracks?'+genre+'&client_id=b5e21578d92314bc753b90ea7c971c1e';
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
    componentDidMount: function(){
      this.getTracks();
      GenreStore.on('change', this.getTracks);
    },
    componentWillUnmount: function() {
      GenreStore.removeListener('change', this.getTracks);
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
                      user_id={track.user.id}
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
