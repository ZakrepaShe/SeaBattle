import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import initListeners, { autoLogin } from '../socket/listeners';
import Lobby from './connection-dashboard';
import Battlefield from './battlefield';

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
            <Route exact path="/lobby" component={Lobby} />
            <Route exact path="/battle" component={Battlefield} />
            <Redirect to="lobby" />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

const mapDispatchToProps = {
  initSocketListeners: initListeners,
  initAutoLogin: autoLogin
};

export default connect(null, mapDispatchToProps)(ViewsRouter);
