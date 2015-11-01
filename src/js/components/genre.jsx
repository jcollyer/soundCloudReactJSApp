var React = require('react');
var GenreActions = require('../actions/genre-actions.js');
var GenreStore = require('../stores/genre-store.js');

var Genre =
  React.createClass({
    getInitialState: function() {
      GenreActions.setGenre({type: "genre", name: "head"});
      var genre = GenreStore.getGenre().name;
      return {genre: genre};
    },
    handleClick: function(event) {
      var genre = {type: "genre", name: event.target.getAttribute("data-genre")};
      GenreActions.setGenre(genre);
    },
    render: function() {
      return (
        <div id="genre-wrapper">
          <div id="genre-wrapper-scroll">
            <button onClick={this.handleClick} data-genre=".sinh">.sinh</button>
            <button onClick={this.handleClick} data-genre="hegemon">hegemon</button>
            <button onClick={this.handleClick} data-genre="smallroom">smallroom</button>
            <button onClick={this.handleClick} data-genre="pat%20lok">pat lok</button>
            <button onClick={this.handleClick} data-genre="disco">disco</button>
            <button onClick={this.handleClick} data-genre="deephouse">deephouse</button>
            <button onClick={this.handleClick} data-genre="acoustic">acoustic</button>
            <button onClick={this.handleClick} data-genre="FutureRnB">FutureRnB</button>
          </div>
        </div>
      );
    }
  });
module.exports = Genre;
