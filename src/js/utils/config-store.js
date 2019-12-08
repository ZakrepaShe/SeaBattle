import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

const __DEV__ = process.env.NODE_ENV !== 'production';

const enhancers = (
  middlewareEnhancer,
  devTools = global.__REDUX_DEVTOOLS_EXTENSION__
) =>
  __DEV__ && devTools
    ? compose(middlewareEnhancer, devTools({ name: 'SeaBattle' }))
    : middlewareEnhancer;

const __configStore = (reducers, middlewares, initalState, combine) =>
  createStore(
    combine(reducers),
    initalState || {},
    enhancers(applyMiddleware(...middlewares))
  );

const addReducers = (store, reducers) =>
  Object.assign(store, {
    addReducers: newReducers =>
      store.replaceReducer(
        combineReducers(Object.assign(reducers, newReducers))
      )
  });

export default (
  reducers,
  middlewares,
  initalState,
  combine = combineReducers
) =>
  addReducers(
    __configStore(reducers, middlewares, initalState, combine),
    reducers
  );
