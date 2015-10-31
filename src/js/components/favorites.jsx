var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var FavoritesStore = require('../stores/favorites-store.js');
var FavoritesActions = require('../actions/favorites-actions.js');
var Track = require('./track.jsx');

var favArr = [];

var Favorites = React.createClass({
  getInitialState: function() {
    return {favorites:[]};
  },
  getUserFavorites: function() {
    var userId = AppStore.getUserId();
    if(!userId) {
      AppActions.login("favorite", null);
    } else {
      var userFavorites = FavoritesStore.getFavorites();
      this.setState({favorites: userFavorites});
      FavoritesActions.openFavorites();
    }
  },
  setFavorites: function() {
    var userFavorites = FavoritesStore.getFavorites();
    this.setState({favorites: userFavorites});
  },
  removeTrack: function(trackId) {
    var trackId = trackId;
    if(!isLoggedInSC) {
      AppActions.login();
    } else {
      var userId = AppStore.getUserId();
      FavoritesActions.deleteFavorite(userId, trackId);
    }
  },
  closeFavoritePane: function() {
    document.getElementById('favorites-wrapper').classList.remove('active-panel');
    document.getElementById("get-favorites-button").classList.remove("active-side-nav-button");
  },
  componentDidMount: function(){
    FavoritesStore.on('change', this.setFavorites);
  },
  componentWillUnmount: function() {
    FavoritesStore.removeListener('change', this.setFavorites);
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
                    <div className="track-delete" onClick={that.removeTrack.bind(null, track.id)}>
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
