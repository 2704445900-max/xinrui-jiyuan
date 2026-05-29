const STORAGE_KEY = 'xinrui_jiyuan_data_v2';

const defaultData = {
  hero: { subtitle:"N E W   E R A", title:"新锐纪元",
    declaration:"在第三纪元的晨曦里，一支年轻的队伍走向太阳。\n这是属于他们的故事，也是属于我们的纪元。" },
  story: "（请进入管理后台 admin.html 编辑这段作者自述）\n\n大家好，我是和平莱茵兔……",
  eras: [
    { name:"第一纪元", title:"旧秩序的黄昏", desc:"（点击管理入口编辑此内容）" },
    { name:"第二纪元", title:"动荡与转折", desc:"（点击管理入口编辑此内容）" },
    { name:"第三纪元", title:"新锐崛起", desc:"（点击管理入口编辑此内容）" }
  ],
  characters: [
    { name:"林荫清", role:"林小队 · 队长", faction:"main", age:"—", rank:"—", origin:"—",
      tags:["冷静","理性","战术天才"], bio:"（人物履历待填写）", quote:"我们的队伍向太阳。",
      images:[], radar:{ "理性":90,"感性":60,"攻击":75,"防御":80,"团队":85,"指挥":95 } },
    { name:"唐舒嫣", role:"林小队 · 副队长", faction:"main", age:"—", rank:"—", origin:"—",
      tags:["可靠","温柔"], bio:"（人物履历待填写）", quote:"", images:[],
      radar:{ "理性":75,"感性":85,"攻击":70,"防御":85,"团队":95,"指挥":80 } },
    { name:"赵婷婷", role:"林小队 · 成员", faction:"main", age:"—", rank:"—", origin:"—",
      tags:["机敏"], bio:"（人物履历待填写）", quote:"", images:[],
      radar:{ "理性":70,"感性":70,"攻击":80,"防御":70,"团队":75,"指挥":60 } }
  ],
  villains: [
    { name:"法特提", desc:"（反派组织描述待填写）" },
    { name:"影碟机构", desc:"（反派组织描述待填写）" }
  ],
  videos: [
    { bvid:"", title:"示例视频", desc:"在管理后台添加你的B站视频" }
  ],
  community: {
    wechatQR: "",
    qqQR: "",
    qqNumber: "—",
    wechatTitle: "支持众筹",
    wechatDesc: "扫码支持新锐纪元企划",
    qqTitle: "加入社群",
    qqDesc: "一起探索新锐纪元的世界"
  }
};


let data = JSON.parse(JSON.stringify(defaultData));

function loadData(){
  const s = localStorage.getItem(STORAGE_KEY);
  if(s){ try{ data = JSON.parse(s); }catch(e){} }
}
function esc(s){ return (s||'').toString().replace(/</g,'&lt;'); }

function renderHero(){
  document.getElementById('hero-subtitle').textContent = data.hero.subtitle;
  document.getElementById('hero-title').textContent = data.hero.title;
  const target = document.getElementById('hero-declaration');
  const full = data.hero.declaration || '';
  target.textContent = '';
  let i = 0;
  const timer = setInterval(()=>{
    target.textContent = full.slice(0, ++i);
    if(i >= full.length) clearInterval(timer);
  }, 40);
}

function renderStory(){
  document.getElementById('story-content').textContent = data.story;
}

function renderEras(){
  const track = document.getElementById('timeline-track');
  track.innerHTML = '';
  data.eras.forEach((era,i)=>{
    const node = document.createElement('div');
    node.className = 'timeline-node' + (i===0?' active':'');
    node.textContent = era.name;
    node.onclick = ()=> showEra(i);
    track.appendChild(node);
  });
  if(data.eras.length) showEra(0);
}

function showEra(i){
  document.querySelectorAll('.timeline-node').forEach((n,j)=>n.classList.toggle('active', i===j));
  const era = data.eras[i];
  document.getElementById('era-content').innerHTML = 
    `<h3>${esc(era.title)}</h3><p>${esc(era.desc)}</p>`;
}

function renderCharacters(){
  const grid = document.getElementById('characters-grid');
  grid.innerHTML = '';
  data.characters.forEach((c,i)=>{
    const cover = (c.images && c.images[0]) || c.image || '';
    const card = document.createElement('div');
    card.className = 'character-card' + (c.faction==='villain'?' faction-villain':'');
    card.innerHTML = `
      <span class="faction-tag">${c.faction==='villain'?'敌':'盟'}</span>
      <div class="portrait">${cover?`<img src="${esc(cover)}">`:'👤'}</div>
      <div class="info">
        <div class="name">${esc(c.name)}</div>
        <div class="role">${esc(c.role)}</div>
      </div>`;
    card.onclick = ()=> openCharModal(i);
    grid.appendChild(card);
  });
}

function renderVillains(){
  document.getElementById('villains-content').innerHTML = 
    data.villains.map(v=>`<div class="villain-card"><h3>${esc(v.name)}</h3><p>${esc(v.desc)}</p></div>`).join('');
}

function renderVideos(){
  const player = document.getElementById('video-player');
  const list = document.getElementById('video-list');
  const videos = data.videos || [];
  
  if(videos.length === 0){
    player.innerHTML = '<div class="video-empty">暂无视频，请在管理后台添加</div>';
    list.innerHTML = '';
    return;
  }
  
  playVideo(0);
  
  list.innerHTML = videos.map((v,i)=>`
    <div class="video-item ${i===0?'active':''}" onclick="playVideo(${i})">
      <div class="video-thumb">
        <div class="play-icon">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${esc(v.title)}</div>
        <div class="video-desc">${esc(v.desc||'')}</div>
      </div>
    </div>
  `).join('');
}

function playVideo(i){
  const v = data.videos[i];
  if(!v) return;
  const player = document.getElementById('video-player');
  if(!v.bvid){
    player.innerHTML = '<div class="video-empty">该视频未配置 BV 号</div>';
    return;
  }
  player.innerHTML = `
    <iframe 
      src="//player.bilibili.com/player.html?bvid=${esc(v.bvid)}&high_quality=1&danmaku=0" 
      scrolling="no" 
      frameborder="no" 
      framespacing="0" 
      allowfullscreen="true">
    </iframe>`;
  document.querySelectorAll('.video-item').forEach((el,idx)=>{
    el.classList.toggle('active', i===idx);
  });
}

function renderCommunity(){
  const c = data.community || {};
  
  document.getElementById('comm-wechat-title').textContent = c.wechatTitle || '支持众筹';
  document.getElementById('comm-wechat-desc').textContent = c.wechatDesc || '扫码支持新锐纪元企划';
  const wechatQR = document.getElementById('comm-wechat-qr');
  if(c.wechatQR){
    wechatQR.innerHTML = `<img src="${esc(c.wechatQR)}" alt="微信收款码">`;
  } else {
    wechatQR.innerHTML = '<div class="qr-hint">请在管理后台上传微信收款码</div>';
  }
  
  document.getElementById('comm-qq-title').textContent = c.qqTitle || '加入社群';
  document.getElementById('comm-qq-desc').textContent = c.qqDesc || '一起探索新锐纪元的世界';
  document.getElementById('comm-qq-num').textContent = c.qqNumber || '—';
  const qqQR = document.getElementById('comm-qq-qr');
  if(c.qqQR){
    qqQR.innerHTML = `<img src="${esc(c.qqQR)}" alt="QQ群二维码">`;
  } else {
    qqQR.innerHTML = '<div class="qr-hint">请在管理后台上传QQ群二维码</div>';
  }
}


let currentChar = null;

function openCharModal(i){
  const c = data.characters[i];
  currentChar = c;
  const imgs = (c.images && c.images.length) ? c.images : (c.image?[c.image]:[]);
  showPortrait(imgs[0] || '');
  const thumbs = document.getElementById('gallery-thumbs');
  if(imgs.length > 1){
    thumbs.innerHTML = imgs.map((src,idx)=>
      `<img src="${esc(src)}" class="${idx===0?'active':''}" onclick="selectThumb(${idx})">`
    ).join('');
  } else { thumbs.innerHTML = ''; }
  document.getElementById('modal-details').innerHTML = `
    <h2>${esc(c.name)}</h2>
    <div class="meta">${esc(c.role)}</div>
    <div class="stat-grid">
      <div><strong>年龄</strong>${esc(c.age||'—')}</div>
      <div><strong>军衔</strong>${esc(c.rank||'—')}</div>
      <div><strong>籍贯</strong>${esc(c.origin||'—')}</div>
      <div><strong>阵营</strong>${c.faction==='villain'?'敌方':'盟友'}</div>
    </div>
    <div class="tags">${(c.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="radar-wrap"><canvas id="radar" class="radar-canvas" width="300" height="300"></canvas></div>
    <p style="white-space:pre-wrap">${esc(c.bio)}</p>
    ${c.quote?`<div class="quote">"${esc(c.quote)}"</div>`:''}`;
  drawRadar(c.radar || {});
  document.getElementById('modal-bg').classList.add('active');
}

function showPortrait(src){
  document.getElementById('modal-portrait').innerHTML = src ? `<img src="${esc(src)}">` : '👤';
}

function selectThumb(idx){
  const imgs = (currentChar.images && currentChar.images.length) ? currentChar.images : [currentChar.image];
  showPortrait(imgs[idx]);
  document.querySelectorAll('#gallery-thumbs img').forEach((el,i)=>el.classList.toggle('active', i===idx));
}

function closeModal(){ document.getElementById('modal-bg').classList.remove('active'); }
document.getElementById('modal-bg').addEventListener('click',e=>{ if(e.target.id==='modal-bg') closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

function drawRadar(radar){
  const canvas = document.getElementById('radar');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2, R = 100;
  const keys = Object.keys(radar);
  const N = keys.length;
  if(N < 3){ ctx.fillStyle='#666'; ctx.fillText('数据不足', cx-30, cy); return; }
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = 'rgba(148,163,184,0.2)';
  for(let level=1; level<=4; level++){
    ctx.beginPath();
    for(let i=0;i<N;i++){
      const a = -Math.PI/2 + i*2*Math.PI/N;
      const r = R*level/4;
      const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(148,163,184,0.15)';
  for(let i=0;i<N;i++){
    const a = -Math.PI/2 + i*2*Math.PI/N;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx + Math.cos(a)*R, cy + Math.sin(a)*R); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(59,130,246,0.25)';
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let i=0;i<N;i++){
    const a = -Math.PI/2 + i*2*Math.PI/N;
    const v = Math.max(0, Math.min(100, radar[keys[i]]||0));
    const r = R*v/100;
    const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  for(let i=0;i<N;i++){
    const a = -Math.PI/2 + i*2*Math.PI/N;
    const x = cx + Math.cos(a)*(R+18), y = cy + Math.sin(a)*(R+18) + 4;
    ctx.fillText(keys[i], x, y);
  }
}

function initParticles(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles=[];
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  resize(); addEventListener('resize',resize);
  for(let i=0;i<60;i++) particles.push({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
    r:Math.random()*1.5+0.5, c:Math.random()>0.5?'59,130,246':'239,68,68'
  });
  function tick(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.fillStyle=`rgba(${p.c},0.6)`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}

function setupFadeIn(){
  document.querySelectorAll('section').forEach(s=>s.classList.add('fade-in'));
  const io = new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('visible');
  }), {threshold:0.1});
  document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));
}

async function bootstrap(){
  // 1. 优先尝试从 data/content.json 读取（线上版本）
  try {
    const res = await fetch('data/content.json', {cache:'no-store'});
    if(res.ok){
      const remote = await res.json();
      if(remote && remote.hero && remote.characters){
        data = remote;
        console.log('已加载 content.json');
      }
    } else {
      // 没有 json 文件就用浏览器本地缓存
      loadData();
    }
  } catch(e){
    // 双击打开 html 时会进这里，回退到本地缓存
    loadData();
  }

  renderHero();
  renderStory();
  renderEras();
  renderCharacters();
  renderVillains();
  renderVideos();
  renderCommunity();
  initParticles();
  setupFadeIn();
}

bootstrap();

