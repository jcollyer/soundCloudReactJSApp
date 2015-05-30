var PlayerDispatcher = require('../dispatchers/player-dispatcher');
var PlayerConstants = require('../constants/player-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _trackURL = "";
var _trackTitle = "";
var _trackAuthor = "";
var _trackArtwork = "";
var _trackDuration = "";

function _setTrack(trackId) {
  _trackURL = "https://api.soundcloud.com/tracks/"+trackId+"";
};

function _setTrackTitle(title) {
  _trackTitle = title;
}

function _setTrackAuthor(author) {
  _trackAuthor = author;
}

function _setTrackDuration(duration) {
  _trackDuration = duration;
}

function _setTrackArtwork(artwork) {
  _trackArtwork = artwork;
}

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
    return _trackURL;
  },

  getTrackTitle:function(){
    return _trackTitle;
  },

   getTrackAuthor:function(){
    return _trackAuthor;
  },

  getTrackArtwork:function(){
    return _trackArtwork;
  },

  getTrackDuration:function(){
    return _trackDuration;
  },

  dispatcherIndex:PlayerDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case PlayerConstants.SET_TRACK:
        _setTrack(payload.action.trackId);
        PlayerStore.emitChange();
        break

      case PlayerConstants.SET_TRACK_DURATION:
        _setTrackDuration(payload.action.duration);
        break

      case PlayerConstants.SET_TRACK_TITLE:
        _setTrackTitle(payload.action.title);
        break

      case PlayerConstants.SET_TRACK_AUTHOR:
        _setTrackAuthor(payload.action.author);
        break

      case PlayerConstants.SET_TRACK_ARTWORK:
        _setTrackArtwork(payload.action.artwork);
        break
    }

    return true;
  })
})

module.exports = PlayerStore;
