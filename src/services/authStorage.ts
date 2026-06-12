const AUTH_TOKEN_KEY = 'plant-health-tracker:auth-token';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getAuthToken() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
