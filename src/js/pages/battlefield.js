import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  activeTurnSelector,
  battlePartnerIdSelector,
  battlePartnerNameSelector,
  fieldSelector,
  isPartnerReadyForBattleSelector,
  isReadyForBattleSelector,
  partnerFieldSelector,
  showPartnerFieldSelector,
} from '../reducers/battlefield';
import { userNameSelector } from '../reducers/user';
import { socket } from '../socket';
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

const Battlefield = ({
  name,
  partnerId,
  partnerName,
  redirect,
  isReadyForBattle,
  isPartnerReadyForBattle,
  field,
  partnerField,
  showPartnerField,
  activeTurn,
}) => {
  const [cellsInfo, updateCellsInfo] = useState(field);
  if (!partnerId) {
    redirect('/lobby');
  }

  useEffect(() => {
    updateCellsInfo({
      ...cellsInfo,
      ...field,
    });
  }, [field]);

  const playerReadyHandler = useCallback(() => {
    socket.emit('player_ready', {
      partnerId,
      field: { active: cellsInfo.active, checked: cellsInfo.checked },
    });
  }, [partnerId, cellsInfo]);

  const turnHandler = useCallback(
    (uuid) => () => {
      socket.emit('player_turn', {
        partnerId,
        cell: uuid,
      });
    },
    [partnerId],
  );

  const toggleActivity = (uuid) => () => {
    // 4 cells diagonally to active id
    const activeIdDisabledCells = getDisabledIds(uuid);

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
        checked: [],
      });
    } else {
      /** add to active */
      updateCellsInfo({
        active: [...cellsInfo.active, uuid],
        disabled: { ...cellsInfo.disabled, [uuid]: activeIdDisabledCells },
        checked: [],
      });
    }
  };

  return (
    <div className="box" style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <div className="name-display">{name}</div>
        <div className="battlefield" style={battlefieldStyle}>
          {new Array(10).fill(0).map((_, rowIndex) => (
            <div key={rowIndex} className="row" style={rowStyle}>
              {new Array(10).fill(0).map((__, colIndex) => {
                const uuid = `${rowIndex}.${colIndex}`;
                const active = cellsInfo.active.some((id) => id === uuid);
                const disabled = Object.values(cellsInfo.disabled).some((disabledArr) =>
                  disabledArr.some((id) => id === uuid),
                );
                const checked = cellsInfo.checked.some((id) => id === uuid);
                return (
                  <div
                    className="cell"
                    key={colIndex}
                    style={cellStyle}
                    id={uuid}
                    onClick={disabled || isReadyForBattle ? () => {} : toggleActivity(uuid)}
                  >
                    {active && checked ? 'X' : active ? 'S' : checked ? 'O' : disabled ? '·' : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {!showPartnerField && (
          <>
            {!isReadyForBattle && (
              <div>Click on field to make Ships shape(currently no restrictions)</div>
            )}
            <button type="button" disabled={isReadyForBattle} onClick={playerReadyHandler}>
              {isReadyForBattle ? 'Waiting for partner' : 'Ready'}
            </button>
          </>
        )}
      </div>
      <div>
        <div className="name-display">{partnerName}</div>
        {showPartnerField ? (
          <>
            <div className="battlefield" style={battlefieldStyle}>
              {new Array(10).fill(0).map((_, rowIndex) => (
                <div key={rowIndex} className="row" style={rowStyle}>
                  {new Array(10).fill(0).map((__, colIndex) => {
                    const uuid = `${rowIndex}.${colIndex}`;
                    const active = partnerField.active.some((id) => id === uuid);
                    const checked = partnerField.checked.some((id) => id === uuid);
                    return (
                      <div
                        className="cell"
                        key={colIndex}
                        style={cellStyle}
                        id={uuid}
                        onClick={active || checked ? () => {} : turnHandler(uuid)}
                      >
                        {active && checked ? 'X' : active ? 'S' : checked ? 'O' : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="name-display">{activeTurn ? 'Your turn' : 'Opponent turn'}</div>
          </>
        ) : (
          <button type="button" disabled>
            {isPartnerReadyForBattle ? 'Ready' : 'Preparing'}
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  name: userNameSelector(state),
  partnerId: battlePartnerIdSelector(state),
  partnerName: battlePartnerNameSelector(state),
  isReadyForBattle: isReadyForBattleSelector(state),
  isPartnerReadyForBattle: isPartnerReadyForBattleSelector(state),
  field: fieldSelector(state),
  partnerField: partnerFieldSelector(state),
  showPartnerField: showPartnerFieldSelector(state),
  activeTurn: activeTurnSelector(state),
});

const mapDispatchToProps = {
  redirect: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Battlefield);
