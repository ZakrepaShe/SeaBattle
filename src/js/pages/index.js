import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import initListeners, { autoLogin } from '../socket/listeners';
import Battlefield from './battlefield';
import Lobby from './connection-dashboard';

class ViewsRouter extends Component {
  componentDidMount() {
    this.props.initSocketListeners();
    this.props.initAutoLogin();
  }

  render() {
    const { history, store } = this.props;
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/lobby" component={Lobby} />
            <Route path="/battle" component={Battlefield} />
            <Redirect to="lobby" />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

const mapDispatchToProps = {
  initSocketListeners: initListeners,
  initAutoLogin: autoLogin,
};

export default connect(null, mapDispatchToProps)(ViewsRouter);
