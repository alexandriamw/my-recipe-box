const React = require("react");

module.exports = function () {
  return (
    <>
      <link rel="stylesheet" href="/css/account.css" />
      <a href="/addrecipe" className="addRecBtn buttonStyle">Add a Recipe</a>
      <div className="recipeList">
          <h1>My Saved Recipes</h1>
      </div>
    </>
  );
};
