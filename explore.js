(()=>{
  const m=document.querySelector('#menuBtn'), n=document.querySelector('#nav');
  m?.addEventListener('click',()=>{n.classList.toggle('open');m.setAttribute('aria-expanded',String(n.classList.contains('open')))});

  const dlg=document.querySelector('#lightbox');
  function show(src,caption){
    if(!dlg) return;
    const img=document.querySelector('#lightboxImage');
    img.removeAttribute('srcset');
    img.loading='eager';
    img.src=src;
    document.querySelector('#lightboxCaption').textContent=caption;
    dlg.showModal();
  }
  document.querySelector('#closeLightbox')?.addEventListener('click',()=>dlg.close());
  dlg?.addEventListener('click',e=>{if(e.target===dlg) dlg.close()});

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function bindLookTiles(root){
    (root||document).querySelectorAll('.look-tile').forEach(b=>{
      if(b.dataset.bound) return;
      b.dataset.bound='1';
      b.addEventListener('click',()=>show(b.dataset.image,b.dataset.caption));
    });
  }

  function forceImageVisible(img){
    // Prevent below-the-fold tiles from staying blank (lazy never firing / screenshot gaps)
    img.loading='eager';
    img.decoding='async';
    img.style.opacity='1';
    img.style.visibility='visible';
    if(!img.complete || img.naturalWidth===0){
      const src=img.currentSrc||img.src;
      if(src) img.src=src;
    }
  }

  const lookGrid=document.querySelector('#lookGrid');
  if(lookGrid){
    const hasStatic=lookGrid.querySelectorAll('.look-tile').length>0;
    const render=(data)=>{
      if(!hasStatic){
        lookGrid.innerHTML=(data.looks||[]).map(look=>{
          return `<button class="look-tile" data-image="${esc(look.image)}" data-caption="${esc(look.source)}" type="button">
            <img src="${esc(look.image)}" alt="${esc(look.title)}: ${esc(look.source)}" width="900" height="1200" decoding="async">
            <span><strong>${esc(look.title)}</strong><small>${esc(look.source)}</small></span>
          </button>`;
        }).join('');
      } else {
        // Keep static markup; optionally refresh captions/images from JSON if counts match
        const tiles=[...lookGrid.querySelectorAll('.look-tile')];
        (data.looks||[]).forEach((look,i)=>{
          const b=tiles[i]; if(!b) return;
          b.dataset.image=look.image;
          b.dataset.caption=look.source;
          const img=b.querySelector('img');
          if(img && img.getAttribute('src')!==look.image){
            img.src=look.image;
            
          }
        });
      }
      lookGrid.querySelectorAll('img').forEach(forceImageVisible);
      bindLookTiles(lookGrid);
    };

    // Eager-bind whatever is already in the DOM (static HTML path)
    lookGrid.querySelectorAll('img').forEach(forceImageVisible);
    bindLookTiles(lookGrid);

    fetch('/looks.json').then(r=>r.json()).then(render).catch(err=>{
      console.error(err);
      if(!hasStatic) lookGrid.textContent='Looks catalogue unavailable.';
      lookGrid.querySelectorAll('img').forEach(forceImageVisible);
      bindLookTiles(lookGrid);
    });
  } else {
    document.querySelectorAll('.look-tile img').forEach(forceImageVisible);
    bindLookTiles(document);
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
          ['/assets/empty-bed-video-still.webp','Sharper EMPTY BED still'],
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
        const i=document.createElement('img'); i.src=src; i.alt=caption; i.loading='eager'; i.decoding='async';
        const s=document.createElement('small'); s.textContent=caption;
        b.append(i,s);
        b.addEventListener('click',()=>show(src,caption));
        g.append(b);
      });
    }).catch(()=>{ const el=document.querySelector('#filmTitle'); if(el) el.textContent='GALLERY UNAVAILABLE'; });
  }
})();
