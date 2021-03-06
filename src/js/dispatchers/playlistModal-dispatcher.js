var Dispatcher = require('./dispatcher.js');
var assign = require('object-assign');

var PlaylistModalDispatcher = assign({},Dispatcher.prototype, {
  handlePlaylistModalAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action:action
    })
  }
})

module.exports = PlaylistModalDispatcher;
