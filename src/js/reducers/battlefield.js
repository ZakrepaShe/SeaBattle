import { getReducerProp, stateSelector } from '../utils/react-redux';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

const UPDATE_BATTLEFIELD = 'UPDATE_BATTLEFIELD';
const CLEAR_BATTLEFIELD = 'CLEAR_BATTLEFIELD';
export const updateBattlefieldAction = createAction(UPDATE_BATTLEFIELD);
export const clearBattlefieldAction = createAction(CLEAR_BATTLEFIELD);

const initialState = {
  partnerId: '',
  partnerName: '',
  isReadyForBattle: false,
  isPartnerReadyForBattle: false,
  showPartnerField: false,
  field: { active: [], disabled: {}, checked: [] },
  partnerField: { active: [], checked: [] },
};

export const REDUCER_NAME = 'battlefield';

export const battlePartnerIdSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('partnerId'),
);

export const battlePartnerNameSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('partnerName'),
);

export const isReadyForBattleSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('isReadyForBattle'),
);

export const isPartnerReadyForBattleSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('isPartnerReadyForBattle'),
);

export const fieldSelector = createSelector(stateSelector(REDUCER_NAME), getReducerProp('field'));

export const partnerFieldSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('partnerField'),
);

export const showPartnerFieldSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('showPartnerField'),
);

export const activeTurnSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('activeTurn'),
);

export default handleActions(
  {
    [UPDATE_BATTLEFIELD]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [CLEAR_BATTLEFIELD]: () => initialState,
  },
  initialState,
);
