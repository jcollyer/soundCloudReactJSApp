var PlaylistsDispatcher = require('../dispatchers/playlists-dispatcher');
var PlaylistsConstants = require('../constants/playlists-constants');
var PlaylistsActions = require('../actions/playlists-actions');
var AppStore = require('../stores/app-store.js');
var PlayerStore = require('../stores/player-store.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

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
      localStorage["userPlaylistsObjects"] = xmlhttp.responseText;
      _updatePlaylists();
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};

function _deletePlaylist(userId, playlistId) {
  var url = 'https://api.soundcloud.com/playlists/'+playlistId+'?client_id='+clientId+'';
  SC.delete(url, function(response, error){
    if(error){
      console.log("Some error occured: " + error.message);
    }else{
      _setPlaylists(userId);
      document.getElementById(playlistId).classList.add("remove_playlist");
    }
  });
};

function _deletePlaylistTrack(userId, trackId, playlistId) {
  SC.get('http://api.soundcloud.com/playlists/'+playlistId+'?client_id='+clientId+'', function(playlist) {
    var newTrackList = [];
    playlist.tracks.forEach(function(track) {
      if(trackId !== track.id) {
        newTrackList.push({id:track.id});
      }
    });
    // Update playlist with tracks minus deleted track
    SC.put(playlist.uri, { playlist: { tracks: newTrackList } }, function(response, error){
      if(error){
        console.log("Some error occured: " + error.message);
      }else{
        _setPlaylists(userId);
        document.getElementById(trackId).classList.add("remove_track");
      }
    });
  });
};

function _addPlaylist(userId, playlistName) {
  var track = PlayerStore.getTrack().id;
  var tracks = [track].map(function(id) { return { id: id }; });
  SC.post('/playlists', { playlist: { title: playlistName, tracks: tracks } }, function(response, error){
    if(error){
      console.log("Some error occured: " + error.message);
    }else{
      // hide "choose playlist menu" and  "new playlist" menu
      document.getElementById("playlist-select-menu").classList.remove("show");
      document.getElementById('new-playlist').classList.remove('show');
      _setPlaylists(userId);
      PlaylistsActions.openPlaylists();
    }
  });
}

function _addPlaylist_track(playlistId) {
  var userId = AppStore.getUserId();
  var trackId = PlayerStore.getTrack().id;
  var trackIdsArray = [];
  var uPlaylistsArray  = PlaylistsStore.getPlaylists();


    uPlaylistsArray .map(function(playlist) {
      // Get selected playlist
      if (playlistId === playlist.id) {

        playlist.tracks.forEach(function (track){
          // Add existing tracks to array
          trackIdsArray.push(track.id);
        });
        // Add new track to array
        trackIdsArray.push(trackId);
        // Turn track array into objects
        var tracks = trackIdsArray.map(function(id) { return { id: id }; });
        // Add tracks to playlist
        SC.put(playlist.uri, { playlist: { tracks: tracks } }, function(response, error){
          if(error){
            console.log("Some error occured: " + error.message);
          }else{
            document.getElementById("playlist-select-menu").classList.remove("show");
            _setPlaylists(userId);
            PlaylistsActions.openPlaylists();
          }
        });
      } // end if
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
    return JSON.parse(localStorage["userPlaylistsObjects"]).reverse();
  },

  dispatcherIndex:PlaylistsDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case PlaylistsConstants.OPEN_PLAYLISTS:
        _openPlaylists();
        break

      case PlaylistsConstants.ADD_PLAYLIST:
        _addPlaylist(payload.action.userId, payload.action.playlistName);
        break

      case PlaylistsConstants.SET_PLAYLISTS:
        _setPlaylists(payload.action.id);
        break

      case PlaylistsConstants.DELETE_PLAYLIST:
        _deletePlaylist(payload.action.userId, payload.action.playlistId);
        break

      case PlaylistsConstants.ADD_PLAYLIST_TRACK:
        _addPlaylist_track(payload.action.id);
        break

      case PlaylistsConstants.DELETE_PLAYLIST_TRACK:
        _deletePlaylistTrack(payload.action.userId, payload.action.trackId, payload.action.playlistId);
        break



    }
    return true;
  })
})

module.exports = PlaylistsStore;
