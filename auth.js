// Token management utilities
const TOKEN_KEY = 'authToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

function generateToken() {
  return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function setToken(username) {
  const token = generateToken();
  const expiryTime = Date.now() + TOKEN_EXPIRATION_TIME;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime);
  localStorage.setItem('username', username);
  localStorage.setItem('isLoggedIn', 'true');
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function isTokenValid() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) {
    return false;
  }
  
  const now = Date.now();
  return now < parseInt(expiry);
}

function getTokenExpiryTime() {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return null;
  const expiryDate = new Date(parseInt(expiry));
  return expiryDate.toLocaleTimeString();
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
}

function checkTokenValidity() {
  if (!isTokenValid()) {
    clearToken();
    window.location.href = 'login.html';
  }
}

function logout() {
  clearToken();
  window.location.replace('login.html');
}

// Check token validity on page load (but not on login or register pages)
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Only check token on protected pages
  if (currentPage !== 'login.html' && currentPage !== 'register.html') {
    checkTokenValidity();
    // Update remaining time every minute
    setInterval(checkTokenValidity, 60000);
  }
});
