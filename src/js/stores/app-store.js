var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _genre = [];
var _track = [];
var _trackURL = "";
var _trackTitle = "";
var _trackAuthor = "";
var _trackArtwork = "";
var _trackDuration = "";

function _login(){
  SC.connect(function() {
    SC.get('/me', function(me) {
      $('#username').html(me.username);
    });
  });
};

function _setGenre(genre) {
  _genre = genre;
};

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

var AppStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  getGenre:function(){
    return _genre;
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

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case AppConstants.LOGIN:
        _login();
        break;

      case AppConstants.SET_GENRE:
        _setGenre(payload.action.genre);
        break

      case AppConstants.SET_TRACK:
        _setTrack(payload.action.trackId);
        AppStore.emitChange();
        break

      case AppConstants.SET_TRACK_DURATION:
        _setTrackDuration(payload.action.duration);
        AppStore.emitChange();
        break

      case AppConstants.SET_TRACK_TITLE:
        _setTrackTitle(payload.action.title);
        AppStore.emitChange();
        break

      case AppConstants.SET_TRACK_AUTHOR:
        _setTrackAuthor(payload.action.author);
        AppStore.emitChange();
        break

      case AppConstants.SET_TRACK_ARTWORK:
        _setTrackArtwork(payload.action.artwork);
        AppStore.emitChange();
        break
    }

    return true;
  })
})

module.exports = AppStore;
