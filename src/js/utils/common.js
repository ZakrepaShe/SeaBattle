import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const push = path => history.push(path);
