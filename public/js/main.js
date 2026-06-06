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

  navItems.on('click', function () {
    if ($('.navbar-toggle').is(':visible')) {
      $('#navCollapse').collapse('hide');
    }
  });
});

// Current year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// GitHub: stats + recent public activity
async function fetchGitHubData() {
  try {
    var username = 'trungkiendang';

    var [userRes, reposRes, eventsRes] = await Promise.all([
      fetch('https://api.github.com/users/' + username),
      fetch('https://api.github.com/users/' + username + '/repos?sort=updated&per_page=100'),
      fetch('https://api.github.com/users/' + username + '/events/public?per_page=10')
    ]);

    var user = await userRes.json();
    var repos = await reposRes.json();
    var events = await eventsRes.json();

    // Stats
    document.getElementById('public-repos').textContent = user.public_repos;
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('total-stars').textContent = repos.reduce(function (a, r) { return a + r.stargazers_count; }, 0);

    // Activities
    var icons = {
      PushEvent: 'fa-code-fork',
      CreateEvent: 'fa-plus-circle',
      IssuesEvent: 'fa-exclamation-circle',
      IssueCommentEvent: 'fa-comment',
      PullRequestEvent: 'fa-git-pull-request',
      PullRequestReviewEvent: 'fa-check-circle',
      WatchEvent: 'fa-star',
      ForkEvent: 'fa-code-fork',
      DeleteEvent: 'fa-trash',
      ReleaseEvent: 'fa-tag',
      PublicEvent: 'fa-globe'
    };

    var list = document.getElementById('activity-list');
    if (!events.length) {
      list.innerHTML = '<p class="text-muted">No recent public activity.</p>';
      return;
    }

    list.innerHTML = events.slice(0, 8).map(function (e) {
      var icon = icons[e.type] || 'fa-github';
      var text = formatActivity(e);
      var time = timeAgo(new Date(e.created_at));
      return (
        '<div class="activity-item">' +
          '<div class="activity-icon"><i class="fa ' + icon + '"></i></div>' +
          '<div class="activity-body">' +
            '<p class="activity-text">' + text + '</p>' +
            '<div class="activity-meta">' + time + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  } catch (err) {
    var list = document.getElementById('activity-list');
    if (list) list.innerHTML = '<p class="text-muted">Unable to load GitHub data.</p>';
  }
}

function formatActivity(e) {
  var repo = '<a href="https://github.com/' + e.repo.name + '" target="_blank" rel="noopener">' + e.repo.name + '</a>';

  switch (e.type) {
    case 'PushEvent':
      var count = (e.payload.commits || []).length;
      return 'Pushed ' + count + ' commit' + (count > 1 ? 's' : '') + ' to ' + repo;

    case 'CreateEvent':
      return 'Created ' + (e.payload.ref_type || 'repository') + ' in ' + repo;

    case 'DeleteEvent':
      return 'Deleted ' + (e.payload.ref_type || 'branch') + ' in ' + repo;

    case 'IssuesEvent':
      return e.payload.action.charAt(0).toUpperCase() + e.payload.action.slice(1) + ' issue in ' + repo;

    case 'IssueCommentEvent':
      return 'Commented on issue in ' + repo;

    case 'PullRequestEvent':
      return e.payload.action.charAt(0).toUpperCase() + e.payload.action.slice(1) + ' pull request in ' + repo;

    case 'PullRequestReviewEvent':
      return 'Reviewed pull request in ' + repo;

    case 'WatchEvent':
      return 'Starred ' + repo;

    case 'ForkEvent':
      return 'Forked ' + repo;

    case 'ReleaseEvent':
      return 'Published release in ' + repo;

    case 'PublicEvent':
      return 'Made ' + repo + ' public';

    default:
      return e.type + ' in ' + repo;
  }
}

function timeAgo(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  for (var i = 0; i < intervals.length; i++) {
    var count = Math.floor(seconds / intervals[i].seconds);
    if (count >= 1) {
      return count + ' ' + intervals[i].label + (count > 1 ? 's' : '') + ' ago';
    }
  }
  return 'Just now';
}

document.addEventListener('DOMContentLoaded', fetchGitHubData);
