export function getUserData() {
  return localStorage.getItem("user_data");
}

export function existsUserData() {
  return getUserData() !== null;
}

export function removeUserData() {
  localStorage.removeItem("user_data");
}

export function setUserData(user_data: string) {
  localStorage.setItem("user_data", user_data);
}
