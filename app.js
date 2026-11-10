const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>new Date(s+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
$('#year').textContent=new Date().getFullYear();
$('#menuBtn').addEventListener('click',()=>{
  const nav=$('#nav');
  nav.classList.toggle('open');
  $('#menuBtn').setAttribute('aria-expanded',String(nav.classList.contains('open')));
});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{
  $('#nav').classList.remove('open');
  $('#menuBtn').setAttribute('aria-expanded','false');
}));


// Copy CA + hydrate live token UI from catalogue when present
function copyText(text, statusEl){
  const done = ()=>{
    if(statusEl){
      statusEl.textContent = 'Copied';
      setTimeout(()=>{ statusEl.textContent = ''; }, 1800);
    }
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(()=>{
      const ta=document.createElement('textarea');
      ta.value=text; document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); done(); }catch(e){}
      ta.remove();
    });
  }else{
    const ta=document.createElement('textarea');
    ta.value=text; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); done(); }catch(e){}
    ta.remove();
  }
}
document.querySelectorAll('[data-ca]').forEach(el=>{
  if(el.tagName === 'BUTTON' || el.classList.contains('hero-token-copy') || el.classList.contains('token-copy-btn')){
    el.addEventListener('click', ()=>{
      const ca = el.getAttribute('data-ca') || '';
      const status = document.getElementById('copyCAStatus');
      copyText(ca, status);
    });
  }
});

const posterFallback={
  Vn_YildjGLw:'/assets/posters/our-song.webp',
  '0b5FTsHPU8Q':'/assets/posters/remedy.webp',
  '8lT_Ab_7u4Y':'/assets/posters/empty-bed.webp'
};

fetch('/catalogue.json').then(r=>{
  if(!r.ok) throw Error('Catalogue unavailable');
  return r.json();
}).then(data=>{
  const releases=[...data.releases].sort((a,b)=>b.date.localeCompare(a.date));

  // Artist socials (keep project X separate in markup; still render catalogue socials)
  const socialsEl=$('#socials');
  if(socialsEl){
    socialsEl.innerHTML=data.socials.map(s=>{
      const role=s.role==='project'?' data-role="project"':'';
      return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"${role}>${esc(s.name)} ↗</a>`;
    }).join('');
  }

  // Video grid with local posters (referrer-safe)
  const videoGrid=$('#videoGrid');
  if(videoGrid){
    videoGrid.innerHTML=data.videos.map(v=>{
      const poster=v.poster||posterFallback[v.youtubeId]||`/assets/posters/empty-bed.webp`;
      return `<a class="video-card" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">
        <div class="video-poster"><img loading="eager" decoding="async" src="${esc(poster)}" alt="Video thumbnail for ${esc(v.title)}"><span class="play">▶</span></div>
        <h3>${esc(v.title)}</h3>
        <p>${esc(v.subtitle)} · ${date(v.date)}</p>
      </a>`;
    }).join('');
  }

  function draw(filter){
    $('#releaseGrid').innerHTML=releases
      .filter(r=>filter==='all'||r.type===filter)
      .map((r,i)=>`<a class="release" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
        <span class="num">${String(i+1).padStart(2,'0')} / ${esc(r.type.toUpperCase())}</span>
        <div><h3>${esc(r.title)}</h3><p>${esc(r.subtitle||'CINEK')}</p></div>
        <div class="bottom"><span>${date(r.date)}</span><span>${esc(r.platform)} ↗</span></div>
      </a>`).join('');
  }
  draw('all');
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    draw(btn.dataset.filter);
  }));

  const rc=$('#releaseCount'); if(rc) rc.textContent=releases.length;
  const vc=$('#videoCount'); if(vc) vc.textContent=data.videos.length;
  const tl=$('#timeline');
  if(tl){
    tl.innerHTML=releases.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
      <span class="date">${date(r.date)}</span>
      <span class="name">${esc(r.title)}</span>
      <span class="type">${esc(r.type.toUpperCase())}</span>
      <span>↗</span>
    </a>`).join('');
  }

  // Live token fill from catalogue
  if(data.token){
    const tokenStatus=$('#tokenStatus');
    if(tokenStatus){
      const st=String(data.token.status||'').toLowerCase();
      tokenStatus.textContent = st==='live' ? 'Live' : (data.token.headline||data.token.status||'Coming soon');
    }
    if(data.token.address){
      const caEl=$('#tokenCA');
      if(caEl){
        caEl.textContent=data.token.address;
        caEl.setAttribute('data-ca', data.token.address);
      }
      document.querySelectorAll('[data-ca]').forEach(el=>{
        if(el.tagName==='BUTTON' || el.classList.contains('hero-token-copy') || el.classList.contains('token-copy-btn')){
          el.setAttribute('data-ca', data.token.address);
        }
      });
    }
  }
}).catch(e=>{
  console.error(e);
  const grid=$('#releaseGrid');
  if(grid) grid.textContent='Catalogue unavailable. Please refresh.';
});

// Cinematic scroll effects; no external animation dependency.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}),{threshold:.09});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const siteHeader=document.querySelector('#siteHeader');
const onScroll=()=>siteHeader && siteHeader.classList.toggle('scrolled',window.scrollY>60);
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();
