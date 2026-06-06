// Navigation scroll effect
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const links = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile nav toggle
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
links.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// GitHub data fetching
async function fetchGitHubData() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/trungkiendang'),
      fetch('https://api.github.com/users/trungkiendang/repos?sort=updated&per_page=10')
    ]);
    const user = await userRes.json();
    const repos = await reposRes.json();

    document.getElementById('public-repos').textContent = user.public_repos;
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('total-stars').textContent = repos.reduce((a, r) => a + r.stargazers_count, 0);

    const list = document.getElementById('repos-list');
    list.innerHTML = repos.map(repo => `
      <div class="repo-card">
        <h4><a href="${repo.html_url}" target="_blank" rel="noopener"><i class="fa fa-github"></i> ${repo.name}</a></h4>
        <p>${repo.description || 'No description available'}</p>
        <div class="repo-stats">
          <span><i class="fa fa-star"></i> ${repo.stargazers_count}</span>
          <span><i class="fa fa-code-fork"></i> ${repo.forks_count}</span>
        </div>
        ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('repos-list').innerHTML = '<p style="color:var(--color-text-muted)">Unable to load GitHub data.</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchGitHubData);
