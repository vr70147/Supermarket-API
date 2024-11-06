module.exports = (rows) => {
  // Ensure rows is an array
  if (!Array.isArray(rows)) {
    throw new TypeError('Expected an array of rows');
  }

  return rows.map((row) => {
    const replaced = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        // Convert keys to camelCase
        const camelCase = key.replace(/([-_][a-z])/gi, ($1) =>
          $1.toUpperCase().replace('_', '')
        );
        replaced[camelCase] = row[key];
      }
    }
    return replaced;
  });
};
