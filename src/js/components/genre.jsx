var React = require('react');
var Appctions = require('../actions/app-actions.js');

var GenreActions = require('../actions/genre-actions.js');
var GenreStore = require('../stores/genre-store.js');

var Genre =
  React.createClass({
    getInitialState: function() {
      var genreList = GenreStore.getGenreList();
      return {genreList: genreList};
    },
    // getInitialState: function() {
    //   GenreActions.setGenre({type: "genre", name: "blake"});
    //   var genre = GenreStore.getGenre().name;
    //   return {genre: genre};
    // },
    handleClick: function(event) {
      var genre = {type: "genre", name: event.target.getAttribute("data-genre")};
      GenreActions.setGenre(genre);
    },
    render: function() {
      var that = this;
      return (
        <div id="genre-wrapper">
          <div id="genre-wrapper-scroll">
            {this.state.genreList.map(function(genre){
              return (
                <button onClick={that.handleClick} key={genre.name} data-genre={genre.name}>{genre.name}</button>
              )
            })}
          </div>
        </div>
      );
    }
  });
module.exports = Genre;
