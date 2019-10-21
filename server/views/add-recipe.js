const React = require("react");

module.exports = function (props) {
  return (
    <>
      <link rel="stylesheet" href="/css/addrecipe.css" />
      <div className="addRecipe">
        {props.message}
        <form className="addRecipeForm" method="POST">
          <div className="recipeFormRow">
            <label htmlFor="recipename">Recipe Name</label>
            <input type="text" id="recipename" name="recipename" required />
          </div>
          <div className="recipeFormRow">
            <label htmlFor="category">Category</label>
            <select name="category" id="category">
              <option value="appetizers">Appetizers</option>
              <option value="bakedgoods">Baked Goods</option>
              <option value="breakfast">Breakfast</option>
              <option value="dessert">Dessert</option>
              <option value="drinks">Drinks</option>
              <option value="maindish">Main Dish</option>
              <option value="salad">Salad</option>
              <option value="sidedish">Side Dish</option>
              <option value="soupstew">Soups and Stews</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="recipeFormRow">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients"></textarea>
          </div>
          <div className="recipeFormRow">
            <label htmlFor="steps">Preparation Steps</label>
            <textarea id="steps" name="steps"></textarea>
          </div>
          <button className="smallerBtn" type="submit">Save my Recipe</button>
        </form>
      </div>
    </>
  );
}
