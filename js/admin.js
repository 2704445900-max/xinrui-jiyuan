// ========= 修改密码请改这一行 =========
const ADMIN_PASSWORD = 'admin123';
// ====================================

const STORAGE_KEY = 'xinrui_jiyuan_data_v2';
const AUTH_KEY = 'xinrui_admin_auth';
const RADAR_KEYS = ["理性","感性","攻击","防御","团队","指挥"];

const defaultData = {
  hero:{subtitle:"N E W   E R A",title:"新锐纪元",declaration:"在第三纪元的晨曦里，一支年轻的队伍走向太阳。"},
  story:"（请编辑这段作者自述）",
  eras:[
    {name:"第一纪元",title:"旧秩序的黄昏",desc:""},
    {name:"第二纪元",title:"动荡与转折",desc:""},
    {name:"第三纪元",title:"新锐崛起",desc:""}
  ],
  characters:[
    {name:"林荫清",role:"林小队 · 队长",faction:"main",age:"",rank:"",origin:"",
     tags:["冷静","理性","战术天才"],bio:"",quote:"我们的队伍向太阳。",images:[],
     radar:{"理性":90,"感性":60,"攻击":75,"防御":80,"团队":85,"指挥":95}}
  ],
  villains:[{name:"法特提",desc:""},{name:"影碟机构",desc:""}],
  videos:[{bvid:"",title:"示例视频",desc:"在管理后台添加你的B站视频"}],
  community:{
    wechatQR:"",
    qqQR:"",
    qqNumber:"",
    wechatTitle:"支持众筹",
    wechatDesc:"扫码支持新锐纪元企划",
    qqTitle:"加入社群",
    qqDesc:"一起探索新锐纪元的世界"
  }
};


let data = JSON.parse(JSON.stringify(defaultData));

function loadData(){ const s=localStorage.getItem(STORAGE_KEY); if(s){try{data=JSON.parse(s)}catch(e){}} }
function saveData(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); }
function esc(s){ return (s||'').toString().replace(/</g,'&lt;'); }
function escAttr(s){ return (s||'').toString().replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// 自动登录检查
window.addEventListener('DOMContentLoaded', ()=>{
  if(sessionStorage.getItem(AUTH_KEY) === '1') showPanel();
});

function doLogin(){
  const pwd = document.getElementById('login-pwd').value;
  if(pwd === ADMIN_PASSWORD){
    sessionStorage.setItem(AUTH_KEY,'1');
    showPanel();
  } else { alert('密码错误'); }
}
function logout(){ sessionStorage.removeItem(AUTH_KEY); location.reload(); }
function showPanel(){
  document.getElementById('login-bg').classList.add('hidden');
  document.getElementById('admin-panel').classList.add('active');
  loadData(); renderAdmin();
}

function renderAdmin(){
  document.getElementById('admin-content').innerHTML = `
    <div class="tip">💡 修改先存在浏览器本地。建议每次大改后点"导出备份"下载 JSON 文件留存。换电脑或正式部署时用"导入备份"恢复。</div>
    
    <div class="admin-section"><h3>① 首页文字</h3>
      <div class="form-row"><label>副标题</label><input id="ed-hero-subtitle" value="${escAttr(data.hero.subtitle)}"></div>
      <div class="form-row"><label>主标题</label><input id="ed-hero-title" value="${escAttr(data.hero.title)}"></div>
      <div class="form-row"><label>开场宣言（支持换行）</label><textarea id="ed-hero-declaration">${esc(data.hero.declaration)}</textarea></div>
    </div>

    <div class="admin-section"><h3>② 故事缘起（作者自述）</h3>
      <div class="form-row"><textarea id="ed-story" style="min-height:240px">${esc(data.story)}</textarea></div>
    </div>

    <div class="admin-section"><h3>③ 三纪元</h3>
      <div id="ed-eras"></div>
      <button class="btn btn-ghost" onclick="addEra()">+ 添加纪元</button>
    </div>

    <div class="admin-section"><h3>④ 角色（共 <span id="char-count">${data.characters.length}</span> 位）</h3>
      <div id="ed-characters"></div>
      <button class="btn btn-ghost" onclick="addCharacter()">+ 添加角色</button>
    </div>

       <div class="admin-section"><h3>⑤ 反派 / 阴影</h3>
      <div id="ed-villains"></div>
      <button class="btn btn-ghost" onclick="addVillain()">+ 添加反派</button>
    </div>

    <div class="admin-section"><h3>⑥ 企划视频</h3>
      <div id="ed-videos"></div>
      <button class="btn btn-ghost" onclick="addVideo()">+ 添加视频</button>
    </div>

    <div class="admin-section"><h3>⑦ 社群信息</h3>
      <div id="ed-community"></div>
    </div>`;
  renderEras(); renderChars(); renderVillains(); renderVideos(); renderCommunity();

}

function renderEras(){
  document.getElementById('ed-eras').innerHTML = data.eras.map((e,i)=>`
    <div class="edit-card">
      <div class="edit-header"><strong>纪元 ${i+1}</strong>
        <div class="edit-actions">
          <button class="btn btn-ghost" onclick="moveEra(${i},-1)">↑</button>
          <button class="btn btn-ghost" onclick="moveEra(${i},1)">↓</button>
          <button class="btn btn-danger" onclick="removeEra(${i})">删除</button>
        </div></div>
      <div class="form-grid-2">
        <div class="form-row"><label>名称（短）</label><input value="${escAttr(e.name)}" oninput="data.eras[${i}].name=this.value"></div>
        <div class="form-row"><label>标题</label><input value="${escAttr(e.title)}" oninput="data.eras[${i}].title=this.value"></div>
      </div>
      <div class="form-row"><label>描述</label><textarea oninput="data.eras[${i}].desc=this.value">${esc(e.desc)}</textarea></div>
    </div>`).join('');
}
function addEra(){ data.eras.push({name:"新纪元",title:"",desc:""}); renderEras(); }
function removeEra(i){ if(confirm('删除该纪元？')){ data.eras.splice(i,1); renderEras(); } }
function moveEra(i,d){ const j=i+d; if(j<0||j>=data.eras.length) return; [data.eras[i],data.eras[j]]=[data.eras[j],data.eras[i]]; renderEras(); }

function renderChars(){
  document.getElementById('ed-characters').innerHTML = data.characters.map((c,i)=>{
    if(!c.radar) c.radar = {};
    if(!c.images) c.images = [];
    const radarHtml = RADAR_KEYS.map(k=>`
      <div class="form-row"><label>${k}（0-100）</label>
        <input type="number" min="0" max="100" value="${c.radar[k]||0}" oninput="data.characters[${i}].radar['${k}']=parseInt(this.value)||0"></div>`).join('');
    const galleryHtml = c.images.map((src,idx)=>`
      <div class="thumb"><img src="${escAttr(src)}"><button onclick="removeCharImage(${i},${idx})">×</button></div>`).join('');
    return `
    <div class="edit-card">
      <div class="edit-header"><strong>${esc(c.name||'新角色')}</strong>
        <div class="edit-actions">
          <button class="btn btn-ghost" onclick="moveChar(${i},-1)">↑</button>
          <button class="btn btn-ghost" onclick="moveChar(${i},1)">↓</button>
          <button class="btn btn-danger" onclick="removeChar(${i})">删除</button>
        </div></div>
      <div class="form-grid-3">
        <div class="form-row"><label>姓名</label><input value="${escAttr(c.name)}" oninput="data.characters[${i}].name=this.value"></div>
        <div class="form-row"><label>身份</label><input value="${escAttr(c.role)}" oninput="data.characters[${i}].role=this.value"></div>
        <div class="form-row"><label>阵营</label><select oninput="data.characters[${i}].faction=this.value">
          <option value="main" ${c.faction==='main'?'selected':''}>盟友</option>
          <option value="villain" ${c.faction==='villain'?'selected':''}>敌方</option></select></div>
        <div class="form-row"><label>年龄</label><input value="${escAttr(c.age)}" oninput="data.characters[${i}].age=this.value"></div>
        <div class="form-row"><label>军衔</label><input value="${escAttr(c.rank)}" oninput="data.characters[${i}].rank=this.value"></div>
        <div class="form-row"><label>籍贯</label><input value="${escAttr(c.origin||'')}" oninput="data.characters[${i}].origin=this.value"></div>
      </div>
      <div class="form-row"><label>性格标签（逗号分隔）</label>
        <input value="${escAttr((c.tags||[]).join(','))}" oninput="data.characters[${i}].tags=this.value.split(',').map(s=>s.trim()).filter(Boolean)"></div>
      <div class="form-row"><label>履历</label><textarea oninput="data.characters[${i}].bio=this.value">${esc(c.bio)}</textarea></div>
      <div class="form-row"><label>名言</label><input value="${escAttr(c.quote||'')}" oninput="data.characters[${i}].quote=this.value"></div>
      
      <div class="form-row"><label>立绘（可上传多张，第一张为封面）</label>
        <input type="file" accept="image/*" multiple onchange="uploadCharImages(event,${i})">
        <div class="gallery-edit">${galleryHtml}</div>
      </div>
      
      <div class="form-row"><label>性格雷达图（六维属性）</label>
        <div class="radar-inputs">${radarHtml}</div>
      </div>
    </div>`;
  }).join('');
  const cnt = document.getElementById('char-count'); if(cnt) cnt.textContent = data.characters.length;
}

function addCharacter(){
  const radar = {}; RADAR_KEYS.forEach(k=>radar[k]=50);
  data.characters.push({name:"新角色",role:"",faction:"main",age:"",rank:"",origin:"",
    tags:[],bio:"",quote:"",images:[],radar});
  renderChars();
}
function removeChar(i){ if(confirm('确定删除此角色？')){ data.characters.splice(i,1); renderChars(); } }
function moveChar(i,d){ const j=i+d; if(j<0||j>=data.characters.length) return; [data.characters[i],data.characters[j]]=[data.characters[j],data.characters[i]]; renderChars(); }

function uploadCharImages(ev,i){
  const files = Array.from(ev.target.files);
  if(!files.length) return;
  let done = 0;
  files.forEach(f=>{
    const r = new FileReader();
    r.onload = ()=>{
      data.characters[i].images.push(r.result);
      done++;
      if(done === files.length) renderChars();
    };
    r.readAsDataURL(f);
  });
}
function removeCharImage(i,idx){ data.characters[i].images.splice(idx,1); renderChars(); }

function renderVillains(){
  document.getElementById('ed-villains').innerHTML = data.villains.map((v,i)=>`
    <div class="edit-card">
      <div class="edit-header"><strong>${esc(v.name||'反派')}</strong>
        <div class="edit-actions">
          <button class="btn btn-ghost" onclick="moveVillain(${i},-1)">↑</button>
          <button class="btn btn-ghost" onclick="moveVillain(${i},1)">↓</button>
          <button class="btn btn-danger" onclick="removeVillain(${i})">删除</button>
        </div></div>
      <div class="form-row"><label>名称</label><input value="${escAttr(v.name)}" oninput="data.villains[${i}].name=this.value"></div>
      <div class="form-row"><label>描述</label><textarea oninput="data.villains[${i}].desc=this.value">${esc(v.desc)}</textarea></div>
    </div>`).join('');
}
function addVillain(){ data.villains.push({name:"新反派",desc:""}); renderVillains(); }
function removeVillain(i){ if(confirm('删除？')){ data.villains.splice(i,1); renderVillains(); } }
function moveVillain(i,d){ const j=i+d; if(j<0||j>=data.villains.length) return; [data.villains[i],data.villains[j]]=[data.villains[j],data.villains[i]]; renderVillains(); }

function renderVideos(){
  if(!data.videos) data.videos = [];
  document.getElementById('ed-videos').innerHTML = data.videos.map((v,i)=>`
    <div class="edit-card">
      <div class="edit-header"><strong>${esc(v.title||'视频')}</strong>
        <div class="edit-actions">
          <button class="btn btn-ghost" onclick="moveVideo(${i},-1)">↑</button>
          <button class="btn btn-ghost" onclick="moveVideo(${i},1)">↓</button>
          <button class="btn btn-danger" onclick="removeVideo(${i})">删除</button>
        </div></div>
      <div class="form-row"><label>标题</label><input value="${escAttr(v.title)}" oninput="data.videos[${i}].title=this.value"></div>
      <div class="form-row"><label>B站 BV 号</label>
        <input value="${escAttr(v.bvid)}" oninput="data.videos[${i}].bvid=this.value" placeholder="例如：BV1xx411c7mD">
        <small>💡 打开B站视频，地址栏里 BV 开头的那串字符</small>
      </div>
      <div class="form-row"><label>简介</label><textarea oninput="data.videos[${i}].desc=this.value">${esc(v.desc)}</textarea></div>
    </div>`).join('');
}
function addVideo(){ if(!data.videos) data.videos=[]; data.videos.push({bvid:"",title:"新视频",desc:""}); renderVideos(); }
function removeVideo(i){ if(confirm('删除？')){ data.videos.splice(i,1); renderVideos(); } }
function moveVideo(i,d){ const j=i+d; if(j<0||j>=data.videos.length) return; [data.videos[i],data.videos[j]]=[data.videos[j],data.videos[i]]; renderVideos(); }

function renderCommunity(){
  if(!data.community) data.community = {wechatQR:"",qqQR:"",qqNumber:"",wechatTitle:"支持众筹",wechatDesc:"",qqTitle:"加入社群",qqDesc:""};
  const c = data.community;
  document.getElementById('ed-community').innerHTML = `
    <div class="edit-card">
      <div class="edit-header"><strong>💰 微信支持</strong></div>
      <div class="form-row"><label>标题</label><input value="${escAttr(c.wechatTitle)}" oninput="data.community.wechatTitle=this.value"></div>
      <div class="form-row"><label>描述</label><input value="${escAttr(c.wechatDesc)}" oninput="data.community.wechatDesc=this.value"></div>
      <div class="form-row"><label>收款码图片</label>
        <input type="file" accept="image/*" onchange="uploadCommunityImage(event,'wechatQR')">
        ${c.wechatQR?`<div class="thumb"><img src="${escAttr(c.wechatQR)}"><button onclick="data.community.wechatQR='';renderCommunity()">×</button></div>`:'<small>💡 上传微信收款码</small>'}
      </div>
    </div>
    <div class="edit-card">
      <div class="edit-header"><strong>💬 QQ 社群</strong></div>
      <div class="form-row"><label>标题</label><input value="${escAttr(c.qqTitle)}" oninput="data.community.qqTitle=this.value"></div>
      <div class="form-row"><label>描述</label><input value="${escAttr(c.qqDesc)}" oninput="data.community.qqDesc=this.value"></div>
      <div class="form-row"><label>群号</label><input value="${escAttr(c.qqNumber)}" oninput="data.community.qqNumber=this.value" placeholder="例如：123456789"></div>
      <div class="form-row"><label>群二维码图片</label>
        <input type="file" accept="image/*" onchange="uploadCommunityImage(event,'qqQR')">
        ${c.qqQR?`<div class="thumb"><img src="${escAttr(c.qqQR)}"><button onclick="data.community.qqQR='';renderCommunity()">×</button></div>`:'<small>💡 上传QQ群二维码</small>'}
      </div>
    </div>`;
}

function uploadCommunityImage(ev,field){
  const f = ev.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ()=>{
    if(!data.community) data.community = {};
    data.community[field] = r.result;
    renderCommunity();
  };
  r.readAsDataURL(f);
}


function saveAll(){
  data.hero.subtitle = document.getElementById('ed-hero-subtitle').value;
  data.hero.title = document.getElementById('ed-hero-title').value;
  data.hero.declaration = document.getElementById('ed-hero-declaration').value;
  data.story = document.getElementById('ed-story').value;
  saveData();
  alert('✓ 保存成功！修改已生效，可点"预览网页"查看效果。');
}

function exportData(){
  saveAll();
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'xinrui-backup-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(ev){
  const f = ev.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ()=>{
    try{
      const imported = JSON.parse(r.result);
      if(!imported.hero || !imported.characters) throw new Error('数据格式不对');
      data = imported;
      saveData(); renderAdmin();
      alert('✓ 导入成功！');
    }catch(e){ alert('文件格式错误：'+e.message); }
  };
  r.readAsText(f);
}
