(() => {
  'use strict';
  const D = window.APPLE_TREE;
  const app = document.getElementById('app');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem('appletree:' + key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem('appletree:' + key, JSON.stringify(value)); } catch { announce('설정을 저장할 수 없지만 이번 화면에서는 사용할 수 있어요.'); } };
  const safeIds = value => Array.isArray(value) ? value.filter(id => D.guides.some(g => g.id === id)) : [];
  let zoom = [100,125,150,175,200].includes(read('zoom',100)) ? read('zoom',100) : 100;
  let contrast = read('contrast',false) === true;
  let regionId = String(read('region',''));
  let saved = safeIds(read('saved',[]));
  let completed = safeIds(read('completed',[]));
  let progress = read('progress',{});
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) progress = {};
  let category = 'all', query = '', speaking = false, finish = false;
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
    document.documentElement.style.fontSize=(20*zoom/100)+'px';
    document.documentElement.dataset.contrast=String(contrast);
    document.documentElement.dataset.large=String(zoom>=150);
    document.querySelectorAll('[data-zoom-output]').forEach(el=>el.textContent=zoom+'%');
    document.querySelectorAll('[data-action="zoom-out"]').forEach(el=>el.disabled=zoom===100);
    document.querySelectorAll('[data-action="zoom-in"]').forEach(el=>el.disabled=zoom===200);
    document.querySelectorAll('[data-action="contrast"]').forEach(el=>el.setAttribute('aria-pressed',String(contrast)));
  }
  function zoomControls() {
    return `<div class="zoom-controls"><button data-action="zoom-out" aria-label="글자와 화면 축소">−</button><output data-zoom-output aria-label="현재 화면 크기">${zoom}%</output><button data-action="zoom-in" aria-label="글자와 화면 확대">+</button><button class="reset" data-action="zoom-reset">초기화</button></div>`;
  }
  function header() {
    const r=route();
    return `<div class="access-bar"><div class="container access-inner"><div class="access-note">${icon('leaf')}천천히 배워도 괜찮아요. 함께 시작해요.</div><div class="access-controls"><span>글자·화면 크기</span>${zoomControls()}<button class="contrast-button" data-action="contrast" aria-pressed="${contrast}">${icon('contrast')}또렷하게</button></div></div></div>
    <header class="header"><div class="container header-inner">${brand()}<nav class="main-nav" aria-label="주 메뉴"><a href="index.html#learn" data-nav="learn" class="${!r.guide&&r.view==='all'?'active':''}">이용 방법 배우기</a><a href="index.html#local" data-nav="local">우리 동네 찾기</a><a href="index.html?view=saved" data-nav="saved" class="${r.view==='saved'?'active':''}">${icon('bookmark')}저장한 안내<span data-save-count>${saved.length?` (${saved.length})`:''}</span></a></nav><button class="header-help" data-action="help">${icon('help')}도움말</button></div></header>`;
  }
  function footer() {
    return `<aside class="help-band"><div class="container help-band-inner"><div><h3>막히는 부분이 있어도 괜찮아요.</h3><p>자주 묻는 질문과 사용 방법을 함께 살펴보세요.</p></div><button class="button secondary" data-action="help">${icon('help')}도움말 보기${icon('arrow')}</button></div></aside><footer class="footer"><div class="container"><div class="footer-top">${brand()}<p>일상에 필요한 인터넷 사용법을 한 걸음씩.<br>사과나무가 여러분의 디지털 생활과 함께해요.</p></div><div class="footer-bottom"><span>사과나무 · Apple Tree · 안내를 위한 학습 사이트</span><span><button class="text-link" data-action="sources">참고 자료·이용 안내</button></span><button class="back-top" data-action="top">맨 위로${icon('up')}</button></div></div></footer>`;
  }
  function home() {
    const r=route(), isSaved=r.view==='saved';
    const latestId=read('lastGuide','');
    const latest=D.guides.find(g=>g.id===latestId&&!completed.includes(g.id)&&Number.isInteger(progress[g.id]));
    const categoryParam=new URLSearchParams(location.search).get('category');
    if(categoryParam && D.categories.some(c=>c.id===categoryParam)) category=categoryParam;
    return `<main id="main" tabindex="-1">
    ${!isSaved?`<section class="container hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="hero-label">${icon('leaf')}어르신을 위한 친절한 인터넷 길잡이</div><h1 id="hero-title">디지털 생활,<br><em>한 걸음씩</em> 함께해요.</h1><p>주민센터 이용부터 나에게 맞는 복지혜택까지.<br>어려웠던 인터넷 사용법을 쉽게 알려드릴게요.</p><div class="hero-actions"><a class="button" href="#learn">이용 방법 배우기${icon('arrow')}</a><a class="button secondary" href="index.html?guide=basics">${icon('mouse')}처음이신가요?</a></div><div class="hero-footnote">${icon('circleCheck')}회원가입 없이, 내 속도에 맞춰 배워보세요.</div></div><div class="hero-visual"><img class="hero-scene" src="assets/learning.svg" width="580" height="430" alt="큰 화면으로 인터넷을 배우는 어르신과 곁에서 돕는 안내자 일러스트"><div class="scene-caption">${icon('heart')}배움에는 늦은 때가 없으니까요.</div></div></section>
    <div class="container quick-strip"><div><span class="quick-icon">${icon('type')}</span><span><strong>더 크고, 더 편안하게</strong><p>위쪽 + 버튼으로 화면을 키워보세요.</p></span></div><a href="index.html?guide=basics"><span class="quick-icon">${icon('mouse')}</span><span><strong>천천히 따라 하는 안내</strong><p>한 단계씩 직접 연습해요.</p></span>${icon('arrow','arrow')}</a><a href="index.html?guide=readability"><span class="quick-icon">${icon('volume')}</span><span><strong>눈이 피곤할 땐 읽어주기</strong><p>안내를 소리로 들어보세요.</p></span>${icon('arrow','arrow')}</a></div>`:''}
    <section id="learn" class="container learn-section" style="${isSaved?'padding-top:2rem':''}" aria-labelledby="learn-title"><div class="section-top"><div><div class="section-number">${isSaved?'MY GUIDE':'01 · 생활 속 디지털 안내'}</div><h2 id="learn-title">${isSaved?'저장한 안내를 다시 만나보세요.':'오늘은 무엇을 배워볼까요?'}</h2><p>${isSaved?'이 브라우저에 저장한 안내예요. 필요한 때 다시 꺼내보세요.':'필요한 안내를 골라, 천천히 따라 해 보세요.'}</p></div>${!isSaved?'<button class="text-link" data-action="show-all">전체 안내 보기 '+icon('arrow')+'</button>':'<a class="text-link" href="index.html#learn">전체 안내 보기 '+icon('arrow')+'</a>'}</div>
    ${latest&&!isSaved?`<div class="continue-banner">${icon('leaf')}<div><strong>지난번에 배우던 안내가 있어요.</strong><p>${latest.title} · ${Math.min(progress[latest.id]+1,latest.steps.length)}단계부터</p></div><a class="button small" href="index.html?guide=${latest.id}">이어서 배우기${icon('arrow')}</a></div>`:''}
    <form class="search-form" id="guide-search" role="search">${icon('search')}<label class="sr-only" for="search-input">배우고 싶은 내용 검색</label><input id="search-input" name="q" type="search" maxlength="100" value="${escape(query)}" placeholder="어떤 도움이 필요하세요? 주민센터, 등본, 복지혜택…" autocomplete="off"><button class="button small" type="submit">검색하기</button></form>
    <div class="category-list" aria-label="안내 주제">${D.categories.map(c=>`<button class="category-button" data-category="${c.id}" aria-pressed="${category===c.id}">${icon(c.icon)}${c.name}</button>`).join('')}</div>
    <div class="result-line"><span id="result-count" role="status" aria-live="polite"></span><span>작은 단계로 나눠서 알려드려요.</span></div><div id="guide-grid" class="guide-grid"></div></section>
    ${!isSaved?`<section id="local" class="container local-section" aria-labelledby="local-title"><div><div class="section-number">02 · 우리 동네와 더 가까이</div><h2 id="local-title">우리 동네 정보가 궁금하세요?</h2><p>살고 있는 지역을 골라주세요.<br>공식 홈페이지에서 주민센터와 생활정보를 찾아봐요.</p><div class="local-actions"><button class="button" data-action="region">${icon('pin')}${region()?escape(region().name):'내 지역 선택'}${icon('arrow')}</button>${link(region()?.url||'https://www.gov.kr/portal/orgSite',region()?'지역 누리집 열기':'공식 누리집 찾기','button secondary')}</div></div><div class="local-illustration"><div class="address-card">${icon('building')}<div><strong>${region()?escape(region().name):'내가 사는 동네부터'}</strong><p>주민센터 · 복지 · 보건소 · 문화생활</p></div></div><div class="local-dots" aria-hidden="true"><span></span><span></span><span></span></div></div></section>
    <section class="container first-section" aria-labelledby="first-title"><div class="section-top"><div><div class="section-number">03 · 처음이라도 괜찮아요</div><h2 id="first-title">차근차근, 기초부터 함께해요.</h2></div></div><div class="first-layout"><div class="first-panel">${icon('mouse','first-icon')}<h3>마우스 클릭부터 시작해 볼까요?</h3><p>버튼 누르기, 글자 입력하기, 이전 화면으로 돌아가기.<br>자주 쓰는 인터넷 기능을 부담 없이 연습해요.</p><a class="text-link" href="index.html?guide=basics">인터넷 기초 배우기${icon('arrow')}</a></div><div class="faq-list">${faqs()}</div></div></section>`:''}
    </main>`;
  }
  function faqs() {
    return `<details><summary>글씨가 작아서 잘 안 보여요.</summary><p>맨 위 ‘글자·화면 크기’의 +를 누르세요. 최대 200%까지 커져요. ‘초기화’를 누르면 원래 크기로 돌아가요. ‘또렷하게’도 사용해 보세요.</p></details><details><summary>잘못 눌렀는데 괜찮을까요?</summary><p>괜찮아요. 이 사이트의 연습 화면에서는 실제 신청이 이루어지지 않아요. ‘이전 단계’로 돌아가 다시 연습할 수 있어요.</p></details><details><summary>회원가입을 해야 하나요?</summary><p>사과나무는 회원가입 없이 이용해요. 실제 정부·복지 사이트에서 신청할 때는 로그인이나 본인인증이 필요할 수 있어요.</p></details><details><summary>설명과 실제 사이트 화면이 달라요.</summary><p>지역과 기기, 사이트 개편에 따라 화면이나 메뉴 이름이 달라질 수 있어요. 비슷한 이름의 메뉴를 찾거나 공식 사이트의 검색을 사용해 보세요.</p></details>`;
  }
  function renderCards() {
    const grid=document.getElementById('guide-grid');if(!grid)return;
    const isSaved=route().view==='saved';
    const words=query.trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
    const guides=D.guides.filter(g=>(category==='all'||g.category===category)&&(!isSaved||saved.includes(g.id))&&words.every(w=>(g.title+' '+g.description+' '+g.keywords).toLocaleLowerCase('ko').includes(w)));
    document.getElementById('result-count').innerHTML=`${query?'검색한 ':''}안내 <strong>${guides.length}개</strong>${category!=='all'?' · '+D.categories.find(c=>c.id===category).name:''}`;
    grid.innerHTML=guides.length?guides.map(g=>`<article class="guide-card" data-color="${g.color}"><a class="card-main" href="index.html?guide=${g.id}"><div class="card-top"><span class="card-icon">${icon(g.icon)}</span><span class="pill">${completed.includes(g.id)?'✓ 배웠어요':g.level}</span></div><h3>${g.title}</h3><p>${g.description}</p></a><div class="card-footer"><span class="card-meta">${icon('clock')}약 ${g.minutes}분 · ${g.steps.length}단계</span><a class="card-start" href="index.html?guide=${g.id}" aria-label="${g.title} 배우기">배워보기${icon('arrow')}</a><button class="bookmark" data-save="${g.id}" aria-pressed="${saved.includes(g.id)}" aria-label="${g.title} ${saved.includes(g.id)?'저장 취소':'저장'}">${icon('bookmark')}</button></div></article>`).join(''):`<div class="empty-state">${icon('search')}<h3>${isSaved?'아직 저장한 안내가 없어요.':'찾으시는 안내가 없어요.'}</h3><p>${isSaved?'안내 카드의 책갈피 버튼을 눌러 저장해 보세요.':'다른 검색어를 입력하거나 전체 안내를 살펴보세요.'}</p><button class="button secondary" data-action="show-all">전체 안내 보기${icon('arrow')}</button></div>`;
    document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  }
  function stepIndex(g) {const n=progress[g.id];return Number.isInteger(n)?Math.max(0,Math.min(g.steps.length-1,n)):0;}
  function lesson(g) {
    document.title=g.title+' | 사과나무';
    const n=stepIndex(g);
    return `<main id="main" class="container lesson-container" tabindex="-1"><div class="breadcrumb"><a href="index.html#learn">안내 목록</a>${icon('arrow')}<span>${D.categories.find(c=>c.id===g.category).name}</span></div><header class="lesson-heading"><span class="pill">${g.level}</span><h1>${g.title}</h1><p>${g.description}</p><div class="lesson-meta"><span>${icon('clock')}약 ${g.minutes}분</span><span>${g.steps.length}단계 안내</span><span>${completed.includes(g.id)?'✓ 학습 완료':'내 속도대로 천천히'}</span></div></header><div class="lesson-tools"><button class="button secondary small" data-action="speak" aria-pressed="false">${icon('volume')}읽어주기</button><button class="button secondary small" data-save="${g.id}" aria-pressed="${saved.includes(g.id)}">${icon('bookmark')}${saved.includes(g.id)?'저장했어요':'안내 저장'}</button><button class="button secondary small" data-action="print">${icon('print')}전체 안내 인쇄</button><button class="button secondary small" data-action="region">${icon('pin')}${region()?escape(region().short):'내 지역 선택'}</button></div><div class="prepare">${icon('light')}<div><strong>시작 전에 준비해요</strong><p>${g.prepare}</p></div></div><div class="lesson-layout"><aside class="lesson-sidebar" aria-label="학습 순서"><h2>이렇게 따라가요</h2><ol class="step-list">${g.steps.map((s,i)=>`<li><button data-step="${i}" ${i===n&&!finish?'aria-current="step"':''}><span class="step-number">${i+1}</span><span>${s.title}</span></button></li>`).join('')}</ol><div class="progress-wrap"><label for="lesson-progress">${finish?'학습 완료':`${n+1} / ${g.steps.length}단계`}</label><progress id="lesson-progress" max="${g.steps.length}" value="${finish?g.steps.length:n}">${n}단계</progress></div></aside><div><section class="step-panel" id="step-panel" tabindex="-1">${finish?completion(g):stepContent(g,n)}</section><div class="lesson-bottom">${g.url?link(['center','health','programs'].includes(g.id)?region()?.url||g.url:g.url,['center','health','programs'].includes(g.id)&&region()?'지역 누리집 열기':'공식 사이트 열기','button secondary official-link'):''}<p>외부 사이트는 새 창으로 열려요. 이 안내로 돌아와 계속 배울 수 있어요.<br>연습 화면은 이해를 돕는 예시이며 실제 사이트의 화면과 다를 수 있어요.</p>${sources(g)}</div></div></div><div class="print-all">${g.steps.map((s,i)=>`<section class="print-step"><h2>${i+1}. ${s.title}</h2><p>${s.body}</p><p class="tip">기억해 주세요: ${s.tip}</p></section>`).join('')}<h2>참고 자료</h2>${g.sources.map(([name,url])=>`<p>${name}: <a href="${url}">${url}</a></p>`).join('')}<p>사과나무 · 2026년 11월 3일 안내 작성 · 실제 화면과 메뉴는 변경될 수 있어요.</p></div></main>`;
  }
  function sources(g) {
    return `<details class="lesson-sources"><summary>참고 자료와 안내 기준</summary>${g.sources.length?`<ul>${g.sources.map(([name,url])=>`<li>${link(url,name)}</li>`).join('')}</ul>`:'<p>사과나무에서 제작한 기초 사용법과 연습 화면이에요.</p>'}<p>안내 작성: 2026년 11월 3일. 메뉴 이름과 화면은 변경될 수 있어요.${g.id==='jobs'?' 일자리 사이트의 최신 화면은 직접 확인하지 못했어요. 모집 기관의 현재 안내를 확인해 주세요.':''}</p></details>`;
  }
  function stepContent(g,n) {
    const s=g.steps[n];
    return `<div class="step-kicker">STEP ${String(n+1).padStart(2,'0')} / ${String(g.steps.length).padStart(2,'0')}</div><h2>${s.title}</h2><p class="step-body">${s.body}</p>${mock(s)}<div class="tip">${icon('light')}<span>${s.tip}</span></div><div class="step-actions"><button class="button secondary" data-step="${n-1}" ${n===0?'disabled':''}>${icon('back')}이전 단계</button><button class="button" ${n===g.steps.length-1?'data-action="finish"':`data-step="${n+1}"`}>${n===g.steps.length-1?'학습 마치기':'다음 단계'}${icon(n===g.steps.length-1?'check':'arrow')}</button></div>`;
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
    return `<div class="completion">${icon('circleCheck')}<div class="eyebrow" style="justify-content:center">오늘도 한 걸음 더 배웠어요</div><h2>차근차근, 잘 따라오셨어요!</h2><p>‘${g.title}’ 안내를 끝까지 살펴보셨어요.<br>필요할 때 언제든 다시 연습해 보세요.</p><div class="hero-actions"><a class="button" href="index.html#learn">다른 안내 배우기${icon('arrow')}</a><button class="button secondary" data-action="restart">다시 연습하기</button></div></div>`;
  }
  function dialogs() {
    return `<dialog id="region-dialog" aria-labelledby="region-title"><div class="dialog-head"><div><h2 id="region-title">살고 있는 지역을 골라주세요.</h2><p>공식 지역 홈페이지를 연결해 드려요.</p></div><button class="icon-button" data-close aria-label="지역 선택 닫기">${icon('close')}</button></div><div class="region-grid">${D.regions.map(r=>`<button class="region-option" data-region="${r.id}" aria-pressed="${r.id===regionId}">${r.name}</button>`).join('')}</div><p class="dialog-note">지역 선택은 이 브라우저에만 기억돼요. 기존 사이트의 ‘광주’ 안내는 경기도 광주시였으므로 별도로 표시했어요.</p></dialog>
    <dialog id="help-dialog" aria-labelledby="help-title"><div class="dialog-head"><div><h2 id="help-title">무엇이 어려우세요?</h2><p>천천히 함께 살펴봐요.</p></div><button class="icon-button" data-close aria-label="도움말 닫기">${icon('close')}</button></div><div class="help-content"><ol><li>위쪽 + 버튼으로 편한 글자 크기를 골라요.</li><li>‘이용 방법 배우기’에서 필요한 안내를 눌러요.</li><li>한 단계씩 읽고 연습한 뒤 ‘다음 단계’를 눌러요.</li><li>공식 사이트가 열리면 새 창에서 실제 이용을 진행해요.</li></ol><div class="faq-list">${faqs()}</div><h3>읽어주기 소리가 나지 않아요.</h3><p>기기 음량을 확인해 주세요. 브라우저와 기기에 따라 한국어 음성 지원이 다를 수 있어요.</p><h3>방문이나 신청에 도움이 필요해요.</h3><p>신청할 기관의 공식 홈페이지에서 담당 연락처를 확인해 주세요. 주민센터를 방문하기 전에 필요한 준비물을 물어보면 좋아요.</p></div></dialog>
    <dialog id="sources-dialog" class="sources-dialog" aria-labelledby="sources-title"><div class="dialog-head"><div><h2 id="sources-title">참고 자료·이용 안내</h2><p>공식 안내를 바탕으로 쉽게 풀어 썼어요.</p></div><button class="icon-button" data-close aria-label="참고 자료 닫기">${icon('close')}</button></div><ul><li>${link('https://www.gov.kr/','정부24')} · 민원 검색과 신청 안내</li><li>${link('https://www.gov.kr/portal/orgSite','정부/지자체 누리집')} · 지역 공식 홈페이지 찾기</li><li>${link('https://www.bokjiro.go.kr/ssis-tbu/cms/pc/intro/intro/info/01/index.html','복지로 서비스 소개')} · 복지정보 검색과 신청 안내</li><li>${link('https://www.sdm.go.kr/dong/sc/index.do','신촌동 주민센터')} · 주민센터 메뉴 구성 예시</li></ul><div class="help-content"><p>2026년 11월 3일에 안내를 작성했어요. 외부 사이트 화면과 신청 조건은 변경될 수 있으니 실제 이용할 때 공식 안내를 확인하세요.</p><h3>이 브라우저에 기억하는 정보</h3><p>글자 크기, 화면 대비, 고른 지역, 저장한 안내와 학습 위치만 이 브라우저에 저장해요. 이 사이트는 회원가입과 실제 민원·복지 신청을 받지 않아요. 읽어주기는 브라우저·운영체제의 음성 기능을 이용하며 외부 글꼴을 불러올 수 있어요.</p></div></dialog>`;
  }
  function render() {
    stopSpeech();document.title='사과나무 | 쉬운 디지털 생활 안내';
    const g=route().guide;
    app.innerHTML=header()+(g?lesson(g):home())+footer()+dialogs();
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
    if(target.dataset.category){category=target.dataset.category;renderCards();return;}
    if(target.dataset.save){
      const id=target.dataset.save;const added=!saved.includes(id);saved=added?[...saved,id]:saved.filter(s=>s!==id);write('saved',saved);
      if(route().view==='saved'){renderCards();document.getElementById('learn-title')?.setAttribute('tabindex','-1');document.getElementById('learn-title')?.focus({preventScroll:true});}
      else document.querySelectorAll(`[data-save="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',String(added));const g=D.guides.find(g=>g.id===id);b.setAttribute('aria-label',g.title+(added?' 저장 취소':' 저장'));if(!b.classList.contains('bookmark'))b.innerHTML=icon('bookmark')+(added?'저장했어요':'안내 저장');});
      document.querySelectorAll('[data-save-count]').forEach(el=>el.textContent=saved.length?` (${saved.length})`:'');announce(added?'안내를 저장했어요.':'안내 저장을 취소했어요.');return;
    }
    if(target.dataset.step!==undefined){updateStep(Number(target.dataset.step));return;}
    if(target.dataset.region){regionId=target.dataset.region;write('region',regionId);document.getElementById('region-dialog').close();render();document.querySelector('[data-action="region"]')?.focus({preventScroll:true});announce(region().name+'을 선택했어요.');return;}
    switch(target.dataset.action){
      case 'zoom-in':zoom=Math.min(200,zoom+25);write('zoom',zoom);applyPreferences();announce('화면 크기 '+zoom+'%');return;
      case 'zoom-out':zoom=Math.max(100,zoom-25);write('zoom',zoom);applyPreferences();announce('화면 크기 '+zoom+'%');return;
      case 'zoom-reset':zoom=100;write('zoom',zoom);applyPreferences();announce('원래 크기로 돌아왔어요.');return;
      case 'contrast':contrast=!contrast;write('contrast',contrast);applyPreferences();announce(contrast?'또렷한 화면을 켰어요.':'기본 화면으로 돌아왔어요.');return;
      case 'region':document.getElementById('region-dialog').showModal();return;
      case 'help':document.getElementById('help-dialog').showModal();return;
      case 'sources':document.getElementById('sources-dialog').showModal();return;
      case 'top':window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('.brand')?.focus({preventScroll:true});return;
      case 'show-all':category='all';query='';if(route().view==='saved'){navigate({},'learn');return;}document.getElementById('search-input').value='';renderCards();return;
      case 'speak':speak();return;
      case 'print':window.print();return;
      case 'practice':document.getElementById('practice-feedback').textContent='잘 누르셨어요! 실제 사이트에서도 이렇게 한 번 누르면 돼요.';return;
      case 'restart':updateStep(0);return;
      case 'finish':{const g=route().guide;if(!g)return;if(!completed.includes(g.id)){completed.push(g.id);write('completed',completed);}finish=true;render();document.getElementById('step-panel').focus();announce('학습을 마쳤어요. 참 잘하셨어요!');return;}
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
    if(match){const regionMap={seoul:'seoul',busan:'busan',daegu:'daegu',gwangju:'gjcity'};if(match[1]){regionId=regionMap[match[1].toLowerCase()];write('region',regionId);}const guideMap={medical:'health',exercise:'programs',welfare:'welfare',job:'jobs'};const url=new URL('index.html',location.href);url.searchParams.set('guide',guideMap[match[2].toLowerCase()]);history.replaceState({},'',url);}
  }
  render();
})();
