var HomeConstants = require('../constants/home-constants.js');
var HomeDispatcher = require('../dispatchers/home-dispatcher.js');

var HomeActions = {
  show:function(){
    HomeDispatcher.handleViewAction({
      actionType: HomeConstants.SHOW
    })
  }
}

module.exports = HomeActions;
