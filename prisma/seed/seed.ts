import { PrismaClient, ScheduleResult } from '@prisma/client'
import { getRandomValues } from 'crypto';

const prisma = new PrismaClient();

const random = (i: number)=> {
  return getRandomValues(new Uint32Array(1))[0]%i;
}
async function main() {
  console.log(`admin start`);
  const admin001 = await prisma.user.upsert({
    where: { email: 'admin001' },
    update: {},
    create: {
      name: '운영자',
      email: 'admin001',
      role: "ADMIN",
      needPasswordReset: true,
    },
  });

  console.log(`admin001 done`);

  const tmNames = ['김티엠', '이티엠', '박티엠'];
  const tms = await Promise.all(tmNames.map(async (name, i)=> {
    const id = 'tm00'+(i+1);
    console.log(`${id} start`);
    return await prisma.user.upsert({
      where: { email: id },
      update: {},
      create: {
        name: name,
        email: id,
        role: "TM",
        needPasswordReset: true,
        managers: {
          connect: {
            email: 'admin001',
          }
        }
      },
    }).then((e)=>{
      console.log(`${e.email} done.`);
      return e;
    });
  }));

  console.log(`tm done`);

  const salesNames = ['김영업', '이영업', '박영업',
                      '최영업', '오영업', '민영업',
                      '우영업', '추영업', '홍영업'];
  const sales = await Promise.all(salesNames.map(async (name, i)=> {
    const id = 'sales00'+(i+1);
    console.log(`${id} start`);
    return await prisma.user.upsert({
      where: { email: id },
      update: {},
      create: {
        name: name,
        email: id,
        role: "SALES",
        needPasswordReset: true,
        managers: {
          connect: [{
            email: 'tm00'+(Math.floor(i/3)+1),
          }, {
            email: 'admin001',
          }
        ],
        }
      },
    }).then((e)=>{
      console.log(`${e.email} done.`);
      return e;
    });
  }));

  console.log(admin001);

  const notificationsMessage = [
    '동해물과 백두산이 마르고 닳도록',
    '하느님이 보우하사 우리나라 만세',
    '무궁화 삼천리 화려 강산',
    '무궁화',
    '대한 사람 대한으로 길이 보전하세',
    '남산 위에 저 소나무 철갑을 두른 듯 바람 서리 불변함은 우리 기상일세 무궁화 삼천리 화려 강산 대한 사람 대한으로 길이 보전하세',
    '남산위에저소나무철갑을두른듯바람서리불변함은우리기상일세무궁화삼천리화려강산대한사람대한으로길이보전하세',
  ];
  
  const defaultTime = new Date('2024-06-01').getTime()
  const scheduleList = [{
    address: '대구광역시 수성구 들안로 38, 2023 들안길 푸드페스티벌 로드레스토랑 (두산동)',
    title: '동이옥',
  }, {
    address: '경기도 수원시 팔달구 창룡대로150번길 33, 1층 (우만동)',
    title: '설렘',
  }, {
    address: '제주특별자치도 서귀포시 남원읍 위미리 3193-9번지',
    title: '풍산식당',
  }, {
    address: '충청북도 증평군 도안면 화성로 56',
    title: '황토식당',
  }, {
    address: '경기도 용인시 수지구 광교중앙로 319 (상현동, 광교스타천 107호)',
    title: '김밥마을',
  }, {
    address: '경기도 용인시 기흥구 구성3로448번길 16 (청덕동, 1층)',
    title: '미가식당',
  }, {
    address: '경기도 안양시 동안구 관평로69번길 14-12, 1층 (평촌동)',
    title: '마실',
  }, {
    address: '경기도 안양시 동안구 관평로 149 (평촌동, 평촌중앙공원 내 음식문화축제장 2호)',
    title: '김경진순녹두빈대떡(음식문화축제)',
  }, {
    address: '경기도 평택시 서정동 775-16번지 (1층)',
    title: '토마토분식',
  }, {
    address: '경기도 수원시 팔달구 장다리로271번길 2 (인계동)',
    title: '페리카나치킨',
  }, {
    address: '충청북도 진천군 진천읍 읍내리 371번지',
    title: '웰빙가마솥치킨',
  }, {
    address: '충청북도 충주시 금제6길 4 (금릉동)',
    title: '원주어머니밥상',
  }, {
    address: '충청북도 청주시 서원구 모충동 239-13번지 (지하1층)',
    title: '쇼킹퓨전음식점',
  }, {
    address: '충청북도 충주시 신립로 80 (칠금동)',
    title: '오늘은짜장내일은짬뽕',
  }, {
    address: '충청북도 청주시 상당구 용암동 2634번지',
    title: '맘스터치',
  }, {
    address: '충청북도 청주시 상당구 남일면 효촌리 64-1번지',
    title: '청일식당',
  }, {
    address: '충청북도 청주시 상당구 단재로360번길 38 (평촌동)',
    title: '버드나무집식당',
  }, {
    address: '충청남도 천안시 동남구 신부동 964번지',
    title: '해마당뷔페',
  }, {
    address: '충청남도 아산시 온화로 28, 1층 101호 (온천동)',
    title: '달.사.해.',
  }, {
    address: '충청남도 천안시 서북구 성환읍 성환리 449-198번지',
    title: '하얀집',
  }, {
    address: '인천광역시 서구 심곡동 333-3번지',
    title: '해마루',
  }, {
    address: '대전광역시 중구 서문로105번길 4, 1층 (문화동)',
    title: '더시카고짬뽕문화점',
  }, {
    address: '대전광역시 유성구 노은동 542-2번지 지상 1층',
    title: '윕스',
  }, {
    address: '광주광역시 서구 금화로 71 (금호동,(일층,101호))',
    title: '해물요리찜...했어요',
  }, {
    address: '광주광역시 광산구 월곡동 682-6번지 세진상가104호',
    title: '엄마손분식',
  }, {
    address: '경기도 부천시 오정구 소사로 820 (원종동, 주건축물제1동, 2층)',
    title: '능이버섯백숙&만두전골',
  }, {
    address: '경기도 부천시 소사구 은성로76번길 12, 1층 일부호 (소사본동)',
    title: '퍼스트치킨',
  }, {
    address: '경상남도 하동군 하동읍 경서대로 191',
    title: '휴식공간',
  }, {
    address: '서울특별시 마포구 상암동 1232-0번지 차량번호39',
    title: '(주)런치벨열차사업부',
  }, {
    address: '서울특별시 마포구 합정동 395-4번지',
    title: '오사까',
  }, {
    address: '서울특별시 마포구 만리재옛길 24 (신공덕동, 1층일부)',
    title: '훌랄라앤인앤피자',
  }, {
    address: '충청북도 청주시 청원구 율량동 809번지 (1층)',
    title: '산골칡냉면',
  }, {
    address: '충청북도 청주시 상당구 북문로2가 65-5번지',
    title: '메일집우동전문',
  }, {
    address: '충청북도 충주시 용산동 151번지',
    title: '불나비',
  }, {
    address: '충청북도 청주시 청원구 향군로108번길 20, 1층 2호 (우암동)',
    title: '우리동네포차',
  }, {
    address: '충청북도 청주시 청원구 오창읍 양청4길 45',
    title: '청원생명축제축산물셀프식당',
  }, {
    address: '충청북도 제천시 의림동 23-6번지',
    title: '오아시스',
  }, {
    address: '인천광역시 남동구 간석동 120-1번지 2층',
    title: '어쭈구리',
  }, {
    address: '인천광역시 미추홀구 주안동 210-9번지',
    title: '웟스업',
  }, {
    address: '인천광역시 서구 가좌동 261-20번지 2층',
    title: '쿵후반점',
  }, {
    address: '인천광역시 미추홀구 도화동 863-1번지',
    title: '신동양식당',
  }, {
    address: '인천광역시 서구 석남동 63-4번지',
    title: '먹거리한마당',
  }, {
    address: '울산광역시 중구 백양로 88, 지상1층 (성안동)',
    title: '김영희강남동태찜',
  }, {
    address: '울산광역시 중구 반구정17길 43, 1층 (반구동)',
    title: '물레방아',
  }, {
    address: '울산광역시 중구 성안동 45번지 B 2-1L',
    title: '성안돼지국밥',
  }, {
    address: '경상남도 거제시 옥포동 516-6번지',
    title: '꽃돼지식당',
  }, {
    address: '경상남도 거제시 장목면 관포길 60-1',
    title: '관포오도리횟집',
  }, {
    address: '경상남도 진주시 신안동 439-9번지 2층',
    title: '포레스타루치',
  }, {
    address: '경상남도 거창군 거창읍 대평리 1498-14번지',
    title: '바다야식',
  }, {
    address: '대구광역시 북구 칠성동1가 208-8   번지',
    title: '다보식당',
  }, {
    address: '광주광역시 서구 풍금로38번길 59 (풍암동,(1층))',
    title: '투게더',
  }, {
    address: '광주광역시 광산구 우산동 1033-11번지',
    title: '다래원',
  }, {
    address: '광주광역시 광산구 월계로 173 (월계동,2층 203호)',
    title: '상무칡냉면첨단점',
  }, {
    address: '경기도 수원시 권선구 서수원로 519, 성광프라자 1층 112호 (금곡동)',
    title: '두레통닭 금곡점',
  }, {
    address: '전북특별자치도 고창군 고창읍 읍내리 201-1',
    title: '먹보왕만두',
  }, {
    address: '전북특별자치도 임실군 오수면 오수리 274',
    title: '천냥분식',
  }, {
    address: '전북특별자치도 무주군 설천면 심곡리 산 60-4 (카니발상가 A-2동 1층11호)',
    title: '푸드존',
  }, {
    address: '광주광역시 서구 군분로179번길 18, 1층 (화정동)',
    title: '명인만두 광주화정점',
  }, {
    address: '서울특별시 노원구 한글비석로24바길 13, 1층 좌측호 (상계동)',
    title: '미담',
  }, {
    address: '경기도 안성시 공도읍 서동대로 3930-39, 스타필드 안성 1층 1321호',
    title: '장안면옥',
  }, {
    address: '경기도 수원시 팔달구 지동 283-2 외1필지',
    title: '숯불구이궁바베큐',
  }, {
    address: '경기도 성남시 수정구 신흥동 5628번지 1층',
    title: '고향뼈다귀감자탕',
  }, {
    address: '경기도 시흥시 정왕동 1189-7번지 1층',
    title: '방목촌',
  }, {
    address: '경기도 시흥시 신천동 707-58번지',
    title: '왕십리곱창',
  }, {
    address: '인천광역시 중구 신도시남로 137, 106호 (운서동, 화평빌딩)',
    title: '김밥천국',
  }, {
    address: '경상남도 진주시 가좌동 1436-1번지 1층',
    title: '꽃보다소',
  }, {
    address: '경상남도 진주시 초전동 642-1번지 1층',
    title: '초전반점',
  }, {
    address: '경상북도 울진군 울진읍 울진중앙로 18',
    title: '돼지식당',
  }, {
    address: '경상북도 문경시 점촌동 177-23번지',
    title: '구미집',
  }, {
    address: '대전광역시 동구 은어송로 72 (가오동, 토마토쇼핑센터 3215호)',
    title: '샤브향 대전 가오점',
  }, {
    address: '광주광역시 서구 구성로 127 (양동,(1층))',
    title: '주막',
  }, {
    address: '전북특별자치도 익산시 남중동 284-5 (1층)',
    title: '청산',
  }, {
    address: '전북특별자치도 익산시 어양동 640-10',
    title: '바우네민물장어',
  }, {
    address: '전북특별자치도 익산시 영등동 842-1 (1층)',
    title: '똥꾼',
  }, {
    address: '전북특별자치도 익산시 영등동 193-1',
    title: '베르사체경양식',
  }, {
    address: '전북특별자치도 정읍시 수성동 1026-3',
    title: '한우전문회관',
  }, {
    address: '경상남도 창원시 성산구 가양로124번길 15, 대암빌딩 지하1층 111호 (대방동)',
    title: '그린밤(Green Bomb)',
  }, {
    address: '서울특별시 종로구 옥인길 40, 1층 (옥인동)',
    title: '에노테카 친친',
  }, {
    address: '경기도 양주시 옥정동로7다길 40, 폴리프라자5 107호 (옥정동)',
    title: '시골청년맥주',
  }, {
    address: '경상북도 포항시 남구 대잠동 930번지',
    title: '해물경매장식당',
  }, {
    address: '서울특별시 강서구 화곡동 50-115번지',
    title: '살로만치킨',
  }, {
    address: '서울특별시 관악구 신림동 307-5번지',
    title: '전통순대분식',
  }, {
    address: '경기도 안산시 상록구 본오동 873-5번지 정일빌딩 201호',
    title: '대웅숯불갈비',
  }, {
    address: '경기도 고양시 일산동구 마두동 739번지 백마마을 상가동 102호',
    title: '을지로골뱅이와호프',
  }, {
    address: '경기도 성남시 분당구 판교역로 235 (삼평동, 1층 N동 124호 )',
    title: '미소한우소고기국밥',
  }, {
    address: '경기도 광명시 오리로 801 (하안동, e편한세상 나상가105호)',
    title: '맘스치킨',
  }, {
    address: '경기도 성남시 분당구 매화로 43 (야탑동, 1층 전부)',
    title: '상하이블루',
  }, {
    address: '경기도 가평군 조종면 현리 264-53번지',
    title: '북경',
  }, {
    address: '경기도 고양시 일산동구 백석동 1187번지 (백송마을상가동 비101호)',
    title: '곰바우',
  }, {
    address: '경기도 가평군 조종면 현리 231-17번지',
    title: '가평왕철판돈까스전문점',
  }, {
    address: '경기도 성남시 분당구 동판교로 92 (백현동, 백현마을 나상가동 103호 일부)',
    title: '1982꾼',
  }, {
    address: '경기도 성남시 분당구 미금로 45, 진도훼미리프라자 지하1층 비02-9호 (구미동)',
    title: '우리음식이야기',
  }, {
    address: '경기도 고양시 덕양구 화신로272번길 30, 3(일부)층 (화정동, JK프라자)',
    title: '수세이로무시화정점',
  }, {
    address: '인천광역시 남동구 만수동 109-158번지',
    title: '숯불꾸이구이',
  }, {
    address: '인천광역시 미추홀구 경인남길 76, 이즈빌딩 지하1층 (용현동)',
    title: '비(B)612',
  }, {
    address: '인천광역시 연수구 송도과학로51번길 136 (송도동, 송도캐슬해모로상가219동  104-1호)',
    title: '바람난탕수육(송도점)',
  }, {
    address: '인천광역시 미추홀구 주안동 1481-1번지',
    title: '효동각',
  }, {
    address: '인천광역시 서구 가정로394번길 8, 1층 (가정동)',
    title: '백두산양꼬치구이전문점',
  }, {
    address: '인천광역시 부평구 영성중로36번길 3 (삼산동)',
    title: '배터지는생돈까스',
  }, {
    address: '대구광역시 달서구 두류동 495-7번지',
    title: '황제식당',
  }, {
    address: '경상남도 김해시 삼방동 665-15번지',
    title: '삼방손칼국수',
  }, {
    address: '경상남도 거제시 옥포동 1950번지',
    title: '이오정',
  }, {
    address: '경상남도 남해군 남면 당항리 27-4번지 외3필지(당항리 27-2,-5,-6)  3층',
    title: '오페라하우스',
  }, {
    address: '경상북도 영덕군 영덕읍 중앙길 108',
    title: '피자하우스',
  }, {
    address: '부산광역시 중구 보수동1가 98-1번지',
    title: '부산포식당',
  }, {
    address: '부산광역시 영도구 동삼동 산 770-0번지',
    title: '오륙도식당',
  }, {
    address: '제주특별자치도 제주시 삼도이동 43-3 외 5필지',
    title: '입춘천냥국수',
  }, {
    address: '경상남도 진주시 새평거로 112, 후문상가동 1층 111호 (평거동, 진주평거 엘크루)',
    title: '배통 진주1호점',
  }, {
    address: '제주특별자치도 제주시 연동12길 25-1, 1층 (연동)',
    title: '크로방',
  }, {
    address: '경기도 안산시 상록구 식물원로 24, 1층 일부호 (일동)',
    title: '남산식당',
  }, {
    address: '서울특별시 강동구 천중로32길 39, 1층 (천호동)',
    title: '백프로',
  }, {
    address: '경기도 수원시 영통구 매탄동 198-86',
    title: '동해주물럭',
  }, {
    address: '경상북도 포항시 북구 흥해읍 죽천길 11',
    title: '풍천숯불장어',
  }, {
    address: '서울특별시 강남구 논현동 164-14번지 지상1층',
    title: '만나',
  }, {
    address: '서울특별시 금천구 독산동 1031-27번지',
    title: '신북경',
  }, {
    address: '서울특별시 관악구 신림동 514-20번지',
    title: '일미식당',
  }, {
    address: '서울특별시 금천구 시흥동 819-7번지 지하1층 (독산동길 279-1)',
    title: '동그라미',
  }, {
    address: '서울특별시 관악구 신림동 507-19번지',
    title: '미소집',
  }, {
    address: '서울특별시 강동구 암사동 460-0번지',
    title: '네오치킨',
  }, {
    address: '서울특별시 관악구 청룡10길 2, 1층 (봉천동)',
    title: '용감한 파닭',
  }, {
    address: '서울특별시 강동구 천호동 410-18번지',
    title: '코오롱식당',
  }, {
    address: '서울특별시 금천구 시흥동 883-1번지',
    title: '마로니에경양식',
  }, {
    address: '서울특별시 광진구 자양로15길 102, 1층 (자양동)',
    title: '장모님식당',
  }, {
    address: '서울특별시 도봉구 도당로2길 8, 지상2층 (쌍문동)',
    title: '더 스타일',
  }, {
    address: '서울특별시 동작구 상도1동 113-5번지',
    title: '주주클럽',
  }, {
    address: '서울특별시 관악구 관악로14길 38 (봉천동,지상1층)',
    title: '방콕야시장',
  }, {
    address: '서울특별시 강북구 수유동 540-66번지',
    title: '다빈',
  }, {
    address: '서울특별시 강서구 화곡동 938-22번지',
    title: '휠링',
  }, {
    address: '서울특별시 강남구 논현동 98-1번지',
    title: '미네르바',
  }, {
    address: '서울특별시 금천구 가산동 142-41번지',
    title: '카네기',
  }, {
    address: '서울특별시 금천구 독산동 1018-2번지 (지상1층)',
    title: '우리집치킨',
  }, {
    address: '서울특별시 강서구 까치산로 64, 1층 (화곡동, 본동)',
    title: '어촌',
  }, {
    address: '서울특별시 강동구 동남로71길 20-10 (명일동)',
    title: '금강설렁탕,감자탕',
  }, {
    address: '서울특별시 강동구 천호동 25-10번지',
    title: '명성식당',
  }, {
    address: '서울특별시 광진구 능동 3-2번지',
    title: '모아분식',
  }, {
    address: '서울특별시 도봉구 도봉동 600-25번지 (지상1층)',
    title: '대호식당',
  }, {
    address: '경기도 안산시 상록구 사동 1421-11번지 1층',
    title: '고모네탕',
  }, {
    address: '경기도 고양시 덕양구 주교동 568-5번지 1층일부(3호)',
    title: '미래',
  }, {
    address: '경기도 안산시 단원구 원곡동 754-1번지',
    title: '자매집',
  }, {
    address: '경기도 가평군 가평읍 하색리 748-1번지 ,3',
    title: '허심청',
  }, {
    address: '경기도 성남시 중원구 금광동 4349번지 4350 (2층)',
    title: '오비캠프',
  }, {
    address: '경기도 남양주시 진접읍 해밀예당3로 122, 1층 102호',
    title: '금돈쿡',
  }, {
    address: '경기도 부천시 원미구 심곡동 40-47',
    title: '분식 하우스',
  }, {
    address: '경기도 구리시 수택동 376-8번지',
    title: '도가민속촌',
  }, {
    address: '경기도 남양주시 진접읍 금곡리 841-15번지 외1필지',
    title: '은혜갈비',
  }, {
    address: '경기도 안산시 단원구 고잔동 672-6번지 107호',
    title: '동산분식',
  }, {
    address: '경기도 부천시 원미구 춘의동 131-7',
    title: '만물식당',
  }, {
    address: '경기도 시흥시 정왕동 1783-6번지 승리프라자 108호',
    title: '대성루',
  }, {
    address: '경기도 부천시 원미구 중동 1142-8 (104호)',
    title: '포항물회',
  }, {
    address: '경기도 김포시 김포한강1로 227, 107호 (운양동, 광장프라자 )',
    title: '봉구비어 운양점',
  }, {
    address: '경기도 부천시 원미구 상동 236-38',
    title: '늘봄생맥주',
  }, {
    address: '경상남도 거제시 성산로3길 9, 1층 (옥포동)',
    title: '가정식백반',
  }, {
    address: '경상남도 진주시 망경동 0번지 고수부지 15호',
    title: '진주사암연합회',
  }, {
    address: '경상북도 구미시 형곡동 117-1번지',
    title: '미씨레스토랑',
  }, {
    address: '경상북도 문경시 남산로 15 (점촌동)',
    title: '지짐이',
  }, {
    address: '경상북도 구미시 형곡동로 112 (형곡동)',
    title: '코바코돈까스형곡점',
  }, {
    address: '부산광역시 서구 부민동3가 54-100번지',
    title: '부흥각',
  }, {
    address: '부산광역시 북구 구포동 916번지',
    title: '장수돼지국밥',
  }, {
    address: '충청남도 태안군 안면읍 장터로 104, 18호',
    title: '수산물백화점',
  }, {
    address: '경상북도 포항시 북구 중앙상가2길 14-5, 1층 (남빈동)',
    title: '타코야미',
  }, {
    address: '서울특별시 강북구 도봉로99길 16 (수유동)',
    title: '비타민',
  }, {
    address: '서울특별시 강서구 방화동 859-0번지 청구 에이상가101',
    title: '옹고집칼국수',
  }, {
    address: '서울특별시 광진구 화양동 18-32번지',
    title: '아로마레스토랑',
  }, {
    address: '서울특별시 구로구 구로동 100-1번지',
    title: '신선',
  }, {
    address: '서울특별시 노원구 섬밭로 258 (중계동,5층3호)',
    title: '밤비니',
  }, {
    address: '서울특별시 강서구 곰달래로 지하 135, 1층 (화곡동, 8동)',
    title: '거시기포차',
  }, {
    address: '서울특별시 강북구 수유동 50-56번지',
    title: '양주순대국',
  }, {
    address: '서울특별시 강남구 일원동 684-7번지',
    title: '유진바베큐',
  }, {
    address: '서울특별시 강서구 공항동 1366-7번지',
    title: '대관령황태해장국',
  }, {
    address: '서울특별시 강남구 선릉로148길 54 (청담동,지하1층)',
    title: '유벤',
  }, {
    address: '서울특별시 강북구 솔샘로 231 (미아동)',
    title: '짱호프',
  }, {
    address: '서울특별시 강남구 봉은사로7길 46, 1동 1층 (논현동)',
    title: '쉬헤즈커피',
  }, {
    address: '서울특별시 광진구 자양동 635-10번지',
    title: '먹어봐',
  }, {
    address: '서울특별시 강서구 양천로 354, 1층 (가양동, 가양 1동 옥천빌딩)',
    title: '바다사랑수산',
  }, {
    address: '경상남도 김해시 삼문로 15, 106호 (대청동, 부자빌딩)',
    title: '맘스터치롯데마트점',
  }, {
    address: '경상남도 통영시 도남로 81, 1층 (봉평동)',
    title: '돈까스킬러',
  }, {
    address: '경상북도 구미시 봉곡동로 19, 1층 (봉곡동)',
    title: '부산면관구미봉곡점',
  }, {
    address: '경상북도 경산시 백자로 125 (사동)',
    title: '청솔굴뚝배기',
  }, {
    address: '부산광역시 사상구 학장동 728-26번지',
    title: '조은식당',
  }, {
    address: '부산광역시 동구 초량동 232-10번지',
    title: '형제닭집',
  }, {
    address: '부산광역시 수영구 광안동 89-18번지',
    title: '신랑각시',
  }, {
    address: '부산광역시 사상구 백양대로 713 (덕포동)',
    title: '신라밀면',
  }, {
    address: '대구광역시 서구 달서로30길 11-4 (비산동)',
    title: '통큐치킨(안동찜닭)',
  }, {
    address: '광주광역시 북구 중흥동 277-26번지',
    title: '준',
  }, {
    address: '광주광역시 북구 오치동 1018-1번지',
    title: '아델리움식당',
  }, {
    address: '강원특별자치도 강릉시 포남동 1153-2',
    title: '선희횟집',
  }, {
    address: '강원특별자치도 강릉시 교동 820-11',
    title: '미주와만남',
  }, {
    address: '강원특별자치도 강릉시 노암동 825-2',
    title: '2022 강릉단오제 먹거리존(롯데리아)',
  }, {
    address: '강원특별자치도 강릉시 주문진읍 주문리 265-1',
    title: '충남횟집',
  }, {
    address: '강원특별자치도 평창군 용평면 재산리 1425',
    title: '재산식당',
  }, {
    address: '전라남도 무안군 청계면 복길로 244-23',
    title: '김삿갓',
  }, {
    address: '서울특별시 종로구 당주동 160-0번지',
    title: '미소',
  }, {
    address: '서울특별시 송파구 잠실동 40-1번지 재래시장',
    title: '무지개분식',
  }, {
    address: '서울특별시 중구 소파로 125, 2층 (남산동2가)',
    title: '남산분식당',
  }, {
    address: '서울특별시 송파구 마천동 125-23번지 104호',
    title: '토크야',
  }, {
    address: '서울특별시 중랑구 면목동 398-30번지',
    title: '동해집',
  }, {
    address: '서울특별시 송파구 방이동 147-3번지',
    title: '맛있는세상',
  }, {
    address: '서울특별시 중랑구 면목동 354-11번지',
    title: '초원복',
  }, {
    address: '제주특별자치도 제주시 일도이동 74-1번지 (연삼로596)',
    title: '아지바라동광점',
  }, {
    address: '전라남도 광양시 중동 1746-1번지 (3층중1층)',
    title: '공간',
  }, {
    address: '경상북도 김천시 덕곡동 761번지',
    title: '덕산삼도봉식당',
  }, {
    address: '전라남도 목포시 상동 1181번지 해양문화축제음식부스',
    title: '장애인체육총연합회',
  }, {
    address: '전라남도 목포시 옥암동 1052-2번지',
    title: '차돌',
  }, {
    address: '전라남도 목포시 호남동 12-26번지',
    title: '모정해물탕',
  }, {
    address: '전라남도 순천시 조곡동 158-8번지 (1층)',
    title: '명동식당',
  }, {
    address: '전라남도 순천시 풍덕동 1271-11번지 (2층)',
    title: '광장커피와호프',
  }, {
    address: '전라남도 순천시 연향상가3길 8-1, 2층 (연향동)',
    title: '카페팔마',
  }, {
    address: '전라남도 목포시 광동3가 5-12번지 1층',
    title: '다래원',
  }, {
    address: '경상남도 창원시 의창구 소답동 121-7 1층',
    title: '찜고을',
  }, {
    address: '경상북도 경산시 와촌면 덕촌리 220번지 ,633-6',
    title: '삼미찌게마을',
  }, {
    address: '부산광역시 남구 수영로13번길 22 (문현동)',
    title: '청해진',
  }, {
    address: '대구광역시 달서구 조암로 77 (월성동)',
    title: '토암골옛날막창 월성점',
  }, {
    address: '강원특별자치도 양양군 현남면 북분리 434-9',
    title: '민희네식당',
  }, {
    address: '강원특별자치도 원주시 일산동 193-0',
    title: '태평양횟집',
  }, {
    address: '강원특별자치도 원주시 중앙동 114-12',
    title: '이학',
  }, {
    address: '강원특별자치도 동해시 망상동 393-78 번지 망상해변상가 A2동 7호',
    title: '야영장마트회집',
  }, {
    address: '경기도 하남시 아리수로 570, 미사역 효성해링턴 타워 더 퍼스트 1층 1026호 (망월동)',
    title: '오 유니통닭',
  }, {
    address: '서울특별시 송파구 방이동 60-15번지',
    title: '케이2',
  }, {
    address: '서울특별시 은평구 역촌동 69-19번지',
    title: '조개가마술을',
  }, {
    address: '서울특별시 은평구 갈현동 508-3번지',
    title: '쉼터포장마차',
  }, {
    address: '서울특별시 서대문구 북가좌동 139-21번지',
    title: '서문식당',
  }, {
    address: '서울특별시 서초구 방배동 790-20번지',
    title: '영광',
  }, {
    address: '서울특별시 서초구 반포동 734-25번지',
    title: '짱',
  }, {
    address: '서울특별시 중랑구 신내동 646번지 금강리빙스텔126호',
    title: '본골뱅이',
  }, {
    address: '서울특별시 중구 충무로2가 65-15번지',
    title: '나고야우동',
  }, {
    address: '서울특별시 서초구 방배중앙로 214 (방배동)',
    title: '한국피자헛 방배점',
  }, {
    address: '서울특별시 서초구 양재동 219-0번지',
    title: '짜짜루',
  }, {
    address: '서울특별시 은평구 신사동 20-4번지',
    title: '로겐베르그',
  }, {
    address: '서울특별시 성동구 송정동 66-48번지 (지상1층)',
    title: '호남식당',
  }, {
    address: '서울특별시 영등포구 선유서로30길 17-2, 1층 (양평동1가)',
    title: '굿통치킨양평점',
  }, {
    address: '서울특별시 서대문구 충정로2가 76-0번지',
    title: '바다회집',
  }, {
    address: '서울특별시 송파구 석촌동 255-1번지 ,2호(1층)',
    title: '패밀리호프',
  }, {
    address: '서울특별시 은평구 불광동 631-1번지 대호프라자상가113호',
    title: '차가네민속집',
  }, {
    address: '서울특별시 은평구 갈현동 423-16번지 (지상2층)',
    title: '다래성',
  }, {
    address: '제주특별자치도 제주시 노형동 2519-15번지',
    title: '경마장가는길',
  }, {
    address: '제주특별자치도 제주시 삼도이동 1036-2번지',
    title: '원조돌고래',
  }, {
    address: '전라남도 여수시 박람회길 24, 1층 (덕충동)',
    title: '진식당',
  }, {
    address: '경상남도 창원시 마산합포구 신포동1가 63-5',
    title: '은실횟집',
  }, {
    address: '경상남도 창원시 성산구 신촌동 15-6 유신상가2층4-1호',
    title: '청학동민속촌',
  }, {
    address: '부산광역시 금정구 금강로 255-6 (장전동)',
    title: '원아이딜젝',
  }, {
    address: '부산광역시 남구 수영로 312, 18호 (대연동,21센츄리시티 오피스텔 지하1층)',
    title: '카마타코',
  }, {
    address: '대구광역시 서구 달성공원로5길 7-9 (비산동)',
    title: '서울 칡냉면',
  }, {
    address: '강원특별자치도 양양군 양양읍 남문리 18-7',
    title: '송화식당',
  }, {
    address: '강원특별자치도 원주시 명륜동 115-17',
    title: '개나리',
  }, {
    address: '강원특별자치도 원주시 부론면 노림리 924-1',
    title: '노림식당',
  }, {
    address: '강원특별자치도 원주시 문막읍 건등리 1717',
    title: '먹어보까식당',
  }, {
    address: '강원특별자치도 춘천시 후석로 597 (소양로1가)',
    title: '왕거니감자탕',
  }, {
    address: '강원특별자치도 원주시 단구동 1460-20',
    title: '롱다리순살치킨',
  }, {
    address: '강원특별자치도 춘천시 요선동 14-2',
    title: '놀부보쌈',
  }, {
    address: '서울특별시 용산구 이촌동 302-46번지',
    title: '연극',
  }, {
    address: '서울특별시 송파구 석촌동 296-6번지',
    title: '스테이지레스토랑',
  }, {
    address: '서울특별시 영등포구 여의도동 15-22번지 국민은행9층',
    title: '국민구내실비식당',
  }, {
    address: '서울특별시 서대문구 북아현동 1000-1번지 ,3(지상2층)',
    title: '24시 가마솥 설렁탕',
  }, {
    address: '서울특별시 영등포구 당산동2가 72번지 외2필지',
    title: '나그네',
  }, {
    address: '서울특별시 성동구 성수동1가 13-24번지',
    title: '함지아구탕',
  }, {
    address: '서울특별시 송파구 가락동 98-2번지',
    title: '한우정',
  }, {
    address: '서울특별시 서대문구 북아현동 3-37번지',
    title: '바이타임',
  }, {
    address: '서울특별시 성동구 마장로 216, 1층 (홍익동)',
    title: '인정국물 떡볶이',
  }, {
    address: '서울특별시 종로구 홍지동 46-1번지',
    title: '빨간고추',
  }, {
    address: '서울특별시 양천구 목동서로 65 (목동,목동가든스위트106호107호)',
    title: '카모메목동점',
  }, {
    address: '서울특별시 서초구 서초동 1356-5번지',
    title: '완도수산',
  }, {
    address: '서울특별시 은평구 역말로 143, 1층 (대조동)',
    title: '또래오래(대조·녹번점)',
  }, {
    address: '경기도 용인시 기흥구 동백중앙로 273 (중동,동백훼미리프라자 Ⅱ107호)',
    title: '김밥천국동백쥬네브점',
  }, {
    address: '경기도 의정부시 신곡동 709-2번지',
    title: '강고집반지락칼국수',
  }, {
    address: '경기도 안양시 만안구 안양동 676-237번지',
    title: '부산할머니집',
  }, {
    address: '경기도 의정부시 의정부동 200-16번지 외 3필지 헤드원호텔 지상1층',
    title: '헤드원',
  }, {
    address: '경기도 안양시 동안구 부림로 121 (관양동, 동아프라자 206호)',
    title: '동아한식셀프식당',
  }, {
    address: '경기도 여주시 오학동 272-4번지',
    title: '임가네3대냉면',
  }, {
    address: '경기도 포천시 신읍동 28-41번지',
    title: '첫사랑',
  }, {
    address: '경기도 파주시 월롱면 덕은리 509-6번지',
    title: '고인돌호프',
  }, {
    address: '경기도 용인시 기흥구 신갈로 31 (상갈동)',
    title: '진화식당',
  }, {
    address: '울산광역시 남구 중앙로300번길 21 (신정동,번지 지상1층)',
    title: '서울 한정식',
  }, {
    address: '경상남도 창원시 마산합포구 중앙서1길 78, 1층 일부호 (장군동3가)',
    title: '안동선계찜닭',
  }, {
    address: '부산광역시 해운대구 해운대로 732 (중동, 경남아너스빌상가 105호)',
    title: '오타루',
  }, {
    address: '부산광역시 해운대구 센텀중앙로 90 (재송동, 큐비e센텀본동 지하 102호)',
    title: '버님팜치킨',
  }, {
    address: '대전광역시 서구 만년동 68번지',
    title: '군산별미아구식당',
  }, {
    address: '대전광역시 서구 남선로 31-14 (탄방동)',
    title: '옥천가',
  }, {
    address: '대구광역시 남구 대봉로 59, 1층 (봉덕동)',
    title: '만두에무쳐',
  }, {
    address: '경기도 수원시 권선구 권선동 963',
    title: '친구마차',
  }, {
    address: '경기도 포천시 소흘읍 송우리 122-14번지',
    title: '느낌',
  }, {
    address: '경기도 의정부시 시민로 185 (신곡동, 지상1층)',
    title: '오바사라(캠핑닭발)',
  }, {
    address: '경기도 의정부시 민락동 734-3번지 지상1층',
    title: '시집온닭갈비',
  }, {
    address: '경기도 하남시 신장동 441-15번지',
    title: '후랭크치킨',
  }, {
    address: '경기도 수원시 장안구 연무동 11-48 지하1층',
    title: '휴',
  }, {
    address: '경기도 파주시 법원읍 술이홀로 1034 (1동)',
    title: '실비식당',
  }, {
    address: '경기도 화성시 남양읍 남양리 1187',
    title: '물레식당',
  }, {
    address: '경기도 용인시 처인구 중부대로 1360 (김량장동)',
    title: '큰들',
  }, {
    address: '경기도 의정부시 신곡로 46-9 (신곡동,지상2층)',
    title: '고랭지김치담는마을',
  }, {
    address: '경기도 의왕시 내손동 755번지 우성메디칼 1층 105호',
    title: '와따 포장마차',
  }, {
    address: '충청남도 아산시 둔포면 둔포로 41 ((1층))',
    title: '낙지마당',
  }, {
    address: '충청남도 논산시 대화로133번길 9-4 (대교동)',
    title: '코아루함바식당',
  }, {
    address: '충청남도 당진시 신평면 삽교천3길 95-1',
    title: '참맛있는칼국수',
  }, {
    address: '충청남도 아산시 온천동 83-29번지',
    title: '온양꽃집만두',
  }, {
    address: '경기도 고양시 일산동구 마두동 799-4번지 204호',
    title: '맛고을',
  }, {
    address: '울산광역시 중구 반구동 588-4번지',
    title: '산까치식당',
  }, {
    address: '울산광역시 울주군 온산읍 덕신리 1293-5번지',
    title: '준코덕신점',
  }, {
    address: '울산광역시 울주군 삼남면 봉화마을길 40',
    title: '카페블랙빈',
  }, {
    address: '울산광역시 북구 호계로 380-3 (신천동, 1층)',
    title: '만리장성',
  }, {
    address: '경상남도 창원시 진해구 석동 114-8',
    title: '천하보신',
  }, {
    address: '경상남도 창원시 진해구 죽곡동 453-4',
    title: '대동식당',
  }];
  const resultList = [
    ScheduleResult.NOTYET,
    ScheduleResult.NOTINTERESTED,
    ScheduleResult.HOLD,
    ScheduleResult.CONTRACT,
  ];

  const schedules = await Promise.all(scheduleList.map(async(schedule,i)=>{
    let date = new Date(defaultTime + (random(87840) * 60 * 1000));
    // let address = scheduleList[random(7)];
    let {address, title} = schedule;
    let result: ScheduleResult = ScheduleResult.NOTYET;
    if (date.getTime() < Date.now()) {
      result = ScheduleResult[resultList[random(3)+1]];
    }
    
    const idRandom = random(3);
    const creatorId = 'tm00'+(idRandom+1);
    const viewerId = 'sales00'+((idRandom)*3+random(3)+1)
    console.log(idRandom, creatorId, viewerId);
    return await prisma.schedule.create({
      data: {
        date,
        address,
        creatorId,
        result,
        manager: {
          connect: {
            email: viewerId
          }
        },
        viewer: {
          connect: [
            {
              email: creatorId
            },
            {
              email: "admin001"
            },
          ]
        }
      }
    }).then((e)=> {
      console.log(`schedule ${e.id} start`);
      return e;
    });
  }));

  console.log(schedules);

  const notifications = await Promise.all(notificationsMessage.map(async (message, i)=> {
    console.log(`noti ${i+1} start`);
    let random = crypto.getRandomValues(new Uint8Array(1))[0] % 300+1;
    return await prisma.notification.create({
      data: {
        user: {
          connect: {
            email: 'admin001'
          }
        },
        message,
        link: `/ScheduleList/${random}`,
      }
    }).then((e)=> {
      console.log(`noti ${i+1} done`);
      return e;
    });
  }));
  
  console.log(notifications);
}
main().then(async()=> {
  await prisma.$disconnect();
}).catch(async(e)=> {
  console.error(e)
  await prisma.$disconnect();
  process.exit(1);
})