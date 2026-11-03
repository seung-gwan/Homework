/* Shared learning content. No personal information is collected. */
window.APPLE_TREE = {
  checked: '2026-11-03',
  categories: [
    {id:'all',name:'전체 안내',icon:'grid'},
    {id:'local',name:'주민센터·민원',icon:'building'},
    {id:'welfare',name:'복지혜택',icon:'heart'},
    {id:'health',name:'건강·의료',icon:'medical'},
    {id:'culture',name:'배움·운동',icon:'flower'},
    {id:'job',name:'일자리',icon:'bag'},
    {id:'basic',name:'인터넷 기초',icon:'mouse'}
  ],
  regions: [
    ['seoul','서울특별시','서울','https://www.seoul.go.kr/'],
    ['busan','부산광역시','부산','https://www.busan.go.kr/'],
    ['daegu','대구광역시','대구','https://www.daegu.go.kr/'],
    ['incheon','인천광역시','인천','https://www.incheon.go.kr/'],
    ['gwangju','광주광역시','광주광역시','https://www.gwangju.go.kr/'],
    ['daejeon','대전광역시','대전','https://www.daejeon.go.kr/'],
    ['ulsan','울산광역시','울산','https://www.ulsan.go.kr/'],
    ['sejong','세종특별자치시','세종','https://www.sejong.go.kr/'],
    ['gyeonggi','경기도','경기','https://www.gg.go.kr/'],
    ['gangwon','강원특별자치도','강원','https://state.gwd.go.kr/'],
    ['chungbuk','충청북도','충북','https://www.chungbuk.go.kr/'],
    ['chungnam','충청남도','충남','https://www.chungnam.go.kr/'],
    ['jeonbuk','전북특별자치도','전북','https://www.jeonbuk.go.kr/'],
    ['jeonnam','전라남도','전남','https://www.jeonnam.go.kr/'],
    ['gyeongbuk','경상북도','경북','https://www.gb.go.kr/'],
    ['gyeongnam','경상남도','경남','https://www.gyeongnam.go.kr/'],
    ['jeju','제주특별자치도','제주','https://www.jeju.go.kr/'],
    ['gjcity','경기도 광주시','경기 광주시','https://www.gjcity.go.kr/']
  ].map(([id,name,short,url])=>({id,name,short,url})),
  guides: [
    {
      id:'center',category:'local',icon:'building',color:'green',title:'우리 동네 주민센터 찾기',description:'주민센터 홈페이지에서 위치와 전화번호를 찾아봐요.',minutes:5,level:'처음 배워요',site:'우리 지역 누리집',url:'https://www.gov.kr/portal/orgSite',prepare:'살고 있는 시·군·구와 동 이름을 알아두세요. 홈페이지를 둘러볼 때는 보통 로그인이 필요하지 않아요.',keywords:'동사무소 행정복지센터 동주민센터 구청 주소 전화 연락처 위치',
      sources:[['정부24 · 정부/지자체 누리집','https://www.gov.kr/portal/orgSite'],['신촌동 주민센터 · 메뉴 구성 예시','https://www.sdm.go.kr/dong/sc/index.do']],
      steps:[
        {title:'살고 있는 지역을 골라요',body:'‘내 지역 선택’을 눌러 시·도를 고르세요. ‘지역 누리집 열기’를 누르면 선택한 지역의 공식 홈페이지가 새 창으로 열려요.',tip:'지역을 선택하지 않았다면 정부24의 ‘정부/지자체 누리집’에서 기관 이름을 찾아볼 수 있어요.',mock:'region'},
        {title:'검색창에 동 이름을 적어요',body:'지역 홈페이지 검색창에 ‘사는 동 이름 + 주민센터’를 입력해 보세요. 예를 들면 ‘신촌동 주민센터’예요. ‘행정복지센터’나 ‘동주민센터’라고 부르는 곳도 있어요.',tip:'Enter를 누르거나 돋보기 모양의 검색 버튼을 누르세요.',mock:'search',query:'신촌동 주민센터'},
        {title:'공식 주민센터 안내를 열어요',body:'검색 결과에서 동 이름과 기관 이름을 확인한 뒤 눌러요. 구청 홈페이지의 ‘동주민센터’ 메뉴에서도 찾을 수 있어요.',tip:'지역마다 화면과 메뉴 이름이 달라요. 예시와 완전히 같지 않아도 괜찮아요.',mock:'result',label:'동주민센터 안내'},
        {title:'위치와 전화번호를 확인해요',body:'‘찾아오시는 길’, ‘청사안내’, ‘직원안내’를 찾아 누르세요. 주소와 연락처를 적어두고 방문 전에 필요한 준비물을 전화로 물어보면 좋아요.',tip:'운영 시간, 담당 업무, 준비물은 방문할 주민센터에 확인해 주세요.',mock:'menu',label:'찾아오시는 길'}
      ]
    },
    {
      id:'documents',category:'local',icon:'document',color:'blue',title:'정부24에서 등본 발급 알아보기',description:'필요한 서류를 검색하고 발급 순서를 알아봐요.',minutes:7,level:'차근차근 배워요',site:'정부24',url:'https://www.gov.kr/',prepare:'실제 발급에는 본인인증이 필요할 수 있어요. 종이로 출력하려면 프린터도 확인해 주세요.',keywords:'주민등록 등본 초본 서류 발급 정부24 민원 증명서',
      sources:[['정부24 · 주민등록표 등본(초본) 발급','https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=13100000015'],['정부24 · 공식 홈페이지','https://www.gov.kr/']],
      steps:[
        {title:'정부24 홈페이지를 열어요',body:'아래 ‘공식 사이트 열기’를 누르세요. 주소가 gov.kr 또는 정부24의 plus.gov.kr인지 확인해요.',tip:'실제 서류 발급은 정부24에서 진행해요. 이곳에서는 이용 방법을 배워요.',mock:'address',label:'www.gov.kr'},
        {title:'필요한 서류 이름을 검색해요',body:'검색창에 ‘주민등록등본’을 적고 검색하세요. 결과에서 ‘주민등록표 등본(초본) 발급’을 찾아 눌러요.',tip:'등본과 초본은 다른 서류예요. 제출할 기관에 필요한 서류 이름을 먼저 확인해 주세요.',mock:'search',query:'주민등록등본'},
        {title:'안내를 읽고 본인인증해요',body:'준비사항을 읽은 뒤 ‘발급하기’ 등 신청 버튼을 누르세요. 화면의 회원·비회원 절차에 따라 진행하고, 본인인증이 나오면 안내를 따라요.',tip:'비회원 신청도 본인인증이 필요할 수 있어요. 이 사이트에는 인증정보를 입력하지 마세요.',mock:'menu',label:'발급 안내 확인'},
        {title:'내용과 수령 방법을 확인해요',body:'주소, 표시할 정보, 수령 방법을 선택해요. 주민등록번호 공개 여부도 제출 목적에 맞게 확인하세요. 신청 뒤 ‘서비스 신청내역’에서 결과를 확인해요.',tip:'출력이 어렵다면 주민센터나 무인민원발급기 이용 방법도 확인해 보세요.',mock:'check',label:'신청 내용 확인'}
      ]
    },
    {
      id:'welfare',category:'welfare',icon:'heart',color:'peach',title:'나에게 맞는 복지혜택 찾아보기',description:'복지로에서 생활에 도움이 되는 지원을 찾아봐요.',minutes:6,level:'처음 배워요',site:'복지로',url:'https://www.bokjiro.go.kr/',prepare:'찾아보고 싶은 지원의 이름을 생각해 보세요. 정보 검색과 실제 신청 절차는 달라요.',keywords:'기초연금 복지로 복지멤버십 지원금 생활지원 혜택 노인',
      sources:[['복지로 · 서비스 소개','https://www.bokjiro.go.kr/ssis-tbu/cms/pc/intro/intro/info/01/index.html'],['복지로 · 모의계산 안내','https://www.bokjiro.go.kr/ssis-tbu/twatbz/mkclAsis/mkclPage.do']],
      steps:[
        {title:'복지로 홈페이지를 열어요',body:'복지로 공식 홈페이지를 열고 ‘복지서비스’ 또는 ‘서비스찾기’를 찾아보세요.',tip:'중앙정부, 지방자치단체, 민간의 복지정보를 찾아볼 수 있어요.',mock:'address',label:'www.bokjiro.go.kr'},
        {title:'관심 있는 복지를 검색해요',body:'검색창에 ‘기초연금’처럼 찾고 싶은 복지 이름을 입력하세요. 지역과 생애주기를 고를 수 있다면 본인 상황에 맞게 선택해요.',tip:'이름을 몰라도 ‘노년’, ‘생활지원’처럼 관련된 말을 넣어보세요.',mock:'search',query:'기초연금'},
        {title:'지원대상과 신청 방법을 읽어요',body:'검색 결과를 누르고 지원대상, 서비스 내용, 신청방법을 차례로 살펴봐요. 문의처와 필요한 서류도 확인해 두세요.',tip:'검색 결과가 있다고 모두 지원받는 것은 아니에요. 상세 조건을 확인해 주세요.',mock:'menu',label:'지원대상 · 신청방법'},
        {title:'모의계산과 상담을 활용해요',body:'해당 사업의 모의계산이 있다면 참고해 보세요. 실제 신청은 복지로의 신청 안내나 담당 주민센터의 안내에 따라 진행해요.',tip:'모의계산은 참고 결과예요. 실제 선정 여부는 신청 후 조사로 결정돼요.',mock:'check',label:'신청 안내 확인'}
      ]
    },
    {
      id:'health',category:'health',icon:'medical',color:'blue',title:'우리 지역 보건소 이용 알아보기',description:'보건소 위치와 진료·건강 프로그램을 확인해요.',minutes:5,level:'처음 배워요',site:'우리 지역 누리집',url:'https://www.gov.kr/portal/orgSite',prepare:'거주하는 시·군·구 이름과 이용하고 싶은 업무를 알아두세요.',keywords:'보건소 병원 건강 진료 예방접종 검진 의료 치매',
      sources:[['정부24 · 정부/지자체 누리집','https://www.gov.kr/portal/orgSite'],['서대문구 · 보건소 연결 메뉴 예시','https://www.sdm.go.kr/dong/sc/index.do']],
      steps:[
        {title:'내 지역 홈페이지로 이동해요',body:'‘내 지역 선택’으로 살고 있는 지역을 고르세요. 공식 홈페이지에서 보건소를 찾아볼 거예요.',tip:'보건소는 시·군·구별로 운영돼요. 가까운 지역과 담당 지역을 함께 확인해 주세요.',mock:'region'},
        {title:'보건소를 검색해요',body:'시·군·구 홈페이지에서 ‘보건소’를 검색하거나 메뉴에서 보건소를 찾아 누르세요.',tip:'‘종로구 보건소’처럼 시·군·구 이름을 함께 넣으면 찾기 쉬워요.',mock:'search',query:'우리 지역 보건소'},
        {title:'이용하려는 업무를 찾아요',body:'‘진료안내’, ‘보건사업’, ‘건강증진’ 메뉴에서 필요한 내용을 확인해요. 대상, 신청 방법, 예약 여부를 읽어보세요.',tip:'보건소별로 제공하는 업무가 달라요. 원하는 서비스가 있는지 먼저 확인해 주세요.',mock:'menu',label:'진료안내 · 보건사업'},
        {title:'방문 전에 전화로 확인해요',body:'담당 부서 전화번호와 위치를 확인하세요. 방문 전에 운영 시간, 예약, 준비물을 문의하면 좋아요.',tip:'이 안내는 홈페이지 이용법을 설명해요. 건강 문제에 관한 판단은 의료진에게 문의해 주세요.',mock:'check',label:'방문 전 확인'}
      ]
    },
    {
      id:'programs',category:'culture',icon:'flower',color:'yellow',title:'주민센터에서 배움·운동 시작하기',description:'체조, 스마트폰, 노래 교실 등 강좌를 찾아봐요.',minutes:5,level:'처음 배워요',site:'우리 지역 누리집',url:'https://www.gov.kr/portal/orgSite',prepare:'배우고 싶은 강좌와 참여할 수 있는 요일을 생각해 보세요.',keywords:'운동 체조 문화 노래 교실 수강신청 강좌 교육 복지관 자치회관 프로그램',
      sources:[['신촌동 주민센터 · 자치회관 메뉴 예시','https://www.sdm.go.kr/dong/sc/index.do'],['정부24 · 정부/지자체 누리집','https://www.gov.kr/portal/orgSite']],
      steps:[
        {title:'주민센터 홈페이지를 찾아요',body:'‘우리 동네 주민센터 찾기’에서 배운 방법으로 주민센터 홈페이지를 열어요. 지역 복지관에서도 프로그램을 확인할 수 있어요.',tip:'구청의 통합예약 홈페이지에서 신청을 받는 지역도 있어요.',mock:'region'},
        {title:'강좌 안내 메뉴를 찾아요',body:'‘자치회관’, ‘주민자치센터’, ‘프로그램 안내’, ‘수강신청’처럼 강좌와 관련된 메뉴를 누르세요.',tip:'지역마다 메뉴 이름이 달라요. 검색창에 ‘프로그램’을 적어도 좋아요.',mock:'menu',label:'자치회관 · 프로그램 안내'},
        {title:'시간과 모집 조건을 확인해요',body:'강좌를 누르고 장소, 요일, 시간, 수강료, 모집 대상과 신청 기간을 살펴봐요.',tip:'강좌가 보여도 모집이 끝났을 수 있어요. ‘접수 중’인지 확인하세요.',mock:'result',label:'강좌 상세 안내'},
        {title:'안내된 방법으로 신청해요',body:'인터넷, 전화, 방문 중 어떤 방법으로 신청하는지 확인해요. 어렵다면 담당 주민센터에 다른 신청 방법을 물어보세요.',tip:'이 연습 화면은 실제 수강신청을 하지 않아요.',mock:'check',label:'신청 방법 확인'}
      ]
    },
    {
      id:'jobs',category:'job',icon:'bag',color:'lavender',title:'내 주변 어르신 일자리 찾아보기',description:'노인일자리여기에서 모집 공고를 살펴봐요.',minutes:6,level:'차근차근 배워요',site:'노인일자리여기',url:'https://www.seniorro.or.kr:4431/seniorro/main/main.do',prepare:'살고 있는 지역과 관심 있는 활동을 생각해 보세요. 모집 조건은 공고마다 달라요.',keywords:'일자리 구직 취업 모집 노인일자리여기 시니어클럽 공고',
      sources:[['노인일자리여기 · 공식 홈페이지','https://www.seniorro.or.kr:4431/seniorro/main/main.do']],
      steps:[
        {title:'노인일자리여기를 열어요',body:'아래 버튼으로 노인일자리여기 홈페이지에 들어가세요. 열리지 않으면 잠시 뒤 다시 접속해 보세요.',tip:'모집 공고와 접수 방법은 운영 기관의 최신 안내를 확인해 주세요.',mock:'address',label:'www.seniorro.or.kr'},
        {title:'살고 있는 지역을 검색해요',body:'지역 검색창에 시·군·구 이름을 입력하고 검색하세요. 참여 가능한 지역의 모집 공고를 찾아봐요.',tip:'처음에는 동 이름보다 시·군·구 이름으로 검색해 보세요.',mock:'search',query:'살고 있는 시·군·구'},
        {title:'모집 공고를 자세히 읽어요',body:'관심 있는 공고를 누르고 활동 내용, 장소, 참여 조건, 접수 기간과 연락처를 확인해요.',tip:'나이, 거주지 등 참여 조건은 사업과 공고마다 달라요.',mock:'result',label:'모집 공고 자세히 보기'},
        {title:'신청 방법을 확인해요',body:'공고의 신청 방법을 따르세요. 온라인 접수 뒤 추가 방문이나 서류가 필요한지도 담당 기관에 물어보세요.',tip:'이 사이트에서는 구직 신청이나 개인정보 접수를 받지 않아요.',mock:'check',label:'모집 기관 안내 확인'}
      ]
    },
    {
      id:'basics',category:'basic',icon:'mouse',color:'green',title:'클릭과 검색, 처음부터 배우기',description:'버튼 누르기부터 검색까지 편안하게 연습해요.',minutes:4,level:'처음 배워요',site:null,url:null,prepare:'마우스 또는 스마트폰만 있으면 돼요. 틀려도 괜찮아요. 언제든 다시 연습할 수 있어요.',keywords:'클릭 마우스 검색 인터넷 기초 스마트폰 뒤로가기 연습 처음',sources:[],
      steps:[
        {title:'버튼을 한 번 눌러봐요',body:'컴퓨터에서는 마우스 왼쪽 버튼을 한 번 눌러요. 스마트폰에서는 손가락으로 가볍게 한 번 누르세요. 아래 연습 버튼을 눌러볼까요?',tip:'홈페이지의 버튼은 보통 한 번만 누르면 돼요. 천천히 눌러보세요.',mock:'click',label:'여기를 눌러보세요'},
        {title:'검색창에 글자를 적어요',body:'검색창을 누른 뒤 키보드로 찾고 싶은 말을 적어요. 아래에 ‘주민센터’를 입력하고 검색해 보세요.',tip:'글자를 지우려면 키보드의 Backspace(←)를 사용해요.',mock:'search',query:'주민센터'},
        {title:'화면을 위아래로 움직여요',body:'컴퓨터에서는 마우스 가운데 바퀴를 돌리면 돼요. 스마트폰에서는 화면을 아래에서 위로 밀면 아래 내용이 보여요.',tip:'맨 위로 가려면 이 사이트 아래쪽의 ‘맨 위로’를 누르세요.',mock:'scroll',label:'아래 내용도 읽어보세요'},
        {title:'이전 화면으로 돌아가요',body:'인터넷 창 위쪽의 왼쪽 화살표(뒤로가기)를 누르면 전에 보던 화면으로 돌아가요. 이 사이트의 ‘안내 목록’으로도 돌아갈 수 있어요.',tip:'잊어버려도 괜찮아요. 언제든 다시 열어 천천히 연습해 보세요.',mock:'check',label:'참 잘하셨어요!'}
      ]
    },
    {
      id:'login',category:'basic',icon:'lock',color:'lavender',title:'로그인과 본인인증 이해하기',description:'회원가입, 로그인, 인증이 무엇인지 알아봐요.',minutes:5,level:'차근차근 배워요',site:'정부24',url:'https://www.gov.kr/',prepare:'이 안내에서는 뜻과 순서만 배워요. 실제 비밀번호나 인증번호는 입력하지 않아요.',keywords:'로그인 회원가입 간편인증 공동인증서 비밀번호 본인인증 인증번호',
      sources:[['정부24 · 로그인 및 인증센터 메뉴','https://www.gov.kr/']],
      steps:[
        {title:'회원가입과 로그인을 구분해요',body:'회원가입은 처음 이용하는 사이트에 내 계정을 만드는 일이에요. 로그인은 이미 만든 계정으로 들어가는 일이에요.',tip:'기억이 안 난다면 ‘아이디 찾기’를 확인해 보세요.',mock:'menu',label:'로그인 · 회원가입'},
        {title:'본인인증의 뜻을 알아봐요',body:'본인인증은 서비스를 이용하는 사람이 본인인지 확인하는 절차예요. 간편인증, 공동·금융인증서 등 여러 방법이 있어요.',tip:'가능한 방법은 서비스마다 달라요. 평소 사용하던 방법이 있는지 확인해요.',mock:'menu',label:'본인인증 방법 선택'},
        {title:'공식 화면에서만 인증해요',body:'신청하려던 공식 사이트인지 주소부터 확인하세요. 본인 휴대폰이나 인증 앱에서 요청 내용을 확인한 뒤 진행해요.',tip:'전화나 문자로 비밀번호·인증번호를 알려 달라고 해도 전달하지 마세요.',mock:'address',label:'공식 홈페이지 주소 확인'},
        {title:'사용 뒤에는 로그아웃해요',body:'여러 사람이 쓰는 컴퓨터에서는 이용 후 ‘로그아웃’을 누르고 인터넷 창을 닫으세요.',tip:'공용 컴퓨터에는 비밀번호를 저장하지 않는 것이 좋아요.',mock:'check',label:'로그아웃 확인'}
      ]
    },
    {
      id:'readability',category:'basic',icon:'type',color:'yellow',title:'작은 글씨를 크게 보는 방법',description:'글씨 확대와 화면 읽어주기를 사용해 봐요.',minutes:3,level:'처음 배워요',site:null,url:null,prepare:'화면 맨 위에 있는 ‘글자·화면 크기’ 버튼부터 살펴보세요.',keywords:'확대 축소 글씨 글자 크기 화면 읽기 음성 접근성',sources:[],
      steps:[
        {title:'플러스 버튼으로 확대해요',body:'화면 맨 위의 ‘+’를 누르면 글자와 안내 화면이 함께 커져요. 100%부터 200%까지 조절할 수 있어요.',tip:'한 번에 25%씩 커져요. 자신에게 편한 크기를 찾아보세요.',mock:'zoom'},
        {title:'원래 크기로 돌아가요',body:'‘−’를 누르면 작아지고 ‘초기화’를 누르면 100%로 돌아가요. 선택한 크기는 이 브라우저에 기억돼요.',tip:'다른 사이트는 인터넷 창 메뉴의 ‘확대/축소’를 사용해 보세요.',mock:'zoom'},
        {title:'또렷한 화면과 읽어주기를 써봐요',body:'‘또렷하게’를 누르면 글자와 배경이 더 뚜렷하게 구분돼요. 안내의 ‘읽어주기’를 누르면 현재 단계를 음성으로 들을 수 있어요.',tip:'읽어주기는 기기의 음성 기능을 이용해요. 소리가 안 나면 음량과 한국어 음성 지원을 확인하세요.',mock:'check',label:'편한 화면으로 읽어보세요'}
      ]
    }
  ]
};
