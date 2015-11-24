var React = require('react');

var Home =
  React.createClass({
    render: function() {
      return (
        <div onClick={this.handleClick}  className="side-nav-link active-side-nav-button">
          <i className="side-nav-icon icon-circle-cross"></i>
          <p>Home</p>
        </div>
      );
    }
  });
module.exports = Home;
