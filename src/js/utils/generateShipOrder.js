import { getBorderIds } from './findShipBorderZone';
import { transformationsArr } from './transformations';

const defaultShips = [['0.0', '0.1', '0.2', '0.3'], ['0.0', '0.1', '0.2'], ['0.0', '0.1'], ['0.0']];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Max not included, min included
}

const dedupeArr = (arr) => [...new Set(arr)];
const excludeCells = (what, from) => from.filter((item) => !what.includes(item));
const hasFullIntersection = (arr1Full, arr2) =>
  arr1Full.every((arr1FullItem) => arr2.includes(arr1FullItem));

function applyShipTransformations(ship, maxTransformations) {
  const numberOfTransformations = getRandomInt(1, maxTransformations);
  let transformedShip = ship;
  for (let i = numberOfTransformations; i >= 0; i--) {
    const transformationFuncNumber = getRandomInt(0, transformationsArr.length);
    const transformationFunc = transformationsArr[transformationFuncNumber];
    const amplitude = getRandomInt(0, 10);
    transformedShip = transformationFunc(transformedShip, amplitude);
  }
  return transformedShip;
}

function placeShip(ship, freeCells) {
  const transformedShip = applyShipTransformations(ship, 5);
  if (hasFullIntersection(transformedShip, freeCells)) {
    return transformedShip;
  }
  return placeShip(ship, freeCells);
}

export function placeShips() {
  let leftCells = [];
  const shipsCells = [];

  new Array(10).fill(0).forEach((_it, rowIndex) => {
    new Array(10).fill(0).forEach((_it, colIndex) => {
      leftCells.push(`${rowIndex}.${colIndex}`);
    });
  });

  defaultShips.forEach((ship, index) => {
    for (let i = 0; i <= index; i++) {
      const shipCoords = placeShip(ship, leftCells);
      shipsCells.push(...shipCoords);
      const deadZone = dedupeArr(shipCoords.map((coord) => getBorderIds(coord)).flat());
      leftCells = excludeCells(shipCoords.concat(deadZone), leftCells);
    }
  });

  return shipsCells;
}
