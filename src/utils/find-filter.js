const filterQuery = async (filter) => {
  if (!filter.columns) throw new Error('Missing columns');
  if (!filter.table) throw new Error('Missing table');

  const { column, value } = filter.where;
  const where = `WHERE ${column} = ${value}`;
  const limit = `LIMIT ${filter.pageSize}`;
  const offset = `OFFSET ((${filter.pageNumber} - 1) * ${filter.pageSize})`;
  const query = `
  SELECT ${filter.columns}
  FROM ${filter.table}
  ${column && value ? where : ''}
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
};

module.exports = filterQuery;
