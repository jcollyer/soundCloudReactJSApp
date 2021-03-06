var Dispatcher = require('./dispatcher.js');
var assign = require('object-assign');

var GenreDispatcher = assign({},Dispatcher.prototype, {
  handleViewAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action:action
    })
  }
})

module.exports = GenreDispatcher;
