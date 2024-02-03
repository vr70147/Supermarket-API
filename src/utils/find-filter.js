const filterQuery = async (filter) => {
  if (!filter.columns) throw new Error('Missing columns');
  if (!filter.table) throw new Error('Missing table');

  const where =
    filter.where !== undefined
      ? `WHERE ${filter.where.column}=${
          typeof value === 'string'
            ? `'${filter.where.value}'`
            : filter.where.value
        }`
      : '';
  const limit = `LIMIT ${filter.pageSize}`;
  const offset = `OFFSET ((${filter.pageNumber} - 1) * ${filter.pageSize})`;

  async function query(filter) {
    const query = `
        SELECT ${filter.columns}
        FROM ${filter.table}
        ${where}
        ${filter.orderBy ? 'ORDER BY' : ''} ${
      !filter.orderBy ? '' : filter.orderBy
    } ${!filter.orderBy || !filter.sort ? '' : filter.sort}
        ${filter.pageSize !== undefined ? limit : ''}
        ${
          filter.pageNumber !== undefined && filter.pageSize !== undefined
            ? offset
            : ''
        }
      `;
    return query;
  }

  return await query(filter);
};

module.exports = filterQuery;
