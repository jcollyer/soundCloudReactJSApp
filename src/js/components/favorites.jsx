var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var FavoritesStore = require('../stores/favorites-store.js');
var Track = require('./track.jsx');

var Favorites = React.createClass({
  getInitialState: function() {
    return {favorites:[]};
  },
  getUserFavorites: function() {
    var that = this;
    var userId = AppStore.getUserId();
    var isLoggedIn = AppStore.isLoggedIn();
    if(!isLoggedIn) {
      AppActions.login("favorite", null);
    } else {

      var url = 'https://api.soundcloud.com/users/'+userId+'/favorites.json?client_id='+clientId+'';
      var xmlhttp = new XMLHttpRequest();
      var favoritetArr = [];
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          favoritetArr = JSON.parse(xmlhttp.responseText);
          that.setState({favorites: favoritetArr});

          [].slice.call(document.getElementsByClassName("side-nav-link")).forEach(function(d){d.classList.remove("active-side-nav-button")});
          [].slice.call(document.getElementsByClassName("panel-box")).forEach(function(d){d.classList.remove("active-panel")});
          document.getElementById('get-favorites-button').classList.add("active-side-nav-button");
          document.getElementById('favorites-wrapper').classList.add('active-panel');
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    }

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
    document.getElementById('favorites-wrapper').classList.remove('active-panel');
    document.getElementById("get-favorites-button").classList.remove("active-side-nav-button");
  },
  componentDidMount: function(){
    FavoritesStore.on('change', this.getUserFavorites);
  },
  componentWillUnmount: function() {
    FavoritesStore.removeListener('change', this.getUserFavorites);
  },
  render: function() {
    var that = this;
    return (
      <div>
        <div onClick={this.getUserFavorites} id="get-favorites-button" className="side-nav-link">
          <i className="side-nav-icon icon-heart"></i>
          <p>Favorites</p>
        </div>
        <div id="favorites-wrapper" className="panel-box close">
          <div onClick={this.closeFavoritePane} className="favorite-close-button">
            <i className="icon-circle-cross"></i>
          </div>
          <div className="favorite">
            <div className="favorite-title">
              <div className="header-container">
                <div className="header-line"></div>
                <h3>My Favorites</h3>
              </div>
            </div>
            {this.state.favorites.map(function(track){
              return (
                <div className='favorite-track-wrapper' key={track.id} id={track.id}>
                  <Track
                        title={track.title}
                        artwork={track.artwork_url}
                        id={track.id}
                        duration={track.duration}
                        author={track.user.username}
                        tags={track.tag_list}
                        user_id={track.user_id}
                  />
                  <div className="favorite-actions">
                    <div className="track-delete" onClick={that.deleteTrack.bind(null, track.id)}>
                      <i className="icon-trash"></i>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Favorites;
