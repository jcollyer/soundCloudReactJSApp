var HomeDispatcher = require('../dispatchers/home-dispatcher');
var HomeConstants = require('../constants/home-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

function _show() {
  HomeStore.emitChange();
};

var HomeStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex:HomeDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case HomeConstants.SHOW:
        _show();
        break
    }

    return true;
  })
})

module.exports = HomeStore;
