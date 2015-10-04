var FavoritesConstants = require('../constants/favorites-constants.js');
var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher.js');

var FavoritesActions = {
  getFavorites:function(userId){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.GET_FAVORITES,
      userId: userId
    })
  },
  setFavorites:function(userAction){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.SET_FAVORITES,
      action: userAction.action,
      trackId: userAction.trackId
    })
  }
}

module.exports = FavoritesActions;
