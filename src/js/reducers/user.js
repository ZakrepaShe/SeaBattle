import { defaultActionHandler, getReducerProp, stateSelector } from '../utils/react-redux';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

const UPDATE_USER = 'UPDATE_USER';
const CLEAR_USER = 'CLEAR_USER';
export const updateUserAction = createAction(UPDATE_USER);
export const clearUserAction = createAction(CLEAR_USER);

const initialState = {
  name: 'Anonymous',
  isLoggedIn: false,
  email: '',
  password: '',
};

export const REDUCER_NAME = 'user';

export const userNameSelector = createSelector(stateSelector(REDUCER_NAME), getReducerProp('name'));

export const userEmailSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('email'),
);

export const userPasswordSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('password'),
);

export const userLoginStateSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('isLoggedIn'),
);

export const userHashSelector = createSelector(stateSelector(REDUCER_NAME), getReducerProp('hash'));

export const userInBattleSelector = createSelector(
  stateSelector(REDUCER_NAME),
  getReducerProp('isInBattle'),
);

export default handleActions(
  {
    [UPDATE_USER]: defaultActionHandler,
    [CLEAR_USER]: () => ({
      ...initialState,
    }),
  },
  initialState,
);
