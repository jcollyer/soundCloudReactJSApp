var Dispatcher = require('./dispatcher.js');
var assign = require('object-assign');

var PlaylistsDispatcher = assign({},Dispatcher.prototype, {
  handlePlaylistsAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action:action
    })
  }
})

module.exports = PlaylistsDispatcher;
