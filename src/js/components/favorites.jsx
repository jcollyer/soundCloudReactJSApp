var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var Track = require('./track.jsx');
require('../../style/favorites.less');

var Favorites = React.createClass({
  getInitialState: function() {
    return {favorites:[]};
  },
  logIn: function() {
    var isLoggedIn = AppStore.isLoggedIn();
    if(!isLoggedIn) {
      AppActions.login();
    }
  },
  getUserFavorites: function() {
    var that = this;
    this.logIn();

    document.getElementById('favorites-wrapper').classList.remove('close');
    var userId = AppStore.getUserId();
    var url = 'https://api.soundcloud.com/users/'+userId+'/favorites.json?client_id=b5e21578d92314bc753b90ea7c971c1e';
    var xmlhttp = new XMLHttpRequest();
    var favoritetArr = [];
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        favoritetArr = JSON.parse(xmlhttp.responseText);
        that.setState({favorites: favoritetArr});
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  },
  removeTrack: function(trackId) {
    var userId = AppStore.getUserId();
    var trackId = trackId;
    var path = 'https://api.soundcloud.com/users/'+userId+'/favorites/'+trackId+'?client_id=b5e21578d92314bc753b90ea7c971c1e';

    SC.delete(path, function(response, error) {
      if (error) {
        console.log("Some error occured: " + error);
      } else {
        console.log("favorite deleted");
        var favorite = document.getElementById(trackId);
        favorite.classList.add("remove_track");
      }
    });
  },
  deleteTrack: function(trackId) {
    var id = id;
    var isLoggedIn = AppStore.isLoggedIn();
    if(isLoggedIn) {
      this.removeTrack(trackId);
    } else {
      login();
    }
  },
  closeFavoritePane: function() {
    document.getElementById('favorites-wrapper').classList.add('close');
  },
  render: function() {
    var that = this;
    return (
      <div>
        <button onClick={this.getUserFavorites}>My Favorites</button>
        <div id="favorites-wrapper" className="close">
          <button onClick={this.closeFavoritePane}>X</button>
          {this.state.favorites.map(function(track){
            return (
              <div className='col-md-12 favorite-track-wrapper' key={track.id} id={track.id}>
                <Track
                      title={track.title}
                      artwork={track.artwork_url}
                      id={track.id}
                      duration={track.duration}
                      author={track.user.username}
                />
                <div className="favorite-actions">
                  <button className="track-delete" onClick={that.deleteTrack.bind(null, track.id)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
});

module.exports = Favorites;
