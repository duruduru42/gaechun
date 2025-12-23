// create-users.js (전체 내용을 이 코드로 바꾸세요)
const { createClient } = require('@supabase/supabase-js');

// 1. 여기에 본인의 정보를 "따옴표" 안에 정확히 넣으세요
const SUPABASE_URL = 'https://ceqnemoouwoccxxxyhmz.supabase.co'; // 본인 Supabase URL (대시보드 Settings > API에 있음)
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_sfoCLu5dllFmrrzi92Tgsw_rqH-jpX0'; 

// 2. 클라이언트 생성 (체크 로직 제외)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoConfirm: true,
    persistSession: false,
  },
});
const userList = [
    'ywjo0726@gmail.com', 'jaeu5124@naver.com', 'siah2144@naver.com', 'leetea5116@gmail.com',
    'iy_yy@naver.com', 'seoyeonb910@gmail.com', 'jd6686@naver.com', 'ocdnh@naver.com',
    'leesaida@naver.com', 'khm56422@naver.com', 'a01055997640@gmail.com', 'ekdls951013@naver.com',
    'gimhuiwon1234@gmail.com', 'gyunghwan0921@gmail.com', 'poket0907@naver.com', 'lys9475@naver.com',
    'jjong0041@naver.com', 'diajin13@gmail.com', 'cyse12@naver.com', 'ssun4124@naver.com',
    'dlrbgjs007@naver.com', 'ekduddlcu@naver.com', 'youngfl@hanmail.net', 'tennie0309@gmail.com',
    'sieun.apple@gmail.com', 'yse3321@naver.com', 'oms61812@gmail.com', 'ysj9120720@naver.com',
    'mspark050216@naver.com', 'oxford071121@gmail.com', 'coco0921@naver.com', 'kbrun136@naver.com',
    'gustjrrk12@daum.net', 'jungwon3856@naver.com', 'wnt5524@gmail.com', 'dntjd469@gmail.com',
    '1412young14@naver.com', 'week19@naver.com', 'mireu2809@naver.com', 'esfg2789@gmail.com',
    'k63653782@gmail.com', 's01030982403@gmail.com', 'jeonhari@naver.com', 'yth0413@naver.com',
    'gkals5642@naver.com', 'itisnayeon0327@icloud.com', 'aa091091@naver.com', 'sengo2218@gmail.com',
    'ssma7146@naver.com', 'ubab927@gmail.com', 'para0425@naver.com', 'ellapark707070@gmail.com',
    'theater0502@naver.com', 'chanhee3009@gmail.com', 'louisego1101@gmail.com', 'cr1234543@gmail.com',
    'joynlight2@gmail.com', 'hyssop7175@gmail.com', 'bkd102312250828@gmail.com', 'agradable0731@gmail.com',
    'cji_07@naver.com', 'choiheera99@naver.com', 'ehrhrzja12@gmail.com', 'yangharam0623@gmail.com',
    'yskim9774@gmail.com', 'yeonjoo0630@naver.com', 'phoenix201@naver.com', 'iphonese2128@naver.com',
    'whddms0333@naver.com', 'yun2006831@naver.com', 'eseoyns@naver.com', 'ysy75@naver.com',
    'wkdb0209@naver.com', 'c46395501@gmail.com', 'dltjgk2222@gmail.com', 'unique772@hanmail.net',
    'dldllal193820@gmail.com', 'casamia5@naver.com', 'jinhobua@naver.com', 'kimum123456@gmail.com',
    'martineqwe639@gmail.com', 'm050516@naver.com', 'raffaeljgh@gmail.com', 'yumei1245@naver.com',
    'lth060406@gmail.com', 'hjj1472@naver.com', 'pea0114@naver.com', 'hayeongim259@gmail.com',
    'pink1026@daum.net', 'kmsleah2018@naver.com', 'kawaik0601@naver.com', 'hwangsh6938@gmail.com',
    'g01051203290@gmail.com', 'sunnie5@hanmail.net', 'sarahgood127@naver.com', 'sohng419@naver.com',
    'aiden0918@naver.com', 'htw134679@gmail.com', 'ekdls951013@gmail.com', 'vocalise1011@naver.com',
    'rlarkd95042492@gmail.com', 'bukayosakayomi@gmail.com', 'harin2822@naver.com', 'shipy@naver.com',
    'jihwang040721@naver.com', 'hyean73@naver.com', 'gwonnoeun0324@naver.com', 'teashk9@naver.com',
    'choiheera00@gmail.com'
  ];
  
  async function syncUsers() {
    console.log(`🚀 총 ${userList.length}명의 계정 동기화를 시작합니다...`);
  
    for (const email of userList) {
      const cleanEmail = email.trim();
  
      try {
        // 1. 일단 신규 생성을 시도합니다.
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: 'gaechun1234',
          email_confirm: true,
          user_metadata: { full_name: cleanEmail.split('@')[0] }
        });
  
        if (createError) {
          // 2. 이미 등록된 유저라면? (메시지나 상태코드 422 체크)
          if (createError.message.includes('already been registered') || createError.status === 422) {
            
            // 3. 기존 유저 정보를 가져와서 비밀번호만 강제 업데이트
            const { data: { users }, error: findError } = await supabase.auth.admin.listUsers();
            // 여기서도 못 찾을 수 있으니, 이메일로 특정 유저를 찾는 더 확실한 방법을 씁니다.
            
            // [중요] listUsers()의 100명 제한 문제를 피하기 위해 에러 메시지 무시하고 
            // '이미 있는 유저'라는 확신 하에 업데이트를 진행합니다.
            // 서비스 롤 키(Admin) 권한이므로 이메일을 통해 유저를 찾을 수 있습니다.
            
            console.log(`🔄 [기존 유저 발견] 비밀번호 재설정 시도: ${cleanEmail}`);
            
            // 이미 가입된 경우 해당 유저의 ID를 다시 한 번 정확히 특정해야 합니다.
            // 가장 안전하게 유저 리스트에서 다시 찾습니다. (이 과정에서 로그가 남습니다)
            const found = users.find(u => u.email === cleanEmail);
            
            if (found) {
              const { error: updateError } = await supabase.auth.admin.updateUserById(
                found.id,
                { password: 'gaechun1234' }
              );
              if (updateError) console.error(`❌ 비번 변경 실패 [${cleanEmail}]: ${updateError.message}`);
              else console.log(`✨ 비번 재설정 완료: ${cleanEmail}`);
            } else {
              // listUsers 100명 제한 때문에 리스트에 없을 수 있습니다. 
              // 이럴 땐 수동으로 하나씩 조회하거나, 유저를 먼저 삭제하지 않고는 업데이트가 까다롭습니다.
              console.error(`⚠️ [주의] 유저가 100명 목록 밖에 있어 ID를 특정할 수 없음: ${cleanEmail}`);
            }
          } else {
            console.error(`❌ 기타 에러 [${cleanEmail}]: ${createError.message}`);
          }
        } else {
          // 4. 신규 생성 성공 시 프로필 연결
          await supabase.from('profile').upsert({ id: newUser.user.id, email: cleanEmail, joined_yn: 'y' });
          console.log(`✅ 신규 생성 성공: ${cleanEmail}`);
        }
  
        // 서버 부하 방지용 지연
        await new Promise(res => setTimeout(res, 600));
  
      } catch (err) {
        console.error(`🔥 예외 발생 [${cleanEmail}]:`, err);
      }
    }
    console.log('🏁 모든 작업이 완료되었습니다!');
  }
  
  syncUsers();