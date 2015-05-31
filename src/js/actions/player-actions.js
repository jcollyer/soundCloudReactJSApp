var PlayerConstants = require('../constants/player-constants.js');
var PlayerDispatcher = require('../dispatchers/player-dispatcher.js');

var PlayerActions = {
  setTrack:function(trackId){
    PlayerDispatcher.handlePlayerAction({
      actionType: PlayerConstants.SET_TRACK_ID,
      trackId: trackId
    })
  },
  setTrackTitle:function(title){
    PlayerDispatcher.handlePlayerAction({
      actionType: PlayerConstants.SET_TRACK_TITLE,
      title: title
    })
  },
  setTrackAuthor:function(author){
    PlayerDispatcher.handlePlayerAction({
      actionType: PlayerConstants.SET_TRACK_AUTHOR,
      author: author
    })
  },
  setTrackDuration:function(duration){
    PlayerDispatcher.handlePlayerAction({
      actionType: PlayerConstants.SET_TRACK_DURATION,
      duration: duration
    })
  },
  setTrackArtwork:function(artwork){
    PlayerDispatcher.handlePlayerAction({
      actionType: PlayerConstants.SET_TRACK_ARTWORK,
      artwork: artwork
    })
  }
}

module.exports = PlayerActions;
