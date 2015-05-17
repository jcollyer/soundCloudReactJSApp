/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions.js');

var GenreList =
  React.createClass({
    getInitialState: function() {
      return {songs: []}
    },
    getTracks: function(genre) {
      AppActions.genreList(genre);
    },
    handleClick: function(event) {
      var genre = event.target.getAttribute("data-genre");
      this.getTracks(genre);
    },
    render: function() {
      return (
        <div>
          <button onClick={this.handleClick} data-genre="beats">Beats</button>
          <button onClick={this.handleClick} data-genre="rnb">RnB</button>
          <button onClick={this.handleClick} data-genre="house">House</button>
          <button onClick={this.handleClick} data-genre="hip-hop">Hip-Hop</button>
          <TrackList songs={this.state.songs} />
        </div>
      );
    }
  });
module.exports = GenreList;
