window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY;
  const header = document.querySelector("header");
  header.style.transform = `translateY(-${scrollPosition * 0.5}px)`;
  const maxScroll = window.innerHeight * 0.9;
  const opacity = 1 - scrollPosition / maxScroll;
  header.style.opacity = opacity > 0 ? opacity : 0;
});

document
  .getElementById("learn-more-btn")
  .addEventListener("click", function () {
    document
      .getElementById("main-section")
      .scrollIntoView({ behavior: "smooth" });
  });

// Upload button logic
const uploadBtn = document.querySelector(".upload-btn");
const uploadInput = document.getElementById("upload-input");
const uploadedFilesContainer = document.getElementById("uploaded-files");
let uploadedFiles = [];

if (uploadBtn && uploadInput) {
  uploadBtn.addEventListener("click", function () {
    uploadInput.click();
  });

  uploadInput.addEventListener("change", function (e) {
    // Add new files to the list
    for (const file of Array.from(e.target.files)) {
      uploadedFiles.push(file);
    }
    renderUploadedFiles();
    // Reset input so the same file can be uploaded again if needed
    uploadInput.value = "";
  });
}

function renderUploadedFiles() {
  if (!uploadedFilesContainer) return;
  uploadedFilesContainer.innerHTML = "";
  uploadedFiles.forEach((file, idx) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "uploaded-file-row";

    const pillDiv = document.createElement("div");
    pillDiv.className = "uploaded-file-pill";

    const fileName = document.createElement("span");
    fileName.className = "uploaded-file-name";
    fileName.textContent = file.name;

    pillDiv.appendChild(fileName);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-file-btn";
    removeBtn.innerHTML = `<img src="images/icons/close.svg" alt="Remove" />`;
    removeBtn.onclick = () => {
      uploadedFiles.splice(idx, 1);
      renderUploadedFiles();
    };

    rowDiv.appendChild(pillDiv);
    rowDiv.appendChild(removeBtn);
    uploadedFilesContainer.appendChild(rowDiv);
  });
}

// Scroll to form on Get in Touch button click
const getInTouchBtn = document.getElementById("get-in-touch-btn");
const formSection = document.querySelector(".form-container");
if (getInTouchBtn && formSection) {
  getInTouchBtn.addEventListener("click", function () {
    formSection.scrollIntoView({ behavior: "smooth" });
  });
}

// Helper to show error message
function showError(input, message) {
  let error = input.parentElement.querySelector(".error-message");
  if (!error) {
    error = document.createElement("div");
    error.className = "error-message";
    input.parentElement.appendChild(error);
  }
  error.textContent = message;
  input.classList.add("input-error");
}
function clearError(input) {
  let error = input.parentElement.querySelector(".error-message");
  if (error) error.textContent = "";
  input.classList.remove("input-error");
}

// Validate form fields
function validateForm(form) {
  let valid = true;
  // Name fields
  const namePattern = /^[A-Za-z\s\-]+$/;
  ["firstName", "lastName"].forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (input) {
      clearError(input);
      if (!namePattern.test(input.value.trim())) {
        showError(input, "Only letters, spaces, and hyphens allowed.");
        valid = false;
      }
    }
  });
  // Email
  const emailInput = form.querySelector('input[name="email"]');
  clearError(emailInput);
  const emailValue = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailValue)) {
    showError(emailInput, "Please enter a valid email address.");
    valid = false;
  }
  // Phone
  const phoneInput = form.querySelector('input[name="phone"]');
  clearError(phoneInput);
  const phonePattern = /^[0-9+\s()-]+$/;
  if (!phonePattern.test(phoneInput.value.trim())) {
    showError(
      phoneInput,
      "Only numbers, spaces, dashes, parentheses, and + allowed."
    );
    valid = false;
  }
  // File size (max 5MB)
  const fileInput = form.querySelector('input[type="file"]');
  clearError(fileInput);
  if (fileInput && fileInput.files.length > 0) {
    for (const file of fileInput.files) {
      if (file.size > 5 * 1024 * 1024) {
        showError(fileInput, "File size must be less than 5MB.");
        valid = false;
        break;
      }
    }
  }
  return valid;
}

// Disable submit if invalid
const form = document.querySelector(".form-container");
const sendBtn = form ? form.querySelector('.send-btn[type="submit"]') : null;
if (form && sendBtn) {
  form.addEventListener("input", function () {
    sendBtn.disabled = !form.checkValidity();
  });
  form.addEventListener("submit", function (e) {
    // Remove previous errors
    form
      .querySelectorAll(".input-error")
      .forEach((i) => i.classList.remove("input-error"));
    form
      .querySelectorAll(".error-message")
      .forEach((e) => (e.textContent = ""));
    if (!validateForm(form)) {
      e.preventDefault();
      sendBtn.disabled = true;
      return;
    }
    // Prevent multiple submissions
    sendBtn.disabled = true;
    // Show success feedback
    e.preventDefault();
    const success = document.createElement("div");
    success.textContent = "Form submitted successfully!";
    success.style.color = "#4caf50";
    success.style.fontWeight = "bold";
    success.style.marginTop = "16px";
    form.appendChild(success);
    setTimeout(() => success.remove(), 3000);
    setTimeout(() => (sendBtn.disabled = false), 3000);
  });
}
