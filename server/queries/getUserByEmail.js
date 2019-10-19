module.exports = `
  SELECT
    id,
    email,
    password
  FROM
    users
  WHERE
    email = ?
`;
