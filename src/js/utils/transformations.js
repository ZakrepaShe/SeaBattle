const Rotate = (cells, amplitude) => cells.map((cell) => cell.split('.').reverse().join('.'));

const ShiftDown = (cells, amplitude) =>
  cells.map((cell) => {
    const [rowIndex, cellIndex] = cell.split('.');
    return `${+rowIndex + amplitude}.${cellIndex}`;
  });

const ShiftRight = (cells, amplitude) =>
  cells.map((cell) => {
    const [rowIndex, cellIndex] = cell.split('.');
    return `${rowIndex}.${+cellIndex + amplitude}`;
  });

export const transformationsArr = [Rotate, ShiftDown, ShiftRight];
