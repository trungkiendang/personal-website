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


