var PlaylistsConstants = require('../constants/playlists-constants.js');
var PlaylistsDispatcher = require('../dispatchers/playlists-dispatcher.js');

var PlaylistsActions = {
  getPlaylists:function(id){
    PlaylistsDispatcher.handlePlaylistsAction({
      actionType: PlaylistsConstants.GET_PLAYLISTS,
      id: id
    })
  },
  setPlaylists:function(id){
    PlaylistsDispatcher.handlePlaylistsAction({
      actionType: PlaylistsConstants.SET_PLAYLISTS,
      id: id
    })
  },
  openPlaylists:function(){
    PlaylistsDispatcher.handlePlaylistsAction({
      actionType: PlaylistsConstants.OPEN_PLAYLISTS
    })
  },
  addPlaylist:function(id){
    PlaylistsDispatcher.handlePlaylistsAction({
      actionType: PlaylistsConstants.ADD_PLAYLIST,
      id: id
    })
  },
  deletePlaylist:function(userId, playlistId){
    PlaylistsDispatcher.handlePlaylistsAction({
      actionType: PlaylistsConstants.DELETE_PLAYLIST,
      userId: userId,
      trackId: trackId
    })
  },
  deletePlaylistTrack:function(userId, trackId, playlistId){
    PlaylistsDispatcher.handlePlaylistsAction({
      actionType: PlaylistsConstants.DELETE_PLAYLIST_TRACK,
      userId: userId,
      trackId: trackId,
      playlistId: playlistId
    })
  }
}

module.exports = PlaylistsActions;
