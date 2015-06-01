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
      AppActions.setGenre("rock");
      return getGenre();
    },
    handleClick: function(event) {
      var genre = event.target.getAttribute("data-genre");
      AppActions.setGenre(genre);
      this.setState(getGenre());
    },
    // componentDidUpdate:function(){
    //   debugger;
    //   AppStore.addChangeListener(this._onChange)
    // },
    // _onChange:function(){
    //   debugger;
    // },
    render: function() {
      return (
        <div>
          <button onClick={this.handleClick} data-genre="rino">rino</button>
          <button onClick={this.handleClick} data-genre="rnb">RnB</button>
          <button onClick={this.handleClick} data-genre="house">House</button>
          <button onClick={this.handleClick} data-genre="hip-hop">Hip-Hop</button>
          <button onClick={this.handleClick} data-genre="beats">beats</button>
          <button onClick={this.handleClick} data-genre="rap">rap</button>
          <button onClick={this.handleClick} data-genre="lofi">lofi</button>
          <button onClick={this.handleClick} data-genre="juciy">juciy</button>
          <TrackList genre={this.state.genre} />
        </div>
      );
    }
  });
module.exports = Genre;

