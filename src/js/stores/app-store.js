var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _genre = [];
var _track;
var _userId = "";
var isLoggedIn = false;

function _setUserId(){
  SC.connect(function() {
    SC.get('/me', function(me) {
      _userId = me.id;
      isLoggedIn = true;

      // Set User ID Cookie
      document.cookie = "userId="+me.id;

      // Set User Playlists Cookie
      SC.get('/users/'+_userId+'/playlists', function(playlists) {
        var playlistArray = [];
        playlists.forEach(function(playlist) {
          playlistArray.push(playlist.title);
        });
        document.cookie = "userPlaylists="+playlistArray;
      });
    });
  });
};

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};

function _setGenre(genre) {
  _genre = genre;
};

// why am i setting track in app??
function  _setTrack(track) {
  debugger;
  _track = track;
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

  getGenre:function(){
    return _genre;
  },

  // why am i getting track in App??
  getTrack:function(){
    return _track;
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
      return ["red","blue"];
    }
  },

  isLoggedIn:function(){
    if (getCookie('userId') && isLoggedIn){
      return true;
    } else {
      return false;
    }
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case AppConstants.LOGIN:
        _setUserId();
        break;

      case AppConstants.SET_GENRE:
        _setGenre(payload.action.genre);
        break

      case AppConstants.SET_TRACK:
        _setTrack(payload.action.track);
        break
    }

    return true;
  })
})

module.exports = AppStore;
