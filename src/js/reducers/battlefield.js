import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import { stateSelector, getReducerProp } from '../utils/react-redux';

const UPDATE_BATTLEFIELD = 'UPDATE_BATTLEFIELD';
export const updateBattlefieldAction = createAction(UPDATE_BATTLEFIELD);

const initialState = {
  partner: ''
};

export const REDUCER_NAME = 'battlefield';

export const battlePartnerSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('partner')
);

export default handleActions(
  {
    [UPDATE_BATTLEFIELD]: (_, { payload }) => ({
      ...payload
    })
  },
  initialState
);
