var React = require('react');
var GenreActions = require('../actions/genre-actions.js');

var Search =
  React.createClass({
    handleClick:function(){
      [].slice.call(document.getElementsByClassName("side-nav-link")).forEach(function(d){d.classList.remove("active-side-nav-button")});
      [].slice.call(document.getElementsByClassName("panel-box")).forEach(function(d){d.classList.remove("active-panel")});
      document.getElementById('show-search-button').classList.add("active-side-nav-button");
      document.getElementById('search-wrapper').classList.add('active-panel');
    },
    search:function(){
      var query = document.getElementById("search-input").value;
      GenreActions.setGenre({type: "query", name: query});
    },
    closeSearchPane: function() {
      document.getElementById('search-wrapper').classList.remove('active-panel');
      document.getElementById("show-search-button").classList.remove("active-side-nav-button");
    },
    render:function(){
      return (
        <div>
          <div onClick={this.handleClick} className='side-nav-link' id="show-search-button">
            <i className='side-nav-icon icon-lintern'></i>
            <p>Search</p>
          </div>
          <div id="search-wrapper" className="close panel-box">
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
