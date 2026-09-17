const progress=document.getElementById('progress');
const sections=[...document.querySelectorAll('[data-section]')];
const body=document.body;

// Assign a visual era from the chapter number so the palette evolves gradually.
let currentChapter=0;
sections.forEach(section=>{
  const num=section.querySelector('.chapter-number');
  if(num){ const n=parseInt(num.textContent.trim(),10); if(!Number.isNaN(n)) currentChapter=n; }
  section.dataset.chapter=currentChapter;
  if(currentChapter===1) section.dataset.era='old';
  else if(currentChapter===2) section.dataset.era='soft';
  else if(currentChapter>=3 && currentChapter<=6) section.dataset.era='playful';
  else if(currentChapter>=7 && currentChapter<=17) section.dataset.era='warm';
  else if(currentChapter===18) section.dataset.era='farewell';
  else if(currentChapter>=19 && currentChapter<=20) section.dataset.era='distance';
  else if(currentChapter>=21) section.dataset.era='final';
});

// Scene-matched visual moments. These are small line-art illustrations that animate
// only when their related scene enters view. They never sit on top of the copy.
const ambient=document.getElementById('ambient-art');
if(ambient) ambient.remove();

const motifs={
  butterfly:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 22C16 7 5 9 7 19c1 6 9 8 17 4M24 22C32 7 43 9 41 19c-1 6-9 8-17 4M24 22v17"/></svg>`,
  flower:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="4"/><circle cx="24" cy="11" r="7"/><circle cx="37" cy="24" r="7"/><circle cx="24" cy="37" r="7"/><circle cx="11" cy="24" r="7"/></svg>`,
  sparkle:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4v40M4 24h40M10 10l28 28M38 10 10 38"/></svg>`,
  fork:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 5v14M12 5v8M20 5v8M16 19v24M31 5c5 8 5 15 0 20v18M31 25h-1"/></svg>`,
  animal:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 18 9 8l10 5M35 18l4-10-10 5M13 18c-3 7 0 16 11 19 11-3 14-12 11-19-3-6-19-6-22 0Z"/><circle cx="19" cy="23" r="1.5"/><circle cx="29" cy="23" r="1.5"/><path d="M21 29c2 2 4 2 6 0"/></svg>`,
  code:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m18 13-11 11 11 11M30 13l11 11-11 11M27 7l-6 34"/></svg>`,
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="31" rx="2"/><path d="M14 6v9M34 6v9M7 19h34M14 27h5M24 27h5M14 34h5"/></svg>`,
  ring:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="28" r="13"/><path d="M18 16c2-5 10-5 12 0l-6 6-6-6Z"/></svg>`,
  plane:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 27 43 10 31 40 24 29 12 34 18 25 5 27Z"/></svg>`,
  moon:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M35 8c-9 2-15 10-15 19 0 8 5 13 13 14-3 2-7 3-11 2C11 42 5 34 7 24 9 13 18 6 29 6c2 0 4 1 6 2Z"/></svg>`,
  heart:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 39S8 29 8 18c0-7 9-11 16-3 7-8 16-4 16 3 0 11-16 21-16 21Z"/></svg>`
};

function motifForSection(section){
  const n=parseInt(section.dataset.chapter||'0',10);
  const text=(section.innerText||'').toLowerCase();
  if(n===2) return ['butterfly','a little butterfly for the Mars chapter'];
  if(n===5) return ['flower','the flowers you gave her'];
  if(n===7 && text.includes('steak')) return ['fork','the steak you cooked'];
  if(n===7 && text.includes('safe')) return ['sparkle','a quiet moment about feeling safe'];
  if(n===7 && text.includes('hand')) return ['heart','the first hand hold'];
  if(n===7 && text.includes('kiss')) return ['heart','the first kiss'];
  if(n===9 && text.includes('zoo')) return ['animal','zoo day'];
  if(n===9 && text.includes('bird')) return ['animal','the bird poop incident'];
  if(n===10) return ['code','building something together'];
  if(n===13) return ['calendar','520 redemption'];
  if(n===14) return ['ring','the Day 100 ring'];
  if(n===16) return ['plane','the Terengganu trip'];
  if(n===18) return ['moon','the last trip before New Zealand'];
  if(n===19) return null;
  return null;
}

sections.forEach(section=>{
  const match=motifForSection(section);
  if(!match) return;
  const el=document.createElement('span');
  el.className='scene-motif';
  el.setAttribute('aria-hidden','true');
  el.dataset.motif=match[0];
  el.title=match[1];
  el.innerHTML=motifs[match[0]];
  section.appendChild(el);
});

const eraClasses=['era-old','era-soft','era-playful','era-warm','era-farewell','era-distance','era-final'];
function activateEra(era){
  eraClasses.forEach(c=>body.classList.remove(c));
  body.classList.add(`era-${era}`);
}
activateEra('old');

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      const era=entry.target.dataset.era;
      if(era) activateEra(era);
      if(musicEnabled){
        const n=parseInt(entry.target.dataset.chapter||'0',10);
        crossfadeTo(musicActForChapter(n));
      }
      entry.target.querySelectorAll('.reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('visible'),i*100));
      const motif=entry.target.querySelector('.scene-motif');
      if(motif && !motif.classList.contains('is-active')) setTimeout(()=>motif.classList.add('is-active'),420);
    }
  });
},{threshold:.18,rootMargin:'0px 0px -10% 0px'});
sections.forEach(s=>observer.observe(s));

// Reveal only when sections enter the viewport; this keeps the scroll choreography intentional.
window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=`${max>0?(window.scrollY/max)*100:0}%`;
},{passive:true});

// Gentle Ken-Burns-like motion for real media when the user replaces placeholders with <img>/<video>.
document.querySelectorAll('.media-placeholder').forEach(box=>{
  box.addEventListener('mouseenter',()=>box.classList.add('media-hover'));
  box.addEventListener('mouseleave',()=>box.classList.remove('media-hover'));
});


// Media loader: every V3 media idea has an explicit path. Missing files stay hidden,
// so you can add photos one-by-one without blank boxes. Multi-photo scenes render
// all supplied images together in the same montage; single-photo scenes remain hero beats.
function loadMediaBox(box){
  const path=box.dataset.media || box.querySelector('small')?.textContent.trim();
  if(!path || !/^images\//i.test(path)) return;
  const img=new Image();
  img.alt='';
  img.decoding='async';
  img.onload=()=>{
    if(box.querySelector('img')) return;
    box.classList.add('has-media');
    box.prepend(img);
  };
  img.onerror=()=>{
    // Keep the placeholder available as a guide when its file has not been added yet.
  };
  img.src=path;
}
function hydrateMedia(){
  document.querySelectorAll('.media-placeholder,.photo-slot').forEach(loadMediaBox);
}
hydrateMedia();

// Add a tiny cinematic parallax to real photos only; disabled on touch devices.
const canHover=window.matchMedia('(hover:hover)').matches;
if(canHover){
  document.querySelectorAll('.media-placeholder,.photo-slot').forEach(box=>{
    box.addEventListener('pointermove',e=>{
      if(!box.classList.contains('has-media')) return;
      const r=box.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const img=box.querySelector('img');
      if(img) img.style.transform=`scale(1.035) translate(${x*6}px,${y*6}px)`;
    });
    box.addEventListener('pointerleave',()=>{
      const img=box.querySelector('img');
      if(img) img.style.transform='';
    });
  });
}

// Keep progress accurate after mobile browser chrome changes viewport height.
const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=`${max>0?(window.scrollY/max)*100:0}%`;
};
window.addEventListener('resize',updateProgress,{passive:true});
updateProgress();

// Music: four cinematic acts. Audio starts only after a user gesture,
// loops within each act, and crossfades when the story enters the next act.
const musicToggle = document.getElementById('music-toggle');
const beginStory = document.getElementById('begin-story');
const musicControl = document.getElementById('music-control');
const tracks = {
  fairytale: document.getElementById('track-fairytale'),
  slowly: document.getElementById('track-slowly'),
  loveStory: document.getElementById('track-love-story'),
  thousandYears: document.getElementById('track-thousand-years')
};
let musicEnabled = false;
let activeTrack = null;
let fadeTimer = null;
const targetVolume = 0.30;

function musicActForChapter(n){
  // Act 1: 童话 — beginning / Chapter 01
  if(n <= 1) return 'fairytale';
  // Act 2: 慢慢 — Mars Arc through the chapter immediately before Genting
  if(n <= 6) return 'slowly';
  // Act 3: Love Story — Genting through the chapter immediately before the final trip to NZ
  if(n <= 17) return 'loveStory';
  // Act 4: A Thousand Years — final trip to NZ through the ending
  return 'thousandYears';
}
function fadeTo(track, duration=1100){
  if(!track) return;
  clearInterval(fadeTimer);
  const start = activeTrack && !activeTrack.paused ? activeTrack.volume : 0;
  const end = targetVolume;
  const startTime = performance.now();
  track.volume = 0;
  track.play().catch(()=>{});
  fadeTimer=setInterval(()=>{
    const t=Math.min(1,(performance.now()-startTime)/duration);
    track.volume=start+(end-start)*t;
    if(t>=1) clearInterval(fadeTimer);
  },40);
}
function crossfadeTo(name){
  if(!musicEnabled || !tracks[name] || tracks[name]===activeTrack) return;
  const next=tracks[name];
  Object.values(tracks).forEach(t=>{ if(t!==next){t.volume=0;t.pause();} });
  activeTrack=next;
  fadeTo(next);
}
function startMusic(){
  musicEnabled=true;
  musicControl.classList.add('is-ready');
  crossfadeTo(musicActForChapter(1));
  musicToggle.textContent='♫';
  musicToggle.setAttribute('aria-label','Pause music');
  musicToggle.title='Pause music';
}
function stopMusic(){
  musicEnabled=false;
  clearInterval(fadeTimer);
  Object.values(tracks).forEach(t=>{t.pause();t.volume=0;});
  musicToggle.textContent='♫';
  musicToggle.setAttribute('aria-label','Start music');
  musicToggle.title='Start music';
}
if(musicToggle){
  musicToggle.addEventListener('click',()=> musicEnabled ? stopMusic() : startMusic());
  musicControl.classList.add('is-ready');
}
if(beginStory){
  beginStory.addEventListener('click',()=>{
    startMusic();
    beginStory.closest('.hero')?.querySelector('.scroll-hint')?.scrollIntoView({behavior:'smooth',block:'center'});
  });
}
sections.forEach(section=>section.addEventListener('mouseenter',()=>{
  if(musicEnabled){const n=parseInt(section.dataset.chapter||'0',10); crossfadeTo(musicActForChapter(n));}
}));
