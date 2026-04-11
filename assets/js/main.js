(function () {
  const body = document.body;
  const navToggle = document.getElementById('navToggle');
  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownTrigger = document.querySelector('.dropdown-trigger');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener('click', function () {
      const isOpen = dropdown.classList.toggle('open');
      dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth > 960) {
      body.classList.remove('nav-open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();
