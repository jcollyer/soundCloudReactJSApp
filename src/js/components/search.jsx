var React = require('react');

var Search =
  React.createClass({
    search:function(){
      var query = document.getElementById("search-input").value;
      alert(query);
    },
    render:function(){
      return (
        <div>
          <div onClick={this.handleClick} className='side-nav-link'>
            <i className='side-nav-icon icon-search'></i>
            <p>Search</p>
          </div>
          <div id="search-wrapper" className="close">
            <div className='search'>
              <input type='text' id='search-input' placeholder='search artist, track, genre, tag...' />
              <div onClick={this.search}className='search-button'>Search</div>
            </div>
            <div onClick={this.closeSearchPane} className='search-close-button'>
              <i className='icon-circle-cross'></i>
            </div>
          </div>
        </div>
      )
    }
  });
module.exports = Search;
