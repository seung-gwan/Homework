(() => {
  'use strict';
  const app=document.getElementById('app');
  let active=false,scale=200,queued=false,point={x:innerWidth/2,y:innerHeight/2},pointerType='mouse';
  try { const stored=Number(localStorage.getItem('appletree:lensScale'));if([150,200,250,300,350,400].includes(stored))scale=stored; } catch {}
  const ui=document.createElement('aside');
  ui.className='view-tools';ui.setAttribute('aria-label','어디서나 사용하는 화면 돋보기');ui.dataset.viewUi='';
  ui.innerHTML='<div class="view-tools-head"><strong>화면 돋보기</strong><span>본문 위치는 그대로 유지됩니다</span></div><div class="view-tools-controls"><button data-view-action="toggle" aria-pressed="false">돋보기 켜기</button><button data-view-action="out" aria-label="돋보기 배율 줄이기">−</button><output aria-label="돋보기 배율">200%</output><button data-view-action="in" aria-label="돋보기 배율 높이기">+</button><button data-view-action="reset" aria-label="돋보기 끄고 배율 초기화">기본</button></div><p class="view-tools-hint">켜고 마우스를 움직이거나 화면을 짚어보세요.</p>';
  const lens=document.createElement('div');lens.className='screen-lens';lens.setAttribute('aria-hidden','true');lens.dataset.viewUi='';lens.innerHTML='<div class="lens-scene"></div><div class="lens-crosshair"></div><span class="lens-label">확대 보기</span>';
  const dialog=document.createElement('dialog');dialog.className='image-dialog';dialog.setAttribute('aria-label','안내 사진 크게 보기');dialog.dataset.viewUi='';
  document.body.append(ui,lens,dialog);
  const views=new Map();
  const storeScale=()=>{try{localStorage.setItem('appletree:lensScale',String(scale));}catch{}};
  function updateControls(){
    ui.querySelector('output').textContent=scale+'%';
    ui.querySelector('[data-view-action="toggle"]').textContent=active?'돋보기 끄기':'돋보기 켜기';
    ui.querySelector('[data-view-action="toggle"]').setAttribute('aria-pressed',String(active));
    ui.querySelector('[data-view-action="out"]').disabled=scale===150;
    ui.querySelector('[data-view-action="in"]').disabled=scale===400;
    ui.classList.toggle('is-active',active);
    ui.querySelector('.view-tools-hint').textContent=active?'마우스나 손가락으로 가리키세요. Esc 키로 끌 수 있어요.':'켜고 마우스를 움직이거나 화면을 짚어보세요.';
  }
  function refresh(){
    if(!active||queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;if(!active)return;
      const clone=app.cloneNode(true);
      clone.removeAttribute('id');clone.classList.add('lens-page');clone.setAttribute('inert','');clone.setAttribute('aria-hidden','true');
      clone.querySelectorAll('dialog,script,noscript').forEach(el=>el.remove());
      clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      clone.querySelectorAll('[data-photo-frame]').forEach(el=>el.removeAttribute('data-photo-frame'));
      const scene=lens.querySelector('.lens-scene');scene.style.width=document.documentElement.clientWidth+'px';scene.replaceChildren(clone);
      const originals=[...app.querySelectorAll('.photo-viewport')];
      clone.querySelectorAll('.photo-viewport').forEach((el,i)=>{if(originals[i]){el.scrollLeft=originals[i].scrollLeft;el.scrollTop=originals[i].scrollTop;}});
      position();
    });
  }
  function position(){
    if(!active)return;
    const width=lens.offsetWidth,height=lens.offsetHeight,gap=24,viewWidth=document.documentElement.clientWidth;
    const x=Math.max(0,Math.min(document.documentElement.clientWidth,point.x));
    const y=Math.max(0,Math.min(innerHeight,point.y));
    let left=x+gap,top=y+gap;
    if(left+width>viewWidth-8)left=x-width-gap;
    if(top+height>innerHeight-ui.offsetHeight-28)top=y-height-gap;
    if(pointerType==='touch'){left=(viewWidth-width)/2;top=y>height+35?12:innerHeight-ui.offsetHeight-height-28;}
    left=Math.max(8,Math.min(viewWidth-width-8,left));top=Math.max(8,Math.min(innerHeight-height-8,top));
    lens.style.left=left+'px';lens.style.top=top+'px';
    const factor=scale/100;
    lens.querySelector('.lens-scene').style.transform=`translate(${width/2-(scrollX+x)*factor}px,${height/2-(scrollY+y)*factor}px) scale(${factor})`;
    lens.querySelector('.lens-label').textContent=scale+'% 확대';
  }
  function start(){active=true;lens.classList.add('is-open');updateControls();refresh();}
  function stop(){active=false;lens.classList.remove('is-open');lens.querySelector('.lens-scene').replaceChildren();updateControls();}
  function toggle(){active?stop():start();}
  function changeScale(delta){scale=Math.max(150,Math.min(400,scale+delta));storeScale();if(!active)start();updateControls();position();}
  ui.addEventListener('click',event=>{
    const action=event.target.closest('[data-view-action]')?.dataset.viewAction;
    if(action==='toggle')toggle();
    if(action==='in')changeScale(50);
    if(action==='out')changeScale(-50);
    if(action==='reset'){scale=200;storeScale();stop();}
  });
  document.addEventListener('pointermove',event=>{
    if(!active||event.target.closest('[data-view-ui]'))return;
    pointerType=event.pointerType;point={x:event.clientX,y:event.clientY};position();
  },{passive:true});
  document.addEventListener('pointerdown',event=>{
    if(!active||event.target.closest('[data-view-ui]'))return;
    pointerType=event.pointerType;point={x:event.clientX,y:event.clientY};position();
  },{passive:true});
  // Touch users can inspect a link without accidentally following it while the lens is on.
  document.addEventListener('click',event=>{
    if(active&&pointerType==='touch'&&event.detail>0&&!event.target.closest('[data-view-ui],[data-photo-action]')){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  window.addEventListener('scroll',position,{passive:true});
  window.addEventListener('resize',()=>{refresh();position();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&active){stop();return;}
    if(active&&document.activeElement===ui.querySelector('[data-view-action="toggle"]')){
      const delta={ArrowLeft:[-30,0],ArrowRight:[30,0],ArrowUp:[0,-30],ArrowDown:[0,30]}[event.key];
      if(delta){event.preventDefault();point.x+=delta[0];point.y+=delta[1];position();}
    }
  });
  function photoKey(frame){return frame.dataset.photoKey+(frame.closest('dialog')?':large':':inline');}
  function savePhoto(frame){
    const viewport=frame.querySelector('.photo-viewport'),canvas=frame.querySelector('.photo-canvas');
    views.set(photoKey(frame),{scale:Number(frame.dataset.photoScale),x:(viewport.scrollLeft+viewport.clientWidth/2)/canvas.offsetWidth,y:(viewport.scrollTop+viewport.clientHeight/2)/canvas.offsetHeight});
  }
  function setPhotoScale(frame,next,reset=false){
    const viewport=frame.querySelector('.photo-viewport'),canvas=frame.querySelector('.photo-canvas');
    const oldWidth=canvas.offsetWidth,oldHeight=canvas.offsetHeight;
    const x=(viewport.scrollLeft+viewport.clientWidth/2)/oldWidth,y=(viewport.scrollTop+viewport.clientHeight/2)/oldHeight;
    next=Math.max(100,Math.min(400,next));
    frame.dataset.photoScale=String(next);canvas.style.width=next+'%';
    frame.querySelector('[data-photo-output]').textContent=next+'%';
    frame.querySelector('[data-photo-action="out"]').disabled=next===100;
    frame.querySelector('[data-photo-action="in"]').disabled=next===400;
    // The viewport has a fixed height. Only its scroll position changes, never the page's.
    viewport.scrollLeft=reset?0:x*canvas.offsetWidth-viewport.clientWidth/2;
    viewport.scrollTop=reset?0:y*canvas.offsetHeight-viewport.clientHeight/2;
    savePhoto(frame);refresh();
  }
  function initFrames(root){
    root.querySelectorAll('[data-photo-frame]').forEach(frame=>{
      if(frame.dataset.photoReady)return;frame.dataset.photoReady='true';
      const viewport=frame.querySelector('.photo-viewport');
      const prior=views.get(photoKey(frame));
      setPhotoScale(frame,prior?.scale||100,true);
      if(prior){const canvas=frame.querySelector('.photo-canvas');viewport.scrollLeft=prior.x*canvas.offsetWidth-viewport.clientWidth/2;viewport.scrollTop=prior.y*canvas.offsetHeight-viewport.clientHeight/2;}
      let drag=null,moved=false;
      viewport.addEventListener('pointerdown',event=>{
        if(event.pointerType!=='mouse'||event.button!==0||Number(frame.dataset.photoScale)===100)return;
        if(event.target.closest('button'))return;
        drag={x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};moved=false;
        viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-dragging');event.preventDefault();
      });
      viewport.addEventListener('pointermove',event=>{
        if(!drag)return;moved=true;viewport.scrollLeft=drag.left-(event.clientX-drag.x);viewport.scrollTop=drag.top-(event.clientY-drag.y);refresh();
      });
      const end=()=>{if(drag){drag=null;viewport.classList.remove('is-dragging');savePhoto(frame);}};
      viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
      viewport.addEventListener('click',event=>{if(moved){event.preventDefault();moved=false;}});
      viewport.addEventListener('scroll',()=>{savePhoto(frame);refresh();},{passive:true});
    });
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-photo-action],[data-photo-point]');if(!button)return;
    const frame=button.closest('[data-photo-frame]');if(!frame)return;
    if(button.dataset.photoPoint){frame.querySelector('.photo-feedback').textContent=button.dataset.photoPoint+'번: '+button.dataset.pointLabel+' 위치입니다. 실제 홈페이지에서 이 메뉴를 누르세요.';return;}
    const action=button.dataset.photoAction;
    if(action==='in')setPhotoScale(frame,Number(frame.dataset.photoScale)+50);
    if(action==='out')setPhotoScale(frame,Number(frame.dataset.photoScale)-50);
    if(action==='reset')setPhotoScale(frame,100,true);
    if(action==='close'){dialog.close();return;}
    if(action==='open'){
      stop();const copy=frame.cloneNode(true);delete copy.dataset.photoReady;
      const close=copy.querySelector('[data-photo-action="open"]');close.dataset.photoAction='close';close.textContent='크게 보기 닫기';
      dialog.replaceChildren(copy);dialog.showModal();initFrames(dialog);
    }
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  new MutationObserver(()=>{initFrames(app);refresh();}).observe(app,{childList:true,subtree:true,characterData:true});
  window.AppleTreeView={toggle,stop,changeScale,refresh};
  initFrames(app);updateControls();
})();
