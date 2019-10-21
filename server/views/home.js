const React = require("react");

module.exports = function () {
  return (
    <div className="buttonContainer">
      <a href="/login" className="loginBtn buttonStyle">Login</a>
      <a href="/register" className="createAcctBtn buttonStyle">Create Account</a>
    </div>
  );
}
