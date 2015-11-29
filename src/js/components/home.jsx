var React = require('react');
var Genre = require('./genre.jsx');

var Home =
  React.createClass({
    render: function() {
      return (
        <div id="home-page">
          <h1>Home!</h1>
          <Genre />
        </div>
      );
    }
  });
module.exports = Home;
