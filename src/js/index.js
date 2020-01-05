import React from 'react';
import { render } from 'react-dom';
import ViewsRouter from './pages';
import store from './store';
import { history } from './utils/common';

const sea = document.getElementById('sea');

render(<ViewsRouter store={store(history)} history={history} />, sea);
