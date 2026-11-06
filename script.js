const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// Data
const committees=[
 {n:'UNHRC',f:'United Nations Human Rights Council',d:'Delegates discuss human rights challenges and ways to protect fundamental freedoms worldwide.',a:'Protecting privacy and human rights in an increasingly connected world.'},
 {n:'DISEC',f:'Disarmament and International Security Committee',d:'The UN General Assembly committee where countries discuss disarmament, arms control, and international security.',a:'Building international cooperation to reduce the risks of autonomous weapons.'},
 {n:'AIPPM',f:'All India Political Parties Meet',d:'Indian political parties debate national policy, representing different viewpoints and constituencies.',a:'Balancing urban growth, public services, and the needs of a changing India.'},
 {n:'CSW',f:'United Nations Commission on the Status of Women',d:'An international body focused on gender equality, women\'s rights, and the empowerment of women and girls.',a:'Strengthening access to education and economic opportunity for women and girls.'},
 {n:'IP',f:'International Press',d:'The conference media team reports on committee discussions through articles, interviews, and press coverage.',a:'Covering committee sessions, interviewing delegates, and reporting on the ideas shaping the conference.',label:'ILLUSTRATIVE PRESS FOCUS'}];
const days=[
 ['Meet your fellow delegates and get oriented','Opening ceremony and first committee session','Learn the rules of debate together','Begin building your bloc and sharing ideas'],
 ['Return to committee with fresh perspectives','Negotiate, collaborate, and write working papers','Respond to new developments in committee','Bring draft resolutions forward for discussion'],
 ['Refine proposals through final debate','Present resolutions and vote as a committee','Close the conference together','Celebrate the ideas and voices in the room']];

// Committee cards + select
$('#cgrid').innerHTML=committees.map(c=>`<button class="card" type="button" aria-pressed="false" aria-label="${c.n}: ${c.f}. Reveal illustrative details and committee description"><span class="front"><span class="ic">${c.n}</span><span class="card-name">${c.f}</span><small>View details <span aria-hidden="true">↗</span></small></span><span class="back"><span class="agenda-label">WHAT THIS COMMITTEE DOES</span><p class="committee-description">${c.d}</p><span class="agenda-label">${c.label||'ILLUSTRATIVE AGENDA'}</span><span>${c.a}</span><small>Tap to return</small></span></button>`).join('');
$('#comSel').innerHTML=committees.map(c=>`<option>${c.n}</option>`).join('')+'<option>No preference</option>';
$$('.card').forEach(c=>{c.onclick=()=>{const flipped=c.classList.toggle('flip');c.setAttribute('aria-pressed',String(flipped))}});

// Schedule tabs
function showDay(n){
 $('#timeline').innerHTML=days[n].map((event,i)=>`<li><b>0${i+1}</b><span>${event}</span></li>`).join('');
 $$('#timeline li').forEach((item,i)=>{item.style.setProperty('--item-index',i)});
 $$('#tabs button').forEach(b=>b.classList.toggle('on',+b.dataset.t===n));
}
$$('#tabs button').forEach(b=>b.onclick=()=>showDay(+b.dataset.t));showDay(0);

// FAQ answers slide open while staying out of keyboard navigation when closed.
$$('.faq-question').forEach(button=>{
 button.onclick=()=>{
  const expanded=button.getAttribute('aria-expanded')==='true';
  const answer=$(`#${button.getAttribute('aria-controls')}`);
  button.setAttribute('aria-expanded',String(!expanded));
  answer.setAttribute('aria-hidden',String(expanded));
  answer.inert=expanded;
  button.closest('.faq-item').classList.toggle('open',!expanded);
 };
});

// Reveal sections as they enter the viewport.
if('IntersectionObserver' in window){
 const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.add('in-view');
    sectionObserver.unobserve(entry.target);
   }
  });
 },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 $$('.sec > .wrap').forEach(section=>sectionObserver.observe(section));
 document.body.classList.add('motion-ready');
}

// Nav
const nav=$('#nav'),burger=$('#burger'),menu=$('#menu');
burger.onclick=()=>{burger.classList.toggle('open');menu.classList.toggle('open')};
let pendingReveal=null,revealFallback=null,revealAnimation=null;
function replaySectionReveal(section){
 if(revealAnimation)revealAnimation.cancel();
 section.classList.add('in-view');
 revealAnimation=section.animate(
  [{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],
  {duration:650,easing:'cubic-bezier(.2, .75, .25, 1)'}
 );
}
document.addEventListener('scrollend',()=>{
 if(!pendingReveal)return;
 const section=pendingReveal;
 pendingReveal=null;
 clearTimeout(revealFallback);
 replaySectionReveal(section);
});
$$('#menu a').forEach(a=>a.onclick=e=>{
 burger.classList.remove('open');menu.classList.remove('open');
 const href=a.getAttribute('href'),target=href&&href.startsWith('#')?$(href):null;
 if(!target)return;
 e.preventDefault();
 const section=target.matches('.sec')?target.querySelector(':scope > .wrap'):target.querySelector(':scope > .hero-in');
 if(section){
  const alreadyAligned=Math.abs(target.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop))<2;
  pendingReveal=null;
  clearTimeout(revealFallback);
  if(alreadyAligned){
   replaySectionReveal(section);
  }else{
  pendingReveal=section;
   revealFallback=setTimeout(()=>{
    if(pendingReveal===section){
     pendingReveal=null;
     replaySectionReveal(section);
    }
   },1500);
   target.scrollIntoView({behavior:'smooth',block:'start'});
  }
  if(location.hash!==href)history.pushState(null,'',href);
 }
});
addEventListener('keydown',e=>{if(e.key==='Escape'){burger.classList.remove('open');menu.classList.remove('open')}});

// Scroll effects
const topButton=$('#top');
topButton.onclick=()=>scrollTo({top:0});
addEventListener('scroll',()=>{
 const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
 $('#progress').style.width=(y/h*100)+'%';
 nav.classList.toggle('solid',y>60);topButton.classList.toggle('show',y>600);
},{passive:true});

// Form
$('#form').onsubmit=e=>{
 e.preventDefault();let ok=true;const f=e.target;
 ['name','email','inst'].forEach(k=>{const el=f[k],bad=!el.value.trim()||(k==='email'&&!/^\S+@\S+\.\S+$/.test(el.value));
  el.classList.toggle('bad',bad);if(bad)ok=false});
 const m=$('#msg');
 if(!ok){m.style.color='#e5a04b';m.textContent='Please fill in the highlighted fields.';return}
 m.style.color='#f3d58a';m.textContent=`Thanks, ${f.name.value.split(' ')[0]}. This preview form is not connected yet; please follow @cmritmun for updates.`;f.reset();
};

// Cursor spotlight
addEventListener('pointermove',e=>{
 document.body.style.setProperty('--mx',e.clientX+'px');
 document.body.style.setProperty('--my',e.clientY+'px');
},{passive:true});