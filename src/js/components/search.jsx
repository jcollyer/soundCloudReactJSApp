var React = require('react');
var GenreActions = require('../actions/genre-actions.js');

var Search =
  React.createClass({
    search:function(){
      var query = document.getElementById("search-input").value;
      GenreActions.setGenre({type: "query", name: query});
    },
    render:function(){
      return (
        <div>
          <div onClick={this.handleClick} className='side-nav-link'>
            <i className='side-nav-icon icon-search'></i>
            <p>Search</p>
          </div>
          <div id="search-wrapper" className="">
            <div onClick={this.closeSearchPane} className='search-close-button'>
              <i className='icon-circle-cross'></i>
            </div>
            <div className='search'>
              <input type='text' id='search-input' placeholder='search artist, track, genre, tag...' />
              <button type='submit' className='search-button' onClick={this.search}>Search</button>
            </div>
          </div>
        </div>
      )
    }
  });
module.exports = Search;
