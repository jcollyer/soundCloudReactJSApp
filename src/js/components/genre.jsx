var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var TrackList = require('./tracklist.jsx');
var Genre =
  React.createClass({
    getInitialState: function() {
      AppActions.setGenre("chill%20trap");
      var genre = AppStore.getGenre();
      return {genre: genre, tags: ["rock","hop"]};
    },
    handleClick: function(event) {
      var genre = event.target.getAttribute("data-genre");
      AppActions.setGenre(genre);
      this.setState({genre: genre});
    },
    render: function() {
      return (
        <div>
          <button onClick={this.handleClick} data-genre="chilltrap">chilltrap</button>
          <button onClick={this.handleClick} data-genre="hegemon">hegemon</button>
          <button onClick={this.handleClick} data-genre="smallroom">smallroom</button>
          <button onClick={this.handleClick} data-genre="pat%20lok">pat lok</button>
          <button onClick={this.handleClick} data-genre="disco">disco</button>
          <button onClick={this.handleClick} data-genre="deephouse">deephouse</button>
          <button onClick={this.handleClick} data-genre="acoustic">acoustic</button>
          <button onClick={this.handleClick} data-genre="FutureRnB">FutureRnB</button>
          {this.state.tags.forEach(function(tag){
            return (
              <button onClick={this.handleClick} data-genre={tag}>{tag}</button>
            )
          })}
          <TrackList genre={this.state.genre} />
        </div>
      );
    }
  });
module.exports = Genre;
