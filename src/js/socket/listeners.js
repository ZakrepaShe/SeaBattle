import { updateBattlefieldAction } from '../reducers/battlefield';
import { updateUserAction } from '../reducers/user';
import { updateUsersListAction } from '../reducers/users';
import { push } from '../utils/common';
import { getCookie, setCookie } from '../utils/cookies';
import { socket } from '.';

export const autoLogin = () => (dispatch) => {
  socket.on('connect', () => {
    const userData = getCookie('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.isLoggedIn) {
        dispatch(updateUserAction(parsedData));
        socket.emit('login', parsedData);
      }
    }
  });
};

export const updateUserThunk = () => (dispatch) => {
  socket.on('update_user', (data) => {
    if (data.error) {
      console.log(data.error);
      return false;
    }
    console.log(data);
    dispatch(updateUserAction(data));
    // Save for auto login on reload
    if (data.isLoggedIn) {
      setCookie('user', JSON.stringify(data));
    }
  });
};

export const updateUsersList = () => (dispatch) => {
  socket.on('update_userslist', (data) => {
    dispatch(updateUsersListAction(data));
  });
};

export const startBattleThunk = () => (dispatch) => {
  socket.on('start_battle', (data) => {
    dispatch(updateBattlefieldAction(data));
    dispatch(push('/battle'));
  });
};

export default () => (dispatch) => {
  updateUserThunk()(dispatch);
  updateUsersList()(dispatch);
  startBattleThunk()(dispatch);
};
