var GenreConstants = require('../constants/genre-constants.js');
var GenreDispatcher = require('../dispatchers/genre-dispatcher.js');

var GenreActions = {
  setGenre:function(genre){
    GenreDispatcher.handleViewAction({
      actionType: GenreConstants.SET_GENRE,
      genre: genre
    })
  }
}

module.exports = GenreActions;
