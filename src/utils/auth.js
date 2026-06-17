import { jwtDecode } from 'jwt-decode';

export function getToken() {
  const tokenSalvo = localStorage.getItem('token');

  if (!tokenSalvo) {
    return null;
  }

  /*
    Remove aspas caso o token tenha sido salvo
    usando JSON.stringify().
  */
  return tokenSalvo
    .replace(/^"|"$/g, '')
    .trim();
}

export function isAuthenticated() {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) {
      return false;
    }

    const tokenValido =
      decoded.exp > Date.now() / 1000;

    if (!tokenValido) {
      localStorage.removeItem('token');
    }

    return tokenValido;
  } catch (error) {
    console.error('Token inválido:', error);

    localStorage.removeItem('token');

    return false;
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
}