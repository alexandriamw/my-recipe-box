const React = require("react");

module.exports = function () {
  return (
    <>
      <link rel="stylesheet" href="/css/account.css" />
      <button type="button" className="addRecBtn buttonStyle">Add a Recipe</button>
      <div className="recipeList">
          <h1>My Saved Recipes</h1>
      </div>
    </>
  );
};
