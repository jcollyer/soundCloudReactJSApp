var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
  login:function(action, trackId, verb, playlistId){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN,
      action: action,
      trackId: trackId,
      verb: verb,
      playlistId: playlistId
    })
  },
  showHome:function(bool){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SHOW_HOME,
      bool: bool
    })
  }
}

module.exports = AppActions;
