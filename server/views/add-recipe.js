const React = require("react");

module.exports = function (props) {
  return (
    <>
      <link rel="stylesheet" href="/css/addrecipe.css" />
      <div className="addRecipe">
        {props.message}
        <form action={props.mode === "edit" ? "/edit/" + props.recipeId : "/addrecipe/"} className="addRecipeForm" method="POST">
          <div className="recipeFormRow">
            <label htmlFor="recipename">Recipe Name</label>
            <input defaultValue={props.mode === "edit" ? props.name : ""} type="text" id="recipename" name="recipename" required />
          </div>
          <div className="recipeFormRow">
            <label htmlFor="category">Category</label>
            <select name="category" id="category">
              <option selected={props.mode === "edit" && props.category === "appetizers"} value="appetizers">Appetizers</option>
              <option selected={props.mode === "edit" && props.category === "bakedgoods"} value="bakedgoods">Baked Goods</option>
              <option selected={props.mode === "edit" && props.category === "breakfast"} value="breakfast">Breakfast</option>
              <option selected={props.mode === "edit" && props.category === "dessert"} value="dessert">Dessert</option>
              <option selected={props.mode === "edit" && props.category === "drinks"} value="drinks">Drinks</option>
              <option selected={props.mode === "edit" && props.category === "maindish"} value="maindish">Main Dish</option>
              <option selected={props.mode === "edit" && props.category === "salad"} value="salad">Salad</option>
              <option selected={props.mode === "edit" && props.category === "sidedish"} value="sidedish">Side Dish</option>
              <option selected={props.mode === "edit" && props.category === "soupstew"} value="soupstew">Soups and Stews</option>
              <option selected={props.mode === "edit" && props.category === "other"} value="other">Other</option>
            </select>
          </div>
          <div className="recipeFormRow">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" defaultValue={props.mode === "edit" ? props.ingredients : ""}></textarea>
          </div>
          <div className="recipeFormRow">
            <label htmlFor="steps">Preparation Steps</label>
            <textarea id="steps" name="steps" defaultValue={props.mode === "edit" ? props.steps : ""}></textarea>
          </div>
          <button className="smallerBtn" type="submit">Save my Recipe</button>
        </form>
      </div>
    </>
  );
}
