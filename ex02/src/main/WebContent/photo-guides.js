/* Original screenshots supplied in the Homework repository. Coordinates are percentages. */
(() => {
  const D=window.APPLE_TREE;
  const shot=(id,title,body,points=[])=>({title,body,tip:'사진 속 번호나 빨간 표시를 찾아보세요. 사진 확대 버튼을 눌러도 페이지의 다른 내용은 움직이지 않아요.',image:'assets/screens/'+id+'.png',imageId:id,points,mock:null});
  const point=(x,y,w,h,label)=>({x,y,w,h,label});
  const make=(id,region,category,title,site,url,steps,original)=>({
    id,region,category,title,site,url,steps,original,photo:true,color:'blue',
    icon:category==='health'?'medical':category==='culture'?'pin':'building',
    description:site+'의 실제 화면을 보며 버튼 위치를 찾아요.',minutes:Math.max(3,steps.length*2),level:'사진으로 배우기',
    prepare:'기존에 올려주신 사이트 캡처를 그대로 사용한 안내입니다. 실제 홈페이지가 개편되었다면 메뉴 이름과 위치가 달라질 수 있어요.',
    keywords:site+' '+(D.regions.find(r=>r.id===region)?.name||'')+' 사진 실제 화면 클릭 이용안내 위치',
    sources:[[site+' 공식 홈페이지',url],['올려주신 원본 안내','https://github.com/seung-gwan/Homework/blob/54e015e/ex02/src/main/WebContent/'+original]]
  });
  const photos=[
    make('seoul-welfare','seoul','welfare','서울노인복지센터 이용 방법','서울노인복지센터','https://seoulnoin.or.kr/',[
      shot('kGhXsGfd','‘노인복지’ 아래 ‘이용안내’를 누르세요','사진 위쪽 초록색 메뉴에서 ① 노인복지에 마우스를 올리세요. 아래 메뉴가 나타나면 ② 이용안내를 누르세요. 스마트폰에서는 메뉴를 한 번 눌러 펼쳐보세요.',[point(29.2,13,10.4,5.5,'노인복지 메뉴'),point(29.6,20.5,9.5,3.5,'이용안내 메뉴')]),
      shot('wvqqdLrp','센터를 이용하는 조건을 확인하세요','이용안내 화면입니다. 이용 대상, 회원가입 방법, 필요한 준비물을 차례로 읽어보세요. 작은 글씨는 사진 확대나 따라다니는 돋보기로 살펴볼 수 있어요.'),
      shot('VLrY1YKd','왼쪽 ‘생활’을 눌러 지원 내용을 살펴보세요','사진 왼쪽 메뉴에서 ‘생활’을 누르세요. 급식·생활지원 안내와 식단표를 확인할 수 있어요. 실제 이용 조건은 센터의 현재 안내를 확인하세요.',[point(18.8,29.4,12.4,5.3,'생활 메뉴')])
    ],'Seoul_welfare1.html'),
    make('busan-welfare','busan','welfare','부산 노인복지관 이용 방법','부산광역시노인종합복지관','https://www.youngsilver.or.kr/',[
      shot('X77wWKY7','첫 화면에서 ‘이용안내’를 누르세요','사진 아래쪽의 파란색 바로가기 메뉴를 보세요. ‘이용안내’라고 적힌 버튼을 누르면 센터 이용 방법이 나와요.',[point(16.7,68.6,16.6,17.2,'이용안내')]),
      shot('SsxyRK28','이용안내의 대상과 절차를 읽으세요','센터 이용안내 화면입니다. 누가 이용할 수 있는지, 회원가입이나 준비물이 필요한지 확인하세요.'),
      shot('gjKQZVC2','‘오시는길/버스안내’를 누르세요','다시 첫 화면의 파란색 바로가기 메뉴를 보세요. 빨간 원 안의 ‘오시는길/버스안내’를 누르세요.',[point(33.3,68.6,16.7,17.2,'오시는길/버스안내')]),
      shot('cHBX9sXD','지도와 버스 노선을 확인하세요','복지관 위치와 교통편을 설명하는 화면입니다. 주소, 정류장, 버스 노선을 확인하고 출발 전에 최신 교통편을 한 번 더 확인하세요.')
    ],'Busan_welfare1.html'),
    make('daegu-welfare','daegu','welfare','대구 노인복지관 이용·강좌 찾기','대구광역시노인종합복지관','https://www.tgsenior.or.kr/',[
      shot('wTxCLr05','첫 화면의 ‘이용안내’를 누르세요','사진 가운데 아래쪽의 큰 네모 버튼을 보세요. 빨간 원 안의 ‘이용안내’를 누르면 센터 이용 방법을 볼 수 있어요.',[point(39.5,65.8,14.4,19,'이용안내')]),
      shot('J4tT1CpF','‘이용안내’ 아래 ‘강좌 시간표’를 누르세요','① 위쪽 이용안내 메뉴에 마우스를 올리세요. ② 펼쳐진 메뉴에서 강좌 시간표를 누르세요. 아래 표에서 요일, 시간, 강좌 이름을 확인할 수 있어요.',[point(29,14.8,11.2,6,'이용안내 메뉴'),point(31.5,23.5,6.5,3.5,'강좌 시간표')]),
      shot('SsDrhgCq','‘복지관소개’ 아래 ‘찾아오시는길’을 누르세요','① 위쪽 복지관소개에 마우스를 올리고 ② 찾아오시는길을 누르세요. 아래 지도와 주소에서 복지관 위치를 확인할 수 있어요.',[point(14.8,14.8,14.2,6.2,'복지관소개'),point(18.5,35.6,7,3.6,'찾아오시는길')])
    ],'Daegu_welfare1.html'),
    make('gjcity-welfare','gjcity','welfare','경기 광주 노인복지관 이용 방법','광주시노인복지관','https://www.gjswc.kr/',[
      shot('cJfwsFq2','첫 화면 아래 ‘이용안내’를 누르세요','사진 아래쪽 남색 바로가기 메뉴에서 손가락 그림이 있는 ‘이용안내’를 누르세요. 빨간 원으로 표시된 곳이에요.',[point(18.8,72.7,10.4,17.2,'이용안내')]),
      shot('3rtpJy68','회원가입과 이용 절차를 확인하세요','복지관 이용안내 화면입니다. 이용 대상, 회원가입 절차와 준비물을 확인하세요. 현재 이용 조건은 실제 홈페이지에서 다시 확인하세요.'),
      shot('XJVGn3kB','‘오시는 길’을 누르세요','첫 화면 아래 바로가기 메뉴에서 맨 오른쪽의 ‘오시는 길’을 누르세요. 지도와 대중교통 안내로 이동할 수 있어요.',[point(70.8,72.7,10.5,17.2,'오시는 길')]),
      shot('431yLqRf','지도와 주소를 확인하세요','복지관 주소와 교통편을 확인하는 화면입니다. 이 안내의 광주는 광주광역시가 아닌 경기도 광주시예요.')
    ],'Gwangju_welfare1.html'),
    make('seoul-health','seoul','health','서울 보건소 홈페이지 찾기','서울특별시 보건소 안내','https://news.seoul.go.kr/welfare/archives/201455',[
      shot('J0XMwPzn','사는 구의 보건소 주소를 누르세요','표의 왼쪽에서 사는 구의 보건소를 찾으세요. 같은 줄 가운데의 파란색 인터넷 주소를 누르면 해당 보건소 홈페이지로 이동해요. 빨간 원은 종로구보건소의 예시입니다.',[point(42.2,14.8,15.2,2.8,'종로구보건소 주소 예시')])
    ],'Seoul_medical_1.html'),
    make('busan-health','busan','health','부산 보건소 홈페이지 찾기','부산광역시 보건소 안내','https://www.busan.go.kr/depart/health0302',[
      shot('jqMjykGH','사는 구 옆 ‘사이트 바로가기’를 누르세요','표 왼쪽에서 보건소 이름을 찾으세요. 같은 줄 맨 오른쪽의 ‘사이트 바로가기’를 누르면 보건소 홈페이지가 열려요. 빨간 원은 중구보건소의 예시입니다.',[point(76.2,40.1,7.6,3.8,'사이트 바로가기 예시')])
    ],'Busan_medical1.html'),
    make('daegu-health','daegu','health','대구 보건소 홈페이지 찾기','대구광역시 보건소 안내','https://www.daegu.go.kr/health/index.do?menu_id=00001040',[
      shot('NMVzctK8','지도 아래 ‘보건소 바로가기’를 누르세요','이용하려는 구의 보건소를 찾은 뒤 지도 아래의 ‘보건소 바로가기’를 누르세요. 빨간 원은 중구보건소 버튼의 예시입니다.',[point(45.3,72.6,10.3,3.6,'중구보건소 바로가기 예시')])
    ],'Daegu_medical1.html'),
    make('gjcity-health','gjcity','health','경기 광주 보건진료소 찾기','광주시 보건진료소 안내','https://www.gjcity.go.kr/depart/contents.do?mId=0803040000',[
      shot('d3wJGG9S','목록에서 보건진료소 이름을 누르세요','사진 위쪽 네모 안에서 이용하려는 보건진료소 이름을 누르세요. 아래에 선택한 진료소의 지도, 주소, 전화번호가 나타나요. 빨간 원은 태전동 보건진료소의 예시입니다.',[point(31.2,25.1,7.4,3.3,'태전동 보건진료소 예시')])
    ],'Gwangju_medical1.html'),
    make('seoul-location','seoul','culture','서울 어르신상담센터 위치 확인','서울노인복지센터','https://seoulnoin.or.kr/',[
      shot('rpSMDdNZ','상담센터 주소와 문의처를 확인하세요','사진은 서울노인복지센터 홈페이지 안의 어르신상담센터 위치 안내입니다. 위쪽 주소, 지도, 아래 문의처를 확인하고 방문할 기관 이름과 일치하는지 살펴보세요.')
    ],'Seoul_exercise1.html'),
    make('busan-location','busan','culture','부산 복지관 운동 프로그램·위치 확인','부산광역시노인종합복지관','https://www.youngsilver.or.kr/',[
      shot('BQ19VLPY','취미여가지원의 ‘건강증진’ 내용을 읽으세요','사진은 취미여가지원 프로그램 안내입니다. 위쪽 이용자격과 이용절차를 읽고, 표의 건강증진 항목에서 체조·요가 등 프로그램을 살펴보세요. 현재 모집과 운영 내용은 복지관에 확인하세요.'),
      shot('cHBX9sXD','지도와 버스 안내를 읽으세요','복지관의 위치, 주소, 버스 노선을 함께 확인하세요. 사진을 크게 보면 지도 안의 글씨도 읽을 수 있어요.')
    ],'Busan_exercise1.html'),
    make('daegu-location','daegu','culture','대구 복지관 건강·운동시설 확인','대구광역시노인종합복지관','https://www.tgsenior.or.kr/',[
      shot('pTnpTV1s','건강생활지원사업의 시설 안내를 읽으세요','사진의 빨간 원은 진료실·물리치료실·운동치료실 안내를 표시합니다. 각 항목의 위치와 이용 방법을 확인하세요. 현재 운영 내용과 예약 방법은 복지관에 문의하세요.'),
      shot('SsDrhgCq','‘찾아오시는길’을 눌러 위치를 확인하세요','① 복지관소개 메뉴를 펼친 뒤 ② 찾아오시는길을 누르세요. 사진 아래 지도와 주소에서 위치를 확인할 수 있어요.',[point(14.8,14.8,14.2,6.2,'복지관소개'),point(18.5,35.6,7,3.6,'찾아오시는길')])
    ],'Daegu_exercise1.html'),
    make('gjcity-location','gjcity','culture','경기 광주 복지관 위치·운동시설 확인','광주시노인복지관','https://www.gjswc.kr/',[
      shot('431yLqRf','오시는 길의 지도를 확인하세요','복지관의 ‘오시는 길’ 안내입니다. 지도에서 위치를 살펴보고 주소를 확인하세요.'),
      shot('8PN9RYPk','자율이용시설의 ‘체력단련실’을 읽으세요','사진의 빨간 원은 체력단련실 안내입니다. 장소, 이용대상, 이용시간, 이용방법을 차례로 확인하세요. 실제 이용 전에는 현재 운영 안내를 확인하세요.')
    ],'Gwangju_exercise1.html')
  ];
  const jobs=D.guides.find(g=>g.id==='jobs');
  Object.assign(jobs,{photo:true,region:'national',original:'job.html',level:'사진으로 배우기',minutes:12,prepare:'기존에 올려주신 노인일자리여기 실제 화면입니다. 화면과 모집 공고는 달라질 수 있으니 실제 사이트의 현재 안내를 확인해 주세요.',steps:[
    shot('HscDhSh1','‘노인일자리’를 누르고 지역을 검색하세요','① 위쪽 노인일자리 메뉴에서 노인일자리를 선택하세요. ② 큰 검색창에 살고 있는 시·군·구 이름을 입력하세요.',[point(35.5,20.1,11.8,4.1,'노인일자리 메뉴'),point(29,55.3,42,6.8,'사는 지역 검색창')]),
    shot('0yY4ThGF','검색 결과에서 원하는 지역을 누르세요','검색어를 입력하면 아래에 지역 이름이 나타나요. 시·군·구 이름이 맞는지 확인한 뒤 원하는 지역을 누르세요.'),
    shot('pXY77gJ7','모집 공고 제목을 눌러 자세히 보세요','일자리 목록에서 활동 내용을 살펴보세요. 관심 있는 공고 제목을 누르면 참여 조건과 접수 방법을 확인할 수 있어요.'),
    shot('cHnkcjJF','‘일자리유형’을 누르세요','위쪽 ‘일자리유형’ 메뉴를 누르면 종류별 안내를 볼 수 있어요. 활동 내용과 참여 조건을 비교해 보세요.',[point(47.5,12.3,9.4,5.4,'일자리유형')]),
    shot('xTYpK6VP','‘일자리참여방법’을 누르세요','위쪽 ‘일자리참여방법’ 메뉴를 눌러 신청 순서를 읽어보세요. 모집 기간과 준비물은 실제 모집 기관에 확인하세요.',[point(58.9,11.5,10.5,6.7,'일자리참여방법')]),
    shot('xCMgmzs7','‘전국수행기관’에서 기관을 검색하세요','① 위쪽 전국수행기관을 누르세요. ② 시·도와 시·군·구를 선택하거나 기관 이름을 입력하고 ③ 검색을 누르세요. 아래 목록에서 연락처와 주소를 확인할 수 있어요.',[point(70.9,11.5,11.8,6.5,'전국수행기관'),point(44,37,24,4.2,'지역 선택'),point(68.5,37.1,6.3,8.5,'검색')]),
    shot('rFQj5cJ8','위쪽 ‘나의 신청내역 확인’을 누르세요','사진 맨 위 오른쪽의 작은 파란색 버튼 ‘나의 신청내역 확인’을 누르세요. 다음 사진처럼 확인 창이 열립니다.',[point(62.4,6.8,7,3.3,'나의 신청내역 확인')]),
    shot('G2wxbpcj','‘신청내역 확인’을 살펴보세요','신청한 뒤에는 신청내역 확인 메뉴를 이용할 수 있어요. 실제 개인정보는 공식 사이트에서만 입력하세요. 이 안내 사진에서는 신청이나 조회가 이루어지지 않아요.')
  ]});
  D.guides=[...photos,jobs,...D.guides.filter(g=>g!==jobs)];
  Object.assign(D.guides.find(g=>g.id==='readability'),{
    title:'화면 확대와 돋보기 사용하기',description:'화면 확대와 돋보기를 함께 사용할 수 있어요.',
    prepare:'화면 오른쪽 아래의 돋보기 도구는 스크롤해도 같은 자리에 있습니다.',
    steps:[
      {title:'오른쪽 아래 ‘화면 확대’의 +를 누르세요',body:'화면 전체가 사진처럼 함께 커집니다. +와 −로 크기를 조절하고 ‘기본’을 누르면 원래 크기로 돌아갑니다.',tip:'확대 도구는 스크롤해도 같은 자리에 있습니다.',mock:'zoom'},
      {title:'커진 화면을 움직여 보세요',body:'사진 위에서 마우스로 끌거나 화면을 스크롤해 원하는 부분을 보세요. 휴대폰에서는 손가락으로 화면을 밀어 움직일 수 있습니다.',tip:'사진과 글의 줄바꿈은 유지한 채 화면 전체를 확대합니다.',mock:'check',label:'화면 움직이기'},
      {title:'‘돋보기’ 옆 ‘켜기’를 누르세요',body:'마우스나 손가락으로 가리킨 부분이 돋보기에 크게 보입니다. 화면 확대와 함께 사용할 수 있습니다. ‘끄기’ 또는 Esc 키로 돋보기를 닫습니다.',tip:'돋보기의 +와 −로 배율을 조절합니다.',mock:'check',label:'돋보기 사용'}
    ]
  });
})();

/* Captured from official public pages on 2026-11-03. No live input fields. */
(() => {
  const D=window.APPLE_TREE;
  const p=(x,y,w,h,label)=>({x,y,w,h,label});
  const screen=(name,title,points,width=1253,height=705)=>({
    title,body:title,tip:'빨간 원으로 표시한 곳을 확인하세요.',
    image:'assets/screens/'+name,points,width,height,mock:null
  });
  const replace=(id,details,steps,sources)=>Object.assign(D.guides.find(g=>g.id===id),{
    ...details,photo:true,steps,sources,prepare:'공식 홈페이지의 화면 사진으로 안내합니다.'
  });
  const gov='https://plus.gov.kr/';
  const issue='https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=13100000015';
  const example='https://www.gov.kr/mw/AA040WHMinwonSamplePopup.do?cappBizCd=1310000001501';
  const form=(title,points,top,height)=>({...screen('gov-form.gif',title,points,1049,777),crop:{top,height}});
  const auth=(title='사용하는 인증 방법을 누르세요')=>screen('gov-login.jpg',title,[
    p(33.5,14.5,31.8,24,'간편인증'),p(65.4,14.5,31.8,24,'공동인증서')
  ]);
  replace('documents',{region:'national',url:gov},[
    screen('gov-home.jpg','‘주민등록등본(초본)’을 누르세요',[p(18,48.5,16,9,'주민등록등본(초본)')]),
    screen('gov-issue.jpg','오른쪽 파란색 ‘발급하기’를 누르세요',[p(70,69,25,11,'발급하기')]),
    screen('gov-choice.jpg','회원·비회원 중 이용할 방법을 누르세요',[p(35.4,46,14.6,9.2,'회원 신청하기'),p(49,46,14.6,9.2,'비회원 신청하기')]),
    auth('회원 신청 예시 · 인증 방법을 고르세요'),
    form('주소를 고르세요 · 정부24 작성예시',[p(3.5,19.5,53,10,'시도와 시군구 선택')],0,.37),
    form('발급형태를 고르세요 · 정부24 작성예시',[p(3.5,45.5,33,7,'전체 발급 또는 선택 발급')],.37,.25),
    form('수령방법을 고르세요 · 정부24 작성예시',[p(3.5,83,89,13,'수령방법')],.64,.36)
  ],[['정부24 등본 발급 안내',issue],['정부24 공식 작성예시',example],['공식 신청서 사진','https://www.gov.kr/images/06/xml_sample/1310000001501.gif']]);
  replace('login',{region:'national',url:gov},[
    screen('gov-login-home.jpg','오른쪽 위 ‘로그인’을 누르세요',[p(79,9,10,8,'로그인')]),auth()
  ],[['정부24 로그인 메뉴',gov]]);
  replace('welfare',{region:'national',url:'https://www.bokjiro.go.kr/'},[
    screen('welfare-home.jpg','검색창에 ‘기초연금’을 적고 돋보기를 누르세요',[p(28.8,31,47.5,12,'복지 검색창'),p(70,30.5,6,12.5,'검색 버튼')]),
    screen('welfare-result.jpg','검색 결과의 ‘기초연금’을 누르세요',[p(7,83,10,7,'기초연금 검색 결과')]),
    screen('welfare-support.jpg','‘지원대상’을 확인하고 ‘신청방법’을 누르세요',[p(5,44,24.5,10,'지원대상'),p(52,44,25,10,'신청방법')]),
    screen('welfare-apply.jpg','신청방법과 처리절차를 읽으세요',[p(52,44,25,10,'신청방법')])
  ],[['복지로 공식 홈페이지','https://www.bokjiro.go.kr/'],['복지로 기초연금 상세 안내','https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00001164']]);
  const center='https://www.sdm.go.kr/dong/sc/index.do';
  replace('center',{region:'seoul',title:'주민센터 위치 찾기 · 신촌동 예시',url:center},[
    screen('center-home.jpg','‘오시는길’을 누르세요',[p(3,41.5,11,15,'오시는길')],1426,891),
    screen('center-map.jpg','주소와 전화번호를 확인하세요',[p(27,58,24,8,'주소와 전화번호')],1426,891)
  ],[['신촌동 주민센터',center],['신촌동 청사와 위치','https://www.sdm.go.kr/dong/sc/citizen/dongInfo.do']]);
  replace('programs',{region:'seoul',title:'주민센터 강좌 찾기 · 신촌동 예시',url:center},[
    screen('program-home.jpg','‘프로그램’을 누르세요',[p(13.2,41.5,11,15,'프로그램')],1426,891),
    screen('program-list.jpg','원하는 강좌 이름을 누르세요',[p(44.5,80,17,5.5,'강좌 이름')],1426,891),
    screen('program-detail.jpg','교육시간과 접수 방법을 확인하세요',[p(34.5,47,27,8,'교육시간'),p(34.5,65.5,27,8,'방문접수')],1426,891)
  ],[['신촌동 주민센터',center],['자치회관 강좌안내','https://www.sdm.go.kr/dong/sc/acms/com/lecture.do']]);
  replace('health',{region:'seoul',title:'보건소 이용 방법 · 서대문구 예시',url:center},[
    screen('health-home.jpg','홈페이지 맨 위의 ‘보건소’를 누르세요',[p(64,0.2,6.2,5,'보건소')],1426,891),
    screen('health-services.jpg','‘진료 및 검사’ 또는 ‘민원안내’를 누르세요',[p(25,13.5,18.6,8.3,'진료 및 검사'),p(42.3,13.5,18.6,8.3,'민원안내')],1426,891)
  ],[['신촌동 주민센터',center],['서대문구 보건소','https://www.sdm.go.kr/health/']]);
  const basics=D.guides.find(g=>g.id==='basics');
  basics.steps[0].body='마우스 왼쪽 버튼이나 손가락으로 원하는 버튼을 한 번 누르세요.';
  basics.steps[1].body='안내 목록의 검색창에 지역이나 기관 이름을 적으면 해당 안내를 찾을 수 있습니다.';
  basics.steps[3].body='이 사이트 위쪽의 ‘안내 목록’을 누르면 처음부터 다른 안내를 고를 수 있습니다.';
})();
