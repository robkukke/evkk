export const sortTableDataByCol = (data, sortByColAccessor) => {
  return data.sort(function (a, b) {
    const propA = a[sortByColAccessor];
    const propB = b[sortByColAccessor];
    if (propA === propB) return data.indexOf(b) - data.indexOf(a);
    return propB - propA;
  });
}

export const sortTableCol = (rowA, rowB, colName) => {
  const valueA = rowA.original[colName];
  const valueB = rowB.original[colName];
  return valueA.localeCompare(valueB, 'et', {sensitivity: 'case'});
};

export const sortColByLastWord = (rowA, rowB, colName) => {
  const valueA = rowA.original[colName].split(' ').at(-1);
  const valueB = rowB.original[colName].split(' ').at(-1);
  return valueA.localeCompare(valueB, 'et', {sensitivity: 'case'});
};
