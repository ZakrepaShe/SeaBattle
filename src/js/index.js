import React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import ViewsRouter from './pages';
import store from './store';

const history = createBrowserHistory();
const sea = document.getElementById('sea');

render(<ViewsRouter store={store(history)} history={history} />, sea);
