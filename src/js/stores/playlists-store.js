var PlaylistsDispatcher = require('../dispatchers/playlists-dispatcher');
var PlaylistsConstants = require('../constants/playlists-constants');
var PlaylistsActions = require('../actions/playlists-actions');
var AppStore = require('../stores/app-store.js');
var PlayerStore = require('../stores/player-store.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var uPlaylistTitles = [];

var CHANGE_EVENT = "change";

function _openPlaylists() {
  [].slice.call(document.getElementsByClassName("side-nav-link")).forEach(function(d){d.classList.remove("active-side-nav-button")});
  [].slice.call(document.getElementsByClassName("panel-box")).forEach(function(d){d.classList.remove("active-panel")});
  document.getElementById('get-playlist-button').classList.add("active-side-nav-button");
  document.getElementById('playlist-wrapper').classList.add('active-panel');
};

function _setPlaylists(userId) {
  var url = 'https://api.soundcloud.com/users/'+userId+'/playlists.json?client_id='+clientId+'';
  var xmlhttp = new XMLHttpRequest();
  var uPlaylists = [];
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      // Set response in localStorage
      JSON.parse(xmlhttp.responseText).map(function(playlist){
        uPlaylists.push(playlist.permalink);
      });

      localStorage["userPlaylists"] = uPlaylists;
      localStorage["userPlaylistsObjects"] = xmlhttp.responseText;

      _updatePlaylists();
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};

function _deletePlaylist(userId, trackId) {
  var path = "https://api.soundcloud.com/users/"+userId+"/playlists/"+trackId+"?client_id=b5e21578d92314bc753b90ea7c971c1e";
  SC.delete(path, function(response, error) {
    if (error) {
      console.log("Some error occured: " + JSON.parse(error));
    } else {
      console.log("playlist deleted");
      var playlist = document.getElementById(trackId);
      playlist.classList.add("remove_track");
      _setPlaylists(userId);
    }
  });
};

function _addPlaylists(playlistId) {
  var playlistId = 160912448;
  var userId = AppStore.getUserId();
  var trackId = PlayerStore.getTrack().id;
  debugger;

        SC.put(playlist.uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            document.getElementById("playlist-select-menu").classList.remove("show");
            alert("track added to playlist!");
          }
        });


  SC.put('/me/playlists/' + playlistId + '/'+ trackId, function(status, error) {
    if (error) {
      alert("Error----: " + error.message);
    } else {
      console.log("Playlist:  " + id);
      _setPlaylists(userId);
      PlaylistsActions.openPlaylists();
    }
  });
};


function _updatePlaylists() {
  PlaylistsStore.emitChange();
};

var PlaylistsStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPlaylists:function() {
    return JSON.parse(localStorage["userPlaylistsObjects"]);
  },

  getPlaylistsTitles:function(){
    uPlaylistTitles = [];
    var titles = localStorage["userPlaylists"].split(",");
    return titles;
  },

  dispatcherIndex:PlaylistsDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case PlaylistsConstants.OPEN_PLAYLISTS:
        _openPlaylists();
        break

      case PlaylistsConstants.SET_PLAYLISTS:
        _setPlaylists(payload.action.id);
        break

      case PlaylistsConstants.DELETE_PLAYLIST:
        _deletePlaylist(payload.action.userId, payload.action.trackId);
        break

      case PlaylistsConstants.ADD_PLAYLIST:
        _addPlaylists(payload.action.id);
        break

      case PlaylistsConstants.ADD_PLAYLIST:
        _addPlaylists(payload.action.id);
        break

    }
    return true;
  })
})

module.exports = PlaylistsStore;
