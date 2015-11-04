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
  }
}

module.exports = AppActions;
