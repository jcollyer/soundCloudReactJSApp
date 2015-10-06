var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FavortiesActions = require('../actions/favorites-actions.js');
var PlaylistsActions = require('../actions/playlists-actions.js');
var CHANGE_EVENT = "change";

var _userId = "";
var isLoggedInSC = false;
var isLoggedIn = false;
if (getCookie("userId")){
  isLoggedIn = true;
};
var userAction = {};

function _logIn(action){
  userAction = action;
  SC.connect(function() {
    SC.get('/me', function(me) {
      _userId = me.id;
      isLoggedIn = true;
      isLoggedInSC = true;

      // Set User ID Cookie
      document.cookie = "userId="+me.id;
      // Set User Playlists Cookie
      SC.get('/users/'+_userId+'/playlists', function(playlists) {
        var playlistArray = [];
        playlists.forEach(function(playlist) {
          playlistArray.push(playlist.title);
          document.cookie = "userPlaylists="+playlistArray;
        });
      });
      setActionCallback(userAction);

    });
  });
};

function setActionCallback(userAction) {
  if (userAction.action == "favorite") {
    FavortiesActions.openFavorites(userAction);
    if (userAction.trackId) {
      SC.put('/me/favorites/'+trackId, function(status, error) {
        if (error) {
          alert("Error----: " + error.message);
        } else {
          console.log("Favorite:  " + trackId);
        }
      });
    }
  } else if (userAction.action == "playlist") {
    PlyalistsActions.openPlaylists(userAction);
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

  getUserPlaylists:function(){
    var userPlaylistsCookie = getCookie('userPlaylists');
    if (userPlaylistsCookie){
      var objectArray = [];
      var array = userPlaylistsCookie.split(",");
      array.forEach(function(p){
        objectArray.push({name:p});
      })
      return objectArray;
    } else {
      return [];
    }
  },

  isLoggedInSC:function(){
    if (isLoggedInSC){
      return true;
    } else {
      return false;
    }
  },
  isLoggedIn:function(){
    if (isLoggedIn){
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
