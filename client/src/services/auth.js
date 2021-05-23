export const httpClient = () => {
  const token  = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const authProvider = {
  // authentication
  login: ({ username, password }) => {
    const request = new Request(
      process.env.REACT_APP_API_URL + '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }
    );
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem(
          'token',
          data.accessToken
        );
      })
      .catch(() => {
        throw new Error('Network error');
      });
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem('token')
      ? Promise.resolve()
      : Promise.reject({ message: 'login required' }),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      const { id, fullName, avatar } = JSON.parse(localStorage.getItem('token'));
      return Promise.resolve({ id, fullName, avatar });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: (params) => Promise.resolve(),
};