import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("auth_token");
}

export function existsToken() {
  return getToken() !== null;
}

export function removeToken() {
  localStorage.removeItem("auth_token");
}

export function setToken(auth_token : string) {
  localStorage.setItem("auth_token", auth_token);
}

export function isValidToken() {
  if (!existsToken()) return false;
  try {
    const auth_token = getToken();
    const decoded = jwtDecode(auth_token);
    const isExpired = Date.now() >= decoded.exp * 1000;

    if (isExpired) {
      removeToken();
      return false;
    }
  } catch {
    removeToken();
    return false;
  }

  return true;
}
