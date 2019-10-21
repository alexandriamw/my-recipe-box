const React = require("react");

module.exports = function () {
  return (
    <>
      <link rel="stylesheet" href="/css/login.css" />
      <div className="loginForm">
        <form action="/login" method="POST">
          <div>
            <label htmlFor="email"><b>Email</b></label>
            <input type="email" placeholder="Enter Email" name="email" required />
          </div>
          <div>
            <label htmlFor="password" className="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password" required />
          </div>
          <button type="submit" className="loginBtn buttonStyle">Login</button>
        </form>
      </div>
    </>
  );
}
