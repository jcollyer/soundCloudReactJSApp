var PlayerConstants = require('../constants/player-constants.js');
var PlayerDispatcher = require('../dispatchers/player-dispatcher.js');

var PlayerActions = {
  setTrack:function(id, duration, title, author, artwork){
    PlayerDispatcher.handlePlayerAction({
      actionType: PlayerConstants.SET_TRACK,
      id: id,
      duration: duration,
      title: title,
      author: author,
      artwork: artwork
    })
  }
}

module.exports = PlayerActions;
