import { socket } from '.';
import { getCookie, setCookie } from '../utils/cookies';
import { updateUserAction } from '../reducers/user';
import { updateUsersListAction } from '../reducers/users';

export const autoLogin = () => {
  const userData = getCookie('user');
  if (userData) {
    const parsedData = JSON.parse(userData);
    if (parsedData.isLoggedIn) {
      socket.emit('login', parsedData);
    }
  }
};

export const updateUserThunk = () => dispatch => {
  socket.on('update_user', data => {
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

export const updateUserslist = () => dispatch => {
  socket.on('update_userslist', data => {
    dispatch(updateUsersListAction(data));
  });
};

export default () => dispatch => {
  updateUserThunk()(dispatch);
  updateUserslist()(dispatch);
};
