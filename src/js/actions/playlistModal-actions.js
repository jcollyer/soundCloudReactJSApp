var PlaylistModalConstants = require('../constants/playlistModal-constants.js');
var PlaylistModalDispatcher = require('../dispatchers/playlistModal-dispatcher.js');

var PlaylistModalActions = {
  open:function(){
    PlaylistModalDispatcher.handlePlaylistModalAction({
      actionType: PlaylistModalConstants.OPEN
    })
  }
}

module.exports = PlaylistModalActions;
