export const getCookie = (name) => {
  const matches = document.cookie.match(
    // eslint-disable-next-line prettier/prettier
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]/+^])/g, '\\$1')}=([^;]*)`)
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (name, value, options = {}) => {
  // eslint-disable-next-line no-param-reassign
  options = {
    path: '/',
    ...options,
  };

  if (options.expires) {
    // eslint-disable-next-line no-param-reassign
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const optionKey in options) {
    updatedCookie += `; ${optionKey}`;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += `=${optionValue}`;
    }
  }

  document.cookie = updatedCookie;
};
