// Uploading Cover and Profile Image with Storage

        document.addEventListener('DOMContentLoaded', function() {
            // Get all profile image elements
            const mainProfileImage = document.getElementById('main-profile-image');
            const profileImage1 = document.getElementById('profile-image-1');
            const profileImage3 = document.getElementById('profile-image-3');
            const profileImage4 = document.getElementById('profile-image-4');
            const profileImage5 = document.getElementById('profile-image-5');
            
            // Group all profile images for easy updating
            const allProfileImages = [mainProfileImage, profileImage1, profileImage3, profileImage4, profileImage5];
            
            // Cover image element
            const coverImage = document.getElementById('cover-image');
            
            // File input elements
            const coverFileInput = document.getElementById('cover-upload');
            const profileFileInput = document.getElementById('profile-upload');
            
            // Load saved images from local storage
            const savedCoverImage = localStorage.getItem('coverImage');
            if (savedCoverImage) {
                coverImage.src = savedCoverImage;
            }
            
            const savedProfileImage = localStorage.getItem('profileImage');
            if (savedProfileImage) {
                // Update all profile images with the saved image
                updateAllProfileImages(savedProfileImage);
            }
            
            // Handle cover image upload
            coverFileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file && file.type.match('image.*')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Update the cover image source
                        coverImage.src = e.target.result;
                        
                        // Save to local storage
                        localStorage.setItem('coverImage', e.target.result);
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
            
            // Handle profile image upload
            profileFileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file && file.type.match('image.*')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const newImageSrc = e.target.result;
                        
                        // Update all profile images with the new image
                        updateAllProfileImages(newImageSrc);
                        
                        // Save to local storage
                        localStorage.setItem('profileImage', newImageSrc);
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
            
            // Function to update all profile images
            function updateAllProfileImages(src) {
                allProfileImages.forEach(image => {
                    if (image) {
                        image.src = src;
                    }
                });
            }
        });

//====================================================================================================================================================
// Add name, description, location of user we get from Profile Page

window.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem("linkedinProfileData"));
    
    if (userData) {
        const fullName = `${userData.firstName} ${userData.lastName}`;
        const location = `${userData.city}, ${userData.country}`;

        document.getElementById("userName").textContent = fullName;
        document.getElementById("desc").textContent = userData.desc;
        document.getElementById("location").textContent = location;
    }
});

//====================================================================================================================================================

// Drop Down Menu

// Show Menu by Clicking on Navigationbar Profile Picture 
document.getElementById('profile-image-1').addEventListener('click', function () {
    const menu = document.getElementById('profile-menu-wrap');
    menu.classList.toggle('open-menu');
  });
  
// Close Menu When Clicking Outside  
document.addEventListener('click', function (e) {
    const profileImage = document.getElementById('profile-image-1');
    const menu = document.getElementById('profile-menu-wrap');
  
    if (!menu.contains(e.target) && !profileImage.contains(e.target)) {
      menu.classList.remove('open-menu');
    }
  });

// Add name of user in Drop Down Menu
document.addEventListener('DOMContentLoaded', () => {
  const savedData = JSON.parse(localStorage.getItem("linkedinProfileData"));
  if (savedData) {
    const menuUserName = document.getElementById("menuUserName");
    if (menuUserName) {
      menuUserName.textContent = `${savedData.firstName} ${savedData.lastName}`;
    }
  }
});
  
//====================================================================================================================================================

/* Post & Comment */
let currentCommentPost = null;

document.getElementById('post-image').addEventListener('change', function () {
  const file = this.files[0];
  const preview = document.getElementById('image-preview');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
});

document.getElementById('submit-post').addEventListener('click', function () {
  const text = document.getElementById('post-text').value.trim();
  const imageFile = document.getElementById('post-image').files[0];
  const feed = document.getElementById('posts-feed');
  const profileImg = document.getElementById('profile-image-3').src;
  const userName = document.getElementById('userName').textContent;
  const userDesc = document.getElementById('desc').textContent;

  if (!text && !imageFile) {
    alert("Please enter some text or choose an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const post = document.createElement('div');
    post.className = 'post';

    // Get formatted time
    const postTime = formatPostTime(new Date());

    post.innerHTML = `
      <div class="post-header">
        <img src="${profileImg}" alt="User">
        <div>
          <div class="post-user">${userName}</div>
          <div class="post-desc">${userDesc}</div>
          <div class="post-time">${postTime}</div>
        </div>
      </div>
      <div class="post-content">
        ${text ? `<p>${text}</p>` : ""}
        ${imageFile ? `<img src="${e.target.result}" alt="Post Image">` : ""}
      </div>
      <div class="post-actions-bar">
        <i class="fa-regular fa-thumbs-up" onclick="toggleLike(this)"></i>
        <span class="like-count">0</span>
        <i class="fa-regular fa-comment" onclick="openCommentModal(this)"></i>
        <span class="comment-count">0</span>
      </div>
      <div class="comments-section"></div>
    `;

    feed.prepend(post);

    document.getElementById('post-text').value = "";
    document.getElementById('post-image').value = "";
    document.getElementById('image-preview').style.display = "none";
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    reader.onload({ target: { result: "" } });
  }
});

// Helper to format post time
function formatPostTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }); // e.g., Jun 5, 12:30 PM
}

function toggleLike(el) {
  const countSpan = el.nextElementSibling;
  let count = parseInt(countSpan.textContent);
  if (el.classList.contains('liked')) {
    el.classList.remove('liked');
    el.style.color = '#555';
    count--;
  } else {
    el.classList.add('liked');
    el.style.color = '#0073b1';
    count++;
  }
  countSpan.textContent = count;
}

function openCommentModal(commentIcon) {
  currentCommentPost = commentIcon.closest('.post');
  document.getElementById('comment-modal').style.display = 'flex';
  const profileImgSrc = document.getElementById('profile-image-3').src;
  document.getElementById('comment-profile-img').src = profileImgSrc;
}

function closeCommentModal() {
  document.getElementById('comment-modal').style.display = 'none';
  document.getElementById('comment-input').value = "";
}

function submitComment() {
  const commentText = document.getElementById('comment-input').value.trim();
  if (!commentText) return;

  const profileImg = document.getElementById('profile-image-3').src;
  const userName = document.getElementById('userName').textContent;
  const commentSection = currentCommentPost.querySelector('.comments-section');

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerHTML = `
    <div class="comment-top-row">
      <img src="${profileImg}" alt="User" class="comment-profile-img">
      <span class="comment-username">${userName}</span>
    </div>
    <div class="comment-content">
      <div class="comment-text">${commentText}</div>
      <span class="comment-time">${timeString}</span>
    </div>
  `;

  commentSection.appendChild(commentDiv);

  const comments = Array.from(commentSection.querySelectorAll('.comment'));
  const commentCountSpan = currentCommentPost.querySelector('.comment-count');
  commentCountSpan.textContent = comments.length;

  comments.forEach((comment, index) => {
    comment.style.display = index < 2 ? 'flex' : 'none';
  });

  const existingToggle = commentSection.querySelector('.toggle-comments-btn');
  if (existingToggle) existingToggle.remove();

  if (comments.length > 2) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-comments-btn';
    toggleBtn.textContent = 'Show More Comments';

    toggleBtn.addEventListener('click', function () {
      const isExpanded = toggleBtn.textContent === 'Show Less';
      comments.forEach((comment, index) => {
        if (index >= 2) {
          comment.style.display = isExpanded ? 'none' : 'flex';
        }
      });
      toggleBtn.textContent = isExpanded ? 'Show More Comments' : 'Show Less';
    });

    commentSection.appendChild(toggleBtn);
  }

  document.getElementById('comment-input').value = "";
  closeCommentModal();
}