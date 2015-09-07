var React = require('react');
var GenreActions = require('../actions/genre-actions.js');
var GenreStore = require('../stores/genre-store.js');
var PlayerStore = require('../stores/player-store.js');

var Genre =
  React.createClass({
    getInitialState: function() {
      GenreActions.setGenre({type: "genre", name: "lofi"});
      var genre = GenreStore.getGenre().name;
      return {genre: genre, tags: ["rock","hop"]};
    },
    handleClick: function(event) {
      var genre = {type: "genre", name: event.target.getAttribute("data-genre")};
      GenreActions.setGenre(genre);
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
        </div>
      );
    }
  });
module.exports = Genre;
