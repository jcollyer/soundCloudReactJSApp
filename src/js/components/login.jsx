var React = require('react');
var AppActions = require('../actions/app-actions.js');

var Login =
  React.createClass({
    handleClick:function(){
      AppActions.login();
    },
    render:function(){
      return <button onClick={this.handleClick}>Login</button>
    }
  });
module.exports = Login;
