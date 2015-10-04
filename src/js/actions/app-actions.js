var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
  login:function(action, trackId){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN,
      action: action,
      trackId: trackId
    })
  }
}

module.exports = AppActions;
