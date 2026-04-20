// Shared include: fetches partials.html and injects nav/footer;
// marks active nav link; no smooth scroll override, no preloader.
(async function(){
  function setActive(name){
    document.querySelectorAll('[data-nav]').forEach(a=>{
      if(a.dataset.nav===name) a.classList.add('active');
    });
  }
  // Active nav: read from <body data-page="...">
  const page = document.body.dataset.page;
  if(page) setActive(page);

  // Simple scroll-fade reveal (respects prefers-reduced-motion)
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
  }
})();
