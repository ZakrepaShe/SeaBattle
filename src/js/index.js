import io from 'socket.io-client';
import $ from 'jquery';
import { getCookie, setCookie } from './utils/cookies';

$(function() {
  const socket = io.connect('http://localhost:3000');
  let user = {};

  socket.on('update_user', data => {
    if (data.error) {
      console.log(data.error);
      return false;
    }
    console.log(data);
    user = {
      ...user,
      ...data
    };
    // Save for auto login on reload
    if (data.isLoggedIn) {
      setCookie('user', JSON.stringify(data));
    }
    $('.name-display').text(`Current name: ${data.name}`);
  });

  $('#changeNameButton').click(function() {
    socket.emit('update_user', { name: $('.name-change').val() });
  });

  socket.on('update_userslist', data => {
    $('.clients').html(data.clients.map(client => `<div>${client}<div/>`));
  });

  $('#loginButton').click(function() {
    socket.emit('login', {
      email: $('#email-login').val(),
      password: $('#password-login').val()
    });
  });

  $('#logoutButton').click(function() {
    socket.emit('logout', {});
  });

  // AutoLogin
  const userData = getCookie('user');
  if (userData) {
    const parsedData = JSON.parse(userData);
    if (parsedData.isLoggedIn) {
      socket.emit('login', parsedData);
    }
  }
});
