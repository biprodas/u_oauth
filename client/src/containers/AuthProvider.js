import http from '../services/http';
import Cookies from 'universal-cookie';


export const httpClient = () => {
  const token  = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};


export const authProvider = {
  // authentication
  login: async ({ username, password }) => {
    await http.post(`/auth/login`, {username, password});
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
    const cookies = new Cookies();
    return cookies.get('accessToken')
      ? Promise.resolve()
      : Promise.reject({ message: 'login required' })
  },
  logout: async () => {
    await http.delete(`/auth/logout`);
    return Promise.resolve();
  },
  getIdentity: () => {
    console.log("Get identity");
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