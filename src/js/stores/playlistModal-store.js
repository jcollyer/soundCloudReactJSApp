var PlaylistModalDispatcher = require('../dispatchers/playlistModal-dispatcher');
var PlaylistModalConstants = require('../constants/playlistModal-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

function _open() {
  PlaylistModalStore.emitChange();
};

var PlaylistModalStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex:PlaylistModalDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case PlaylistModalConstants.OPEN:
        _open();
        break
    }

    return true;
  })
})

module.exports = PlaylistModalStore;
