(() => {
  'use strict';
  const app=document.getElementById('app');
  const shell=document.createElement('div');shell.className='zoom-shell';app.before(shell);shell.append(app);
  let active=false,lensScale=200,pageScale=100,baseWidth=document.documentElement.clientWidth,queued=false;
  let point={x:innerWidth/2,y:innerHeight/2},pointerType='mouse',drag=null;
  try{const l=Number(localStorage.getItem('appletree:lensScale')),p=Number(localStorage.getItem('appletree:pageScale'));if([150,200,250,300,350,400].includes(l))lensScale=l;if([100,125,150,175,200].includes(p))pageScale=p;}catch{}
  const ui=document.createElement('aside');ui.className='view-tools simple-view-tools';ui.dataset.viewUi='';ui.setAttribute('aria-label','화면 확대와 돋보기');
  ui.innerHTML='<div class="view-tool-row"><strong>화면 확대</strong><button data-view-action="page-out" aria-label="화면 축소">−</button><output data-page-output aria-label="화면 확대 비율">100%</output><button data-view-action="page-in" aria-label="화면 확대">+</button><button data-view-action="page-reset">기본</button></div><div class="view-tool-row"><strong>돋보기</strong><button data-view-action="toggle" aria-pressed="false">켜기</button><button data-view-action="lens-out" aria-label="돋보기 축소">−</button><output data-lens-output aria-label="돋보기 비율">200%</output><button data-view-action="lens-in" aria-label="돋보기 확대">+</button></div>';
  const lens=document.createElement('div');lens.className='screen-lens';lens.dataset.viewUi='';lens.setAttribute('aria-hidden','true');lens.innerHTML='<div class="lens-scene"></div><div class="lens-crosshair"></div>';
  document.body.append(ui,lens);
  const store=(key,value)=>{try{localStorage.setItem('appletree:'+key,String(value));}catch{}};
  function updateControls(){
    ui.querySelector('[data-page-output]').textContent=pageScale+'%';
    ui.querySelector('[data-lens-output]').textContent=lensScale+'%';
    ui.querySelector('[data-view-action="page-out"]').disabled=pageScale===100;
    ui.querySelector('[data-view-action="page-in"]').disabled=pageScale===200;
    ui.querySelector('[data-view-action="lens-out"]').disabled=lensScale===150;
    ui.querySelector('[data-view-action="lens-in"]').disabled=lensScale===400;
    const toggle=ui.querySelector('[data-view-action="toggle"]');toggle.textContent=active?'끄기':'켜기';toggle.setAttribute('aria-pressed',String(active));
  }
  function sizeShell(){
    const factor=pageScale/100;
    document.documentElement.dataset.pageEnlarged=String(pageScale>100);
    if(pageScale===100){app.style.cssText='';shell.style.width='';shell.style.height='';return;}
    app.style.width=baseWidth+'px';app.style.maxWidth='none';app.style.position='absolute';app.style.left='0';app.style.top='0';app.style.transformOrigin='0 0';app.style.transform='scale('+factor+')';
    shell.style.width=Math.ceil(baseWidth*factor)+'px';shell.style.height=Math.ceil(app.offsetHeight*factor)+'px';
  }
  function setPageScale(next,preserve=true){
    next=Math.max(100,Math.min(200,next));
    const x=document.documentElement.clientWidth/2,y=innerHeight/2;
    const logicalX=(scrollX+x)/ (pageScale/100),logicalY=(scrollY+y-shell.offsetTop)/(pageScale/100);
    if(pageScale===100)baseWidth=document.documentElement.clientWidth;
    pageScale=next;store('pageScale',pageScale);sizeShell();updateControls();
    if(preserve)window.scrollTo({left:logicalX*(pageScale/100)-x,top:shell.offsetTop+logicalY*(pageScale/100)-y,behavior:'instant'});
    refresh();
  }
  function position(){
    if(!active)return;
    const w=lens.offsetWidth,h=lens.offsetHeight,vw=document.documentElement.clientWidth,gap=22;
    const x=Math.max(0,Math.min(vw,point.x)),y=Math.max(0,Math.min(innerHeight,point.y));
    let left=x+gap,top=y+gap;
    if(left+w>vw-8)left=x-w-gap;
    if(top+h>innerHeight-ui.offsetHeight-24)top=y-h-gap;
    if(pointerType==='touch'){left=(vw-w)/2;top=y>h+35?12:innerHeight-ui.offsetHeight-h-26;}
    left=Math.max(8,Math.min(vw-w-8,left));top=Math.max(8,Math.min(innerHeight-h-8,top));
    lens.style.left=left+'px';lens.style.top=top+'px';
    const l=lensScale/100,p=pageScale/100;
    lens.querySelector('.lens-scene').style.transform='translate('+(w/2-(scrollX+x)*l)+'px,'+(h/2-(scrollY+y-shell.offsetTop)*l)+'px) scale('+(l*p)+')';
  }
  function refresh(){
    sizeShell();if(!active||queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;if(!active)return;
      const copy=app.cloneNode(true);copy.removeAttribute('id');copy.removeAttribute('style');copy.classList.add('lens-page');copy.setAttribute('inert','');copy.setAttribute('aria-hidden','true');copy.style.width=baseWidth+'px';
      copy.querySelectorAll('dialog,script,noscript').forEach(e=>e.remove());copy.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
      const scene=lens.querySelector('.lens-scene');scene.style.width=baseWidth+'px';scene.replaceChildren(copy);position();
    });
  }
  function stop(){active=false;lens.classList.remove('is-open');lens.querySelector('.lens-scene').replaceChildren();updateControls();}
  function start(){active=true;lens.classList.add('is-open');updateControls();refresh();}
  function toggle(){active?stop():start();}
  function changeScale(delta){lensScale=Math.max(150,Math.min(400,lensScale+delta));store('lensScale',lensScale);if(!active)start();updateControls();position();}
  ui.addEventListener('click',event=>{
    const action=event.target.closest('[data-view-action]')?.dataset.viewAction;
    if(action==='page-in')setPageScale(pageScale+25);
    if(action==='page-out')setPageScale(pageScale-25);
    if(action==='page-reset')setPageScale(100);
    if(action==='toggle')toggle();
    if(action==='lens-in')changeScale(50);
    if(action==='lens-out')changeScale(-50);
  });
  document.addEventListener('pointerdown',event=>{
    if(event.target.closest('[data-view-ui]'))return;
    pointerType=event.pointerType;point={x:event.clientX,y:event.clientY};position();
    if(pageScale>100&&event.pointerType==='mouse'&&event.button===0&&event.target.closest('.photo-canvas')&&!event.target.closest('button,a')){
      drag={x:event.clientX,y:event.clientY,left:scrollX,top:scrollY};app.setPointerCapture(event.pointerId);event.preventDefault();
    }
  });
  document.addEventListener('pointermove',event=>{
    if(drag)window.scrollTo({left:drag.left-(event.clientX-drag.x),top:drag.top-(event.clientY-drag.y),behavior:'instant'});
    if(!active||event.target.closest('[data-view-ui]'))return;pointerType=event.pointerType;point={x:event.clientX,y:event.clientY};position();
  },{passive:true});
  document.addEventListener('pointerup',()=>{drag=null;});document.addEventListener('pointercancel',()=>{drag=null;});
  document.addEventListener('click',event=>{
    if(active&&pointerType==='touch'&&event.detail>0&&!event.target.closest('[data-view-ui]')){event.preventDefault();event.stopImmediatePropagation();return;}
    const target=event.target.closest('.photo-target');
    if(target){target.closest('.photo-frame').querySelectorAll('.photo-target').forEach(e=>e.classList.toggle('is-selected',e===target));}
  },true);
  window.addEventListener('scroll',position,{passive:true});
  window.addEventListener('resize',()=>{baseWidth=document.documentElement.clientWidth;sizeShell();refresh();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')stop();});
  new MutationObserver(refresh).observe(app,{childList:true,subtree:true,characterData:true});
  new ResizeObserver(()=>{sizeShell();if(active)refresh();}).observe(app);
  window.AppleTreeView={toggle,stop,changeScale,refresh,changePageScale:delta=>setPageScale(pageScale+delta)};
  setPageScale(pageScale,false);updateControls();
})();
