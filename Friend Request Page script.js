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

// Replace the initial load function with this:
async function init() {
  try {
    // Show loading states
    document.getElementById('pending-list').innerHTML = '<p>Loading...</p>';
    document.getElementById('friends-list').innerHTML = '<p>Loading...</p>';
    document.getElementById('suggestions-list').innerHTML = '<p>Loading...</p>';
    
    // Fetch users from dummyjson API
    const response = await fetch("https://dummyjson.com/users");
    const data = await response.json();
    const users = data.users;
    
    // Filter out current user (assuming user ID 1 is the current user)
    const otherUsers = users.filter(user => user.id !== 1);
    
    // Simulate different friend states
    const pendingRequests = otherUsers.slice(0, 3).map(user => ({
      id: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      image: user.image
    }));
    
    const friends = otherUsers.slice(3, 6).map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      image: user.image
    }));
    
    const suggestions = otherUsers.slice(6, 18).map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      image: user.image,
      title: user.company?.title || 'Professional'
    }));
    
    // Render the data
    renderPendingRequests(pendingRequests);
    renderFriendsList(friends);
    renderSuggestions(suggestions);
    
  } catch (error) {
    console.error("Error loading user data:", error);
    showToast('Failed to load friend data', 'error');
    
    // Show error states
    document.getElementById('pending-list').innerHTML = '<p>Error loading requests</p>';
    document.getElementById('friends-list').innerHTML = '<p>Error loading friends</p>';
    document.getElementById('suggestions-list').innerHTML = '<p>Error loading suggestions</p>';
  }
}

// New rendering functions
function renderPendingRequests(requests) {
  const container = document.getElementById('pending-list');
  container.innerHTML = '';
  
  if (!requests.length) {
    container.innerHTML = '<p>No pending requests.</p>';
    return;
  }
  
  requests.forEach(request => {
    const div = document.createElement('div');
    div.className = 'item pending-request-item';
    div.dataset.requestId = request.id;
    div.innerHTML = `
      <div class="user-info">
        <img src="${request.image}" alt="${request.senderName}" class="friend-avatar">
        <span>${request.senderName}</span>
      </div>
      <div class="actions">
        <button class="btn-accept" data-request-id="${request.id}">Accept</button>
        <button class="btn-decline" data-request-id="${request.id}">Decline</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderFriendsList(friends) {
  const container = document.getElementById('friends-list');
  container.innerHTML = '';
  
  if (!friends.length) {
    container.innerHTML = '<p>You have no friends yet.</p>';
    return;
  }
  
  friends.forEach(friend => {
    const div = document.createElement('div');
    div.className = 'item friend-item';
    div.dataset.friendId = friend.id;
    div.innerHTML = `
      <div class="user-info">
        <img src="${friend.image}" alt="${friend.name}" class="friend-avatar">
        <span>${friend.name}</span>
      </div>
      <button class="btn-remove" data-friend-id="${friend.id}">Remove</button>
    `;
    container.appendChild(div);
  });
}

function renderSuggestions(suggestions) {
  const container = document.getElementById('suggestions-list');
  container.innerHTML = '';
  
  if (!suggestions.length) {
    container.innerHTML = '<p>No suggestions available.</p>';
    return;
  }
  
  suggestions.forEach(suggestion => {
    const div = document.createElement('div');
    div.className = 'item suggestion-item';
    div.dataset.userId = suggestion.id;
    div.innerHTML = `
      <div class="user-info">
        <img src="${suggestion.image}" alt="${suggestion.name}" class="friend-avatar">
        <div>
          <span class="name">${suggestion.name}</span>
          <span class="title">${suggestion.title}</span>
        </div>
      </div>
      <button class="btn-send-request" data-user-id="${suggestion.id}">Connect</button>
    `;
    container.appendChild(div);
  });
}

// Friend request actions
async function sendFriendRequest(userId) {
  if (!userId) {
    showToast('Please enter a valid user ID or username.', 'error');
    return;
  }
  try {
    // In a real app, this would be an API call
    showToast(`Friend request sent to user ${userId}!`);
    // Refresh suggestions to show the change
    await init();
  } catch (error) {
    showToast('Failed to send friend request: ' + error.message, 'error');
  }
}

async function acceptFriendRequest(requestId) {
  if (!requestId) return;
  try {
    // In a real app, this would be an API call
    showToast('Friend request accepted!');
    // Refresh lists to show the change
    await init();
  } catch (error) {
    showToast('Failed to accept request: ' + error.message, 'error');
  }
}

async function declineFriendRequest(requestId) {
  if (!requestId) return;
  try {
    // In a real app, this would be an API call
    showToast('Friend request declined.');
    // Refresh lists to show the change
    await init();
  } catch (error) {
    showToast('Failed to decline request: ' + error.message, 'error');
  }
}

async function removeFriend(friendId) {
  if (!friendId) return;
  try {
    // In a real app, this would be an API call
    showToast('Friend removed.');
    // Refresh lists to show the change
    await init();
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

// Initialize the page
document.addEventListener('DOMContentLoaded', init);
