  (function(){
    var WA_NUMBER = "5574991038287";
    document.querySelectorAll('.wa-cta').forEach(function(el){
      var service = el.getAttribute('data-service') || 'uma consulta';
      var msg = 'Olá! Gostaria de agendar ' + service + ' na Minas Dentistas.';
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
    });

    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if(toggle && links){
      toggle.addEventListener('click', function(){
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  })();
