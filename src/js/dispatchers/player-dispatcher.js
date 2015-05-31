var Dispatcher = require('./dispatcher.js');
var assign = require('object-assign');

var PlayerDispatcher = assign({},Dispatcher.prototype, {
  handlePlayerAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action:action
    })
  }
})

module.exports = PlayerDispatcher;
