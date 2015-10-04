var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher');
var FavoritesConstants = require('../constants/favorites-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = "change";

var _favorites = {};

function _setFavorites(action) {
  var trackId = action.trackId;
};

var FavoritesStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFavorites:function(){
    return _favorites;
  },

  dispatcherIndex:FavoritesDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case FavoritesConstants.SET_FAVORITES:
        _setFavorites(payload.action);
        FavoritesStore.emit('change');
        break

      case FavoritesConstants.GET_FAVORITES:
        _setFavorites(payload.action);
        FavoritesStore.emit('change');
        break
    }

    return true;
  })
})

module.exports = FavoritesStore;
