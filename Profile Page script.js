const editProfileIcon = document.querySelector('.edit-icon-profile');
const profileEditModal = document.getElementById('profileEditModalOverlay');
const closeProfileEditBtn = document.getElementById('closeProfileEditBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const descInput = document.getElementById('descInput');
const cityInput = document.getElementById('cityInput');
const countryInput = document.getElementById('countryInput');
const userNameElement = document.getElementById('userName');
const descElement = document.getElementById('desc');
const locationElement = document.getElementById('location');

// ====== LocalStorage Key ======
const PROFILE_DATA_KEY = 'linkedinProfileData';

function openProfileEditModal() {
  // Load saved data if exists
  const savedData = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY)) || {};
  
  // Fill inputs with saved data or empty
  firstNameInput.value = savedData.firstName || '';
  lastNameInput.value = savedData.lastName || '';
  descInput.value = savedData.desc || '';
  cityInput.value = savedData.city || '';
  countryInput.value = savedData.country || '';
  
  // Show modal
  profileEditModal.classList.add('active');
}

function closeProfileEditModal() {
  profileEditModal.classList.remove('active');
}

function saveProfileData() {
  const profileData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    desc: descInput.value.trim(),
    city: cityInput.value.trim(),
    country: countryInput.value.trim()
  };

  localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(profileData));
  
  // Trigger storage event to update main page
  const event = new Event('storage');
  window.dispatchEvent(event);
  
  closeProfileEditModal();

  // Validate required fields
  if (!profileData.firstName || !profileData.lastName) {
    alert('First and Last Name are required!');
    return;
  }

  // Update DOM
  userNameElement.textContent = `${profileData.firstName} ${profileData.lastName}`;
  descElement.textContent = profileData.desc;
  locationElement.innerHTML = `${profileData.city}, ${profileData.country} <a href="#">Contact Info</a>`;

  // Save to localStorage
  localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(profileData));
  
  // Close modal
  closeProfileEditModal();
}

// ====== Event Listeners ======
editProfileIcon.addEventListener('click', openProfileEditModal);
closeProfileEditBtn.addEventListener('click', closeProfileEditModal);
saveProfileBtn.addEventListener('click', saveProfileData);

// Click outside modal to close
profileEditModal.addEventListener('click', (e) => {
  if (e.target === profileEditModal) closeProfileEditModal();
});

// ====== Load Saved Data on Page Load ======
document.addEventListener('DOMContentLoaded', () => {
  const savedData = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY));
  if (savedData) {
    userNameElement.textContent = `${savedData.firstName} ${savedData.lastName}`;
    descElement.textContent = savedData.desc;
    locationElement.innerHTML = `${savedData.city}, ${savedData.country} • <a href="#">Contact Info</a>`;
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

//==================================================================================================================================================================================
//  EDUCATION SECTION

const addEducationBtn = document.getElementById('addEducationBtn');
const educationModalOverlay = document.getElementById('educationModalOverlay');
const closeEducationBtn = document.getElementById('closeEducationBtn');
const schoolNameInput = document.getElementById('schoolNameInput');
const degreeSelect = document.getElementById('degreeSelect');
const fieldInput = document.getElementById('fieldInput');
const eduStartDateInput = document.getElementById('eduStartDateInput');
const eduEndDateInput = document.getElementById('eduEndDateInput');
const eduLogoUpload = document.getElementById('eduLogoUpload');
const eduLogoPreview = document.getElementById('eduLogoPreview');
const submitEducationBtn = document.getElementById('submitEducationBtn');
const educationList = document.getElementById('educationList');
const showMoreEducationBtn = document.getElementById('showMoreEducationBtn');
const showMoreEducationContainer = document.getElementById('showMoreEducationContainer');

let educationData = JSON.parse(localStorage.getItem('educationData')) || [];
let educationLogoData = null;
let isEduExpanded = false;
const VISIBLE_EDU = 2;
let editEducationIndex = null;

document.addEventListener('DOMContentLoaded', function () {
  renderEducation();

  addEducationBtn.addEventListener('click', () => openEducationModal(null));
  closeEducationBtn.addEventListener('click', closeEducationModal);
  educationModalOverlay.addEventListener('click', function (e) {
    if (e.target === educationModalOverlay) closeEducationModal();
  });

  [schoolNameInput, degreeSelect, fieldInput, eduStartDateInput].forEach(input => {
    input.addEventListener('input', validateEducationInputs);
  });

  eduLogoUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        educationLogoData = event.target.result;
        eduLogoPreview.innerHTML = `<img src="${educationLogoData}" alt="Logo" class="education-logo">`;
        eduLogoPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  submitEducationBtn.addEventListener('click', function () {
    if (editEducationIndex !== null) {
      updateEducation();
    } else {
      addEducation();
    }
  });

  showMoreEducationBtn.addEventListener('click', toggleEducationVisibility);
});

function openEducationModal(index) {
  educationModalOverlay.classList.add('active');
  submitEducationBtn.disabled = true;
  if (index !== null) {
    const edu = educationData[index];
    schoolNameInput.value = edu.school;
    degreeSelect.value = edu.degree;
    fieldInput.value = edu.field;
    eduStartDateInput.value = edu.startDate;
    eduEndDateInput.value = edu.endDate || '';
    educationLogoData = edu.logo || null;
    eduLogoPreview.innerHTML = edu.logo
      ? `<img src="${edu.logo}" alt="Logo" class="education-logo">`
      : '';
    editEducationIndex = index;
    submitEducationBtn.disabled = false;
  } else {
    editEducationIndex = null;
    clearEducationForm();
  }
  schoolNameInput.focus();
}

function closeEducationModal() {
  educationModalOverlay.classList.remove('active');
  clearEducationForm();
}

function clearEducationForm() {
  [schoolNameInput, fieldInput].forEach(input => input.value = '');
  degreeSelect.selectedIndex = 0;
  eduStartDateInput.value = '';
  eduEndDateInput.value = '';
  eduLogoUpload.value = '';
  eduLogoPreview.innerHTML = '';
  educationLogoData = null;
  editEducationIndex = null;
  submitEducationBtn.disabled = true;
}

function validateEducationInputs() {
  const isValid =
    schoolNameInput.value.trim() !== '' &&
    degreeSelect.value !== '' &&
    fieldInput.value.trim() !== '' &&
    eduStartDateInput.value !== '';
  submitEducationBtn.disabled = !isValid;
}

function addEducation() {
  const newEducation = {
    school: schoolNameInput.value.trim(),
    degree: degreeSelect.value,
    field: fieldInput.value.trim(),
    startDate: eduStartDateInput.value,
    endDate: eduEndDateInput.value || null,
    logo: educationLogoData || null
  };
  educationData.push(newEducation);
  localStorage.setItem('educationData', JSON.stringify(educationData));
  renderEducation();
  closeEducationModal();
}

function updateEducation() {
  const updatedEducation = {
    school: schoolNameInput.value.trim(),
    degree: degreeSelect.value,
    field: fieldInput.value.trim(),
    startDate: eduStartDateInput.value,
    endDate: eduEndDateInput.value || null,
    logo: educationLogoData || null
  };
  educationData[editEducationIndex] = updatedEducation;
  localStorage.setItem('educationData', JSON.stringify(educationData));
  renderEducation();
  closeEducationModal();
}

function removeEducation(index) {
  if (confirm('Remove this education entry?')) {
    educationData.splice(index, 1);
    localStorage.setItem('educationData', JSON.stringify(educationData));
    renderEducation();
  }
}

function toggleEducationVisibility() {
  isEduExpanded = !isEduExpanded;
  const icon = showMoreEducationBtn.querySelector('i');
  const text = showMoreEducationBtn.querySelector('span');
  icon.className = isEduExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
  text.textContent = isEduExpanded ? 'Show less' : 'Show more';

  document.querySelectorAll('.hidden-education').forEach(item => {
    item.style.display = isEduExpanded ? 'flex' : 'none';
  });
}

function formatEduDateRange(start, end) {
  const options = { year: 'numeric', month: 'short' };
  const startFormatted = new Date(start).toLocaleDateString('en-US', options);
  const endFormatted = end ? new Date(end).toLocaleDateString('en-US', options) : 'Continue';
  return `${startFormatted} - ${endFormatted}`;
}

function renderEducation() {
  educationList.innerHTML = '';

  if (educationData.length === 0) {
    educationList.innerHTML = '<div class="no-education">No education records yet</div>';
    showMoreEducationContainer.style.display = 'none';
    return;
  }

  isEduExpanded = false;
  const needsShowMore = educationData.length > VISIBLE_EDU;
  showMoreEducationContainer.style.display = needsShowMore ? 'block' : 'none';

  showMoreEducationBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
  showMoreEducationBtn.querySelector('span').textContent = 'Show more';

  educationData.forEach((edu, index) => {
    const eduItem = document.createElement('div');
    eduItem.className = 'education-item';

    if (index >= VISIBLE_EDU && needsShowMore) {
      eduItem.classList.add('hidden-education');
      eduItem.style.display = 'none';
    }

    const logoHtml = edu.logo
      ? `<img src="${edu.logo}" alt="Logo" class="education-logo">`
      : `<div class="education-logo" style="background: #f0f2f5; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-building" style="color: #666; font-size: 20px;"></i>
         </div>`;

    eduItem.innerHTML = `
      <div style="display: flex; align-items: center;">
        ${logoHtml}
        <div class="education-info">
          <div class="education-name">${edu.school}</div>
          <div class="education-degree">${edu.degree} in ${edu.field}</div>
          <div class="education-dates">${formatEduDateRange(edu.startDate, edu.endDate)}</div>
        </div>
      </div>
      <div>
        <button class="edit-btn-education" onclick="openEducationModal(${index})">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-btn" onclick="removeEducation(${index})">
          <i class='bx bx-x'></i>
        </button>
      </div>
    `;

    educationList.appendChild(eduItem);
  });
}

//==================================================================================================================================================================================

/* Skills Section */
        const addBtn = document.getElementById('addBtn');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeBtn = document.getElementById('closeBtn');
        const skillInput = document.getElementById('skillInput');
        const submitBtn = document.getElementById('submitBtn');
        const skillsList = document.getElementById('skillsList');
        const showMoreContainer = document.getElementById('showMoreContainer');
        const showMoreBtn = document.getElementById('showMoreBtn');

        let skills = JSON.parse(localStorage.getItem('skills')) || [];
        let isExpanded = false;
        const VISIBLE_SKILLS = 2;

        document.addEventListener('DOMContentLoaded', function () {
            renderSkills();

            addBtn.addEventListener('click', openModal);
            closeBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) closeModal();
            });

            skillInput.addEventListener('input', validateInput);
            skillInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' && !submitBtn.disabled) {
                    addSkill();
                }
            });

            submitBtn.addEventListener('click', addSkill);
            showMoreBtn.addEventListener('click', toggleSkillsVisibility);
        });

        function openModal() {
            modalOverlay.classList.add('active');
            skillInput.focus();
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            skillInput.value = '';
            submitBtn.disabled = true;
        }

        function validateInput() {
            submitBtn.disabled = skillInput.value.trim() === '';
        }

        function addSkill() {
            let skillName = skillInput.value.trim();

            if (skillName === '') return;

            // Capitalize each word
            skillName = skillName.replace(/\b\w/g, char => char.toUpperCase());

            // Check for duplicates
            if (skills.some(skill => skill.toLowerCase() === skillName.toLowerCase())) {
                alert("Skill is already located");
                return;
            }

            skills.push(skillName);
            localStorage.setItem('skills', JSON.stringify(skills));
            renderSkills();
            closeModal();
        }

        function removeSkill(index) {
            skills.splice(index, 1);
            localStorage.setItem('skills', JSON.stringify(skills));
            renderSkills();
        }

        function toggleSkillsVisibility() {
            isExpanded = !isExpanded;

            const icon = showMoreBtn.querySelector('i');
            const text = showMoreBtn.querySelector('span');

            icon.className = isExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
            text.textContent = isExpanded ? 'Show less' : 'Show more';

            const hiddenSkills = document.querySelectorAll('.hidden-skill');
            hiddenSkills.forEach(skill => {
                skill.style.display = isExpanded ? 'flex' : 'none';
            });
        }

        function renderSkills() {
            skillsList.innerHTML = '';

            if (skills.length === 0) {
                skillsList.innerHTML = '<div class="no-skills">No skills added yet</div>';
                showMoreContainer.style.display = 'none';
                return;
            }

            isExpanded = false;
            const needsShowMore = skills.length > VISIBLE_SKILLS;
            showMoreContainer.style.display = needsShowMore ? 'block' : 'none';

            showMoreBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
            showMoreBtn.querySelector('span').textContent = 'Show more';

            skills.forEach((skill, index) => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';

                if (index >= VISIBLE_SKILLS && needsShowMore) {
                    skillItem.classList.add('hidden-skill');
                    skillItem.style.display = 'none';
                }

                skillItem.innerHTML = `
                    <div class="skill-name">${skill}</div>
                    <div>
                        <button class="remove-btn" data-index="${index}">
                            <i class='bx bx-x'></i>
                        </button>
                    </div>
                `;

                skillsList.appendChild(skillItem);

                const removeBtn = skillItem.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function () {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeSkill(index);
                });
            });
        }

//==================================================================================================================================================================================
/* About Section */

const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');
const aboutText = document.getElementById('aboutText');
const emptyState = document.getElementById('emptyState');
const aboutTextarea = document.getElementById('aboutTextarea');
const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const showMoreButton = document.getElementById('showMoreButton');
const clearButton = document.getElementById('clearButton');

const STORAGE_KEY = 'linkedinAboutContent';

// Initialize text collapse state
let isCollapsed = true;

// Load content from local storage if available
function loadFromStorage() {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
        aboutText.textContent = savedContent;
        clearButton.classList.remove('hidden');
    }
    checkEmptyState();
}

// Save content to local storage
function saveToStorage(content) {
    if (content && content.trim().length > 0) {
        localStorage.setItem(STORAGE_KEY, content);
        clearButton.classList.remove('hidden');
    } else {
        localStorage.removeItem(STORAGE_KEY);
        clearButton.classList.add('hidden');
    }
}

// Function to check if about text is empty
function checkEmptyState() {
    const hasContent = aboutText.textContent.trim().length > 0;
    
    if (hasContent) {
        emptyState.classList.add('hidden');
        aboutText.classList.remove('hidden');
        
        // Check if show more button should be visible
        if (aboutText.scrollHeight > 100) {
            aboutText.classList.add('collapsed-text');
            showMoreButton.classList.remove('hidden');
        } else {
            aboutText.classList.remove('collapsed-text');
            showMoreButton.classList.add('hidden');
        }
    } else {
        emptyState.classList.remove('hidden');
        aboutText.classList.add('hidden');
        showMoreButton.classList.add('hidden');
    }
}

// Toggle between expanded and collapsed view
showMoreButton.addEventListener('click', () => {
    if (isCollapsed) {
        aboutText.classList.remove('collapsed-text');
        showMoreButton.textContent = "...see less";
    } else {
        aboutText.classList.add('collapsed-text');
        showMoreButton.textContent = "...see more";
    }
    isCollapsed = !isCollapsed;
});

// Switch to edit mode from empty state
emptyState.addEventListener('click', () => {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    aboutTextarea.focus();
});

// Switch to edit mode
editButton.addEventListener('click', () => {
    // Copy current content to textarea
    aboutTextarea.value = aboutText.textContent.trim();
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    aboutTextarea.focus();
});

// Cancel edit and return to view mode
cancelButton.addEventListener('click', () => {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
});

// Save changes and return to view mode
saveButton.addEventListener('click', () => {
    const newText = aboutTextarea.value.trim();
    aboutText.textContent = newText;
    
    // Save to local storage
    saveToStorage(newText);
    
    checkEmptyState();
    
    isCollapsed = true;
    showMoreButton.textContent = "...see more";
    
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
});

// Clear saved content
clearButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your saved information?')) {
        localStorage.removeItem(STORAGE_KEY);
        aboutText.textContent = '';
        aboutTextarea.value = '';
        clearButton.classList.add('hidden');
        checkEmptyState();
        
        editMode.classList.add('hidden');
        viewMode.classList.remove('hidden');
    }
});

// Load content on page load
loadFromStorage();

//=============================================================================================================================================================================
/* Languaage Section */

const addLangBtn = document.getElementById('addLangBtn');
const langModalOverlay = document.getElementById('langModalOverlay');
const closeLangBtn = document.getElementById('closeLangBtn');
const languageInput = document.getElementById('languageInput');
const proficiencySelect = document.getElementById('proficiencySelect');
const submitLangBtn = document.getElementById('submitLangBtn');
const languageList = document.getElementById('languageList');
const showMoreLangContainer = document.getElementById('showMoreLangContainer');
const showMoreLangBtn = document.getElementById('showMoreLangBtn');

let languages = JSON.parse(localStorage.getItem('languages')) || [];
let isLangExpanded = false;
const VISIBLE_LANGUAGES = 2;
let editIndex = null; // track if we are editing

document.addEventListener('DOMContentLoaded', function() {
    renderLanguages();

    addLangBtn.addEventListener('click', openLangModal);
    closeLangBtn.addEventListener('click', closeLangModal);
    langModalOverlay.addEventListener('click', function(e) {
        if (e.target === langModalOverlay) closeLangModal();
    });

    languageInput.addEventListener('input', validateLangInput);
    languageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !submitLangBtn.disabled) {
            if (editIndex !== null) {
                updateLanguage();
            } else {
                addLanguage();
            }
        }
    });

    submitLangBtn.addEventListener('click', function() {
        if (editIndex !== null) {
            updateLanguage();
        } else {
            addLanguage();
        }
    });

    showMoreLangBtn.addEventListener('click', toggleLanguagesVisibility);
});

function openLangModal() {
    langModalOverlay.classList.add('active');
    languageInput.focus();
}

function closeLangModal() {
    langModalOverlay.classList.remove('active');
    languageInput.value = '';
    proficiencySelect.selectedIndex = 0;
    submitLangBtn.disabled = true;
    editIndex = null; // Reset edit mode
}

function validateLangInput() {
    submitLangBtn.disabled = languageInput.value.trim() === '';
}

function addLanguage() {
    let langName = languageInput.value.trim();
    let proficiency = proficiencySelect.value;

    if (langName === '') return;

    // Capitalize first letter, lowercase the rest
    langName = langName.charAt(0).toUpperCase() + langName.slice(1).toLowerCase();

    if (languages.some(lang => lang.name.toLowerCase() === langName.toLowerCase())) {
        alert("Language is already in your list");
        return;
    }

    languages.push({
        name: langName,
        proficiency: proficiency
    });

    localStorage.setItem('languages', JSON.stringify(languages));
    renderLanguages();
    closeLangModal();
}

function updateLanguage() {
    let langName = languageInput.value.trim();
    let proficiency = proficiencySelect.value;

    if (langName === '') return;

    langName = langName.charAt(0).toUpperCase() + langName.slice(1).toLowerCase();

    if (languages.some((lang, idx) => idx !== editIndex && lang.name.toLowerCase() === langName.toLowerCase())) {
        alert("Language is already in your list");
        return;
    }

    languages[editIndex] = {
        name: langName,
        proficiency: proficiency
    };

    localStorage.setItem('languages', JSON.stringify(languages));
    renderLanguages();
    closeLangModal();
}

function removeLanguage(index) {
    languages.splice(index, 1);
    localStorage.setItem('languages', JSON.stringify(languages));
    renderLanguages();
}

function editLanguage(index) {
    const language = languages[index];
    languageInput.value = language.name;
    proficiencySelect.value = language.proficiency;
    langModalOverlay.classList.add('active');
    submitLangBtn.disabled = false;
    editIndex = index;
}

function toggleLanguagesVisibility() {
    isLangExpanded = !isLangExpanded;

    const icon = showMoreLangBtn.querySelector('i');
    const text = showMoreLangBtn.querySelector('span');

    icon.className = isLangExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
    text.textContent = isLangExpanded ? 'Show less' : 'Show more';

    const hiddenLanguages = document.querySelectorAll('.hidden-language');
    hiddenLanguages.forEach(lang => {
        lang.style.display = isLangExpanded ? 'flex' : 'none';
    });
}

function renderLanguages() {
    languageList.innerHTML = '';

    if (languages.length === 0) {
        languageList.innerHTML = '<div class="no-languages">No languages added yet</div>';
        showMoreLangContainer.style.display = 'none';
        return;
    }

    isLangExpanded = false;
    const needsShowMore = languages.length > VISIBLE_LANGUAGES;
    showMoreLangContainer.style.display = needsShowMore ? 'block' : 'none';

    showMoreLangBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
    showMoreLangBtn.querySelector('span').textContent = 'Show more';

    languages.forEach((language, index) => {
        const langItem = document.createElement('div');
        langItem.className = 'language-item';

        if (index >= VISIBLE_LANGUAGES && needsShowMore) {
            langItem.classList.add('hidden-language');
            langItem.style.display = 'none';
        }

        langItem.innerHTML = `
            <div class="language-info">
                <div class="language-name">${language.name}</div>
                <div class="proficiency-level">${language.proficiency}</div>
            </div>
            <div>
                <button class="edit-btn-language edit-lang-btn" data-index="${index}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="remove-btn remove-lang-btn" data-index="${index}">
                    <i class='bx bx-x'></i>
                </button>
            </div>
        `;

        languageList.appendChild(langItem);

        const removeBtn = langItem.querySelector('.remove-lang-btn');
        removeBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeLanguage(index);
        });

        const editBtn = langItem.querySelector('.edit-lang-btn');
        editBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editLanguage(index);
        });
    });
}
//=============================================================================================================================================================================
/* Experience Section */
const addExperienceBtn = document.getElementById('addExperienceBtn');
const experienceModalOverlay = document.getElementById('experienceModalOverlay');
const closeExperienceBtn = document.getElementById('closeExperienceBtn');
const jobTitleInput = document.getElementById('jobTitleInput');
const companyNameInput = document.getElementById('companyNameInput');
const startDateInput = document.getElementById('startDateInput');
const endDateInput = document.getElementById('endDateInput');
const companyLogoUpload = document.getElementById('companyLogoUpload');
const companyLogoPreview = document.getElementById('companyLogoPreview');
const submitExperienceBtn = document.getElementById('submitExperienceBtn');
const experienceList = document.getElementById('experienceList');
const showMoreExperienceContainer = document.getElementById('showMoreExperienceContainer');
const showMoreExperienceBtn = document.getElementById('showMoreExperienceBtn');

let experiences = JSON.parse(localStorage.getItem('experiences')) || [];
let isExperienceExpanded = false;
const VISIBLE_EXPERIENCES = 2;
let companyLogoDataUrl = null;

document.addEventListener('DOMContentLoaded', function() {
    renderExperiences();

    // Set today as default for end date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    startDateInput.min = '1900-01-01';
    startDateInput.max = `${yyyy}-${mm}-${dd}`;
    endDateInput.min = '1900-01-01';
    endDateInput.max = `${yyyy}-${mm}-${dd}`;

    addExperienceBtn.addEventListener('click', openExperienceModal);
    closeExperienceBtn.addEventListener('click', closeExperienceModal);
    experienceModalOverlay.addEventListener('click', function(e) {
        if (e.target === experienceModalOverlay) closeExperienceModal();
    });

    // Image upload handler
    companyLogoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                companyLogoDataUrl = event.target.result;
                companyLogoPreview.innerHTML = `<img src="${companyLogoDataUrl}" alt="Company logo preview">`;
                companyLogoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Validate inputs
    jobTitleInput.addEventListener('input', validateExperienceInputs);
    companyNameInput.addEventListener('input', validateExperienceInputs);
    startDateInput.addEventListener('input', function() {
        endDateInput.min = this.value;
        validateExperienceInputs();
    });
    endDateInput.addEventListener('input', validateExperienceInputs);

    submitExperienceBtn.addEventListener('click', addExperience);
    showMoreExperienceBtn.addEventListener('click', toggleExperiencesVisibility);
});

function openExperienceModal() {
    experienceModalOverlay.classList.add('active');
    jobTitleInput.focus();
    validateExperienceInputs();
}

function closeExperienceModal() {
    experienceModalOverlay.classList.remove('active');
    jobTitleInput.value = '';
    companyNameInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    companyLogoUpload.value = '';
    companyLogoPreview.innerHTML = '';
    companyLogoPreview.style.display = 'none';
    companyLogoDataUrl = null;
    submitExperienceBtn.disabled = true;
}

function validateExperienceInputs() {
    const titleValid = jobTitleInput.value.trim() !== '';
    const companyValid = companyNameInput.value.trim() !== '';
    const startDateValid = startDateInput.value !== '';
    
    submitExperienceBtn.disabled = !(titleValid && companyValid && startDateValid);
}

function formatExperienceDate(startDate, endDate) {
    const start = new Date(startDate);
    const options = { year: 'numeric', month: 'short' };
    const startStr = start.toLocaleDateString('en-US', options);
    
    if (!endDate) {
        return `${startStr} - Present`;
    }
    
    const end = new Date(endDate);
    const endStr = end.toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
}

function addExperience() {
    const title = jobTitleInput.value.trim();
    const company = companyNameInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value || null;
    
    if (!title || !company || !startDate) return;
    
    // Check if end date is before start date
    if (endDate && new Date(endDate) < new Date(startDate)) {
        alert("End date cannot be before start date");
        return;
    }
    
    const newExperience = {
        title: title,
        company: company,
        startDate: startDate,
        endDate: endDate,
        logo: companyLogoDataUrl || null
    };
    
    experiences.push(newExperience);
    localStorage.setItem('experiences', JSON.stringify(experiences));
    renderExperiences();
    closeExperienceModal();
}

function removeExperience(index) {
    if (confirm('Are you sure you want to remove this experience?')) {
        experiences.splice(index, 1);
        localStorage.setItem('experiences', JSON.stringify(experiences));
        renderExperiences();
    }
}

function toggleExperiencesVisibility() {
    isExperienceExpanded = !isExperienceExpanded;

    const icon = showMoreExperienceBtn.querySelector('i');
    const text = showMoreExperienceBtn.querySelector('span');

    icon.className = isExperienceExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
    text.textContent = isExperienceExpanded ? 'Show less' : 'Show more';

    const hiddenExperiences = document.querySelectorAll('.hidden-experience');
    hiddenExperiences.forEach(exp => {
        exp.style.display = isExperienceExpanded ? 'flex' : 'none';
    });
}

function renderExperiences() {
    experienceList.innerHTML = '';

    if (experiences.length === 0) {
        experienceList.innerHTML = '<div class="no-experiences">No experiences added yet</div>';
        showMoreExperienceContainer.style.display = 'none';
        return;
    }

    // Sort experiences by start date (oldest first)
    experiences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    isExperienceExpanded = false;
    const needsShowMore = experiences.length > VISIBLE_EXPERIENCES;
    showMoreExperienceContainer.style.display = needsShowMore ? 'block' : 'none';

    showMoreExperienceBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
    showMoreExperienceBtn.querySelector('span').textContent = 'Show more';

    experiences.forEach((exp, index) => {
        const expItem = document.createElement('div');
        expItem.className = 'experience-item';

        if (index >= VISIBLE_EXPERIENCES && needsShowMore) {
            expItem.classList.add('hidden-experience');
            expItem.style.display = 'none';
        }

        const logoHtml = exp.logo 
            ? `<img src="${exp.logo}" class="company-logo" alt="${exp.company} logo">`
            : `<div class="company-logo" style="background: #f0f2f5; display: flex; align-items: center; justify-content: center;">
                  <i class="fa-solid fa-building" style="color: #666; font-size: 20px;"></i>
               </div>`;

        expItem.innerHTML = `
            ${logoHtml}
            <div class="experience-info">
                <div class="experience-header">
                    <div>
                        <div class="job-title">${exp.title}</div>
                        <div class="company-name">${exp.company}</div>
                        <div class="experience-date">${formatExperienceDate(exp.startDate, exp.endDate)}</div>
                    </div>
                    <div>
                        <button class="remove-btn remove-experience-btn" data-index="${index}">
                            <i class='bx bx-x'></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        experienceList.appendChild(expItem);

        const removeBtn = expItem.querySelector('.remove-experience-btn');
        removeBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeExperience(index);
        });
    });
}

//=============================================================================================================================================================================
/* Projects Section */
const addProjectBtn = document.getElementById('addProjectBtn');
const projectModalOverlay = document.getElementById('projectModalOverlay');
const closeProjectBtn = document.getElementById('closeProjectBtn');
const projectTitleInput = document.getElementById('projectTitleInput');
const projectDateInput = document.getElementById('projectDateInput');
const projectDescInput = document.getElementById('projectDescInput');
const projectLinkInput = document.getElementById('projectLinkInput');
const charCount = document.getElementById('charCount');
const submitProjectBtn = document.getElementById('submitProjectBtn');
const projectList = document.getElementById('projectList');
const showMoreProjectContainer = document.getElementById('showMoreProjectContainer');
const showMoreProjectBtn = document.getElementById('showMoreProjectBtn');

let projects = JSON.parse(localStorage.getItem('projects')) || [];
let isProjectExpanded = false;
const VISIBLE_PROJECTS = 2;
let editProjectIndex = null;

document.addEventListener('DOMContentLoaded', function() {
    renderProjects();

    addProjectBtn.addEventListener('click', openProjectModal);
    closeProjectBtn.addEventListener('click', closeProjectModal);
    projectModalOverlay.addEventListener('click', function(e) {
        if (e.target === projectModalOverlay) closeProjectModal();
    });

    // Set today as the default date (max date)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    projectDateInput.max = todayString;
    
    // Validate inputs
    projectTitleInput.addEventListener('input', validateProjectInputs);
    projectDateInput.addEventListener('input', validateProjectInputs);
    projectDescInput.addEventListener('input', function() {
        // Update character count
        const length = this.value.length;
        charCount.textContent = length;
        
        // Check if length exceeds max
        if (length > 500) {
            alert('Description cannot exceed 500 characters!');
            this.value = this.value.substring(0, 500);
            charCount.textContent = 500;
        }
        
        validateProjectInputs();
    });
    
    // Handle form submission
    submitProjectBtn.addEventListener('click', function() {
        if (editProjectIndex !== null) {
            updateProject();
        } else {
            addProject();
        }
    });
    
    showMoreProjectBtn.addEventListener('click', toggleProjectsVisibility);
});

function openProjectModal() {
    projectModalOverlay.classList.add('active');
    projectTitleInput.focus();
    
    // Set default date to today if adding new project
    if (editProjectIndex === null) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        projectDateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    
    validateProjectInputs();
}

function closeProjectModal() {
    projectModalOverlay.classList.remove('active');
    projectTitleInput.value = '';
    projectDateInput.value = '';
    projectDescInput.value = '';
    projectLinkInput.value = '';
    charCount.textContent = '0';
    submitProjectBtn.disabled = true;
    editProjectIndex = null;
}

function validateProjectInputs() {
    const titleValid = projectTitleInput.value.trim() !== '';
    const dateValid = projectDateInput.value !== '';
    const descValid = projectDescInput.value.trim() !== '';
    
    submitProjectBtn.disabled = !(titleValid && dateValid && descValid);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function addProject() {
    const title = projectTitleInput.value.trim();
    const date = projectDateInput.value;
    const description = projectDescInput.value.trim();
    const link = projectLinkInput.value.trim();
    
    if (!title || !date || !description) return;
    
    // Check for duplicates by title
    if (projects.some(project => project.title.toLowerCase() === title.toLowerCase())) {
        alert("A project with this title already exists");
        return;
    }
    
    const newProject = {
        title: title,
        date: date,
        description: description,
        link: link || null
    };
    
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
    closeProjectModal();
}

function updateProject() {
    const title = projectTitleInput.value.trim();
    const date = projectDateInput.value;
    const description = projectDescInput.value.trim();
    const link = projectLinkInput.value.trim();
    
    if (!title || !date || !description) return;
    
    // Check for duplicates, excluding the current project
    if (projects.some((project, idx) => 
        idx !== editProjectIndex && 
        project.title.toLowerCase() === title.toLowerCase())) {
        alert("A project with this title already exists");
        return;
    }
    
    projects[editProjectIndex] = {
        title: title,
        date: date,
        description: description,
        link: link || null
    };
    
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
    closeProjectModal();
}

function removeProject(index) {
    if (confirm('Are you sure you want to remove this project?')) {
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects();
    }
}

function editProject(index) {
    const project = projects[index];
    projectTitleInput.value = project.title;
    projectDateInput.value = project.date;
    projectDescInput.value = project.description;
    projectLinkInput.value = project.link || '';
    charCount.textContent = project.description.length;
    
    editProjectIndex = index;
    openProjectModal();
}

function toggleProjectsVisibility() {
    isProjectExpanded = !isProjectExpanded;
    
    const icon = showMoreProjectBtn.querySelector('i');
    const text = showMoreProjectBtn.querySelector('span');
    
    icon.className = isProjectExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
    text.textContent = isProjectExpanded ? 'Show less' : 'Show more';
    
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    hiddenProjects.forEach(project => {
        project.style.display = isProjectExpanded ? 'block' : 'none';
    });
}

function renderProjects() {
    projectList.innerHTML = '';
    
    if (projects.length === 0) {
        projectList.innerHTML = '<div class="no-projects">No projects added yet</div>';
        showMoreProjectContainer.style.display = 'none';
        return;
    }
    
    // Sort projects by date (newest first)
    projects.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    isProjectExpanded = false;
    const needsShowMore = projects.length > VISIBLE_PROJECTS;
    showMoreProjectContainer.style.display = needsShowMore ? 'block' : 'none';
    
    showMoreProjectBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
    showMoreProjectBtn.querySelector('span').textContent = 'Show more';
    
    projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        if (index >= VISIBLE_PROJECTS && needsShowMore) {
            projectItem.classList.add('hidden-project');
            projectItem.style.display = 'none';
        }
        
        let projectHTML = `
            <div class="project-header">
                <div class="project-title-date">
                    <div class="project-title">${project.title}</div>
                    <div class="project-date">${formatDate(project.date)}</div>
                </div>
                <div class="project-actions">
                    <button class="edit-btn-language edit-project-btn" data-index="${index}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="remove-btn remove-project-btn" data-index="${index}">
                        <i class='bx bx-x'></i>
                    </button>
                </div>
            </div>
            <div class="project-description">${project.description}</div>
        `;
        
        // Only add link if it exists
        if (project.link) {
            projectHTML += `<a href="${project.link}" class="project-link" target="_blank">
                <i class="fa-brands fa-github"></i> View on GitHub
            </a>`;
        }
        
        projectItem.innerHTML = projectHTML;
        projectList.appendChild(projectItem);
        
        // Add event listeners to buttons
        const removeBtn = projectItem.querySelector('.remove-project-btn');
        removeBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeProject(index);
        });
        
        const editBtn = projectItem.querySelector('.edit-project-btn');
        editBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editProject(index);
        });
    });
}

/*=================================================================================================================================================================*/
/* Licenses & Certifications */

const addCertBtn = document.getElementById('addCertBtn');
const certModalOverlay = document.getElementById('certModalOverlay');
const closeCertBtn = document.getElementById('closeCertBtn');
const certTitleInput = document.getElementById('certTitleInput');
const certImageUpload = document.getElementById('certImageUpload');
const certImagePreview = document.getElementById('certImagePreview');
const certDateInput = document.getElementById('certDateInput');
const certDocInput = document.getElementById('certDocInput');
const certCharCount = document.getElementById('certCharCount');
const submitCertBtn = document.getElementById('submitCertBtn');
const certificationsList = document.getElementById('certificationsList');
const showMoreCertContainer = document.getElementById('showMoreCertContainer');
const showMoreCertBtn = document.getElementById('showMoreCertBtn');

let certifications = JSON.parse(localStorage.getItem('certifications')) || [];
let isCertExpanded = false;
const VISIBLE_CERTS = 2;
let certImageDataUrl = null;

document.addEventListener('DOMContentLoaded', function() {
    renderCertifications();

    // Set today as default date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    certDateInput.value = `${yyyy}-${mm}-${dd}`;
    certDateInput.max = `${yyyy}-${mm}-${dd}`;

    addCertBtn.addEventListener('click', openCertModal);
    closeCertBtn.addEventListener('click', closeCertModal);
    certModalOverlay.addEventListener('click', function(e) {
        if (e.target === certModalOverlay) closeCertModal();
    });

    // Image upload handler
    certImageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                certImageDataUrl = event.target.result;
                certImagePreview.innerHTML = `<img src="${certImageDataUrl}" alt="Certification preview">`;
                certImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Documentation character counter
    certDocInput.addEventListener('input', function() {
        const length = this.value.length;
        certCharCount.textContent = length;
        
        if (length > 500) {
            this.value = this.value.substring(0, 500);
            certCharCount.textContent = 500;
        }
    });

    // Validate inputs
    certTitleInput.addEventListener('input', validateCertInputs);
    certDateInput.addEventListener('input', validateCertInputs);

    submitCertBtn.addEventListener('click', addCertification);
    showMoreCertBtn.addEventListener('click', toggleCertificationsVisibility);
});

function openCertModal() {
    certModalOverlay.classList.add('active');
    certTitleInput.focus();
    validateCertInputs();
}

function closeCertModal() {
    certModalOverlay.classList.remove('active');
    certTitleInput.value = '';
    certImageUpload.value = '';
    certImagePreview.innerHTML = '';
    certImagePreview.style.display = 'none';
    certImageDataUrl = null;
    certDateInput.value = '';
    certDocInput.value = '';
    certCharCount.textContent = '0';
    submitCertBtn.disabled = true;
}

function validateCertInputs() {
    const titleValid = certTitleInput.value.trim() !== '';
    const dateValid = certDateInput.value !== '';
    
    submitCertBtn.disabled = !(titleValid && dateValid);
}

function formatCertDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function addCertification() {
    const title = certTitleInput.value.trim();
    const date = certDateInput.value;
    const documentation = certDocInput.value.trim();
    
    if (!title || !date) return;
    
    // Check for duplicates
    if (certifications.some(cert => cert.title.toLowerCase() === title.toLowerCase())) {
        alert("This certification is already in your list");
        return;
    }
    
    const newCert = {
        title: title,
        image: certImageDataUrl || null,
        date: date,
        documentation: documentation || null
    };
    
    certifications.push(newCert);
    localStorage.setItem('certifications', JSON.stringify(certifications));
    renderCertifications();
    closeCertModal();
}

function removeCertification(index) {
    if (confirm('Are you sure you want to remove this certification?')) {
        certifications.splice(index, 1);
        localStorage.setItem('certifications', JSON.stringify(certifications));
        renderCertifications();
    }
}

function toggleCertificationsVisibility() {
    isCertExpanded = !isCertExpanded;

    const icon = showMoreCertBtn.querySelector('i');
    const text = showMoreCertBtn.querySelector('span');

    icon.className = isCertExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
    text.textContent = isCertExpanded ? 'Show less' : 'Show more';

    const hiddenCerts = document.querySelectorAll('.hidden-cert');
    hiddenCerts.forEach(cert => {
        cert.style.display = isCertExpanded ? 'flex' : 'none';
    });
}

function renderCertifications() {
    certificationsList.innerHTML = '';

    if (certifications.length === 0) {
        certificationsList.innerHTML = '<div class="no-certifications">No certifications added yet</div>';
        showMoreCertContainer.style.display = 'none';
        return;
    }

    // Sort certifications by date (newest first)
    certifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    isCertExpanded = false;
    const needsShowMore = certifications.length > VISIBLE_CERTS;
    showMoreCertContainer.style.display = needsShowMore ? 'block' : 'none';

    showMoreCertBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
    showMoreCertBtn.querySelector('span').textContent = 'Show more';

    certifications.forEach((cert, index) => {
        const certItem = document.createElement('div');
        certItem.className = 'certification-item';

        if (index >= VISIBLE_CERTS && needsShowMore) {
            certItem.classList.add('hidden-cert');
            certItem.style.display = 'none';
        }

        const imageHtml = cert.image 
            ? `<img src="${cert.image}" class="certification-image" alt="${cert.title}">`
            : `<div class="certification-image" style="background: #f0f2f5; display: flex; align-items: center; justify-content: center;">
                  <i class="fa-solid fa-certificate" style="color: #666; font-size: 20px;"></i>
               </div>`;

        const docHtml = cert.documentation 
            ? `<div class="certification-doc">${cert.documentation}</div>`
            : '';

        certItem.innerHTML = `
            ${imageHtml}
            <div class="certification-info">
                <div class="certification-header">
                    <div>
                        <div class="certification-title">${cert.title}</div>
                        <div class="certification-date">${formatCertDate(cert.date)}</div>
                    </div>
                    <div>
                        <button class="remove-btn remove-cert-btn" data-index="${index}">
                            <i class='bx bx-x'></i>
                        </button>
                    </div>
                </div>
                ${docHtml}
            </div>
        `;

        certificationsList.appendChild(certItem);

        const removeBtn = certItem.querySelector('.remove-cert-btn');
        removeBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCertification(index);
        });
    });
}

//=============================================================================================================================================================================
/* Events Section */
const addEventBtn = document.getElementById('addEventBtn');
const eventModalOverlay = document.getElementById('eventModalOverlay');
const closeEventBtn = document.getElementById('closeEventBtn');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventImageUpload = document.getElementById('eventImageUpload');
const eventImagePreview = document.getElementById('eventImagePreview');
const eventStartDateInput = document.getElementById('eventStartDate');
const eventEndDateInput = document.getElementById('eventEndDate');
const submitEventBtn = document.getElementById('submitEventBtn');
const eventsList = document.getElementById('eventsList');
const showMoreEventsContainer = document.getElementById('showMoreEventsContainer');
const showMoreEventsBtn = document.getElementById('showMoreEventsBtn');

let events = JSON.parse(localStorage.getItem('events')) || [];
let isEventsExpanded = false;
const VISIBLE_EVENTS = 2;
let eventImageDataUrl = null;

document.addEventListener('DOMContentLoaded', function() {
    renderEvents();

    // Set today as default start date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    eventStartDateInput.value = `${yyyy}-${mm}-${dd}`;
    eventStartDateInput.min = `${yyyy}-${mm}-${dd}`;

    addEventBtn.addEventListener('click', openEventModal);
    closeEventBtn.addEventListener('click', closeEventModal);
    eventModalOverlay.addEventListener('click', function(e) {
        if (e.target === eventModalOverlay) closeEventModal();
    });

    // Image upload handler
    eventImageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                eventImageDataUrl = event.target.result;
                eventImagePreview.innerHTML = `<img src="${eventImageDataUrl}" alt="Event preview">`;
                eventImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Validate inputs
    eventTitleInput.addEventListener('input', validateEventInputs);
    eventStartDateInput.addEventListener('input', function() {
        eventEndDateInput.min = this.value;
        validateEventInputs();
    });
    eventEndDateInput.addEventListener('input', validateEventInputs);

    submitEventBtn.addEventListener('click', addEvent);
    showMoreEventsBtn.addEventListener('click', toggleEventsVisibility);
});

function openEventModal() {
    eventModalOverlay.classList.add('active');
    eventTitleInput.focus();
    validateEventInputs();
}

function closeEventModal() {
    eventModalOverlay.classList.remove('active');
    eventTitleInput.value = '';
    eventImageUpload.value = '';
    eventImagePreview.innerHTML = '';
    eventImagePreview.style.display = 'none';
    eventImageDataUrl = null;
    
    // Reset dates to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    eventStartDateInput.value = `${yyyy}-${mm}-${dd}`;
    eventEndDateInput.value = '';
    
    submitEventBtn.disabled = true;
}

function validateEventInputs() {
    const titleValid = eventTitleInput.value.trim() !== '';
    const startDateValid = eventStartDateInput.value !== '';
    
    submitEventBtn.disabled = !(titleValid && startDateValid);
}

function formatEventDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', options);
    
    if (!endDate || startDate === endDate) {
        return startStr;
    }
    
    const endStr = end.toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
}

function addEvent() {
    const title = eventTitleInput.value.trim();
    const startDate = eventStartDateInput.value;
    const endDate = eventEndDateInput.value;
    
    if (!title || !startDate) return;
    
    // Check if end date is before start date
    if (endDate && new Date(endDate) < new Date(startDate)) {
        alert("End date cannot be before start date");
        return;
    }
    
    // Check for duplicates
    if (events.some(event => event.title.toLowerCase() === title.toLowerCase())) {
        alert("An event with this title already exists");
        return;
    }
    
    const newEvent = {
        title: title,
        startDate: startDate,
        endDate: endDate || null,
        image: eventImageDataUrl || null
    };
    
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    renderEvents();
    closeEventModal();
}

function removeEvent(index) {
    if (confirm('Are you sure you want to remove this event?')) {
        events.splice(index, 1);
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents();
    }
}

function toggleEventsVisibility() {
    isEventsExpanded = !isEventsExpanded;

    const icon = showMoreEventsBtn.querySelector('i');
    const text = showMoreEventsBtn.querySelector('span');

    icon.className = isEventsExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
    text.textContent = isEventsExpanded ? 'Show less' : 'Show more';

    const hiddenEvents = document.querySelectorAll('.hidden-event');
    hiddenEvents.forEach(event => {
        event.style.display = isEventsExpanded ? 'flex' : 'none';
    });
}

function renderEvents() {
    eventsList.innerHTML = '';

    if (events.length === 0) {
        eventsList.innerHTML = '<div class="no-events">No events added yet</div>';
        showMoreEventsContainer.style.display = 'none';
        return;
    }

    // Sort events by start date (newest first)
    events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    isEventsExpanded = false;
    const needsShowMore = events.length > VISIBLE_EVENTS;
    showMoreEventsContainer.style.display = needsShowMore ? 'block' : 'none';

    showMoreEventsBtn.querySelector('i').className = 'fa-solid fa-chevron-down';
    showMoreEventsBtn.querySelector('span').textContent = 'Show more';

    events.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';

        if (index >= VISIBLE_EVENTS && needsShowMore) {
            eventItem.classList.add('hidden-event');
            eventItem.style.display = 'none';
        }

        const imageHtml = event.image 
            ? `<img src="${event.image}" class="event-image" alt="${event.title}">`
            : `<div class="event-image" style="background: #f0f2f5; display: flex; align-items: center; justify-content: center;">
                  <i class="fa-solid fa-calendar" style="color: #666; font-size: 20px;"></i>
               </div>`;

        eventItem.innerHTML = `
            ${imageHtml}
            <div class="event-info">
                <div class="event-header">
                    <div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-date">${formatEventDate(event.startDate, event.endDate)}</div>
                    </div>
                    <div>
                        <button class="remove-btn remove-event-btn" data-index="${index}">
                            <i class='bx bx-x'></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        eventsList.appendChild(eventItem);

        const removeBtn = eventItem.querySelector('.remove-event-btn');
        removeBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeEvent(index);
        });
    });
}