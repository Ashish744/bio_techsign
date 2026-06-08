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
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.querySelector('.password-toggle');

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const isHidden = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
      passwordToggle.textContent = isHidden ? '🙈' : '👁';
      passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
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

  const signUpForm = document.getElementById('signupForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedRole = roleSelect?.value;
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value.trim();
      const confirmPassword = document.getElementById('confirmPassword')?.value.trim();

      if (!selectedRole) {
        alert('Please choose a role to sign up.');
        return;
      }

      if (!name) {
        alert('Please enter your full name.');
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

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      alert('Account created successfully!');
      const encodedEmail = encodeURIComponent(email);
      const encodedRole = encodeURIComponent(selectedRole);
      window.location.href = `dashbord.html?role=${encodedRole}&email=${encodedEmail}`;
    });
  }

  const dashboardRole = document.getElementById('dashboardRole');
  const userGreeting = document.getElementById('userGreeting');

  if (dashboardRole && userGreeting) {
    const params = getQueryParams();
    const role = params.role ? decodeURIComponent(params.role) : 'Researcher';
    const email = params.email ? decodeURIComponent(params.email) : '';
    const displayName = email ? email.split('@')[0].replace(/[._\-]+/g, ' ') : role;

    dashboardRole.textContent = role.toUpperCase();
    userGreeting.textContent = `Hey, ${displayName} 👋`;
  }
});
