import React, { useCallback, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { usersListSelector } from '../reducers/users';
import {
  userNameSelector,
  userEmailSelector,
  userPasswordSelector,
  userLoginStateSelector,
  clearUserAction
} from '../reducers/user';
import { socket } from '../socket';

const Lobby = ({ name, isLoggedIn, email, password, clients, clearUser }) => {
  const [userName, changeUserName] = useState('');
  const [userEmail, changeUserEmail] = useState('');
  const [userPassword, changeUserPassword] = useState('');

  useEffect(() => {
    changeUserName(name);
  }, [name]);

  useEffect(() => {
    changeUserEmail(email);
  }, [email]);

  useEffect(() => {
    changeUserPassword(password);
  }, [password]);

  const editNameHandler = useCallback(({ target: { value } }) => {
    changeUserName(value);
  }, []);

  const editEmailHandler = useCallback(({ target: { value } }) => {
    changeUserEmail(value);
  }, []);

  const editPasswordHandler = useCallback(({ target: { value } }) => {
    changeUserPassword(value);
  }, []);

  const changeNameHandler = useCallback(() => {
    socket.emit('update_user', { name: userName });
  }, [userName]);

  const loginHandler = useCallback(() => {
    socket.emit('login', {
      email: userEmail,
      password: userPassword
    });
  }, [userEmail, userPassword]);

  const registerHandler = useCallback(() => {
    if (userName && userEmail && userPassword) {
      socket.emit('register_user', {
        name: userName,
        email: userEmail,
        password: userPassword
      });
    }
  }, [userName, userEmail, userPassword]);

  const logoutHandler = useCallback(() => {
    socket.emit('logout', {});
    clearUser();
  }, []);

  return (
    <>
      <div className="name-display">{name}</div>

      <input
        type="name"
        className="name-change"
        value={userName}
        onChange={editNameHandler}
      />
      <button onClick={changeNameHandler} type="button" id="changeNameButton">
        Change Name
      </button>

      {!isLoggedIn && (
        <>
          <div className="col">
            <label htmlFor="email-login">Email</label>
            <input
              type="email"
              className="col"
              id="email-login"
              value={userEmail}
              onChange={editEmailHandler}
            />
          </div>
          <div className="col">
            <label htmlFor="password-login">Password</label>
            <input
              className="col"
              type="password"
              id="password-login"
              value={userPassword}
              onChange={editPasswordHandler}
            />
          </div>
        </>
      )}
      <div>
        {!isLoggedIn && (
          <button onClick={loginHandler} type="button" id="loginButton">
            Login
          </button>
        )}
        {!isLoggedIn && (
          <button onClick={registerHandler} type="button" id="loginButton">
            Register
          </button>
        )}
        {isLoggedIn && (
          <button onClick={logoutHandler} type="button" id="logoutButton">
            Logout
          </button>
        )}
      </div>

      <div>Connected clients:</div>
      <div className="clients">
        {clients.map((client, id) => (
          <div key={client + id}>{client}</div>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  clients: usersListSelector(state),
  name: userNameSelector(state),
  email: userEmailSelector(state),
  password: userPasswordSelector(state),
  isLoggedIn: userLoginStateSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearUser: clearUserAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
