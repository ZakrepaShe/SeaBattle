import React, { useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { battlePartnerSelector } from '../reducers/battlefield';
import { push } from '../utils/common';

const battlefieldStyle = {
  position: 'relative',
  display: 'block',
  width: '210px',
  flexWrap: 'wrap',
  borderLeft: '1px solid',
  borderBottom: '1px solid',
};

const rowStyle = {
  display: 'flex',
};

const cellStyle = {
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderTop: '1px solid',
  borderRight: '1px solid',
  cursor: 'pointer',
};

const YBoundMax = 9;
const XBoundMax = 9;
const YBoundMin = 0;
const XBoundMin = 0;

const getDisabledIds = (id) => {
  const [Y, X] = id.split('.');
  const y = +Y;
  const x = +X;
  const ids = [];

  //Top Left
  const YTopLeft = y - 1;
  const XTopLeft = x - 1;
  if (YTopLeft >= YBoundMin && XTopLeft >= XBoundMin) {
    ids.push(`${YTopLeft}.${XTopLeft}`);
  }

  //Top Right
  const YTopRight = y - 1;
  const XTopRight = x + 1;
  if (YTopRight >= YBoundMin && XTopRight <= XBoundMax) {
    ids.push(`${YTopRight}.${XTopRight}`);
  }

  //Bottom Left
  const YBottomLeft = y + 1;
  const XBottomLeft = x - 1;
  if (YBottomLeft <= YBoundMax && XBottomLeft >= XBoundMin) {
    ids.push(`${YBottomLeft}.${XBottomLeft}`);
  }

  //Bottom Right
  const YBottomRight = y + 1;
  const XBottomRight = x + 1;
  if (YBottomRight <= YBoundMax && XBottomRight <= XBoundMax) {
    ids.push(`${YBottomRight}.${XBottomRight}`);
  }

  return ids;
};

const Battlefield = ({ partner, redirect }) => {
  const [cellsInfo, updateCellsInfo] = useState({ active: [], disabled: {} });
  // if (!partner) {
  //   redirect('/lobby');
  // }

  const toggleActivity = (uuid) => () => {
    // 4 cells diagonally to active id
    const activeIdDisabledCells = getDisabledIds(uuid);
    console.log(activeIdDisabledCells);

    if (cellsInfo.active.some((id) => id === uuid)) {
      /** remove from active */
      const active = [...cellsInfo.active.filter((id) => id !== uuid)];
      delete cellsInfo.disabled[uuid];
      const disabled = {
        ...cellsInfo.disabled,
      };
      updateCellsInfo({
        active,
        disabled,
      });
    } else {
      /** add to active */
      updateCellsInfo({
        active: [...cellsInfo.active, uuid],
        disabled: { ...cellsInfo.disabled, [uuid]: activeIdDisabledCells },
      });
    }
  };

  return (
    <>
      <div className="name-display">{partner}</div>
      <div className="battlefield" style={battlefieldStyle}>
        {new Array(10).fill(0).map((_, rowIndex) => (
          <div key={rowIndex} className="row" style={rowStyle}>
            {new Array(10).fill(0).map((__, colIndex) => {
              const uuid = `${rowIndex}.${colIndex}`;
              const active = cellsInfo.active.some((id) => id === uuid);
              const disabled = Object.values(cellsInfo.disabled).some((disabledArr) =>
                disabledArr.some((id) => id === uuid),
              );
              return (
                <div
                  className="cell"
                  key={colIndex}
                  style={cellStyle}
                  id={uuid}
                  onClick={disabled ? () => {} : toggleActivity(uuid)}
                >
                  {active ? 'X' : ''}
                  {disabled ? '·' : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  partner: battlePartnerSelector(state),
});

const mapDispatchToProps = {
  redirect: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Battlefield);
