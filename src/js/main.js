/** @jsx React.DOM */
var APP = require('./components/app');
var React = require('react');

// React.render(
//   <APP />,
//   document.getElementById('main'));


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
      url: 'https://api.soundcloud.com/users/143543661/playlists.json?client_id=b5e21578d92314bc753b90ea7c971c1e',
      dataType: 'json',
      success: function(playlists) {
        this.setState({tracks: playlists[0].tracks});
      }.bind(this),
      error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
        console.error('http://api.soundcloud.com/playlists/405726.json?client_id=b5e21578d92314bc753b90ea7c971c1e', status, err.toString());
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


// var Song = React.createClass({
//   handleClick: function(event) {
//     id = event.target.getAttribute("data-id");
//     url = "https://api.soundcloud.com/tracks/"+id+"";
//     // according to docs: https://developers.soundcloud.com/docs/api/html5-widget

//     var iframe   = document.creatElement('iframe');
//     // var iframeID = iframe.id;

//     var player   = SC.Widget(iframe);
//     debugger;
//     // var player2  = SC.Widget(iframeID);
//     // widget1 === widget2
//     player.load(url, {
//       auto_play: true
//     });

//     player.bind(SC.Widget.Events.READY, function() {
//       playerReady();
//     });

//     player.bind(SC.Widget.Events.FINISH, function() {
//       console.log("track finished!");
//     });

//     // player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
//     //   var currentTime = e.relativePosition;

//     //   setCurrentTime(currentTime);
//     //   toHHMMSS(currentTime);
//     //   // console.log( e.relativePosition*100);
//     //    // $('.progress-bar').css('width', ( e.relativePosition*100)+"%");
//     // });
//   },
//   addTrackToPlaylist: function() {
//     id = event.target.getAttribute("data-id");
//     if(isLoggedIn) {
//       SC.get('/me/playlists', function(playlist) {
//         var oTracksIds = [];
//         var titleNames = [];

//         // playlists.forEach(function(playlist){
//         //   var title = playlist.title;
//         //   titleNames.push(title);
//         // });

//         var oTracks = playlist[0].tracks;
//         oTracks.forEach(function (track){
//           var stringifyIDs = JSON.stringify(track.id)
//           oTracksIds.push(stringifyIDs);
//         });

//         oTracksIds.push(id);
//         var tracks = oTracksIds.map(function(id) { return { id: id }; });
//         SC.put(playlist[0].uri, { playlist: { tracks: tracks } }, function(response, error){
//           if(error){
//             console.log("Some error occured: " + error.message);
//           }else{
//             console.log("tracks added to playlist!");
//           }
//         });

//       });
//     } else {
//       login();
//     }
//   },
//   favoriteTrack: function() {
//     id = event.target.getAttribute("data-id");
//     if(isLoggedIn) {
//       SC.put('/me/favorites/'+id, function(status, error) {
//         if (error) {
//           alert("Error: " + error.message);
//         } else {
//           alert("Favorite:  " + id);
//         }
//       });
//     } else {
//       login();
//     }
//   },
//   render: function() {
//     return (
//       <div className="Song">
//         <p>{this.props.title}</p>
//         <img src={this.props.artwork} data-id={this.props.id} onClick={this.handleClick} />
//         <button onClick={this.favoriteTrack} data-id={this.props.id}>Favorite</button>
//         <button onClick={this.addTrackToPlaylist} data-id={this.props.id}>+Playlist</button>
//       </div>
//     );
//   }
// });

// React.render(
//   <MusicPlayerBox />,
//   document.getElementById('react-music-player')
// );

// React.render(
//   <MyTracksButton />,
//   document.getElementById('track-button')
// );
