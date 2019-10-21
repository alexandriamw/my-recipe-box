const React = require("react");

module.exports = function () {
  return (
    <>
      <link rel="stylesheet" href="/css/recipedetail.css" />
      <div className="recipeDetail">
        <div>
          <h3>Recipe Name:</h3>
        </div>
        <div>
          <h3>Category:</h3>
          <p></p>
        </div>
        <div>
          <h3>Ingredients:</h3>
          <ul>
            <li></li>
          </ul>
        </div>
        <div>
          <h3>Preparation Steps:</h3>
          <ol>
            <li></li>
          </ol>
        </div>
        <div className="recDetailBtns">
          <button className="smallerBtn" type="button">Edit Recipe</button>
          <button className="smallerBtn" type="button">Delete Recipe</button>
          <a href="/account" className="smallerBtn" type="button">Back to Account</a>
        </div>
      </div>
    </>
  );
}
