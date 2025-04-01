(function($){"use strict";function subpages_resize(){var subpagesHeight=$('.pt-page-current').height();$(".subpages").height(subpagesHeight+50);}
function mobileMenuHide(){var windowWidth=$(window).width();if(windowWidth<1024){$('#site_header').addClass('mobile-menu-hide');}}
$(window).on('load',function(){$(".preloader").fadeOut("slow");var ptPage=$('.subpages');if(ptPage[0]){PageTransitions.init({menu:'ul.site-main-menu',});}}).on('resize',function(){mobileMenuHide();setTimeout(function(){subpages_resize();},500);}).scroll(function(){if($(window).scrollTop()<20){$('.header').removeClass('sticked');}else{$('.header').addClass('sticked');}}).scrollTop(0);$(document).on('ready',function(){$('.menu-toggle').on("click",function(){$('#site_header').toggleClass('mobile-menu-hide');});$('.site-main-menu').on("click","a",function(e){mobileMenuHide();});$('.sidebar-toggle').on("click",function(){$('#blog-sidebar').toggleClass('open');});$('.text-rotation').owlCarousel({loop:true,dots:false,nav:false,margin:0,items:1,autoplay:true,autoplayHoverPause:false,autoplayTimeout:3800,animateOut:'zoomOut',animateIn:'zoomIn'});$('body').magnificPopup({delegate:'a.lightbox',type:'image',removalDelay:300,mainClass:'mfp-fade',image:{titleSrc:'title',gallery:{enabled:true},},iframe:{markup:'<div class="mfp-iframe-scaler">'+'<div class="mfp-close"></div>'+'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+'<div class="mfp-title mfp-bottom-iframe-title"></div>'+'</div>',patterns:{youtube:{index:'youtube.com/',id:null,src:'%id%?autoplay=1'},vimeo:{index:'vimeo.com/',id:'/',src:'//player.vimeo.com/video/%id%?autoplay=1'},gmaps:{index:'//maps.google.',src:'%id%&output=embed'}},srcAction:'iframe_src',},callbacks:{markupParse:function(template,values,item){values.title=item.el.attr('title');}},});$('.ajax-page-load-link').magnificPopup({type:'ajax',removalDelay:300,mainClass:'mfp-fade',gallery:{enabled:true},});});})(jQuery);

// GitHub Data Fetching
async function fetchGitHubData() {
    try {
        // Fetch user data
        const userResponse = await fetch('https://api.github.com/users/trungkiendang');
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch('https://api.github.com/users/trungkiendang/repos?sort=updated&per_page=10');
        const reposData = await reposResponse.json();

        // Update stats
        document.getElementById('public-repos').textContent = userData.public_repos;
        document.getElementById('followers').textContent = userData.followers;

        // Calculate total stars
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        document.getElementById('total-stars').textContent = totalStars;

        // Update repositories list
        const reposList = document.getElementById('repos-list');
        reposList.innerHTML = reposData.map(repo => `
            <div class="repo-card">
                <h4>
                    <a href="${repo.html_url}" target="_blank">
                        <i class="fa fa-github"></i>
                        ${repo.name}
                    </a>
                </h4>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    <span><i class="fa fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fa fa-code-fork"></i> ${repo.forks_count}</span>
                    <span><i class="fa fa-eye"></i> ${repo.watchers_count}</span>
                </div>
                <div class="repo-languages">
                    ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        document.getElementById('repos-list').innerHTML = '<p>Error loading GitHub data. Please try again later.</p>';
    }
}

// Call fetchGitHubData when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubData);