const filterQuery = async (filter) => {
  if (!filter.table) {
    throw new Error('Table name is required');
  }

  if (!Array.isArray(filter.columns)) {
    throw new Error('Columns must be provided as an array');
  }

  const columns = filter.columns.length > 0 ? filter.columns.join(', ') : '*';

  let where = '';
  const values = [];

  if (filter.where && filter.where.column && filter.where.value !== undefined) {
    where = `WHERE ${filter.where.column} = $1`;
    values.push(filter.where.value);
  }

  const limit = filter.pageSize !== undefined ? `LIMIT ${filter.pageSize}` : '';
  const offset =
    filter.pageNumber !== undefined && filter.pageSize !== undefined
      ? `OFFSET ${(filter.pageNumber - 1) * filter.pageSize}`
      : '';

  const orderBy = filter.orderBy
    ? `ORDER BY ${filter.orderBy} ${filter.sort || 'ASC'}`
    : '';

  const query = `
    SELECT ${columns}
    FROM ${filter.table}
    ${where}
    ${orderBy}
    ${limit}
    ${offset}
  `.trim();

  return { query, values };
};

module.exports = filterQuery;
