var React = require('react');
var AppActions = require('../actions/app-actions.js');

var isLoggedIn = false;
var titleNames = [];

var Playlist =
  React.createClass({

    getInitialState: function() {
      return {tracks:[]};
    },

    getUsersPlaylists: function() {
      if(isLoggedIn) {
        SC.get('/me/playlists', function(playlists) {
          playlists.forEach(function(playlist){
            var title = playlist.title;
            titleNames.push(title);
          });
        });
      } else {
        isLoggedIn = true;
        AppActions.login();
      }
    },
    displayTracks: function(trackArr) {
      that = this;
      that.setState({tracks: trackArr});
    },
    handleClick: function() {
      this.getUsersPlaylists();
      // $.ajax({
      //   // url: this.props.url,
      //   url: 'https://api.soundcloud.com/users/143543661/playlists.json?client_id=b5e21578d92314bc753b90ea7c971c1e',
      //   dataType: 'json',
      //   success: function(playlists) {


      //   }.bind(this),
      //   error: function(xhr, status, err) {
      //     // console.error(this.props.url, status, err.toString());
      //     console.error('http://api.soundcloud.com/playlists/405726.json?client_id=b5e21578d92314bc753b90ea7c971c1e', status, err.toString());
      //   }.bind(this)
      // });


      var url = 'https://api.soundcloud.com/users/143543661/playlists.json?client_id=b5e21578d92314bc753b90ea7c971c1e';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var trackArr = JSON.parse(xmlhttp.responseText);
          that.displayTracks(trackArr);
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();


    },
    render: function() {

      return (
        <div>
          <button onClick={this.handleClick}>My Tracks</button>
          {this.state.tracks.map(function(track){
            var bigImage = track.artwork_url? track.artwork_url.replace('large', 't200x200') : "";
            return (
              <div key={track.state.id}>
                <Track
                      title={track.state.title}
                      artwork={bigImage}
                      id={track.state.id}
                      duration={track.state.duration}
                      author={track.state.user.username}
                />
              </div>
            )
          })}
        </div>
      );
    }
  });
module.exports = Playlist;

