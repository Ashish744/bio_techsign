function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function setActiveRole(role) {
  document.querySelectorAll('.role-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.role === role);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const roleSelect = document.getElementById('role');
  const roleChips = document.querySelectorAll('.role-chip');

  if (roleSelect && roleChips.length) {
    roleChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const selectedRole = chip.dataset.role;
        roleSelect.value = selectedRole;
        setActiveRole(selectedRole);
      });
    });
  }

  const signInForm = document.getElementById('signinForm');
  const signUpForm = document.getElementById('signupForm');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.querySelector('.password-toggle');

  // Only handle signin page password toggle if we're on signin page
  if (signInForm && passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
      passwordToggle.textContent = isHidden ? '🙈' : '👁';
      passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  // Handle password toggles on signup page - separate from signin
  if (!signInForm) {
    // Only run on signup/other pages, not on signin
    const allPasswordToggles = document.querySelectorAll('.password-field .password-toggle');
    allPasswordToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parentField = toggle.closest('.password-field');
        const inputField = parentField.querySelector('input');
        if (inputField) {
          const isHidden = inputField.getAttribute('type') === 'password';
          inputField.setAttribute('type', isHidden ? 'text' : 'password');
          toggle.textContent = isHidden ? '🙈' : '👁';
          toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        }
      });
    });
  }

  // Password strength validation for signup page
  const signupPasswordInput = document.getElementById('password');
  const passwordStrengthNote = document.getElementById('passwordStrength');
  if (signupPasswordInput && passwordStrengthNote) {
    signupPasswordInput.addEventListener('input', () => {
      const passwordLength = signupPasswordInput.value.length;
      if (passwordLength === 0) {
        passwordStrengthNote.textContent = '';
      } else if (passwordLength < 6) {
        passwordStrengthNote.textContent = '⚠️ Password must be at least 6 characters';
        passwordStrengthNote.style.color = '#ff6b6b';
      } else if (passwordLength < 8) {
        passwordStrengthNote.textContent = '✓ Password is acceptable (6+ characters)';
        passwordStrengthNote.style.color = '#ffa500';
      } else {
        passwordStrengthNote.textContent = '✓ Password is strong';
        passwordStrengthNote.style.color = '#4caf50';
      }
    });
  }

  if (signInForm) {
    signInForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedRole = roleSelect?.value;
      const email = document.getElementById('email')?.value.trim();
      const password = passwordInput?.value.trim();

      if (!email) {
        alert('Please enter your email address.');
        return;
      }

      const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegExp.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (!selectedRole) {
        alert('Please choose a role before signing in.');
        return;
      }

      if (!password) {
        alert('Please enter your password.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      const encodedEmail = encodeURIComponent(email);
      const encodedRole = encodeURIComponent(selectedRole);
      window.location.href = `dashbord.html?role=${encodedRole}&email=${encodedEmail}`;
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const selectedRole = document.getElementById('role').value;
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      // Validation
      if (!selectedRole) {
        alert('Please choose a role to sign up.');
        return;
      }

      if (!name) {
        alert('Please enter your full name.');
        return;
      }

      const nameRegExp = /^[A-Za-z\s]+$/;
      if (!nameRegExp.test(name)) {
        alert('Full name should only contain letters and spaces.');
        return;
      }

      if (!email) {
        alert('Please enter your email address.');
        return;
      }

      const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegExp.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (!password || !confirmPassword) {
        alert('Please enter and confirm your password.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // All validations passed - redirect to sign in
      alert('Account created successfully!');
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 500);
    });
  }

  // Setup modal close button listener
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  const dashboardRole = document.getElementById('dashboardRole');
  const userGreeting = document.getElementById('userGreeting');

  function updateActiveNav(hash) {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((link) => {
      const target = link.getAttribute('href');
      link.classList.toggle('active', target === hash);
    });
  }

  const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-item[href^="#"]');
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetHash = link.getAttribute('href');
      if (!targetHash || targetHash === '#') return;
      event.preventDefault();
      const targetEl = document.querySelector(targetHash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveNav(targetHash);
        history.replaceState(null, '', targetHash);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    updateActiveNav(window.location.hash || '#dashboardTop');
  });

  if (dashboardRole && userGreeting) {
    const params = getQueryParams();
    const role = params.role ? decodeURIComponent(params.role) : 'Researcher';
    const email = params.email ? decodeURIComponent(params.email) : '';
    const displayName = email ? email.split('@')[0].replace(/[._\-]+/g, ' ') : role;

    dashboardRole.textContent = role.toUpperCase();
    userGreeting.textContent = `Hey, ${displayName} 👋`;
  }

  updateActiveNav(window.location.hash || '#dashboardTop');
});
