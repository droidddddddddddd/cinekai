/* CINEK homepage enhancement. No external dependencies. */
(function(){
  'use strict';
  function make(tag,cls,html){var el=document.createElement(tag);if(cls)el.className=cls;if(html!==undefined)el.innerHTML=html;return el}
  function init(){
    var intro=document.querySelector('#home .intro-center');
    if(intro&&!document.querySelector('.cinek-hero-description')){
      var oldSub=intro.querySelector('.hero-sub');if(oldSub)oldSub.textContent='THE ARTIST · THE MUSIC · THE MASK';
      var description=make('p','cinek-hero-description','The artist behind <strong>EMPTY BED</strong>, <strong>OUR SONG</strong> and <strong>REMEDY</strong>. Explore the music, the films, and the masked visual world of CINEK. <span class="hero-fan-note">Unofficial fan project — not affiliated with or endorsed by Cinek (yet). We&rsquo;d love the artist&rsquo;s blessing.</span>');
      var actions=make('div','cinek-hero-actions');
      [['WHO IS CINEK?','#who-is-cinek'],['THE WIKI','/wiki.html'],['THE FILMS','/films.html']].forEach(function(pair){var a=make('a','',pair[0]);a.href=pair[1];actions.appendChild(a)});
      var original=intro.querySelector('.hero-link');
      if(original){original.insertAdjacentElement('beforebegin',description);original.insertAdjacentElement('beforebegin',actions);original.style.display='none'}else{intro.append(description,actions)}
    }
    if(!document.getElementById('who-is-cinek')){
      var section=make('section','cinek-about');section.id='who-is-cinek';section.setAttribute('aria-labelledby','cinek-about-title');
      section.innerHTML='<div class="cinek-about-inner"><div><p class="overline">THE ARTIST / THE STORY</p><h2 id="cinek-about-title">WHO IS<br><em>CINEK?</em></h2><p>CINEK is a recording artist whose releases and visual world form the heart of this unofficial fan archive. Discover the songs, music videos and evolving imagery through links to their original sources. This project is not affiliated with or endorsed by the artist (yet) — we&rsquo;d love Cinek&rsquo;s blessing.</p><p>The masked figure, dramatic shadows and eye-focused portraits give the project a recognizable cinematic identity. This archive explores those visuals without claiming to reveal the person behind the mask or an official character backstory.</p><div class="cinek-about-links"><a href="/wiki.html">EXPLORE THE WIKI ↗</a><a href="/films.html">WATCH THE FILMS ↗</a><a href="https://x.com/CINEKonSol" target="_blank" rel="noopener noreferrer">@CINEKonSol ↗</a><a href="https://linktr.ee/noahcinek" target="_blank" rel="noopener noreferrer">ARTIST LINKS ↗</a></div></div><div><img class="cinek-about-portrait" src="/assets/reference-5650.webp" alt="Masked CINEK visual reference" loading="lazy" decoding="async"><div class="cinek-about-caption">VISUAL REFERENCE · UNOFFICIAL FAN PROJECT</div></div></div>';
      var world=document.getElementById('world');var artist=document.getElementById('artist');
      if(world)world.insertAdjacentElement('afterend',section);else if(artist)artist.insertAdjacentElement('beforebegin',section);
    }
    var nav=document.getElementById('nav');
    if(nav&&!nav.querySelector('a[href="#who-is-cinek"]')){var link=make('a','','WHO IS CINEK');link.href=location.pathname==='/'||location.pathname.endsWith('index.html')?'#who-is-cinek':'/index.html#who-is-cinek';var artistLink=nav.querySelector('a[href="#artist"]');if(artistLink)artistLink.insertAdjacentElement('beforebegin',link);else nav.appendChild(link)}
    document.querySelectorAll('img:not([decoding])').forEach(function(img){img.decoding='async'});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
