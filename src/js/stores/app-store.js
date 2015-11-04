var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FavortiesActions = require('../actions/favorites-actions.js');
var PlaylistsActions = require('../actions/playlists-actions.js');
var PlaylistModalActions = require('../actions/playlistModal-actions.js');
var CHANGE_EVENT = "change";

var _userId = "";
var userAction = {};
window.isLoggedInSC = false;

function _logIn(action){
  userAction = action;
  SC.connect(function() {
    SC.get('/me', function(me) {
      _userId = me.id;

      // isLoggedIn = true;
      isLoggedInSC = true;

      // Set User ID Cookie
      document.cookie = "userId="+_userId;

      // set user playlists
      PlaylistsActions.setPlaylists(_userId)

      // set user favorites
      FavortiesActions.setFavorites(_userId)

      // Run the action to do after logging in
      setActionCallback(userAction, _userId);
    });
  });
};

function setActionCallback(userAction, _userId) {
  if (userAction.action == "favorite") {
    if (userAction.trackId) {
      if (userAction.verb == "delete") {
        FavortiesActions.deleteFavorite(AppStore.getUserId(), userAction.trackId);
      } else {
        FavortiesActions.addFavorite(userAction.trackId);
      }
    }
    FavortiesActions.openFavorites();
  } else if (userAction.action == "playlist") {
    if (userAction.trackId) {
      if (userAction.verb == "delete") {
        if (userAction.trackId == 1) { //delete playlist
          PlaylistsActions.deletePlaylist(AppStore.getUserId(), userAction.playlistId);
        } else { //delete playlist track
          PlaylistsActions.deletePlaylistTrack(AppStore.getUserId(), userAction.trackId, userAction.playlistId);
        }
      } else {
        PlaylistsActions.addPlaylist(getCookie("userId"), userAction.trackId);
      }
    }
    PlaylistsActions.openPlaylists();
  } else if (userAction.action == "playlistModal") {
    PlaylistModalActions.open();
  } else {
    return;
  }
};
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};

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

  getUserId:function(){
    return getCookie("userId");
  },

  isLoggedInSC:function(){
    if (isLoggedInSC){
      return true;
    } else {
      return false;
    }
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case AppConstants.LOGIN:
        _logIn(payload.action);
        break;
    }

    return true;
  })
})

module.exports = AppStore;
