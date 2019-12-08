import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import { stateSelector, getReducerProp } from '../utils/react-redux';

const UPDATE_USERSLIST = 'UPDATE_USERSLIST';
export const updateUsersListAction = createAction(UPDATE_USERSLIST);

const initialState = {
  clients: []
};

export const REDUCER_NAME = 'users';

export const usersListSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('clients')
);

export default handleActions(
  {
    [UPDATE_USERSLIST]: (_, { payload }) => ({
      ...payload
    })
  },
  initialState
);
