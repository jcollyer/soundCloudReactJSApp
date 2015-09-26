var FavoritesConstants = require('../constants/favorites-constants.js');
var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher.js');

var FavoritesActions = {
  setFavorites:function(){
    FavoritesDispatcher.handleViewAction({
      actionType: FavoritesConstants.SET_FAVORITES
    })
  }
}

module.exports = FavoritesActions;
