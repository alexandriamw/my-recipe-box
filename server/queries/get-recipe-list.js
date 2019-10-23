module.exports = `
  SELECT
    id,
    name,
    category,
    ingredients,
    steps
  FROM
    recipes
  WHERE
    user_id = ?
  ORDER BY
    category
  ASC
`;
