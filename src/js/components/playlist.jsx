var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var Track = require('./track.jsx');
require('../../style/playlist.less');


var isLoggedIn = false;
var titleNames = [];

var Playlist =
  React.createClass({
    getInitialState: function() {
      return {playlists:[]};
    },
    getUsersPlaylists: function() {
      var isLoggedIn = AppStore.isLoggedIn();
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
    displayPlaylists: function(playlistArr) {
      this.setState({playlists: playlistArr});
    },
    handleClick: function() {
      that = this;
      this.getUsersPlaylists();
      var userId = AppStore.getUserId();
      var url = 'https://api.soundcloud.com/users/'+userId+'/playlists.json?client_id=b5e21578d92314bc753b90ea7c971c1e';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var playlistArr = JSON.parse(xmlhttp.responseText);
          that.displayPlaylists(playlistArr);
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    },
    render: function() {
      return (
        <div>
          <button onClick={this.handleClick}>My playlists</button>

          <div className="playlist-wrapper">
            {this.state.playlists.map(function(playlist){
              // var bigImage = playlist.artwork_url? playlist.artwork_url.replace('large', 't200x200') : "";
              return (
                <div className="row playlist" key={playlist.id}>

                  <h1>{playlist.title}</h1>
                  {playlist.tracks.map(function(track){
                    return (
                      <div className='col-md-12' key={track.id}>
                        <Track
                              title={track.title}
                              artwork={track.artwork_url}
                              id={track.id}
                              duration={track.duration}
                              author={track.user.username}
                              playlist={playlist.id}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      );
    }
  });
module.exports = Playlist;
