// Dropdown menu toggle
document.getElementById('profile-image-1').addEventListener('click', () => {
  document.getElementById('profile-menu-wrap').classList.toggle('open-menu');
});

document.addEventListener('click', (e) => {
  const profileImage = document.getElementById('profile-image-1');
  const menu = document.getElementById('profile-menu-wrap');
  if (!menu.contains(e.target) && !profileImage.contains(e.target)) {
    menu.classList.remove('open-menu');
  }
});

// Load user name in dropdown from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedData = JSON.parse(localStorage.getItem("linkedinProfileData"));
  if (savedData) {
    const menuUserName = document.getElementById("menuUserName");
    if (menuUserName) {
      menuUserName.textContent = `${savedData.firstName} ${savedData.lastName}`;
    }
  }
});

// Responsive search box toggle on small screens
document.addEventListener('DOMContentLoaded', function () {
  const searchIcon = document.getElementById('mobile-search-icon');
  const searchBox = document.querySelector('.search-box');
  const navbarCenter = document.querySelector('.navbar-center');

  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 600) {
      if (!searchBox.contains(e.target)) {
        searchBox.classList.remove('active');
        navbarCenter.classList.remove('hide-nav');
      }
    }
  });

  searchIcon.addEventListener('click', function (e) {
    e.stopPropagation();
    if (window.innerWidth <= 600) {
      searchBox.classList.toggle('active');
      navbarCenter.classList.toggle('hide-nav');
    }
  });
});

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// API base URL
const API_BASE = '/api';

// Get auth token from localStorage
function getToken() {
  return localStorage.getItem('token') || '';
}

// Get current user ID from localStorage
async function getCurrentUserId() {
  const data = JSON.parse(localStorage.getItem("linkedinProfileData"));
  return data?.userId || '';
}

// Helper to fetch JSON with authorization headers
async function fetchJSON(url, options = {}) {
  options.headers = {
    ...(options.headers || {}),
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'application/json'
  };
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Load pending friend requests
async function loadPendingRequests() {
  const container = document.getElementById('pending-list');
  try {
    const requests = await fetchJSON(`${API_BASE}/friendrequests/pending`);
    container.innerHTML = '';
    if (!requests.length) {
      container.innerHTML = '<p>No pending requests.</p>';
      return;
    }
    requests.forEach(r => {
      const div = document.createElement('div');
      div.className = 'pending-request-item';
      div.dataset.requestId = r.id;
      div.innerHTML = `
        <span>${r.senderName}</span>
        <button class="btn-accept" data-request-id="${r.id}">Accept</button>
        <button class="btn-decline" data-request-id="${r.id}">Decline</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error loading pending requests: ${error.message}</p>`;
  }
}

// Load friends list
async function loadFriendsList() {
  const container = document.getElementById('friends-list');
  try {
    const friends = await fetchJSON(`${API_BASE}/friends/list`);
    container.innerHTML = '';
    if (!friends.length) {
      container.innerHTML = '<p>You have no friends yet.</p>';
      return;
    }
    friends.forEach(friend => {
      const div = document.createElement('div');
      div.className = 'friend-item';
      div.dataset.friendId = friend.id;
      div.innerHTML = `
        <span>${friend.name}</span>
        <button class="btn-remove" data-friend-id="${friend.id}">Remove</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error loading friends: ${error.message}</p>`;
  }
}

// Load friend suggestions
async function loadSuggestions() {
  const container = document.getElementById('suggestions-list');
  try {
    const suggestions = await fetchJSON(`${API_BASE}/friends/suggestions`);
    container.innerHTML = '';
    if (!suggestions.length) {
      container.innerHTML = '<p>No suggestions available.</p>';
      return;
    }
    suggestions.forEach(s => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.dataset.userId = s.id;
      div.innerHTML = `
        <span>${s.name}</span>
        <button class="btn-send-request" data-user-id="${s.id}">Send Request</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error loading suggestions: ${error.message}</p>`;
  }
}

// Send friend request by userId
async function sendFriendRequest(userId) {
  if (!userId) {
    showToast('Please enter a valid user ID or username.', 'error');
    return;
  }
  try {
    await fetchJSON(`${API_BASE}/friends/request/${userId}`, {
      method: 'POST'
    });
    showToast('Friend request sent!');
    await loadSuggestions();
  } catch (error) {
    showToast('Failed to send friend request: ' + error.message, 'error');
  }
}

// Accept friend request
async function acceptFriendRequest(requestId) {
  if (!requestId) return;
  try {
    await fetchJSON(`${API_BASE}/friends/accept/${requestId}`, { method: 'POST' });
    showToast('Friend request accepted!');
    await loadPendingRequests();
    await loadFriendsList();
  } catch (error) {
    showToast('Failed to accept request: ' + error.message, 'error');
  }
}

// Decline friend request
async function declineFriendRequest(requestId) {
  if (!requestId) return;
  try {
    await fetchJSON(`${API_BASE}/friends/decline/${requestId}`, { method: 'POST' });
    showToast('Friend request declined.');
    await loadPendingRequests();
  } catch (error) {
    showToast('Failed to decline request: ' + error.message, 'error');
  }
}

// Remove friend
async function removeFriend(friendId) {
  if (!friendId) return;
  try {
    await fetchJSON(`${API_BASE}/friends/remove/${friendId}`, { method: 'POST' });
    showToast('Friend removed.');
    await loadFriendsList();
  } catch (error) {
    showToast('Failed to remove friend: ' + error.message, 'error');
  }
}

// Event delegation for friend request actions
document.addEventListener('click', e => {
  if (e.target.classList.contains('btn-send-request')) {
    const userId = e.target.dataset.userId;
    sendFriendRequest(userId);
  } else if (e.target.id === 'send-request-btn') {
    const input = document.getElementById('send-user-input');
    const val = input.value.trim();
    if (!val) {
      showToast('Please enter a username or user ID.', 'error');
      return;
    }
    sendFriendRequest(val);
    input.value = '';
  } else if (e.target.classList.contains('btn-accept')) {
    const requestId = e.target.dataset.requestId;
    acceptFriendRequest(requestId);
  } else if (e.target.classList.contains('btn-decline')) {
    const requestId = e.target.dataset.requestId;
    declineFriendRequest(requestId);
  } else if (e.target.classList.contains('btn-remove')) {
    const friendId = e.target.dataset.friendId;
    removeFriend(friendId);
  }
});

// Initial load
(async function init() {
  await loadPendingRequests();
  await loadFriendsList();
  await loadSuggestions();
})();