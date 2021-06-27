export function detectShips(field, fieldMinIndex, fieldMaxIndex) {
  const checkedCells = [];
  let fieldCells = [...field];
  const ships = [];

  fieldCells.forEach((cell) => {
    if (checkedCells.includes(cell)) return;
    const ship = [cell];
    checkedCells.push(cell);
    const [rowIndex, colIndex] = cell.split('.');

    let currentRowIndex = +rowIndex - 1;
    let currentColIndex = +colIndex - 1;

    while (
      currentRowIndex >= fieldMinIndex &&
      fieldCells.includes(currentRowIndex + '.' + colIndex)
    ) {
      ship.unshift(currentRowIndex + '.' + colIndex);
      checkedCells.unshift(currentRowIndex + '.' + colIndex);
      currentRowIndex--;
    }

    currentRowIndex = +rowIndex + 1;
    while (
      currentRowIndex <= fieldMaxIndex &&
      fieldCells.includes(currentRowIndex + '.' + colIndex)
    ) {
      ship.push(currentRowIndex + '.' + colIndex);
      checkedCells.push(currentRowIndex + '.' + colIndex);
      currentRowIndex++;
    }

    while (
      currentColIndex >= fieldMinIndex &&
      fieldCells.includes(rowIndex + '.' + currentColIndex)
    ) {
      ship.unshift(rowIndex + '.' + currentColIndex);
      checkedCells.unshift(rowIndex + '.' + currentColIndex);
      currentColIndex--;
    }

    currentColIndex = +colIndex + 1;
    while (
      currentColIndex <= fieldMaxIndex &&
      fieldCells.includes(rowIndex + '.' + currentColIndex)
    ) {
      ship.push(rowIndex + '.' + currentColIndex);
      checkedCells.push(rowIndex + '.' + currentColIndex);
      currentColIndex++;
    }
    ships.push(ship);
  });
  return ships;
}
