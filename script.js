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
    removeBtn.innerHTML = `<img src="images/icons/removeIcon.svg" alt="Remove" width="29" height="29" />`;
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

// Helper to show error
function showError(input) {
  const container = input.classList.contains("form-group")
    ? input
    : input.parentElement;
  container.classList.add("input-error");
}

function clearError(input) {
  if (!input) return;
  const container = input.classList.contains("form-group")
    ? input
    : input.parentElement;
  container.classList.remove("input-error");
}

// Validate form fields
function validateForm(form) {
  let valid = true;
  const inputs = form.querySelectorAll('input:not([type="file"])');

  // Clear all previous errors first
  inputs.forEach((input) => clearError(input));
  clearError(document.querySelector(".file-upload-group"));

  // Check minimum length for all text inputs
  inputs.forEach((input) => {
    if (input.value.trim().length < 3 && input.type !== "file") {
      showError(input);
      valid = false;
    }
  });

  // Name fields - letters only
  const namePattern = /^[A-Za-z\s\-]+$/;
  ["firstName", "lastName"].forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (input && input.value.trim()) {
      if (!namePattern.test(input.value.trim())) {
        showError(input);
        valid = false;
      }
    }
  });

  // Email validation
  const emailInput = form.querySelector('input[name="email"]');
  if (emailInput && emailInput.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput);
      valid = false;
    }
  }

  // Phone - numbers only
  const phoneInput = form.querySelector('input[name="phone"]');
  if (phoneInput && phoneInput.value.trim()) {
    const phonePattern = /^\d+$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      showError(phoneInput);
      valid = false;
    }
  }

  // Check if files are uploaded
  if (uploadedFiles.length === 0) {
    showError(document.querySelector(".file-upload-group"));
    valid = false;
  }

  return valid;
}

// Form submission and validation
const form = document.querySelector(".form-container");
if (form) {
  // Add input event listeners for real-time validation
  const inputs = form.querySelectorAll('input:not([type="file"])');
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input);

      // Validate minimum length
      if (input.value.trim().length < 3) {
        showError(input);
        return;
      }

      // Validate specific fields
      switch (input.name) {
        case "firstName":
        case "lastName":
          if (!/^[A-Za-z\s\-]+$/.test(input.value.trim())) {
            showError(input);
          }
          break;
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            showError(input);
          }
          break;
        case "phone":
          if (!/^\d+$/.test(input.value.trim())) {
            showError(input);
          }
          break;
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Remove previous errors
    form
      .querySelectorAll(".input-error")
      .forEach((i) => i.classList.remove("input-error"));

    if (!validateForm(form)) {
      return;
    }

    // If validation passes, show success message
    const success = document.createElement("div");
    success.textContent = "Form submitted successfully!";
    success.style.color = "#4caf50";
    success.style.fontWeight = "bold";
    success.style.marginTop = "16px";
    form.appendChild(success);
    setTimeout(() => success.remove(), 3000);
  });
}
