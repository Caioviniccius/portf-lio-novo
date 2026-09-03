(function(){
    var burger = document.getElementById('burgerBtn');
    var closeBtn = document.getElementById('closeBtn');
    var menu = document.getElementById('mobileMenu');

    function openMenu(){
      menu.classList.add('open');
      burger.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu(){
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });

    var toggleBtn = document.getElementById('toggleServicesBtn');
    var moreServices = document.getElementById('moreServices');
    if(toggleBtn && moreServices){
      toggleBtn.addEventListener('click', function(){
        var isOpen = moreServices.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggleBtn.querySelector('.btn-label').textContent = isOpen ? 'VER MENOS SERVIÇOS' : 'VER TODOS OS SERVIÇOS';
        if(isOpen){
          moreServices.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in-view'); });
        }
      });
    }

    var revealEls = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
    }
  })();
