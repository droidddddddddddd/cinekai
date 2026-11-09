(()=>{
  const m=document.querySelector('#menuBtn'), n=document.querySelector('#nav');
  m?.addEventListener('click',()=>{n.classList.toggle('open');m.setAttribute('aria-expanded',String(n.classList.contains('open')))});

  const dlg=document.querySelector('#lightbox');
  function show(src,caption){
    if(!dlg) return;
    document.querySelector('#lightboxImage').src=src;
    document.querySelector('#lightboxCaption').textContent=caption;
    dlg.showModal();
  }
  document.querySelector('#closeLightbox')?.addEventListener('click',()=>dlg.close());
  dlg?.addEventListener('click',e=>{if(e.target===dlg) dlg.close()});

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Looks page: hydrate from looks.json when #lookGrid exists
  const lookGrid=document.querySelector('#lookGrid');
  if(lookGrid){
    fetch('/looks.json').then(r=>r.json()).then(data=>{
      lookGrid.innerHTML=(data.looks||[]).map(look=>`
        <button class="look-tile" data-image="${esc(look.image)}" data-caption="${esc(look.source)}" type="button">
          <img loading="lazy" decoding="async" src="${esc(look.image)}" alt="${esc(look.title)}: ${esc(look.source)}">
          <span><strong>${esc(look.title)}</strong><small>${esc(look.source)}</small></span>
        </button>`).join('');
      lookGrid.querySelectorAll('.look-tile').forEach(b=>b.addEventListener('click',()=>show(b.dataset.image,b.dataset.caption)));
    }).catch(()=>{ lookGrid.textContent='Looks catalogue unavailable.'; });
  } else {
    document.querySelectorAll('.look-tile').forEach(b=>b.addEventListener('click',()=>show(b.dataset.image,b.dataset.caption)));
  }

  // Film detail page
  if(location.pathname.endsWith('/film.html') || location.pathname.endsWith('film.html')){
    const id=new URLSearchParams(location.search).get('id');
    fetch('/films.json').then(r=>r.json()).then(data=>{
      const f=data.films.find(x=>x.slug===id);
      if(!f){document.querySelector('#filmTitle').textContent='FILM NOT FOUND';return}
      document.title=f.title+' — CINEK Film Gallery';
      document.querySelector('#filmTitle').textContent=f.title;
      document.querySelector('#filmSubtitle').textContent=f.subtitle+' · '+f.date;
      document.querySelector('#watchFilm').href=f.url;
      document.querySelector('#filmDescription').textContent=f.description;
      document.querySelector('#filmLook').textContent=f.look;
      const still=f.still || `/assets/posters/${f.slug}.webp`;
      document.querySelector('#filmHero').style.setProperty('--scene',`url("${still}")`);
      const gallerySets={
        'empty-bed':[
          ['/assets/posters/empty-bed.webp','Local poster from EMPTY BED'],
          ['/assets/empty-bed-video-still.webp','Frame from EMPTY BED video'],
          ['/assets/empty_bed_masked_singer_portrait.jpg','EMPTY BED masked portrait'],
          ['/assets/empty_bed_masked_mic_closeup.jpg','EMPTY BED mic closeup'],
          ['/assets/empty_bed_guitar_playing.jpg','EMPTY BED guitar performance'],
          ['/assets/reference-5649.webp','User-supplied masked-eye reference']
        ],
        'our-song':[
          ['/assets/posters/our-song.webp','Local poster from Our Song lyric video'],
          ['/assets/cinek-eyes-wide.webp','Site eye study (not an official Our Song still)'],
          ['/assets/reference-5649.webp','User-supplied masked-eye reference']
        ],
        'remedy':[
          ['/assets/posters/remedy.webp','Local poster from Remedy lyric video'],
          ['/assets/remedy_masked_eyes.jpg','Remedy performance eye still'],
          ['/assets/remedy_front_performance.jpg','Remedy front-of-stage still'],
          ['/assets/remedy_singing_to_crowd.jpg','Remedy crowd performance still']
        ]
      };
      const imgs=gallerySets[f.slug] || [[still,'Local film poster']];
      const g=document.querySelector('#filmGallery');
      imgs.forEach(([src,caption])=>{
        const b=document.createElement('button'); b.type='button';
        const i=document.createElement('img'); i.src=src; i.alt=caption; i.loading='lazy'; i.decoding='async';
        const s=document.createElement('small'); s.textContent=caption;
        b.append(i,s);
        b.addEventListener('click',()=>show(src,caption));
        g.append(b);
      });
    }).catch(()=>{ const el=document.querySelector('#filmTitle'); if(el) el.textContent='GALLERY UNAVAILABLE'; });
  }
})();
