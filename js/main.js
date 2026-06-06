// Active nav link on scroll
$(function () {
  var sections = $('section[id], header[id]');
  var navItems = $('#navCollapse .nav a');

  $(window).on('scroll', function () {
    var current = '';
    sections.each(function () {
      var top = $(this).offset().top - 100;
      if ($(window).scrollTop() >= top) {
        current = '#' + $(this).attr('id');
      }
    });
    navItems.parent().removeClass('active');
    navItems.filter('[href="' + current + '"]').parent().addClass('active');
  });

  // Close mobile nav on click
  navItems.on('click', function () {
    if ($('.navbar-toggle').is(':visible')) {
      $('#navCollapse').collapse('hide');
    }
  });
});

// Current year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// GitHub data
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
    document.getElementById('total-stars').textContent = repos.reduce(function (a, r) { return a + r.stargazers_count; }, 0);

    var list = document.getElementById('repos-list');
    list.innerHTML = repos.map(function (repo) {
      return '<div class="repo-card">' +
        '<h4><a href="' + repo.html_url + '" target="_blank" rel="noopener"><i class="fa fa-github"></i> ' + repo.name + '</a></h4>' +
        '<p>' + (repo.description || 'No description available') + '</p>' +
        '<div class="repo-stats">' +
          '<span><i class="fa fa-star"></i> ' + repo.stargazers_count + '</span>' +
          '<span><i class="fa fa-code-fork"></i> ' + repo.forks_count + '</span>' +
        '</div>' +
        (repo.language ? '<span class="repo-language">' + repo.language + '</span>' : '') +
      '</div>';
    }).join('');
  } catch (err) {
    document.getElementById('repos-list').innerHTML = '<p class="text-muted">Unable to load GitHub data.</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchGitHubData);
