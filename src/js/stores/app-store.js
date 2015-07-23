var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _genre = [];
var _userId = "";

window.isLoggedIn = false;

function _setUserId(){
  SC.connect(function() {
    SC.get('/me', function(me) {
      _userId = me.id;
      window.isLoggedIn = true;
      console.log(me.username);
      document.cookie = "userId="+me.id;
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

  getUserId:function(){
    // return _userId;

    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    return getCookie("userId");
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case AppConstants.LOGIN:
        _setUserId();
        break;

      case AppConstants.SET_GENRE:
        _setGenre(payload.action.genre);
        break
    }

    return true;
  })
})

module.exports = AppStore;
