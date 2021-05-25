import http from '../services/http';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

export const httpClient = () => {
  const cookies = new Cookies();
  const token = cookies.get('accessToken')
  return { Authorization: `Bearer ${token}` };
};


export const authProvider = {
  // authentication
  login: async ({ username, password }) => {
    await http.post(`/auth/login`, {username, password});
    // return Promise.resolve({ redirectTo: '/users' });
  },
  checkError: (error) => {
    console.log("Check errors");
    const status = error.status;
    if (status === 401 || status === 403) {
      const cookies = new Cookies();
      // cookies.get('accessToken')
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => {
    const cookies = new Cookies();
    console.log("Cechk auth", cookies.get('accessToken'));
    // if(!cookies.get('accessToken')) return Promise.resolve({ redirectTo: '/login' })
    return cookies.get('accessToken')
      ? Promise.resolve()
      : Promise.reject({ message: 'login required' })
  },
  logout: async () => {
    console.log("LOG OUT");
    const cookies = new Cookies();
    if(cookies.get('accessToken')) await http.delete(`/auth/logout`);
    // return Promise.resolve({ redirectTo: '/login' });
  },
  getIdentity: () => {
    console.log("Get identity");
    try {
      // const { id, fullName, avatar } = JSON.parse(localStorage.getItem('token'));
      const cookies = new Cookies();
      const {id, username} = jwt_decode(cookies.get('accessToken'));
      return Promise.resolve({ id, fullName: username, avatar: "avatar" });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: (params) => Promise.resolve(),
};

export default authProvider;