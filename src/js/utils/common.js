import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const push = (path) => (_dispatch, _getState, history) => history.push(path);
