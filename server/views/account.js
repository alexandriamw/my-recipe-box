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

  let categories = {};

  props.recipes.forEach(function (recipe) {
    if (recipe.category in categories === false) {
      categories[recipe.category] = [];
    }

    categories[recipe.category].push(recipe);
  });

  return (
    <>
      <link rel="stylesheet" href="/css/account.css" />
      <a href="/addrecipe" className="addRecBtn buttonStyle">Add a Recipe</a>
      <div className="recipeList">
          <h1>My Saved Recipes</h1>
          {Object.keys(categories).map(function(recipeCategory) {
            const recipes = categories[recipeCategory];

            return (
              <>
                <h2>{recipeCategories[recipeCategory]}</h2>
                <ul>
                  {recipes.map(function(recipe) {
                    return <li><a href={"/recipe/" + recipe.id}>{recipe.name}</a></li>;
                  })}
                </ul>
              </>
            );
          })}
      </div>
    </>
  );
};
