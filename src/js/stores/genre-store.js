var GenreDispatcher = require('../dispatchers/genre-dispatcher');
var GenreConstants = require('../constants/genre-constants');
var AppActions = require('../actions/app-actions.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

var _genre = {kind: "", name: ""};

function _setGenre(genre) {
  _genre = genre;
  AppActions.showHome(false);
};

var GenreStore = assign({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  getGenre:function(){
    return _genre;
  },

  getGenreList:function() {
    return [
      {name: 'rock'},
      {name: 'dance'},
      {name: 'hegemon'},
      {name: 'smallroom'},
      {name: 'disco'},
      {name: 'deephouse'},
      {name: 'acoustic'},
      {name: 'FutureRnB'},
      {name: 'redbull'},
      {name: 'style'},
      {name: 'chill'},
      {name: 'mac'},
      {name: 'TopDawgEnt'}
    ]
  },

  dispatcherIndex:GenreDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){

      case GenreConstants.SET_GENRE:
        _setGenre(payload.action.genre);
        GenreStore.emit('change');
        break
    }

    return true;
  })
})

module.exports = GenreStore;
