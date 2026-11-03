(() => {
  'use strict';
  const D = window.APPLE_TREE;
  const app = document.getElementById('app');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem('appletree:' + key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem('appletree:' + key, JSON.stringify(value)); } catch { announce('설정을 저장할 수 없지만 이번 화면에서는 사용할 수 있어요.'); } };
  const safeIds = value => Array.isArray(value) ? value.filter(id => D.guides.some(g => g.id === id)) : [];
  let zoom = 100;
  let contrast = read('contrast',false) === true;
  let regionId = String(read('region',''));
  let saved = safeIds(read('saved',[]));
  let completed = safeIds(read('completed',[]));
  let progress = read('progress',{});
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) progress = {};
  let category = 'all', query = '', speaking = false, finish = false, photoRegion = 'all';
  const paths = {
    arrow:'M5 12h14m-5-5 5 5-5 5', back:'M19 12H5m5-5-5 5 5 5', up:'m6 14 6-6 6 6',
    building:'M4 21V8l8-5 8 5v13M2 21h20M9 21v-5h6v5M8 9h1m6 0h1M8 12h1m6 0h1',
    heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    medical:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z',
    flower:'M12 8c-6-9-12 0-5 4-7 4-1 13 5 4 6 9 12 0 5-4 7-4 1-13-5-4Zm0 8v6m0-2c-6 0-7-3-7-3m7 3c6 0 7-3 7-3',
    bag:'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 7h18v14H3ZM3 12c6 4 12 4 18 0M10 13h4v3h-4Z',
    mouse:'M9 2h6a4 4 0 0 1 4 4v10a7 7 0 0 1-14 0V6a4 4 0 0 1 4-4Zm3 0v7M5 9h14',
    grid:'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
    document:'M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h8',
    bookmark:'M5 3h14v19l-7-5-7 5Z', clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    check:'m5 12 4 4L19 6', circleCheck:'m7 12 3 3 7-7M22 12a10 10 0 1 1-10-10',
    help:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    volume:'M11 4 6 8H2v8h4l5 4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
    contrast:'M12 2v20a10 10 0 0 0 0-20ZM22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    type:'M3 4h18M12 4v17M8 21h8', lock:'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4Zm8 5v3',
    light:'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z',
    close:'m6 6 12 12M6 18 18 6', external:'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
    print:'M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v8H6Zm11-2h.1', leaf:'M20 3C10 1 2 7 5 15c8 4 17-2 15-12ZM3 21 15 9'
  };
  const icon = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.leaf}"/></svg>`;
  const region = () => D.regions.find(r => r.id === regionId);
  const announce = msg => { const el = document.getElementById('announcement'); if (el) { el.textContent=''; requestAnimationFrame(()=>{el.textContent=msg;}); } };
  const link = (url, text, classes='text-link') => `<a class="${classes}" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(text)} (새 창)">${text}${icon('external')}</a>`;
  const brand = () => '<a class="brand" href="index.html" aria-label="사과나무 처음 화면"><img src="assets/favicon.svg" alt="" width="45" height="45"><span><span class="brand-name">사과나무</span><span class="brand-sub">쉬운 디지털 생활 안내</span></span></a>';
  function route() {
    const p = new URLSearchParams(location.search);
    return {guide:D.guides.find(g=>g.id===p.get('guide')),view:p.get('view')==='saved'?'saved':'all'};
  }
  function navigate(values, hash='') {
    stopSpeech(); finish=false;
    const url = new URL('index.html',location.href);
    Object.entries(values).forEach(([k,v])=>{if(v) url.searchParams.set(k,v);});
    url.hash=hash; history.pushState({},'',url); render();
    if (hash) document.getElementById(hash)?.scrollIntoView();
    else {window.scrollTo({top:0,behavior:'instant'});document.getElementById('main')?.focus({preventScroll:true});}
  }
  function applyPreferences() {
    // The reading layout stays fixed. Magnification happens in a separate lens or photo viewport.
    document.documentElement.style.fontSize='20px';
    document.documentElement.dataset.contrast=String(contrast);
    delete document.documentElement.dataset.large;
    document.querySelectorAll('[data-action="contrast"]').forEach(el=>el.setAttribute('aria-pressed',String(contrast)));
    window.AppleTreeView?.refresh();
  }
  function zoomControls() {
    return '<button class="button secondary" data-action="magnify">'+icon('search')+'돋보기 켜기</button>';
  }
  function header() {
    const r=route();
    return `<div class="access-bar"><div class="container access-inner"><span>실제 화면으로 배우는 웹사이트 이용안내</span><div class="access-controls"><button data-action="contrast" aria-pressed="${contrast}">${icon('contrast')}또렷한 화면</button><button data-action="help">${icon('help')}사용 도움말</button></div></div></div>
    <header class="header"><div class="container header-inner">${brand()}<p class="header-description">복지관 · 보건소 · 일자리<br><strong>인터넷 사용 방법을 알려드립니다.</strong></p><button class="button secondary" data-action="magnify">${icon('search')}돋보기 사용</button></div><div class="nav-bar"><nav class="container main-nav" aria-label="주 메뉴"><a href="index.html#learn" data-nav="learn" class="${!r.guide&&r.view==='all'?'active':''}">사진으로 배우기</a><a href="index.html#local" data-nav="local">지역 홈페이지 찾기</a><a href="index.html?view=saved" data-nav="saved" class="${r.view==='saved'?'active':''}">저장한 안내<span data-save-count>${saved.length?' ('+saved.length+')':''}</span></a><a href="index.html?guide=basics">인터넷 기초</a></nav></div></header>`;
  }
  function footer() {
    return `<footer class="footer"><div class="container footer-top">${brand()}<p>안내 사진의 표시와 설명을 보며 실제 사이트를 이용해 보세요.<br>사진과 현재 홈페이지의 화면은 다를 수 있습니다.</p><button class="back-top" data-action="top">맨 위로${icon('up')}</button></div><div class="container footer-bottom"><span>사과나무 · 웹사이트 이용안내</span><button data-action="sources">안내 출처·이용 안내</button><button data-action="help">도움말</button></div></footer>`;
  }
  function home() {
    const isSaved=route().view==='saved';
    const latestId=read('lastGuide','');
    const latest=D.guides.find(g=>g.id===latestId&&!completed.includes(g.id)&&Number.isInteger(progress[g.id]));
    const param=new URLSearchParams(location.search).get('category');
    if(param&&D.categories.some(c=>c.id===param))category=param;
    return `<main id="main" tabindex="-1">
    ${!isSaved?`<section class="container hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="hero-label">사과나무 이용안내</p><h1 id="hero-title">어디를 눌러야 할지,<br>사진으로 확인하세요.</h1><p>복지관 이용, 보건소 찾기, 일자리 검색.<br>실제 홈페이지 사진에 누를 곳을 표시했습니다.</p><div class="hero-actions"><a class="button" href="#learn">안내 사진 찾기${icon('arrow')}</a><a class="text-link" href="index.html?guide=basics">인터넷이 처음이라면${icon('arrow')}</a></div><p class="hero-footnote">글씨가 작을 때는 오른쪽 아래 돋보기를 사용하세요.</p></div><a class="hero-photo" href="index.html?guide=seoul-welfare"><div class="hero-photo-label">이런 화면을 보며 따라 해요</div><img src="assets/screens/kGhXsGfd.png" width="1280" height="720" alt="서울노인복지센터 실제 홈페이지. 노인복지 메뉴에 빨간 원이 표시되어 있습니다."><span>서울노인복지센터 이용안내 보기${icon('arrow')}</span></a></section>
    <div class="container service-menu" aria-label="자주 찾는 안내">${D.categories.filter(c=>c.id!=='all').map(c=>`<button data-category="${c.id}" data-jump-learn>${icon(c.icon)}<strong>${c.name}</strong>${icon('arrow')}</button>`).join('')}</div>`:''}
    <section id="learn" class="container learn-section" aria-labelledby="learn-title"><div class="section-top"><div><h2 id="learn-title">${isSaved?'저장한 안내':'필요한 이용 방법을 찾아보세요'}</h2><p>${isSaved?'책갈피로 저장한 안내를 다시 볼 수 있습니다.':'지역과 이용하려는 내용을 고른 뒤 사진을 열어보세요.'}</p></div><span class="photo-count">실제 안내 사진 <strong>30장</strong></span></div>
    ${latest&&!isSaved?`<div class="continue-banner"><span><strong>이어서 보기</strong> · ${latest.title}</span><a class="text-link" href="index.html?guide=${latest.id}">${Math.min(progress[latest.id]+1,latest.steps.length)}단계부터${icon('arrow')}</a></div>`:''}
    <form class="search-form" id="guide-search" role="search"><label class="sr-only" for="search-input">배우고 싶은 내용 검색</label><input id="search-input" type="search" maxlength="100" value="${escape(query)}" placeholder="지역, 기관 이름 또는 이용 방법을 입력하세요"><button class="button" type="submit">${icon('search')}검색</button></form>
    <div class="region-tabs" aria-label="사진 안내 지역"><span>사진 안내 지역</span>${[['all','전체'],['seoul','서울'],['busan','부산'],['daegu','대구'],['gjcity','경기 광주']].map(([id,name])=>`<button data-photo-region="${id}" aria-pressed="${photoRegion===id}">${name}</button>`).join('')}</div>
    <div class="category-list" aria-label="안내 주제">${D.categories.map(c=>`<button class="category-button" data-category="${c.id}" aria-pressed="${category===c.id}">${c.name}</button>`).join('')}</div>
    <div class="result-line"><span id="result-count" role="status" aria-live="polite"></span><span>사진을 누르면 단계별 설명이 나옵니다.</span></div><div id="guide-grid" class="guide-grid"></div></section>
    ${!isSaved?`<section id="local" class="container local-section"><div>${icon('building')}<h2>다른 지역의 홈페이지도 찾을 수 있어요</h2><p>사진 안내는 서울·부산·대구·경기 광주를 제공합니다.<br>다른 지역은 공식 홈페이지에서 이용 정보를 찾아보세요.</p></div><div class="local-actions"><button class="button" data-action="region">${icon('pin')}${region()?escape(region().name):'지역 선택'}</button>${link(region()?.url||'https://www.gov.kr/portal/orgSite',region()?'지역 홈페이지 열기':'공식 홈페이지 찾기','button secondary')}</div></section><section class="container first-section"><div class="section-top"><h2>자주 묻는 질문</h2><button class="text-link" data-action="help">사용 도움말${icon('arrow')}</button></div><div class="faq-list">${faqs()}</div></section>`:''}
    </main>`;
  }
  function faqs() {
    return '<details><summary>확대하면 보던 위치가 바뀌나요?</summary><p>돋보기는 페이지 위에 확대된 부분만 보여줍니다. 글자 크기와 본문 배치를 바꾸지 않아요. 사진 확대도 사진 안에서만 이루어집니다.</p></details><details><summary>사진 안의 번호는 무엇인가요?</summary><p>실제 홈페이지에서 눌러야 할 위치입니다. 번호 표시를 누르면 메뉴 이름을 확인할 수 있어요. 실제 서비스 이용은 공식 홈페이지를 열어 진행하세요.</p></details><details><summary>사진을 더 크게 보고 싶어요.</summary><p>사진 위의 + 버튼이나 크게 열기를 누르세요. 커진 사진은 마우스로 끌거나 손가락으로 밀어 움직일 수 있어요.</p></details><details><summary>사진과 실제 홈페이지가 달라요.</summary><p>기존에 올려주신 사진을 기준으로 설명합니다. 홈페이지가 개편되면 메뉴 이름과 위치가 달라질 수 있어요. 현재 홈페이지의 비슷한 이름의 메뉴를 찾아보세요.</p></details>';
  }
  function renderCards() {
    const grid=document.getElementById('guide-grid');if(!grid)return;
    const isSaved=route().view==='saved';
    const words=query.trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
    const guides=D.guides.filter(g=>(category==='all'||g.category===category)&&(!isSaved||saved.includes(g.id))&&(photoRegion==='all'||!g.photo||g.region===photoRegion||g.region==='national')&&words.every(w=>(g.title+' '+g.description+' '+g.keywords).toLocaleLowerCase('ko').includes(w)));
    document.getElementById('result-count').innerHTML='안내 <strong>'+guides.length+'개</strong>';
    grid.innerHTML=guides.length?guides.map(g=>`<article class="guide-card ${g.photo?'photo-card':'text-card'}"><a class="card-main" href="index.html?guide=${g.id}">${g.photo?`<img class="card-thumbnail" src="${g.steps[0].image}" width="320" height="180" loading="lazy" alt="${escape(g.site)} 안내 사진">`:`<span class="card-icon">${icon(g.icon)}</span>`}<div><span class="card-site">${g.photo?(g.region==='national'?'전국':D.regions.find(r=>r.id===g.region)?.short)+' · '+g.site:'기초 이용안내'}</span><h3>${g.title}</h3><p>${g.photo?'사진 '+g.steps.length+'장으로 따라보기':g.description}</p></div></a><div class="card-footer"><span class="card-meta">${completed.includes(g.id)?'✓ 배운 안내':g.photo?'실제 화면 안내':'글과 연습으로 배우기'}</span><a class="card-start" href="index.html?guide=${g.id}" aria-label="${g.title} 보기">안내 보기${icon('arrow')}</a><button class="bookmark" data-save="${g.id}" aria-pressed="${saved.includes(g.id)}" aria-label="${g.title} ${saved.includes(g.id)?'저장 취소':'저장'}">${icon('bookmark')}</button></div></article>`).join(''):'<div class="empty-state"><h3>해당하는 안내가 없습니다.</h3><p>검색어 또는 지역을 바꾸거나 전체 안내를 확인해 주세요.</p><button class="button secondary" data-action="show-all">전체 안내 보기</button></div>';
    document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
    document.querySelectorAll('[data-photo-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.photoRegion===photoRegion)));
    window.AppleTreeView?.refresh();
  }
  function stepIndex(g) {const n=progress[g.id];return Number.isInteger(n)?Math.max(0,Math.min(g.steps.length-1,n)):0;}
  function lesson(g) {
    document.title=g.title+' | 사과나무';
    const n=stepIndex(g);
    return `<main id="main" class="container lesson-container" tabindex="-1"><div class="breadcrumb"><a href="index.html#learn">안내 목록</a>${icon('arrow')}<span>${D.categories.find(c=>c.id===g.category).name}</span></div><header class="lesson-heading"><span class="pill">${g.level}</span><h1>${g.title}</h1><p>${g.description}</p><div class="lesson-meta"><span>${icon('clock')}약 ${g.minutes}분</span><span>${g.steps.length}단계 안내</span><span>${completed.includes(g.id)?'✓ 학습 완료':'내 속도대로 천천히'}</span></div></header><div class="lesson-tools"><button class="button secondary small" data-action="speak" aria-pressed="false">${icon('volume')}읽어주기</button><button class="button secondary small" data-save="${g.id}" aria-pressed="${saved.includes(g.id)}">${icon('bookmark')}${saved.includes(g.id)?'저장했어요':'안내 저장'}</button><button class="button secondary small" data-action="print">${icon('print')}전체 안내 인쇄</button><button class="button secondary small" data-action="region">${icon('pin')}${region()?escape(region().short):'내 지역 선택'}</button></div>${g.photo?'<aside class="photo-notice">올려주신 안내 사진을 기준으로 설명합니다. 현재 홈페이지의 화면은 달라질 수 있습니다.</aside>':'<div class="prepare">'+icon('light')+'<div><strong>시작 전에 준비해요</strong><p>'+g.prepare+'</p></div></div>'}<div class="lesson-layout"><aside class="lesson-sidebar" aria-label="학습 순서"><h2>이렇게 따라가요</h2><ol class="step-list">${g.steps.map((s,i)=>`<li><button data-step="${i}" ${i===n&&!finish?'aria-current="step"':''}><span class="step-number">${i+1}</span><span>${s.title}</span></button></li>`).join('')}</ol><div class="progress-wrap"><label for="lesson-progress">${finish?'학습 완료':`${n+1} / ${g.steps.length}단계`}</label><progress id="lesson-progress" max="${g.steps.length}" value="${finish?g.steps.length:n}">${n}단계</progress></div></aside><div><section class="step-panel" id="step-panel" tabindex="-1">${finish?completion(g):stepContent(g,n)}</section><div class="lesson-bottom">${g.url?link(['center','health','programs'].includes(g.id)?region()?.url||g.url:g.url,['center','health','programs'].includes(g.id)&&region()?'지역 누리집 열기':'공식 사이트 열기','button secondary official-link'):''}<p>외부 사이트는 새 창으로 열려요. 이 안내로 돌아와 계속 배울 수 있어요.<br>안내 사진은 올려주신 원본 캡처입니다. 실제 사이트의 현재 화면은 달라질 수 있어요.</p>${sources(g)}</div></div></div><div class="print-all">${g.steps.map((s,i)=>`<section class="print-step"><h2>${i+1}. ${s.title}</h2>${s.image?'<img src="'+s.image+'" alt="'+escape(s.title)+'">':''}<p>${s.body}</p><p class="tip">기억해 주세요: ${s.tip}</p></section>`).join('')}<h2>참고 자료</h2>${g.sources.map(([name,url])=>`<p>${name}: <a href="${url}">${url}</a></p>`).join('')}<p>사과나무 · 2026년 11월 3일 안내 작성 · 실제 화면과 메뉴는 변경될 수 있어요.</p></div></main>`;
  }
  function sources(g) {
    return `<details class="lesson-sources"><summary>참고 자료와 안내 기준</summary>${g.sources.length?`<ul>${g.sources.map(([name,url])=>`<li>${link(url,name)}</li>`).join('')}</ul>`:'<p>사과나무에서 제작한 기초 사용법과 연습 화면이에요.</p>'}<p>안내 작성: 2026년 11월 3일. 메뉴 이름과 화면은 변경될 수 있어요.${g.id==='jobs'?' 일자리 사이트의 최신 화면은 직접 확인하지 못했어요. 모집 기관의 현재 안내를 확인해 주세요.':''}</p></details>`;
  }
  function photoMarkup(s) {
    return `<figure class="photo-frame" data-photo-frame data-photo-key="${s.imageId}" data-photo-scale="100"><div class="photo-tools"><strong>안내 사진</strong><div class="photo-controls"><button data-photo-action="out" aria-label="사진 축소">−</button><output data-photo-output aria-label="사진 확대 비율">100%</output><button data-photo-action="in" aria-label="사진 확대">+</button><button data-photo-action="reset">맞춰보기</button><button data-photo-action="open">크게 열기${icon('external')}</button></div></div><div class="photo-viewport" tabindex="0" role="region" aria-label="안내 사진. 확대 후 마우스로 끌거나 손가락으로 밀어 이동할 수 있습니다."><div class="photo-canvas"><img src="${s.image}" width="1280" height="720" draggable="false" alt="${escape(s.title)}. ${escape(s.body)}">${s.points.map((p,i)=>`<button class="photo-target" data-photo-point="${i+1}" data-point-label="${escape(p.label)}" style="left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%" aria-label="${i+1}번: ${escape(p.label)} 위치 확인"><span>${i+1}</span></button>`).join('')}</div></div><figcaption><span>${s.points.length?'번호 표시를 누르면 메뉴 이름을 확인할 수 있습니다.':'사진 안의 위치와 안내 내용을 살펴보세요.'}</span><span>확대 후 끌어서 이동</span></figcaption><p class="photo-feedback" role="status" aria-live="polite"></p></figure>`;
  }
  function stepContent(g,n) {
    const s=g.steps[n];
    return `<div class="step-kicker">${n+1} / ${g.steps.length}단계</div><h2>${s.title}</h2><p class="step-body">${s.body}</p>${s.image?photoMarkup(s):mock(s)}${!s.image?'<div class="tip">'+icon('light')+'<span>'+s.tip+'</span></div>':''}<div class="step-actions"><button class="button secondary" data-step="${n-1}" ${n===0?'disabled':''}>${icon('back')}이전 단계</button><button class="button" ${n===g.steps.length-1?'data-action="finish"':'data-step="'+(n+1)+'"'}>${n===g.steps.length-1?'학습 마치기':g.photo?'다음 사진':'다음 단계'}${icon(n===g.steps.length-1?'check':'arrow')}</button></div>`;
  }
  function mock(s) {
    let inner='';
    if(s.mock==='search') inner=`<p><label for="practice-input">검색어를 입력하고 검색해 보세요.</label></p><form id="practice-search" class="mock-input-row"><input id="practice-input" type="search" maxlength="60" placeholder="${escape(s.query)}" autocomplete="off" required><button class="button small" type="submit">${icon('search')}검색</button></form><p class="mock-hint">예: ${s.query} · 이름, 주민등록번호 등 개인정보는 입력하지 마세요.</p>`;
    else if(s.mock==='region')inner=`<p>지역을 고른 다음 공식 누리집을 열어보세요.</p><div class="local-actions"><button class="button small" data-action="region">${icon('pin')}${region()?escape(region().name):'내 지역 선택'}</button>${link(region()?.url||'https://www.gov.kr/portal/orgSite',region()?'지역 누리집 열기':'공식 누리집 찾기','button secondary small')}</div>`;
    else if(s.mock==='address')inner=`<div class="mock-address">${icon('lock')}<strong>${escape(s.label)}</strong>${icon('check')}</div><p class="mock-hint">인터넷 창 위쪽의 주소를 확인하는 연습이에요.</p>`;
    else if(s.mock==='zoom')inner=`<p>이 버튼으로도 화면 크기를 바꿀 수 있어요.</p>${zoomControls()}`;
    else if(s.mock==='scroll')inner='<div class="mock-scroll" tabindex="0" aria-label="위아래로 움직이기 연습"><p>마우스 바퀴를 돌리거나 손가락으로 밀어보세요.</p><p>천천히 아래로 내려가요.</p><p>주민센터 이용법도 차근차근 배워요.</p><p>복지정보도 스스로 찾아볼 수 있어요.</p><p>끝까지 잘 내려오셨어요!</p></div>';
    else inner=`<button class="mock-link" data-action="practice">${icon(s.mock==='check'?'check':s.mock==='click'?'mouse':'document')}<span>${escape(s.label)}</span>${icon('arrow')}</button>`;
    return `<div class="mock"><div class="mock-chrome"><i></i><i></i><i></i><span>따라 해 보는 화면 · 실제 신청은 이루어지지 않아요</span></div><div class="mock-content">${inner}<div class="practice-feedback" id="practice-feedback" role="status" aria-live="polite"></div></div></div>`;
  }
  function completion(g) {
    return `<div class="completion">${icon('circleCheck')}<div class="eyebrow" style="justify-content:center">학습 완료</div><h2>안내를 모두 확인했습니다.</h2><p>‘${g.title}’ 안내를 끝까지 살펴보셨어요.<br>필요할 때 언제든 다시 연습해 보세요.</p><div class="hero-actions"><a class="button" href="index.html#learn">다른 안내 배우기${icon('arrow')}</a><button class="button secondary" data-action="restart">다시 연습하기</button></div></div>`;
  }
  function dialogs() {
    return `<dialog id="region-dialog" aria-labelledby="region-title"><div class="dialog-head"><div><h2 id="region-title">살고 있는 지역을 골라주세요.</h2><p>공식 지역 홈페이지를 연결해 드려요.</p></div><button class="icon-button" data-close aria-label="지역 선택 닫기">${icon('close')}</button></div><div class="region-grid">${D.regions.map(r=>`<button class="region-option" data-region="${r.id}" aria-pressed="${r.id===regionId}">${r.name}</button>`).join('')}</div><p class="dialog-note">지역 선택은 이 브라우저에만 기억돼요. 기존 사이트의 ‘광주’ 안내는 경기도 광주시였으므로 별도로 표시했어요.</p></dialog>
    <dialog id="help-dialog" aria-labelledby="help-title"><div class="dialog-head"><div><h2 id="help-title">무엇이 어려우세요?</h2><p>천천히 함께 살펴봐요.</p></div><button class="icon-button" data-close aria-label="도움말 닫기">${icon('close')}</button></div><div class="help-content"><ol><li>오른쪽 아래 돋보기를 켜면 가리킨 부분만 확대됩니다.</li><li>‘이용 방법 배우기’에서 필요한 안내를 눌러요.</li><li>사진의 번호 표시와 설명을 확인하고 다음 사진을 보세요.</li><li>공식 사이트가 열리면 새 창에서 실제 이용을 진행해요.</li></ol><div class="faq-list">${faqs()}</div><h3>읽어주기 소리가 나지 않아요.</h3><p>기기 음량을 확인해 주세요. 브라우저와 기기에 따라 한국어 음성 지원이 다를 수 있어요.</p><h3>방문이나 신청에 도움이 필요해요.</h3><p>신청할 기관의 공식 홈페이지에서 담당 연락처를 확인해 주세요. 주민센터를 방문하기 전에 필요한 준비물을 물어보면 좋아요.</p></div></dialog>
    <dialog id="sources-dialog" class="sources-dialog" aria-labelledby="sources-title"><div class="dialog-head"><div><h2 id="sources-title">참고 자료·이용 안내</h2><p>공식 안내를 바탕으로 쉽게 풀어 썼어요.</p></div><button class="icon-button" data-close aria-label="참고 자료 닫기">${icon('close')}</button></div><ul><li>${link('https://www.gov.kr/','정부24')} · 민원 검색과 신청 안내</li><li>${link('https://www.gov.kr/portal/orgSite','정부/지자체 누리집')} · 지역 공식 홈페이지 찾기</li><li>${link('https://www.bokjiro.go.kr/ssis-tbu/cms/pc/intro/intro/info/01/index.html','복지로 서비스 소개')} · 복지정보 검색과 신청 안내</li><li>${link('https://www.sdm.go.kr/dong/sc/index.do','신촌동 주민센터')} · 주민센터 메뉴 구성 예시</li></ul><div class="help-content"><p>2026년 11월 3일에 안내를 작성했어요. 외부 사이트 화면과 신청 조건은 변경될 수 있으니 실제 이용할 때 공식 안내를 확인하세요.</p><h3>이 브라우저에 기억하는 정보</h3><p>돋보기 배율, 화면 대비, 고른 지역, 저장한 안내와 학습 위치만 이 브라우저에 저장해요. 이 사이트는 회원가입과 실제 민원·복지 신청을 받지 않아요. 읽어주기는 브라우저·운영체제의 음성 기능을 이용하며 외부 글꼴을 불러올 수 있어요.</p></div></dialog>`;
  }
  function render() {
    stopSpeech();document.title='사과나무 | 쉬운 디지털 생활 안내';
    const g=route().guide;
    app.innerHTML=header()+(g?lesson(g):home())+footer()+dialogs();
    document.body.classList.toggle('photo-lesson',!!g?.photo);
    applyPreferences();if(!g)renderCards();
  }
  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speaking=false;
    document.getElementById('speech-status')?.remove();
    document.querySelectorAll('[data-action="speak"]').forEach(b=>{b.innerHTML=icon('volume')+'읽어주기';b.setAttribute('aria-pressed','false');});
  }
  function speak() {
    if(speaking){stopSpeech();return;}
    const showSpeechMessage = message => {
      let el=document.getElementById('speech-status');
      if(!el){el=document.createElement('p');el.id='speech-status';el.className='speech-status';el.setAttribute('role','status');document.querySelector('.lesson-tools')?.insertAdjacentElement('afterend',el);}
      el.textContent=message;
    };
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){showSpeechMessage('이 브라우저는 읽어주기를 지원하지 않아요. 다른 브라우저에서 이용해 주세요.');return;}
    const g=route().guide;if(!g)return;
    const s=g.steps[stepIndex(g)];
    const speech=new SpeechSynthesisUtterance(finish?'잘 따라오셨어요. 학습을 마쳤어요.':`${s.title}. ${s.body}. 기억해 주세요. ${s.tip}`);
    speech.lang='ko-KR';speech.rate=.85;
    const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('ko'));if(voice)speech.voice=voice;
    speech.onend=stopSpeech;speech.onerror=()=>{stopSpeech();showSpeechMessage('읽어주기를 재생할 수 없어요. 기기의 음량과 한국어 음성 설정을 확인해 주세요.');};
    showSpeechMessage('현재 단계를 읽고 있어요. 멈추려면 ‘읽기 멈추기’를 누르세요.');
    speaking=true;const b=document.querySelector('[data-action="speak"]');b.innerHTML=icon('volume')+'읽기 멈추기';b.setAttribute('aria-pressed','true');window.speechSynthesis.speak(speech);
  }
  function updateStep(n) {
    const g=route().guide;if(!g||n<0||n>=g.steps.length)return;
    progress[g.id]=n;write('progress',progress);write('lastGuide',g.id);finish=false;render();
    const panel=document.getElementById('step-panel');panel?.focus({preventScroll:true});panel?.scrollIntoView({block:'start',behavior:'instant'});
  }
  app.addEventListener('click',event=>{
    const target=event.target.closest('button,a');if(!target)return;
    if(target.hasAttribute('data-close')){target.closest('dialog').close();return;}
    if(target.dataset.nav){event.preventDefault();category='all';query='';if(target.dataset.nav==='saved')navigate({view:'saved'});else navigate({},target.dataset.nav==='local'?'local':'learn');return;}
    if(target.dataset.category){category=target.dataset.category;renderCards();if(target.hasAttribute('data-jump-learn'))document.getElementById('learn')?.scrollIntoView();return;}
    if(target.dataset.photoRegion){photoRegion=target.dataset.photoRegion;renderCards();return;}
    if(target.dataset.save){
      const id=target.dataset.save;const added=!saved.includes(id);saved=added?[...saved,id]:saved.filter(s=>s!==id);write('saved',saved);
      if(route().view==='saved'){renderCards();document.getElementById('learn-title')?.setAttribute('tabindex','-1');document.getElementById('learn-title')?.focus({preventScroll:true});}
      else document.querySelectorAll(`[data-save="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',String(added));const g=D.guides.find(g=>g.id===id);b.setAttribute('aria-label',g.title+(added?' 저장 취소':' 저장'));if(!b.classList.contains('bookmark'))b.innerHTML=icon('bookmark')+(added?'저장했어요':'안내 저장');});
      document.querySelectorAll('[data-save-count]').forEach(el=>el.textContent=saved.length?` (${saved.length})`:'');announce(added?'안내를 저장했어요.':'안내 저장을 취소했어요.');return;
    }
    if(target.dataset.step!==undefined){updateStep(Number(target.dataset.step));return;}
    if(target.dataset.region){regionId=target.dataset.region;write('region',regionId);document.getElementById('region-dialog').close();render();document.querySelector('[data-action="region"]')?.focus({preventScroll:true});announce(region().name+'을 선택했어요.');return;}
    switch(target.dataset.action){
      case 'zoom-in':window.AppleTreeView?.changeScale(50);return;
      case 'zoom-out':window.AppleTreeView?.changeScale(-50);return;
      case 'zoom-reset':window.AppleTreeView?.stop();return;
      case 'magnify':window.AppleTreeView?.toggle();return;
      case 'contrast':contrast=!contrast;write('contrast',contrast);applyPreferences();announce(contrast?'또렷한 화면을 켰어요.':'기본 화면으로 돌아왔어요.');return;
      case 'region':document.getElementById('region-dialog').showModal();return;
      case 'help':document.getElementById('help-dialog').showModal();return;
      case 'sources':document.getElementById('sources-dialog').showModal();return;
      case 'top':window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('.brand')?.focus({preventScroll:true});return;
      case 'show-all':category='all';query='';photoRegion='all';if(route().view==='saved'){navigate({},'learn');return;}document.getElementById('search-input').value='';renderCards();return;
      case 'speak':speak();return;
      case 'print':window.print();return;
      case 'practice':document.getElementById('practice-feedback').textContent='잘 누르셨어요! 실제 사이트에서도 이렇게 한 번 누르면 돼요.';return;
      case 'restart':updateStep(0);return;
      case 'finish':{const g=route().guide;if(!g)return;if(!completed.includes(g.id)){completed.push(g.id);write('completed',completed);}finish=true;render();document.getElementById('step-panel').focus();announce('안내를 모두 확인했습니다.');return;}
    }
    // Keep standard new-tab and modified-click behavior for all real links.
    if(target.tagName==='A'&&!target.target&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){
      const url=new URL(target.href,location.href);
      if(url.origin===location.origin&&url.pathname.endsWith('/index.html')){
        const id=url.searchParams.get('guide');if(id&&D.guides.some(g=>g.id===id)){event.preventDefault();write('lastGuide',id);navigate({guide:id});}
        else if(!url.search){event.preventDefault();category='all';query='';navigate({},url.hash.slice(1));}
      }
    }
  });
  app.addEventListener('submit',event=>{
    if(event.target.id==='guide-search'){event.preventDefault();query=document.getElementById('search-input').value.slice(0,100);renderCards();}
    if(event.target.id==='practice-search'){event.preventDefault();const value=document.getElementById('practice-input').value.trim();if(!value)return;document.getElementById('practice-feedback').textContent='검색 버튼을 잘 누르셨어요! 실제 홈페이지에서는 관련 결과가 나타나요.';}
  });
  app.addEventListener('input',event=>{if(event.target.id==='search-input'){query=event.target.value.slice(0,100);renderCards();}});
  window.addEventListener('popstate',()=>{finish=false;category='all';query='';render();});
  window.addEventListener('pagehide',stopSpeech);
  // Original links remain usable; Gwangju in the original repository was Gyeonggi Gwangju.
  const filename=decodeURIComponent(location.pathname.split('/').pop()||'');
  if(filename&&filename!=='index.html'){
    const match=filename.match(/^(?:(Seoul|Busan|Daegu|Gwangju)_)?(medical|exercise|welfare|job)(?:_?1)?\.html$/i);
    if(match){const regionMap={seoul:'seoul',busan:'busan',daegu:'daegu',gwangju:'gjcity'};if(match[1]){regionId=regionMap[match[1].toLowerCase()];write('region',regionId);}const kind=match[2].toLowerCase();const url=new URL('index.html',location.href);if(kind==='job')url.searchParams.set('guide','jobs');else if(match[1])url.searchParams.set('guide',regionId+'-'+({medical:'health',exercise:'location',welfare:'welfare'}[kind]));else{url.searchParams.set('category',({medical:'health',exercise:'culture',welfare:'welfare'}[kind]));url.hash='learn';}history.replaceState({},'',url);}
  }
  render();
})();
