var FavoritesConstants = require('../constants/favorites-constants.js');
var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher.js');

var FavoritesActions = {
  openFavorites:function(userAction){
    FavoritesDispatcher.handleFavoritesAction({
      actionType: FavoritesConstants.OPEN_FAVORITES,
      action: userAction.action,
      trackId: userAction.trackId
    })
  }
}

module.exports = FavoritesActions;
