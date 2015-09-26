var React = require('react');
var AppActions = require('../actions/app-actions.js');

var Login =
  React.createClass({
    handleClick:function(){
      AppActions.login();
    },
    render:function(){
      return (
        <div onClick={this.handleClick}  className="side-nav-link">
          <i className="side-nav-icon icon-head"></i>
          <p>Login</p>
        </div>
      )
    }
  });
module.exports = Login;
