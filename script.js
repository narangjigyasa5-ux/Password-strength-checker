document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const backgroundImage = document.getElementById('backgroundImage');

  const checkPasswordInput = document.getElementById('checkPasswordInput');
  const checkStrengthBar = document.getElementById('checkStrengthBar');
  const checkStrengthPercent = document.getElementById('checkStrengthPercent');
  const checkStrengthFeedback = document.getElementById('checkStrengthFeedback');
  const checkLengthCriteria = document.getElementById('checkLengthCriteria');
  const checkUpperCriteria = document.getElementById('checkUpperCriteria');
  const checkLowerCriteria = document.getElementById('checkLowerCriteria');
  const checkNumberCriteria = document.getElementById('checkNumberCriteria');
  const checkSymbolCriteria = document.getElementById('checkSymbolCriteria');
  const toggleCheckPassword = document.getElementById('toggleCheckPassword');

  const generatedPasswordInput = document.getElementById('generatedPassword');
  const genLength = document.getElementById('genLength');
  const genUpper = document.getElementById('genUpper');
  const genLower = document.getElementById('genLower');
  const genNum = document.getElementById('genNum');
  const genSym = document.getElementById('genSym');
  const generateBtn = document.getElementById('generateBtn');
  const genStrengthBar = document.getElementById('genStrengthBar');
  const genStrengthPercent = document.getElementById('genStrengthPercent');
  const genStrengthFeedback = document.getElementById('genStrengthFeedback');
  const genLengthCriteria = document.getElementById('genLengthCriteria');
  const genUpperCriteria = document.getElementById('genUpperCriteria');
  const genLowerCriteria = document.getElementById('genLowerCriteria');
  const genNumberCriteria = document.getElementById('genNumberCriteria');
  const genSymbolCriteria = document.getElementById('genSymbolCriteria');
  const copyGenBtn = document.getElementById('copyGenBtn');
  const copyGeneratedMsg = document.getElementById('copyGeneratedMsg');

  // Theme toggle event
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      // Set image filter brightness or adjust accordingly for light theme
      backgroundImage.style.filter = 'brightness(1) blur(15px)';
    } else {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      backgroundImage.style.filter = 'brightness(0.7) blur(15px)';
    }
  });

  // Password strength calculation function
  function calculateStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#^()[\]{}<>|;:,.+=_-]/.test(password)) score++;
    if (password.length >= 16) score++; // bonus for length
    return score;
  }

  // Update criteria UI
  function updateCriteriaUI(criteriaId, condition) {
    const icon = criteriaId.querySelector('i');
    if (condition) {
      icon.classList.remove('fa-times', 'text-danger');
      icon.classList.add('fa-check', 'text-success');
    } else {
      icon.classList.remove('fa-check', 'text-success');
      icon.classList.add('fa-times', 'text-danger');
    }
  }

  // Map score to text & bar style
  function getStrengthLabel(score) {
    switch(score) {
      case 0:
      case 1:
        return {text: 'Very Weak', className: '', glow: false};
      case 2:
        return {text: 'Weak', className: '', glow: false};
      case 3:
        return {text: 'Moderate', className: '', glow: false};
      case 4:
        return {text: 'Strong', className: 'strong', glow: true};
      case 5:
      case 6:
        return {text: 'Very Strong', className: 'strong', glow: true};
      default:
        return {text: 'Very Weak', className: '', glow: false};
    }
  }

  // Update check strength UI
  function updateCheckStrengthUI(password) {
    const len = password.length;

    updateCriteriaUI(checkLengthCriteria, len >= 8);
    updateCriteriaUI(checkUpperCriteria, /[A-Z]/.test(password));
    updateCriteriaUI(checkLowerCriteria, /[a-z]/.test(password));
    updateCriteriaUI(checkNumberCriteria, /\d/.test(password));
    updateCriteriaUI(checkSymbolCriteria, /[@$!%*?&#^()[\]{}<>|;:,.+=_-]/.test(password));

    const score = calculateStrength(password);
    const { text, className, glow } = getStrengthLabel(score);

    // Update bar and percent
    const percent = Math.round((score / 6) * 100);
    checkStrengthBar.style.width = `${percent}%`;
    checkStrengthBar.className = `strength-bar ${className}`;
    checkStrengthPercent.textContent = `Strength: ${percent}%`;

    // Update feedback text with typing animation restart
    checkStrengthFeedback.textContent = text;
    checkStrengthFeedback.classList.remove('typing-anim');
    void checkStrengthFeedback.offsetWidth; // Trigger reflow
    checkStrengthFeedback.classList.add('typing-anim');

    // Adjust background image blur based on strength
    let blurVal = 15 - (score * 2.5);
    if (blurVal < 0) blurVal = 0;
    backgroundImage.style.filter = `brightness(${body.classList.contains('theme-light') ? 1 : 0.7}) blur(${blurVal}px)`;
  }

  // Handle toggle password visibility in check tab
  toggleCheckPassword.addEventListener('click', () => {
    if (checkPasswordInput.type === 'password') {
      checkPasswordInput.type = 'text';
      toggleCheckPassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      checkPasswordInput.type = 'password';
      toggleCheckPassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });

  // Event listener for typing in check password input
  checkPasswordInput.addEventListener('input', (e) => {
    updateCheckStrengthUI(e.target.value);
  });

  // Password generation function
  function generatePassword(length, useUpper, useLower, useNum, useSym) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charSet = '';
    if (useUpper) charSet += uppercase;
    if (useLower) charSet += lowercase;
    if (useNum) charSet += numbers;
    if (useSym) charSet += symbols;

    if (!charSet) return '';

    // Ensure at least one character from each checked category
    let passwordArr = [];
    if (useUpper) passwordArr.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    if (useLower) passwordArr.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    if (useNum) passwordArr.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (useSym) passwordArr.push(symbols[Math.floor(Math.random() * symbols.length)]);

    // Fill remaining length randomly
    for (let i = passwordArr.length; i < length; i++) {
      passwordArr.push(charSet[Math.floor(Math.random() * charSet.length)]);
    }

    // Shuffle result
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
    }
    return passwordArr.join('');
  }

  // Update Generator strength UI
  function updateGenStrengthUI(password) {
    const len = password.length;

    updateCriteriaUI(genLengthCriteria, len >= 8);
    updateCriteriaUI(genUpperCriteria, /[A-Z]/.test(password));
    updateCriteriaUI(genLowerCriteria, /[a-z]/.test(password));
    updateCriteriaUI(genNumberCriteria, /\d/.test(password));
    updateCriteriaUI(genSymbolCriteria, /[@$!%*?&#^()[\]{}<>|;:,.+=_-]/.test(password));

    const score = calculateStrength(password);
    const { text, className, glow } = getStrengthLabel(score);

    // Update bar and percent
    const percent = Math.round((score / 6) * 100);
    genStrengthBar.style.width = `${percent}%`;
    genStrengthBar.className = `strength-bar ${className}`;
    genStrengthPercent.textContent = `Strength: ${percent}%`;

    // Update feedback text with typing animation restart
    genStrengthFeedback.textContent = text;
    genStrengthFeedback.classList.remove('typing-anim');
    void genStrengthFeedback.offsetWidth; // Trigger reflow
    genStrengthFeedback.classList.add('typing-anim');

    // Adjust background image blur based on strength
    let blurVal = 15 - (score * 2.5);
    if (blurVal < 0) blurVal = 0;
    backgroundImage.style.filter = `brightness(${body.classList.contains('theme-light') ? 1 : 0.7}) blur(${blurVal}px)`;
  }

  // Handle Generate password button click
  generateBtn.addEventListener('click', () => {
    const length = parseInt(genLength.value, 10);
    const useUpper = genUpper.checked;
    const useLower = genLower.checked;
    const useNum = genNum.checked;
    const useSym = genSym.checked;

    if (length < 8) {
      alert('Minimum password length is 8');
      return;
    }
    if (!useUpper && !useLower && !useNum && !useSym) {
      alert('Select at least one character type');
      return;
    }

    const password = generatePassword(length, useUpper, useLower, useNum, useSym);
    generatedPasswordInput.value = password;
    updateGenStrengthUI(password);
  });

  // Real-time update of strength if user edits manually generated password (readonly usually, but just in case)
  generatedPasswordInput.addEventListener('input', (e) => {
    updateGenStrengthUI(e.target.value);
  });

  // Copy generated password button
  copyGenBtn.addEventListener('click', () => {
    if (!generatedPasswordInput.value) return;
    navigator.clipboard.writeText(generatedPasswordInput.value).then(() => {
      copyGeneratedMsg.style.display = 'inline';
      setTimeout(() => {
        copyGeneratedMsg.style.display = 'none';
      }, 1500);
    });
  });

  // Initialize UI states on page load
  function initializeUI() {
    // Set initial background brightness filter
    backgroundImage.style.filter = 'brightness(0.7) blur(15px)';
    // Initialize strength bars
    updateCheckStrengthUI('');
    updateGenStrengthUI('');
  }
  initializeUI();
});