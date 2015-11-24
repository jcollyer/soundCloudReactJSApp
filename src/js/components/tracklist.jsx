var React = require('react');
var GenreStore = require('../stores/genre-store.js');
var PlayerActions = require('../actions/player-actions.js');
var PlayerStore = require('../stores/player-store.js');
var Track = require('./track.jsx');
var Genre = require('./genre.jsx');
require('../../style/tracklist.less');
require('../../style/genre.less');
var TrackList =
  React.createClass({
    getInitialState: function() {
      return {tracks: [], ready: true, cached: false, offset: 0, fromScroll: false, artistUsername: "", artistId: "", showHome: true};
    },
    displayTracks: function(tracksArr) {
      var that = this;

      if(tracksArr.length > 1){
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
      } else {
        if (tracksArr.user) {
          var artistUsername = tracksArr.user.username;
          var artistId = tracksArr.user.id;
          that.setState({tracks: tracksArr, artistUsername: artistUsername, artistId: artistId});
        }
      }
    },
    getTracksAjax: function(genre, authorId, offset) {
      if (genre.type == "author") { // load for author
        var url = 'https://api.soundcloud.com/users/'+authorId+'/tracks?client_id=b5e21578d92314bc753b90ea7c971c1e';
      } else if (genre.type == "query") {  // load for search
        var url = 'https://api.soundcloud.com/tracks.json?client_id=b5e21578d92314bc753b90ea7c971c1e&q='+genre.name+'&order=hotness&limit=70&offset=0'
      } else if (genre.type == "singleTrack") { //load single track
        var url = 'https://api.soundcloud.com/tracks/'+genre.name+'.json?client_id=b5e21578d92314bc753b90ea7c971c1e';
      } else { // load default
        var url = 'https://api.soundcloud.com/tracks.json?client_id=b5e21578d92314bc753b90ea7c971c1e&tags='+genre.name+'&order=hotness&limit=30&offset='+offset+'';
      }
      var that = this;
      var tracksArr = [];
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var tracksArr = JSON.parse(xmlhttp.responseText);

          //hide home
          that.state.showHome = false;
          //play track
          // debugger;
          var tags = tracksArr[0].tag_list;
          var id = tracksArr[0].id;
          var duration = tracksArr[0].duration;
          var title = tracksArr[0].title;
          var author = tracksArr[0].user.username;
          var artwork = tracksArr[0].artwork_url;
          var user_id = tracksArr[0].user.id;


          PlayerActions.setTags(tags);
          PlayerActions.setTrack(id, duration, title, author, artwork, user_id);
          window.location.hash = "/tracks/"+id+"";


          if (that.state.cached && that.state.fromScroll) {
            // check if end of scroll
            if (JSON.parse(localStorage.tracks)[0].id && JSON.parse(xmlhttp.responseText)[0].id && (JSON.parse(localStorage.tracks)[0].id == JSON.parse(xmlhttp.responseText)[0].id)) {
              document.getElementById("no-more-tracks").classList.add("show");
              document.getElementById("loading-more-tracks").classList.remove("show");
              setTimeout(function(){
                document.getElementById("no-more-tracks").classList.remove("show");
              },3500)
              that.state.cached = false;
              return;
            }
            var totalTracks = JSON.parse(localStorage.tracks).concat(JSON.parse(xmlhttp.responseText));
            localStorage["tracks"] = JSON.stringify(totalTracks);
            that.displayTracks(totalTracks);
            that.state.fromScroll = false;
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
      if (window.location.hash.indexOf("/tracks/") >= 1){
        var trackId = window.location.hash.split("/")[2];
        this.getTracksAjax({type:"singleTrack",name: [trackId]});
      } else {
        var genre = GenreStore.getGenre();
        var authorId = PlayerStore.getTrack().user_id || PlayerStore.getTrack().id || "";

        this.getTracksAjax(genre, authorId, this.state.offset);
      }
    },
    getScrollTracks: function(offset) {
      var genre = GenreStore.getGenre();
      var authorId = PlayerStore.getTrack().user_id || "";
      this.state.fromScroll = true;
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
      // this.getTracks();
      GenreStore.on('change', this.getTracks);
    },
    componentWillUnmount: function() {
      GenreStore.removeListener('change', this.getTracks);
    },
    render: function() {
      if (this.state.showHome) {
        return (
          <div id="home-wrapper">
            <h1>Home!</h1>
            <Genre />
          </div>
        );
      } else if (this.state.tracks.length > 1) {
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
            <div id="no-more-tracks"><h3>End of tracks</h3></div>

          </div>
        );
      } else {
        return (
          <div id="tracklist-wrapper">
            <div className='col-md-2' key={this.state.tracks.id}>
              <Track
                    id={this.state.tracks.id}
                    title={this.state.tracks.title}
                    author={this.state.artistUsername}
                    artwork={this.state.tracks.artwork_url}
                    duration={this.state.tracks.duration}
                    user_id={this.state.artistId}
                    tags={this.state.tracks.tag_list}
              />
            </div>
          </div>
        );
      }
    }
  });
module.exports = TrackList;
