var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _genre = [];


debugger;
SC.initialize({
  client_id: "51b52c948e268a19b58f87f3d47861ad",
  redirect_uri: "http://localhost:3000/callback.html"
});


function _login(){
  debugger;
  SC.connect(function() {
    SC.get('/me', function(me) {
      $('#username').html(me.username);
    });
  });
};

function _setGenre(genre) {
  _genre = genre;
};

var AppStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  getGenre:function(){
    return _genre;
  },

  getTrack:function(){
    return _trackURL;
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case AppConstants.LOGIN:
        _login();
        break;

      case AppConstants.SET_GENRE:
        _setGenre(payload.action.genre);
        break

    }

    return true;
  })
})

module.exports = AppStore;
