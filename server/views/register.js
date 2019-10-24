const React = require("react");

module.exports = function (props) {
  return (
    <>
      <link rel="stylesheet" href="/css/register.css" />
      <div className="registerForm">
        {props.message}
        <form method="POST" action="/register">
          <div>
            <label htmlFor="email"><b>Email</b></label>
            <input className="emailInput" type="email" placeholder="Enter Email" name="email" required />
          </div>
          <div>
            <label htmlFor="password" className="password"><b>Password</b></label>
            <input type="password" placeholder="Pick a Password" name="password" required />
          </div>
          <button type="submit" className="signupBtn buttonStyle">Sign Up</button>
        </form>
      </div>
    </>
  );
}
