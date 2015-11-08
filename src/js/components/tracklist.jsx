var React = require('react');
var GenreStore = require('../stores/genre-store.js');
var PlayerActions = require('../actions/player-actions.js');
var PlayerStore = require('../stores/player-store.js');
var Track = require('./track.jsx');
require('../../style/tracklist.less');

var TrackList =
  React.createClass({
    getInitialState: function() {
      return {tracks: [], ready: true, cached: false, offset: 0 };
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
    getTracksAjax: function(genre, authorId, offset) {
      if (genre.type == "author") { // load for author
        var url = 'https://api.soundcloud.com/users/'+authorId+'/tracks?client_id=b5e21578d92314bc753b90ea7c971c1e';
      } else if (genre.type == "query"){  // load for search
        var url = 'https://api.soundcloud.com/tracks.json?client_id=b5e21578d92314bc753b90ea7c971c1e&q='+genre.name+'&order=hotness&limit=70&offset=0'
      } else { // load default
        var url = 'https://api.soundcloud.com/tracks.json?client_id=b5e21578d92314bc753b90ea7c971c1e&tags='+genre.name+'&order=hotness&limit=30&offset='+offset+'';
      }
      var that = this;
      var tracksArr = [];
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          // var tracksArr = JSON.parse(xmlhttp.responseText);

          if (that.state.cached) {
            var totalTracks = JSON.parse(localStorage.tracks).concat(JSON.parse(xmlhttp.responseText));
            localStorage["tracks"] = JSON.stringify(totalTracks);
            that.displayTracks(totalTracks);
            document.getElementById("loading-more-tracks").classList.remove("show");
          } else {
            localStorage["tracks"] = xmlhttp.responseText;
            that.state.cached = true;
            that.displayTracks(JSON.parse(xmlhttp.responseText));
          }
          that.state.ready = true;
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    },
    getTracks: function() {
      debugger;
      if (window.location.hash.indexOf("/tracks/") >= 1){
        var trackId = window.location.hash.split("/")[2];
        this.getTracksAjax({type:"singleTrack",name: trackId});
      } else {
        var genre = GenreStore.getGenre();
        var authorId = PlayerStore.getTrack().user_id || "";
        this.getTracksAjax(genre, authorId, this.state.offset);
      }
    },
    getScrollTracks: function(offset) {
      var genre = GenreStore.getGenre();
      var authorId = PlayerStore.getTrack().user_id || "";
      this.getTracksAjax(genre, authorId, this.state.offset);

      document.getElementById("loading-more-tracks").classList.add("show");
    },
    componentWillMount: function() {
      // for browser compatibility
      function getDocHeight() {
        var D = document;
        return Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight
        );
      }
      var that = this;
      window.addEventListener("scroll", function(){
        if (that.state.ready){
          if(window.scrollY + window.innerHeight > getDocHeight() - 100) {
           that.state.offset = that.state.offset + 30;
           that.getScrollTracks(that.state.offset);
           that.state.ready = false;
         }
        }
      });
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
        <div id="tracklist-wrapper">
          {this.state.tracks.map(function(track){
            var bigImage = track.artwork_url? track.artwork_url.replace('large', 't200x200') : "";
            var tags = track.tag_list.split(" ");
            return (
              <div className='col-md-2' key={track.id}>
                <Track
                      id={track.id}
                      title={track.title}
                      author={track.user.username}
                      artwork={bigImage}
                      duration={track.duration}
                      user_id={track.user.id}
                      tags={track.tag_list}
                />
              </div>
            )
          })}
          <div id="loading-more-tracks"><h3>Loading more tracks...</h3></div>
        </div>
      );
    }
  });
module.exports = TrackList;
