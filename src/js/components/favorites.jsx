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
  closeFavoritePane: function() {
    document.getElementById('favorites-wrapper').classList.add('close');
  },
  render: function() {
    return (
      <div>
        <button onClick={this.getUserFavorites}>My Favorites</button>
        <div id="favorites-wrapper" className="close">
          <button onClick={this.closeFavoritePane}>X</button>
          {this.state.favorites.map(function(track){
            return (
              <div className='col-md-12 favorite' key={track.id}>
                <Track
                      title={track.title}
                      artwork={track.artwork_url}
                      id={track.id}
                      duration={track.duration}
                      author={track.user.username}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
});

module.exports = Favorites;
