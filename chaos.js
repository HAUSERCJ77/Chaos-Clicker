/* Ultra Chaos Clicker Main Script (chaos.js) */

// =================== VARIABLES ===================
let points = 0, clickPower = 1, autoClickers = 0, prestigePoints = 0;
let combo = 0, lastClick = 0;
let emojiSet = ['💥','⚡','🔥','👾','✨','💎','🐉','🛸'];
let achievements = [];
let unlockedAchievements = [];
let clickSound;

// =================== DOM ELEMENTS ===================
const pointsDisplay = document.getElementById('points');
const clickBtn = document.getElementById('clickBtn');
const megaClickBtn = document.getElementById('megaClickBtn');
const shopDiv = document.getElementById('shop');
const achievementsDiv = document.getElementById('achievements');

// =================== HELPERS ===================
function randomColor(){ return `hsl(${Math.floor(Math.random()*360)},100%,50%)`; }
function randOffset(){ return (Math.random()-0.5)*200+'px'; }
function randomInt(max){ return Math.floor(Math.random()*max); }

// =================== SOUND ===================
function playClickSound(){
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}
function loadClickSound(){
  clickSound = new Audio('click.mp3');
  clickSound.load();
}
loadClickSound();

// =================== SPAWN FUNCTIONS ===================
function spawnEmoji(){ 
  const e = document.createElement('div');
  e.className = 'emoji';
  e.textContent = emojiSet[randomInt(emojiSet.length)];
  e.style.left = randomInt(window.innerWidth)+'px';
  e.style.top = randomInt(window.innerHeight)+'px';
  e.style.color = randomColor();
  document.body.appendChild(e);
  setTimeout(()=>e.remove(),1000);
}

function spawnParticles(x,y,count=10){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.background = randomColor();
    p.style.left = x+'px';
    p.style.top = y+'px';
    p.style.setProperty('--x',randOffset());
    p.style.setProperty('--y',randOffset());
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),500);
  }
}

function shakeScreen(mag=10){
  const x=(Math.random()-0.5)*mag;
  const y=(Math.random()-0.5)*mag;
  document.body.style.transform=`translate(${x}px,${y}px)`;
  setTimeout(()=>document.body.style.transform='translate(0,0)',100);
}

// =================== RANDOM EVENTS ===================
function randomEvent(){
  const r=Math.random();
  if(r<0.1){shakeScreen(50);}
  else if(r<0.2){clickPower*=2; setTimeout(()=>clickPower/=2,5000);}
  else if(r<0.3){document.body.style.filter='invert(1)'; setTimeout(()=>document.body.style.filter='invert(0)',5000);}
  else if(r<0.4){spawnParticles(randomInt(window.innerWidth),randomInt(window.innerHeight),30);}
  else if(r<0.5){spawnEmoji();}
}

// =================== ACHIEVEMENTS ===================
achievements = [
  {id:'firstClick', name:'First Click!', desc:'Click for the first time.', test:()=>points>=1},
  {id:'hundredPoints', name:'100 Points!', desc:'Reach 100 points.', test:()=>points>=100},
  {id:'shopBuy', name:'Shopper', desc:'Buy any shop item.', test:()=>shopItems.some(i=>i.amount>0)},
  {id:'prestige', name:'Prestige!', desc:'Prestige at least once.', test:()=>prestigePoints>0},
  {id:'autoClicker', name:'Automation!', desc:'Own 10 auto clickers.', test:()=>shopItems[0].amount>=10},
  {id:'megaClick', name:'Mega Click!', desc:'Unlock Mega Click.', test:()=>megaClickBtn.style.display!=='none'},
  {id:'chaos', name:'Chaos!', desc:'Trigger a random event.', test:()=>points>=1 && Math.random()<0.01},
];
function checkAchievements(){
  achievements.forEach(a=>{
    if(!unlockedAchievements.includes(a.id) && a.test()){
      unlockedAchievements.push(a.id);
      showAchievement(a);
      saveGame();
    }
  });
  renderAchievements();
}
function showAchievement(a){
  const div = document.createElement('div');
  div.textContent = `🏆 ${a.name}: ${a.desc}`;
  div.style.background = '#222';
  div.style.color = '#0f0';
  div.style.padding = '8px';
  div.style.margin = '4px';
  div.style.border = '2px solid #0f0';
  div.style.position = 'fixed';
  div.style.top = '10px';
  div.style.right = '10px';
  div.style.zIndex = 9999;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),3000);
}
function renderAchievements(){
  achievementsDiv.innerHTML = '<h2>Achievements</h2>';
  unlockedAchievements.forEach(id=>{
    const a = achievements.find(x=>x.id===id);
    if(a){
      const div = document.createElement('div');
      div.textContent = `🏆 ${a.name}`;
      achievementsDiv.appendChild(div);
    }
  });
}

// =================== SHOP ITEMS ===================
let shopItems = [
  {name:"Auto Clicker", basePrice:50, amount:0, mult:1.15, effect:()=>autoClickers++},
  {name:"+1 Click Power", basePrice:100, amount:0, mult:1.2, effect:()=>clickPower++},
  {name:"Double Power", basePrice:250, amount:0, mult:1.25, effect:()=>clickPower*=2},
  {name:"Unlock Mega Click", basePrice:500, amount:0, mult:2, effect:()=>megaClickBtn.style.display='inline-block'},
  {name:"Combo Booster", basePrice:600, amount:0, mult:1.3, effect:()=>{}},
  {name:"Emoji Storm", basePrice:800, amount:0, mult:1.3, effect:()=>{for(let i=0;i<3;i++) spawnEmoji();}},
  {name:"Particle Frenzy", basePrice:1000, amount:0, mult:1.35, effect:()=>spawnParticles(randomInt(window.innerWidth),randomInt(window.innerHeight),15)},
  {name:"Critical Clicks", basePrice:1200, amount:0, mult:1.4, effect:()=>{if(Math.random()<0.1){ points+=clickPower*5; pointsDisplay.textContent=points; }}},
  {name:"Screen Shaker", basePrice:1500, amount:0, mult:1.4, effect:()=>shakeScreen(30)},
  {name:"Chaos Energy", basePrice:2000, amount:0, mult:1.5, effect:()=>{ document.body.style.background=randomColor(); setTimeout(()=>document.body.style.background='#111',300); }},
  {name:"Overdrive +5 Power", basePrice:2500, amount:0, mult:1.5, effect:()=>clickPower+=5},
  {name:"Emoji Boss", basePrice:3000, amount:0, mult:1.6, effect:()=>{
      const boss=document.createElement('div');
      boss.textContent='👹';
      boss.style.position='absolute';
      boss.style.fontSize='64px';
      boss.style.left=randomInt(window.innerWidth-100)+'px';
      boss.style.top=randomInt(window.innerHeight-100)+'px';
      boss.style.cursor='pointer';
      document.body.appendChild(boss);
      boss.onclick=()=>{
        points+=500; pointsDisplay.textContent=points;
        spawnParticles(parseInt(boss.style.left),parseInt(boss.style.top),50);
        boss.remove();
      };
      setTimeout(()=>boss.remove(),15000);
  }},
  {name:"Auto Chaos", basePrice:4000, amount:0, mult:1.6, effect:()=>{if(Math.random()<0.2) randomEvent();}},
  {name:"Super Particle Blast", basePrice:5000, amount:0, mult:1.7, effect:()=>spawnParticles(randomInt(window.innerWidth),randomInt(window.innerHeight),50)},
  {name:"Click Magnet", basePrice:6000, amount:0, mult:1.8, effect:(x=0,y=0)=>{document.querySelectorAll('.particle,.emoji').forEach(el=>{ el.style.left=x+'px'; el.style.top=y+'px'; });}},
  {name:"RNG Madness", basePrice:7000, amount:0, mult:1.8, effect:()=>{if(Math.random()<0.1){ points+=randomInt(50)+10; pointsDisplay.textContent=points; }}},
  {name:"Apocalypse Mode", basePrice:8000, amount:0, mult:2, effect:()=>{ combo*=2; setTimeout(()=>combo=1,15000); }},
  {name:"Infinity Clicks +50", basePrice:10000, amount:0, mult:2, effect:()=>clickPower+=50},
  {name:"Prestige Reset", basePrice:15000, amount:0, mult:3, effect:prestige},
  {name:"Ultimate Chaos", basePrice:20000, amount:0, mult:5, effect:()=>alert("You have unlocked Ultimate Chaos!")}
];

// =================== RENDER SHOP ===================
function renderShop(){
  shopDiv.innerHTML='<h2>Shop</h2>';
  shopItems.forEach(item=>{
    const cost = Math.floor(item.basePrice * Math.pow(item.mult, item.amount));
    const btn = document.createElement('button');
    btn.textContent=`${item.name} (${cost}) [Owned: ${item.amount}]`;
    btn.onclick=()=>{
      if(points>=cost){
        points -= cost; pointsDisplay.textContent=points;
        item.amount++; item.effect(); renderShop();
        checkAchievements();
        saveGame();
      }
    };
    btn.setAttribute('aria-label', item.name + ' costs ' + cost);
    shopDiv.appendChild(btn);
  });
}

// =================== PRESTIGE ===================
function prestige(){
  prestigePoints++;
  points=0; clickPower=1; autoClickers=0;
  shopItems.forEach(i=>i.amount=0);
  alert(`Prestige! Permanent +1 click power. Total prestige: ${prestigePoints}`);
  clickPower += prestigePoints;
  renderShop();
  checkAchievements();
  saveGame();
}

// =================== CLICK HANDLER ===================
function handleClick(e){
  const now = Date.now();
  combo = (now-lastClick<300)?combo+1:1;
  lastClick = now;
  points += clickPower*combo;
  pointsDisplay.textContent=points;
  spawnEmoji();
  spawnParticles(e.clientX,e.clientY,5+combo);
  shakeScreen(combo*2);
  playClickSound();
  shopItems.forEach(item=>{
    if(item.amount>0){
      if(item.name==="Critical Clicks") item.effect();
      if(item.name==="Super Particle Blast") item.effect();
      if(item.name==="Emoji Storm") item.effect();
      if(item.name==="Particle Frenzy") item.effect();
      if(item.name==="Screen Shaker") item.effect();
      if(item.name==="Chaos Energy") item.effect();
      if(item.name==="Click Magnet") item.effect(e.clientX,e.clientY);
      if(item.name==="RNG Madness") item.effect();
      if(item.name==="Apocalypse Mode") item.effect();
    }
  });
  checkAchievements();
  saveGame();
}
clickBtn.onclick=handleClick;
clickBtn.setAttribute('aria-label', 'Click to earn points');
clickBtn.setAttribute('tabindex', '0');
clickBtn.onkeydown = function(e){ if(e.key==='Enter'||e.key===' '){ handleClick(e); } };

// Touch support
clickBtn.ontouchstart = function(e){ handleClick(e.touches[0]); };

// =================== MEGA CLICK ===================
function handleMegaClick(){
  points += clickPower*50;
  pointsDisplay.textContent=points;
  spawnParticles(window.innerWidth/2,window.innerHeight/2,100);
  shakeScreen(40);
  playClickSound();
  checkAchievements();
  saveGame();
}
megaClickBtn.onclick=handleMegaClick;
megaClickBtn.setAttribute('aria-label', 'Mega Click for bonus points');
megaClickBtn.setAttribute('tabindex', '0');
megaClickBtn.onkeydown = function(e){ if(e.key==='Enter'||e.key===' '){ handleMegaClick(); } };
megaClickBtn.ontouchstart = function(e){ handleMegaClick(); };

// =================== AUTOCLICKER LOOP ===================
setInterval(()=>{
  points += autoClickers;
  pointsDisplay.textContent=points;
  for(let i=0;i<autoClickers;i++){
    spawnEmoji();
    shopItems.forEach(item=>{
      if(item.amount>0 && item.name==="Auto Chaos") item.effect();
      if(item.amount>0 && item.name==="Emoji Boss") item.effect();
    });
  }
  checkAchievements();
  saveGame();
},1000);

// =================== LOCAL STORAGE ===================
function saveGame(){
  const state = {
    points, clickPower, autoClickers, prestigePoints,
    combo, lastClick,
    shopItems: shopItems.map(i=>i.amount),
    unlockedAchievements
  };
  localStorage.setItem('chaosClickerSave', JSON.stringify(state));
}
function loadGame(){
  const state = JSON.parse(localStorage.getItem('chaosClickerSave')||'null');
  if(state){
    points = state.points;
    clickPower = state.clickPower;
    autoClickers = state.autoClickers;
    prestigePoints = state.prestigePoints;
    combo = state.combo;
    lastClick = state.lastClick;
    if(state.shopItems){
      shopItems.forEach((i,idx)=>{ i.amount = state.shopItems[idx]||0; });
    }
    unlockedAchievements = state.unlockedAchievements||[];
    pointsDisplay.textContent=points;
    if(shopItems[3].amount>0) megaClickBtn.style.display='inline-block';
    renderShop();
    renderAchievements();
  }
}

// =================== INIT ===================
window.onload = function(){
  loadGame();
  renderShop();
  renderAchievements();
};

// =================== SERVICE WORKER CACHE ===================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(reg => {
    if (reg.active) {
      reg.active.postMessage({cacheFile: 'click.mp3'});
    }
  });
}
