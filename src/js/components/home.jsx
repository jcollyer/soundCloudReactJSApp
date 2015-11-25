var React = require('react');

var Home =
  React.createClass({
    handleClick: function(){
      alert("click")
    },
    render: function() {
      return (
        <div onClick={this.handleClick}  id="home-side-nav-link" className="side-nav-link active-side-nav-button">
          <i className="side-nav-icon icon-circle-cross"></i>
          <p>Home</p>
        </div>
      );
    }
  });
module.exports = Home;
