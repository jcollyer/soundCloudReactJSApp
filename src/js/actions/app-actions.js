var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
  login:function(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN
    })
  },
  setTrack:function(track){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK,
      track: track
    })
  },
  setGenre:function(genre){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_GENRE,
      genre: genre
    })
  }
}

module.exports = AppActions;
