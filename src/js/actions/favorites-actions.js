var FavoritesConstants = require('../constants/favorites-constants.js');
var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher.js');

var FavoritesActions = {
  getFavorites:function(id){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.GET_FAVORITES,
      id: id
    })
  },
  setFavorites:function(id){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.SET_FAVORITES,
      id: id
    })
  },
  openFavorites:function(){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.OPEN_FAVORITES
    })
  },
  addFavorite:function(id){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.ADD_FAVORITE,
      id: id
    })
  },
  deleteFavorite:function(userId, trackId){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.DELETE_FAVORITE,
      userId: userId,
      trackId: trackId
    })
  }
}

module.exports = FavoritesActions;
