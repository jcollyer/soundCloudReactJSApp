var AppConstants = require('../constants/player-constants.js');
var AppDispatcher = require('../dispatchers/player-dispatcher.js');

var PlayerActions = {
  setTrack:function(trackId){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK,
      trackId: trackId
    })
  },
  setTrackTitle:function(title){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK_TITLE,
      title: title
    })
  },
  setTrackAuthor:function(author){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK_AUTHOR,
      author: author
    })
  },
  setTrackDuration:function(duration){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK_DURATION,
      duration: duration
    })
  },
  setTrackArtwork:function(artwork){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SET_TRACK_ARTWORK,
      artwork: artwork
    })
  }
}

module.exports = PlayerActions;
