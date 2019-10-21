module.exports = `
  SELECT
    name,
    category,
    ingredients,
    steps
  FROM
    recipes
  WHERE
    id = ?
`;
