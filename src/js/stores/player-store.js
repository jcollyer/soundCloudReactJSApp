var PlayerDispatcher = require('../dispatchers/player-dispatcher');
var PlayerConstants = require('../constants/player-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _track = {};
var _ids = [];

function _setTrack(track) {
  _track = track;
};

function _setTrackIds(ids) {
  _ids = ids
};

var PlayerStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  getTrack:function(){
    return _track;
  },

  getTrackIds:function() {
    return _ids;
  },

  dispatcherIndex:PlayerDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case PlayerConstants.SET_TRACK:
        _setTrack(payload.action);
        PlayerStore.emit('change');
        break

      case PlayerConstants.SET_TRACK_IDS:
        _setTrackIds(payload.action);
        break
    }
    return true;
  })
})

module.exports = PlayerStore;
