const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// Data
const committees=[
 {n:'UNGA',f:'United Nations General Assembly',d:'A forum where all UN member states debate global issues and propose cooperative solutions.',a:'How should the international community govern artificial intelligence across borders?'},
 {n:'UNSC',f:'Security Council',d:'This council addresses threats to international peace and considers collective responses to conflict.',a:'Building lasting peace while responding to a fast-changing regional conflict.'},
 {n:'UNHRC',f:'Human Rights Council',d:'Delegates discuss human rights challenges and ways to protect fundamental freedoms worldwide.',a:'Protecting privacy and human rights in an increasingly connected world.'},
 {n:'AIPPM',f:'All India Political Parties Meet',d:'Indian political parties debate national policy, representing different viewpoints and constituencies.',a:'Balancing urban growth, public services, and the needs of a changing India.'},
 {n:'UNEP',f:'UN Environment Programme',d:'This committee focuses on international cooperation to address environmental challenges.',a:'Making climate adaptation more accessible to vulnerable communities.'},
 {n:'WHO',f:'World Health Organization',d:'Delegates work together on global public health challenges and equitable access to care.',a:'Working towards fair access to essential healthcare and medicine.'},
 {n:'Crisis',f:'Joint Crisis Committee',d:'A fast-paced simulation where delegates respond to unfolding events and shape the outcome together.',a:'A fast-moving, collaborative scenario where every decision changes the next.'}];
const days=[
 ['Meet your fellow delegates and get oriented','Opening ceremony and first committee session','Learn the rules of debate together','Begin building your bloc and sharing ideas'],
 ['Return to committee with fresh perspectives','Negotiate, collaborate, and write working papers','Respond to new developments in committee','Bring draft resolutions forward for discussion'],
 ['Refine proposals through final debate','Present resolutions and vote as a committee','Close the conference together','Celebrate the ideas and voices in the room']];

// Committee cards + select
$('#cgrid').innerHTML=committees.map(c=>`<button class="card" type="button" aria-pressed="false" aria-label="${c.n}: ${c.f}. Reveal illustrative agenda and committee description"><span class="front"><span class="ic">${c.n}</span><span class="card-name">${c.f}</span><small>View illustrative agenda <span aria-hidden="true">↗</span></small></span><span class="back"><span class="agenda-label">WHAT THIS COMMITTEE DOES</span><p class="committee-description">${c.d}</p><span class="agenda-label">ILLUSTRATIVE AGENDA</span><span>${c.a}</span><small>Tap to return</small></span></button>`).join('');
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
$$('#menu a').forEach(a=>a.onclick=()=>{burger.classList.remove('open');menu.classList.remove('open')});
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