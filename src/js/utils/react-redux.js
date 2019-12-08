import get from 'lodash-es/get';

export const defaultActionHandler = (state, { payload }) => ({
  ...state,
  ...payload
});

/** reducers helpers */
export const updatePrevState = newState => (state, { payload }) => ({
  ...state,
  ...(typeof newState === 'function' ? newState(payload) : newState)
});

/** selectors helpers */
export const getReducerProp = prop => state => get(state, prop);
export const stateSelector = REDUCER_NAME => state =>
  get(state, REDUCER_NAME, {});
