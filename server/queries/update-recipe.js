module.exports = `
  UPDATE
    recipes
  SET
    name=?,
    category=?,
    ingredients=?,
    steps=?
  WHERE
    id=?
  AND
    user_id=?
`;
