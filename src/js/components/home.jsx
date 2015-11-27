var React = require('react');
var HomeActions = require('../actions/home-actions.js');

var Home =
  React.createClass({
    handleClick: function(){
      HomeActions.show();
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
