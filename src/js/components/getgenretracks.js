/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var TrackList = require('../components/tracklist');

getGenre = function(){
  return {genre: AppStore.getGenre()}
};

var getGenreTist =
  React.createClass({
    getInitialState: function() {
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
          <button onClick={this.handleClick} data-genre="beats">Beats</button>
          <button onClick={this.handleClick} data-genre="rnb">RnB</button>
          <button onClick={this.handleClick} data-genre="house">House</button>
          <button onClick={this.handleClick} data-genre="hip-hop">Hip-Hop</button>
          <h2>{this.state.genre}</h2>
          <TrackList genre={this.state.genre}/>
        </div>
      );
    }
  });
module.exports = getGenreTist;

