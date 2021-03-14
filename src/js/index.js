import React from 'react';
import { render } from 'react-dom';
import { history } from './utils/common';
import ViewsRouter from './pages';
import store from './store';

const sea = document.getElementById('sea');

render(<ViewsRouter store={store(history)} history={history} />, sea);
