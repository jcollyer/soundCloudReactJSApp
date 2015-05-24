var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
  addItem:function(item){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_ITEM,
      item: item
    })
  },
  removeItem:function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_ITEM,
      index: index
    })
  },
  decreaseItem:function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.DECREASE_ITEM,
      index: index
    })
  },
  increaseItem:function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.INCREASE_ITEM,
      index: index
    })
  },
  login:function(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN
    })
  },
  setGenre:function(genre){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_GENRE,
      genre: genre
    })
  },
  setTrack:function(trackId){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK,
      trackId: trackId
    })
  }
}

module.exports = AppActions;
