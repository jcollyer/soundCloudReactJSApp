var Dispatcher = require('./dispatcher.js');
var assign = require('object-assign');

var FavoritesDispatcher = assign({},Dispatcher.prototype, {
  handleFavoritesAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action:action
    })
  }
})

module.exports = FavoritesDispatcher;
