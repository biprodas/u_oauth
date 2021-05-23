export const httpClient = () => {
  const token  = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const authProvider = {
  // authentication
  login: ({ username, password }) => {
    console.log('REACT_APP_API_URL', process.env.REACT_APP_API_URL);
    localStorage.setItem('token', "data.accessToken");
    return Promise.resolve({ redirectTo: '/users' });
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
  checkAuth: () => {
    return localStorage.getItem('token')
      ? Promise.resolve()
      : Promise.reject({ message: 'login required' })
  },
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      // const { id, fullName, avatar } = JSON.parse(localStorage.getItem('token'));

      return Promise.resolve({ id: 1, fullName: "Biprodas", avatar: "avatar" });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: (params) => Promise.resolve(),
};

export default authProvider;