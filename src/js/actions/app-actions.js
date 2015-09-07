var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
  login:function(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN
    })
  }
}

module.exports = AppActions;
