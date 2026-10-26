const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// Data
const committees=[
 {n:'UNGA',f:'General Assembly',a:'Agenda: Governing AI across borders. Open to all first timers.'},
 {n:'UNSC',f:'Security Council',a:'Agenda: Cyber warfare and state sovereignty. Crisis style debate.'},
 {n:'UNHRC',f:'Human Rights Council',a:'Agenda: Digital rights and mass surveillance.'},
 {n:'AIPPM',f:'All India Political Parties Meet',a:'Agenda: Federalism and water sharing between states.'},
 {n:'UNEP',f:'Environment Programme',a:'Agenda: Climate finance for the Global South.'},
 {n:'Crisis',f:'Joint Crisis Committee',a:'Agenda: Revealed on day one. Think fast, negotiate faster.'}];
const days=[
 [['9:00','Inauguration and keynote'],['11:00','Committee session I'],['2:00','Lunch and lobbying'],['3:30','Committee session II']],
 [['9:30','Committee session III'],['12:30','Crisis update drops'],['3:00','Draft resolution deadline'],['6:00','Cultural evening']],
 [['9:30','Final session and voting'],['1:00','Lunch'],['2:30','Closing ceremony'],['4:00','Awards and best delegates']]];

// Committee cards + select
$('#cgrid').innerHTML=committees.map(c=>`<div class="card" tabindex="0"><div class="front"><div class="ic">${c.n}</div><h3>${c.f}</h3><small>Tap to view agenda</small></div><div class="back"><p>${c.a}</p></div></div>`).join('');
$('#comSel').innerHTML=committees.map(c=>`<option>${c.n}</option>`).join('')+'<option>No preference</option>';
$$('.card').forEach(c=>{c.onclick=()=>c.classList.toggle('flip');c.onkeydown=e=>e.key==='Enter'&&c.classList.toggle('flip')});

// Schedule tabs
function showDay(n){
 $('#timeline').innerHTML=days[n].map(([t,e])=>`<li><b>${t}</b>${e}</li>`).join('');
 $$('#tabs button').forEach(b=>b.classList.toggle('on',+b.dataset.t===n));
}
$$('#tabs button').forEach(b=>b.onclick=()=>showDay(+b.dataset.t));showDay(0);

// Countdown (placeholder date, change as needed)
const target=new Date('2027-01-29T09:00:00+05:30');
const pad=n=>String(n).padStart(2,'0');
setInterval(function tick(){
 let t=Math.max(0,target-Date.now())/1000;
 $('#d').textContent=pad(Math.floor(t/86400));$('#h').textContent=pad(Math.floor(t/3600%24));
 $('#m').textContent=pad(Math.floor(t/60%60));$('#s').textContent=pad(Math.floor(t%60));return tick}(),1000);

// Nav
const nav=$('#nav'),burger=$('#burger'),menu=$('#menu');
burger.onclick=()=>{burger.classList.toggle('open');menu.classList.toggle('open')};
$$('#menu a').forEach(a=>a.onclick=()=>{burger.classList.remove('open');menu.classList.remove('open')});

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
 m.style.color='#f3d58a';m.textContent=`Thank you, ${f.name.value.split(' ')[0]}. We will email you when ${f.com.value} registrations open.`;f.reset();
};

// Cursor spotlight
addEventListener('pointermove',e=>{
 document.body.style.setProperty('--mx',e.clientX+'px');
 document.body.style.setProperty('--my',e.clientY+'px');
},{passive:true});