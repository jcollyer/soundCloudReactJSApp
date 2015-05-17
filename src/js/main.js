/** @jsx React.DOM */
var APP = require('./components/app');
var React = require('react');

React.render(
  <APP />,
  document.getElementById('main'));



SC.initialize({
  client_id: "51b52c948e268a19b58f87f3d47861ad",
  redirect_uri: "http://localhost:3000/callback.html"
});


var titleNames = [];
var getUsersPlaylists = function() {
  SC.get('/me/playlists', function(playlists) {

    playlists.forEach(function(playlist){
      var title = playlist.title;
      titleNames.push(title);
    });
  });
};

var player;
playerReady = function() {
  console.log("track ready!");
};

var MyTracksButton = React.createClass({
  getInitialState: function() {
    return {tracks:[]};
  },
  handleClick: function() {
    getUsersPlaylists();
    $.ajax({
      // url: this.props.url,
      url: 'https://api.soundcloud.com/users/143543661/playlists.json?client_id=51b52c948e268a19b58f87f3d47861ad',
      dataType: 'json',
      success: function(playlists) {
        this.setState({tracks: playlists[0].tracks});
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
        console.error('http://api.soundcloud.com/playlists/405726.json?client_id=51b52c948e268a19b58f87f3d47861ad', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <button onClick={this.handleClick}>My Tracks</button>
        <MyTracks tracks={this.state.tracks} />
      </div>
    );
  }
});

var MyTracks = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.tracks.map(function(track){
          return (
            <div>
              <Track title={track.title} artwork={track.artwork_url} id={track.id} />
            </div>
          )
        })}
      </div>
    );
  }
});

var Track = React.createClass({
  handleClick: function(event) {
    id = event.target.getAttribute("data-id");
    url = "https://api.soundcloud.com/tracks/"+id+"";
    // according to docs: https://developers.soundcloud.com/docs/api/html5-widget
    var iframe   = document.querySelector('iframe');
    var iframeID = iframe.id;
    var player   = SC.Widget(iframe);
    var player2  = SC.Widget(iframeID);
    // widget1 === widget2
    player.load(url, {
      auto_play: true
    });

    player.bind(SC.Widget.Events.READY, function() {
      playerReady();
    });

    player.bind(SC.Widget.Events.FINISH, function() {
      console.log("track finished!");
    });
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


var MusicPlayerBox = React.createClass({
  render: function() {
    return (
      <div className="MusicPlayerBox">
        <Player />
        <MusicTable />
      </div>
    );
  }
});

var Player = React.createClass({
  getInitialState: function() {
    return {url: "http://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/39804767&show_artwork=false&liking=false&sharing=false&auto_play=false"};
  },
  toggleTrack: function() {
    var player = player || this.getPlayer();
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
    var player = player || this.getPlayer();
    player.getVolume(function(vol){
      if(vol == 0 ) {
        player.setVolume(1);
      } else {
        player.setVolume(0);
      }
    });
  },
  getPlayer: function() {
    iframe   = document.querySelector('iframe');
    iframeID = iframe.id;
    return SC.Widget(iframe);
  },
  render: function() {
    return (
      <div>
        <div id="current_time"></div>
        <button id="toggle" onClick={this.toggleTrack}>toggle</button>
        <button id="next" onClick={this.nextTrack}>Next</button>
        <button id="prev" onClick={this.prevTrack}>Prev</button>
        <button id="mute" onClick={this.muteToggleTrack}>Mute</button>

        <iframe id="soundcloud_widget" src={this.state.url} width="420" height="120" frameBorder="no">
        </iframe>
      </div>
    );
  }
});

var MusicTable = React.createClass({
  render: function() {
    return (
      <div className="MusicTable">
        <h3>Music Table</h3>
      </div>
    );
  }
});


// http://stackoverflow.com/questions/16394100/order-by-playbacks-when-fetching-tracks-from-soundcloud
// https://api-v2.soundcloud.com/explore/metal?limit=5&offset=0

// var GenreList = React.createClass({
//   getInitialState: function() {
//     return {songs: []}
//   },
//   getTracks: function(genre) {
//     $.ajax({
//       // url: this.props.url,
//       url: 'http://api.soundcloud.com/tracks?'+genre+'&client_id=51b52c948e268a19b58f87f3d47861ad',
//       dataType: 'json',
//       success: function(songs) {
//         this.setState({songs: songs});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         // console.error(this.props.url, status, err.toString());
//         console.error(xhr, status, err.toString());
//       }.bind(this)
//     });
//   },
//   handleClick: function(event) {
//     var genre = event.target.getAttribute("data-genre");
//     this.getTracks(genre);
//   },
//   render: function() {
//     return (
//       <div>
//         <button onClick={this.handleClick} data-genre="beats">Beats</button>
//         <button onClick={this.handleClick} data-genre="rnb">RnB</button>
//         <button onClick={this.handleClick} data-genre="house">House</button>
//         <button onClick={this.handleClick} data-genre="hip-hop">Hip-Hop</button>
//         <TrackList songs={this.state.songs} />
//       </div>
//     );
//   }
// });

TrackList = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.songs.map(function(song){
          return (
            <Song title={song.title} artwork={song.artwork_url} id={song.id} key={song.id}/>
          )
        })}
      </div>
    );
  }
});

var Song = React.createClass({
  handleClick: function(event) {
    id = event.target.getAttribute("data-id");
    url = "https://api.soundcloud.com/tracks/"+id+"";
    // according to docs: https://developers.soundcloud.com/docs/api/html5-widget
    var iframe   = document.querySelector('iframe');
    var iframeID = iframe.id;
    var player   = SC.Widget(iframe);
    var player2  = SC.Widget(iframeID);
    // widget1 === widget2
    player.load(url, {
      auto_play: true
    });

    player.bind(SC.Widget.Events.READY, function() {
      playerReady();
    });

    player.bind(SC.Widget.Events.FINISH, function() {
      console.log("track finished!");
    });

    // player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    //   var currentTime = e.relativePosition;

    //   setCurrentTime(currentTime);
    //   toHHMMSS(currentTime);
    //   // console.log( e.relativePosition*100);
    //    // $('.progress-bar').css('width', ( e.relativePosition*100)+"%");
    // });
  },
  addTrackToPlaylist: function() {
    id = event.target.getAttribute("data-id");
    if(isLoggedIn) {
      SC.get('/me/playlists', function(playlist) {
        var oTracksIds = [];
        var titleNames = [];

        // playlists.forEach(function(playlist){
        //   var title = playlist.title;
        //   titleNames.push(title);
        // });

        var oTracks = playlist[0].tracks;
        oTracks.forEach(function (track){
          var stringifyIDs = JSON.stringify(track.id)
          oTracksIds.push(stringifyIDs);
        });

        oTracksIds.push(id);
        var tracks = oTracksIds.map(function(id) { return { id: id }; });
        SC.put(playlist[0].uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            console.log("tracks added to playlist!");
          }
        });

      });
    } else {
      login();
    }
  },
  favoriteTrack: function() {
    id = event.target.getAttribute("data-id");
    if(isLoggedIn) {
      SC.put('/me/favorites/'+id, function(status, error) {
        if (error) {
          alert("Error: " + error.message);
        } else {
          alert("Favorite:  " + id);
        }
      });
    } else {
      login();
    }
  },
  render: function() {
    return (
      <div className="Song">
        <p>{this.props.title}</p>
        <img src={this.props.artwork} data-id={this.props.id} onClick={this.handleClick} />
        <button onClick={this.favoriteTrack} data-id={this.props.id}>Favorite</button>
        <button onClick={this.addTrackToPlaylist} data-id={this.props.id}>+Playlist</button>
      </div>
    );
  }
});

React.render(
  <MusicPlayerBox />,
  document.getElementById('react-music-player')
);

React.render(
  <MyTracksButton />,
  document.getElementById('track-button')
);
