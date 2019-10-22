const React = require("react");

module.exports = function (props) {
  return (
    <>
      <link rel="stylesheet" href="/css/account.css" />
      <a href="/addrecipe" className="addRecBtn buttonStyle">Add a Recipe</a>
      <div className="recipeList">
          <h1>My Saved Recipes</h1>
          // Create a separate list for each category
          <h2>Category name</h2>
          <ul>
            <li><a href="">recipe naaaame</a></li>
          </ul>
      </div>
    </>
  );
};
