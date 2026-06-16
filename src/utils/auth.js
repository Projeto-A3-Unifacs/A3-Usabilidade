import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);

    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};


export function getToken() {
  return localStorage.getItem('token');
}

export const logoutUser = () => {
  localStorage.removeItem('token');
};