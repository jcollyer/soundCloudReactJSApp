var FavoritesConstants = require('../constants/favorites-constants.js');
var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher.js');

var FavoritesActions = {
  setFavorites:function(trackId){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.SET_FAVORITES,
      trackId: trackId
    })
  }
}

module.exports = FavoritesActions;
