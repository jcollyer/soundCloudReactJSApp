var React = require('react');
var AppActions = require('../actions/app-actions.js');
var AppStore = require('../stores/app-store.js');
var PlayerStore = require('../stores/player-store.js');
var TrackList = require('./tracklist.jsx');
var Genre =
  React.createClass({
    getInitialState: function() {
      AppActions.setGenre("rap");
      var genre = AppStore.getGenre();
      return {genre: genre, tags: ["rock","hop"]};
    },
    handleClick: function(event) {
      var genre = event.target.getAttribute("data-genre");
      AppActions.setGenre(genre);
      this.setState({genre: genre});
    },
    componentDidMount: function(){
      PlayerStore.on('change', this.updateTags);
    },
    componentWillUnmount: function() {
      PlayerStore.removeListener('change', this.updateTags);
    },
    updateTags: function() {
      var tags = PlayerStore.getTags();
      this.setState({tags: tags});
    },
    render: function() {
      var that = this;
      return (
        <div>
          <hr />
          {this.state.tags.map(function(tag){
            var cleanTag = tag.replace(/['"]+/g, '');
            return (
              <button onClick={that.handleClick} data-genre={tag}>{cleanTag}</button>
            )
          })}
          <hr />
          <button onClick={this.handleClick} data-genre="chilltrap">chilltrap</button>
          <button onClick={this.handleClick} data-genre="hegemon">hegemon</button>
          <button onClick={this.handleClick} data-genre="smallroom">smallroom</button>
          <button onClick={this.handleClick} data-genre="pat%20lok">pat lok</button>
          <button onClick={this.handleClick} data-genre="disco">disco</button>
          <button onClick={this.handleClick} data-genre="deephouse">deephouse</button>
          <button onClick={this.handleClick} data-genre="acoustic">acoustic</button>
          <button onClick={this.handleClick} data-genre="FutureRnB">FutureRnB</button>
          <TrackList genre={this.state.genre} />
        </div>
      );
    }
  });
module.exports = Genre;
