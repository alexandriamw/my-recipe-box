const React = require("react");

module.exports = function (props) {
  const recipeCategories = {
    appetizers: "Appetizers",
    bakedgoods: "Baked Goods",
    breakfast: "Breakfast",
    dessert: "Dessert",
    drinks: "Drinks",
    maindish: "Main Dish",
    salad: "Salad",
    sidedish: "Side Dish",
    soupstew: "Soups and Stews",
    other: "Other"
  };

  return (
    <>
      <link rel="stylesheet" href="/css/recipedetail.css" />
      <div className="recipeDetail">
        <div>
          <h2>{props.name}</h2>
        </div>
        <div>
          <h3>Category:</h3>
          <p>{recipeCategories[props.category]}</p>
        </div>
        <div>
          <h3>Ingredients:</h3>
          <ul>
            {props.ingredients.trim().split("\n").map(function (ingredient, index) {
              return <li key={index}>{ingredient}</li>;
            })}
          </ul>
        </div>
        <div>
          <h3>Preparation Steps:</h3>
          <ol>
            {props.steps.trim().split("\n").map(function (step, index) {
              return <li key={index}>{step}</li>;
            })}
          </ol>
        </div>
        <div className="recDetailBtns">
          <button className="smallerBtn" type="button">Edit Recipe</button>
          <a href="/account" className="smallerBtn" type="button">Back to Account</a>
        </div>
      </div>
    </>
  );
}
