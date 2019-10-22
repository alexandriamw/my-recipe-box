module.exports = `
  SELECT
    id,
    user_id,
    name,
    category,
    ingredients,
    steps
  FROM
    recipes
  WHERE
    id = ?
`;
