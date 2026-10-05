(() => {
  const variant = Number(new URLSearchParams(location.search).get('videoOption'));
  if (![1,2,3].includes(variant)) return;
  const style = document.createElement('style');
  style.textContent = `
    /* Keep the comparison still while the video itself remains playable. */
    .motion-reveal { opacity:1!important; transform:none!important; }
    body * { animation:none!important; transition:none!important; }
    .film-preview { margin:0; color:#222; background:#fff; }
    .film-preview-inner { max-width:1280px; padding:0 32px; margin:auto; }
    .film-preview-media { position:relative; width:100%; background:#202927; overflow:hidden; }
    .film-preview video { display:block; width:100%; aspect-ratio:16/6; object-fit:cover; }
    .film-preview-caption { font-size:12px; line-height:1.5; color:#626262; margin:12px 0 0; }
    .film-preview-header { margin:0 0 22px; max-width:520px; }
    .film-preview-header .section-eyebrow { margin-bottom:16px; }
    .film-preview-header h2 { font-family:var(--font-editorial); font-size:38px; font-weight:400; line-height:1.12; margin:0 0 16px; }
    .film-preview-header p:last-child { font-size:14px; line-height:1.6; color:#626262; }
    .film-preview-standalone { padding:36px 0 48px; }
    .film-preview-inline { margin:0 0 24px; }
    .film-preview-inline .section-heading { max-width:640px; margin-bottom:28px; }
    .film-preview-inline .section-heading h2 { font-family:var(--font-editorial); font-size:54px; line-height:1.08; font-weight:400; }
    .film-preview-inline .bespoke-start { margin:24px 0 8px; }
    .film-preview-inline .film-preview-caption { margin-top:14px; }
    .film-preview-inline+.bespoke-start { margin-bottom:24px; }
    .film-preview-link { display:inline-block; font-size:13px; padding:12px 0 6px; border-bottom:1px solid #777; color:#222; text-decoration:none; margin-top:12px; }
    @media(max-width:700px) { .film-preview-inner { padding:0 20px; } .film-preview video { aspect-ratio:16/9; } .film-preview-inline .section-heading h2 { font-size:38px; } }
    @media(prefers-reduced-motion:reduce) { .film-preview * { animation:none; transition:none; } }
  `;
  document.head.append(style);
  const media = `<div class="film-preview-media"><video autoplay playsinline muted loop preload="auto" poster="/preview-media/poster.jpg" aria-label="Jewellery crafting film"><source media="(max-width:700px)" src="/preview-media/mobile-loop.mp4" type="video/mp4"><source src="/preview-media/desktop-loop.mp4" type="video/mp4"></video></div>`;
  const mount = () => {
    const order = document.querySelector('#custom-order');
    const categories = document.querySelector('.category-preview');
    if (!order || !categories || document.querySelector('#film-preview')) return false;
    const block = document.createElement('section');
    block.id='film-preview'; block.dataset.theme='light';
    if (variant===1) {
      block.className='film-preview film-preview-inline';
      block.setAttribute('aria-label','Inside the atelier');
      const header=order.querySelector('.bespoke-story .section-heading');
      const start=order.querySelector('.bespoke-start');
      block.innerHTML='<div class="film-preview-inner film-preview-intro"></div>'+media+'<div class="film-preview-inner film-preview-footer"><p class="film-preview-caption">A closer look at the craft behind your piece.</p></div>';
      block.querySelector('.film-preview-intro').append(header);
      block.querySelector('.film-preview-footer').append(start);
      order.querySelector('.bespoke-layout').before(block);
      order.querySelector('.bespoke-sketch')?.remove();
    } else if (variant===2) {
      block.className='film-preview film-preview-standalone';
      block.innerHTML='<div class="film-preview-inner"><header class="film-preview-header"><p class="section-eyebrow">Inside the atelier</p><h2>Made around you.</h2><p>From the first sketch to the final setting.</p></header></div>'+media+'<div class="film-preview-inner"><p class="film-preview-caption">A closer look at how a piece takes shape.</p></div>';
      order.after(block);
    } else {
      block.className='film-preview film-preview-standalone';
      block.innerHTML='<div class="film-preview-inner"><header class="film-preview-header"><p class="section-eyebrow">The art of making</p><h2>From an idea<br>to your piece.</h2><p>Explore the craft behind a personal design.</p></header></div>'+media+'<div class="film-preview-inner"><a class="film-preview-link" href="#custom-order">Explore bespoke jewellery →</a></div>';
      categories.after(block);
    }
    const video=block.querySelector('video');
    video.muted=true;
    const startFilm=()=>{video.play().catch(()=>{});};
    const playbackObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting) startFilm(); else video.pause();});
    },{rootMargin:'250px 0px',threshold:0});
    playbackObserver.observe(video);
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden) video.pause();
      else {const rect=video.getBoundingClientRect(); if(rect.bottom>-250&&rect.top<innerHeight+250)startFilm();}
    });
    const target=variant===1?order:block;
    const position=()=>window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-88,behavior:'instant'});
    document.fonts.ready.then(()=>requestAnimationFrame(()=>requestAnimationFrame(position)));
    // Re-align after the existing lazy-loaded illustration changes the page height.
    setTimeout(position,500);
    setTimeout(position,1400);
    return true;
  };
  const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(mount())observer.disconnect();
})();
