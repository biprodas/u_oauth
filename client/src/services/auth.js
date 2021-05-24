import http from './http';
import jwtDecode from "jwt-decode";
import Cookies from 'universal-cookie';

const apiUrl = "/api/v1/auth";
const tokenKey = "token";

setTimeout(() => {
  http.setJWT(getJWT());
}, 1000);

export async function register(user) {
  const { name, email, phone, password } = user;
  const { data } = await http.post(`${apiUrl}/register`, { name, email, phone, password });
  localStorage.setItem(tokenKey, data.token);
}
export async function login(user) {
  const { email, password } = user;
  const { data } = await http.post(`${apiUrl}/login`, { email, password });
  localStorage.setItem(tokenKey, data.token);
  //const decoded = jwtDecode(token);
  //localStorage.setItem("user", JSON.stringify(decoded));
}

export const getOffice = () => JSON.parse(localStorage.getItem("office"));

export function getCurrentUser() {
  try {
    const token = localStorage.getItem(tokenKey);
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}
export function getCurrentUserProfile() {
  return http.get(`${apiUrl}/me`);
}
export function updateMyDetails(data) {
  const {name, email, phone} = data;
  return http.put(`${apiUrl}/updatedetails`, {name, email, phone});
}
export function updateMyPassword(data) {
  const {currentPassword, newPassword} = data;
  return http.put(`${apiUrl}/updatepassword`, {currentPassword, newPassword});
}

export function loginWithJWT(token) {
  localStorage.setItem(tokenKey, token);
}

export function logout() {
  // localStorage.removeItem(tokenKey);
  localStorage.clear();
}

export function getJWT() {
  const cookies = new Cookies();
  console.log("cookie access token", cookies.get('accessToken'));
  // return localStorage.getItem(tokenKey);
  return cookies.get('accessToken');

}

export default {
  register,
  login,
  loginWithJWT,
  logout,
  getOffice,
  getCurrentUser,
  getCurrentUserProfile,
  getJWT
};