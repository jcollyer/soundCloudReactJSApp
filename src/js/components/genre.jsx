var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var TrackList = require('./tracklist.jsx');

getGenre = function(){
  return {genre: AppStore.getGenre()}
};

var Genre =
  React.createClass({

    getInitialState: function() {
      AppActions.setGenre("chill%20trap");
      return getGenre();
    },
    handleClick: function(event) {
      var genre = event.target.getAttribute("data-genre");
      AppActions.setGenre(genre);
      this.setState(getGenre());
    },
    render: function() {
      return (
        <div>
          <button onClick={this.handleClick} data-genre="chilltrap">chilltrap</button>
          <button onClick={this.handleClick} data-genre="hegemon">hegemon</button>
          <button onClick={this.handleClick} data-genre="smallroom">smallroom</button>
          <button onClick={this.handleClick} data-genre="pat%20lok">patlok</button>
          <button onClick={this.handleClick} data-genre="disco">disco</button>
          <button onClick={this.handleClick} data-genre="deephouse">deephouse</button>
          <button onClick={this.handleClick} data-genre="acoustic">acoustic</button>
          <button onClick={this.handleClick} data-genre="juciy">juciy</button>
          <TrackList genre={this.state.genre} />
        </div>
      );
    }
  });
module.exports = Genre;
