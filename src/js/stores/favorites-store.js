var FavoritesDispatcher = require('../dispatchers/favorites-dispatcher');
var FavoritesConstants = require('../constants/favorites-constants');
var FavoritesActions = require('../actions/favorites-actions');
var AppStore = require('../stores/app-store.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

function _openFavorites() {
  [].slice.call(document.getElementsByClassName("side-nav-link")).forEach(function(d){d.classList.remove("active-side-nav-button")});
  [].slice.call(document.getElementsByClassName("panel-box")).forEach(function(d){d.classList.remove("active-panel")});
  document.getElementById('get-favorites-button').classList.add("active-side-nav-button");
  document.getElementById('favorites-wrapper').classList.add('active-panel');
};

function _setFavorites(userId) {
  var url = 'https://api.soundcloud.com/users/'+userId+'/favorites.json?client_id='+clientId+'';
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      // Set response in localStorage
      localStorage["userFavorites"] = xmlhttp.responseText;
      _updateFavorites();
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};

function _addFavorites(id) {
  var userId = AppStore.getUserId();
  SC.put('/me/favorites/' + id, function(status, error) {
    if (error) {
      alert("Error----: " + error.message);
    } else {
      console.log("Favorite:  " + id);
      _setFavorites(userId);
    }
  });
};

function _updateFavorites() {
  FavoritesStore.emitChange();
};

var FavoritesStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFavorites:function() {
    return JSON.parse(localStorage["userFavorites"]);
  },

  dispatcherIndex:FavoritesDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case FavoritesConstants.OPEN_FAVORITES:
        _openFavorites();
        break

      case FavoritesConstants.SET_FAVORITES:
        _setFavorites(payload.action.id);
        break
      //
      // case FavoritesConstants.GET_FAVORITES:
      //   _getFavorites(payload.action.id);
      //   break

      case FavoritesConstants.ADD_FAVORITE:
        _addFavorites(payload.action.id);
        break
    }
    return true;
  })
})

module.exports = FavoritesStore;
