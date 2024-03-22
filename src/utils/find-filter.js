const filterQuery = async (filter) => {
  if (filter.columns === undefined && !filter.table) {
    throw new Error('Missing columns or table');
  }

  const where = filter.where
    ? `WHERE ${filter.where.column} = ${
        typeof filter.where.value === 'string'
          ? `'${filter.where.value}'`
          : filter.where.value
      }`
    : '';
  const limit = filter.pageSize !== undefined ? `LIMIT ${filter.pageSize}` : '';
  const offset =
    filter.pageNumber !== undefined && filter.pageSize !== undefined
      ? `OFFSET ((${filter.pageNumber} - 1) * ${filter.pageSize})`
      : '';

  const query = `
    SELECT ${filter.columns ? filter.columns.join() : '*'}
    FROM ${filter.table}
    ${where}
    ${filter.orderBy ? `ORDER BY ${filter.orderBy} ${filter.sort || ''}` : ''}
    ${limit}
    ${offset}
  `;

  return query;
};

module.exports = filterQuery;
