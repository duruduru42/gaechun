"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import gaechunLogo from "@/components/gaechun.svg";

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selection_type, setSelectionType] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleKeyDown = (e, nextElementId) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextElement = document.getElementById(nextElementId);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

  const isPage3Valid = () => {
    return (
      validateEmail(email) &&
      password.length >= 8 &&
      password.length <= 16 &&
      /\d/.test(password) &&
      /[a-zA-Z]/.test(password) &&
      password === confirmPassword &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== ''
    );
  };

  const validateName = (name) => {
    const re = /^[가-힣]+$/;
    return re.test(name);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{11}$/;
    return re.test(phoneNumber);
  };

  const handleSignUp = async () => {
    let validationErrors = {};

    // 유효성 검사
    if (!validateEmail(email)) {
        validationErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }
    if (
        password.length < 8 ||
        password.length > 16 ||
        !/\d/.test(password) ||
        !/[a-zA-Z]/.test(password)
    ) {
        validationErrors.password = "비밀번호는 8~16자리의 영문과 숫자 조합이어야 합니다.";
    }
    if (password !== confirmPassword) {
        validationErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(validationErrors);

    // 에러가 없을 때 회원가입 실행
    if (Object.keys(validationErrors).length === 0) {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: name,
                    phone: phoneNumber,
                    gender: gender,
                    selection_type: selection_type,
                    coins: 3,
                    image_url: null
                }
            }
        });

        if (error) {
            console.error("Error signing up:", error.message);
            alert(`회원가입 중 오류 발생: ${error.message}`);
            return;
        }

        alert("이메일 인증 부탁드립니다.");
        console.log("User signed up: ", data.user);
    } else {
        alert("모든 필드를 올바르게 입력해주세요.");
    }
};

  const isPage2Valid = () => {
    return (
      validateName(name) &&
      gender &&
      validatePhoneNumber(phoneNumber) &&
      selection_type
    );
  };

  const handleNextPage2 = () => {
    let validationErrors = {};

    if (!validateName(name)) {
      validationErrors.name = "한글로 된 이름을 입력해주세요.";
    }

    if (!validatePhoneNumber(phoneNumber)) {
      validationErrors.phoneNumber = "전화번호는 11자리의 숫자여야 합니다.";
    }

    if (!selection_type) {
      validationErrors.selection_type = "전형을 선택해주세요.";
    }

    if (!(gender === "남학생" || gender === "여학생")) {
      validationErrors.gender = "성별을 선택해주세요.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setPage(3);
    } else {
      alert('모든 필드를 올바르게 입력해주세요.');
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="absolute top-4 left-4">
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-md shadow-md space-y-5">
        <div className="flex justify-center mb-6">
          <Image src={gaechunLogo} alt="Gaechun Logo" width={100} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        <div className="text-center font-semibold text-gray-300">
          {["1. 약관동의", "2. 학생정보", "3. 계정정보", "4. 이메일인증"].map((step, index) => (
            <span key={index} className={`mx-2 ${page === index + 1 ? "text-orange-600" : ""}`}>
              {step} {index < 3}
            </span>
          ))}
        </div>        
        <hr className="w-full border-gray-300" />
        {page === 1 && (
          <div>
            <div className="space-y-3">
            <div className="border p-3 rounded h-32 overflow-y-scroll bg-gray-100">
              <p className="text-sm">
            제1조(목적)
이 약관은 개천용입시컨설팅이 운영하는 인터넷 사이트(이하 "사이트"라 한다)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 한다)를 이용함에 있어 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
<br/>
<br/>
제2조(정의)
①"사이트"란 개천용입시컨설팅이 유료 상품(이하 "재화등"이라 함)을 이용자에게 제공하기 위하여 컴퓨터등 정보통신설비를 이용하여 재화등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이트를을 운영하는 사업자의 의미로도 사용합니다.
②"이용자"란 "사이트"에 접속하여 이 약관에 따라 "사이트"가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
③ ‘회원’이라 함은 "사이트"에 개인정보를 제공하여 회원등록을 한 자로서, "사이트"의 정보를 지속적으로 제공받으며, "사이트"가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
④ ‘비회원’이라 함은 회원에 가입하지 않고 "사이트"에서 제공하는 서비스를 이용하는 자를 말합니다.
<br/>
<br/>
제3조 (약관등의 명시와 설명 및 개정) 
① "사이트"는 이 약관의 내용과 상호 및 대표자 성명, 영업장 소재지, 전화번호·모사전송번호·전자우편주소, 사업자등록번호, 통신판매업신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 "사이트"의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
② "사이트은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 제공하여 이용자의 확인을 구하여야 합니다.
③ "사이트"는 전자상거래등에서의소비자보호에관한법률, 약관의규제에관한법률, 전자거래기본법, 전자서명법, 정보통신망이용촉진등에관한법률, 방문판매등에관한법률, 소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
④ "사이트"가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 사이트의 초기화면에 그 적용일자 7일이전부터 적용일자 전일까지 공지합니다.
다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 "사이트"는 개정전 내용과 개정후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다. 
⑤ "사이트"가 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간내에 ‘사이트"에 송신하여 "사이트"의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.
⑥ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래등에서의소비자보호에관한법률, 약관의규제등에관한법률, 공정거래위원회가 정하는 전자상거래등에서의소비자보호지침 및 관계법령 또는 상관례에 따릅니다.
<br/>
<br/>

제4조(서비스의 제공 및 변경) 
① "사이트"는 다음과 같은 업무를 수행합니다.
1. 유료 정보 제공 및 구매계약의 체결
2. 기타 "사이트"가 정하는 업무
②"사이트"는 제공되는 유료 정보 제공이 변경되는 경우에는 장차 체결되는 계약에 의해 제공할 유료 정보의  내용을 변경할 수 있습니다. 이 경우에는 변경된 유료 정보의 내용 및 제공일자를 명시하여 현재의 유료 정보의 내용을 게시한 곳에 즉시 공지합니다.
③"사이트"가 제공하기로 이용자와 계약을 체결한 서비스의 내용을 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.
④전항의 경우 "사이트"는 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, "사이트"가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
<br/>
<br/>

제5조(서비스의 중단) 
① "사이트"는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
②"사이트"는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, "사이트"가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
③사업종목의 전환, 사업의 포기, 업체간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 "사이트"는 제8조에 정한 방법으로 이용자에게 통지하고 당초 "사이트"에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, "사이트"가 보상기준 등을 고지하지 아니한 경우에는 "사이트"에서 통용되는 현물 또는 현금으로 이용자에게 지급합니다.
<br/>
<br/>

제6조(회원가입) 
① 이용자는 "사이트"가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
② "사이트"는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다.
1. 가입신청자가 이 약관 제7조 제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우
2. 등록 내용에 허위, 기재누락, 오기가 있는 경우
3. 기타 회원으로 등록하는 것이 "사이트"의 기술상 현저히 지장이 있다고 판단되는 경우
③ 회원가입계약의 성립시기는 "사이트"의 승낙이 회원에게 도달한 시점으로 합니다.
④ 회원은 제15조제1항에 의한 등록사항에 변경이 있는 경우, 즉시 전자우편 기타 방법으로 "사이트"에 대하여 그 변경사항을 알려야 합니다.
<br/>
<br/>

제7조(회원 탈퇴 및 자격 상실 등) 
① 회원은 "사이트"에 언제든지 탈퇴를 요청할 수 있으며 "사이트"는 즉시 회원탈퇴를 처리합니다.
② 회원이 다음 각호의 사유에 해당하는 경우, "사이트"는 회원자격을 제한 및 정지시킬 수 있습니다.
1. 가입 신청시에 허위 내용을 등록한 경우
2. "사이트"을 이용하여 구입한 재화등의 대금, 기타 "사이트"가용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우
3. 다른 사람의 "사이트" 이용을 방해하거나 그 정보를 도용하는 등 질서를 위협하는 경우
4. "사이트"을 이용하여 법령 또는 이 약관이 금지하거나 미풍양속에 반하는 행위를 하는 경우
5. 다른 사람의 주민등록번호 등의 명의를 사용하여 회원 가입을 하였을 때
③ "사이트"가 회원 자격을 제한·정지 시킨후, 동일한 행위가 2회이상 반복되거나 30일이내에 그 사유가 시정되지 아니하는 경우 "사이트"는 회원자격을 상실시킬 수 있습니다.
④ "사이트"가 회원 자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 전자우편으로 이를 통지합니다.
⑤ "사이트"의 최종 접속 이후 1년간 접속이 없을 때에는 회원에게 전자우편으로 고지 후 7일 이내에 접속하지 않을 경우 회원 자격을 상실하게 됩니다.
<br/>
<br/>

제8조(회원에 대한 통지)
① "사이트"가 회원에 대한 통지를 하는 경우, 회원이 "사이트"과 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.
② "사이트"는 불특정다수 회원에 대한 통지의 경우 1주일이상 "사이트" 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.
<br/>
<br/>

제9조(구매신청)
"사이트"이용자는 "사이트"에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, "사이트"는 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.
1. 유료상품의 제공 내역과 이용범위
2. 청약철회권이 제한되는 서비스에 대한 확인
3. 유료상품 구매시 주의사항에 대한 동의
4. 결제방법의 선택

<br/>
<br/>
제10조 (계약의 성립)
① "사이트"는 제9조와 같은 구매신청에 대하여 다음 각호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.
1. 신청 내용에 허위, 기재누락, 오기가 있는 경우
2. 기타 구매신청에 승낙하는 것이 "사이트" 기술상 현저히 지장이 있다고 판단하는 경우
② "사이트"의 승낙이 제12조제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
<br/>
<br/>

제11조(지급방법)
"사이트"에서 구매한 유료상품에 대한 대금지급방법은 다음 각호의 방법중 가용한 방법으로 할 수 있습니다. 단, "사이트"는 이용자의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도  추가하여 징수할 수 없습니다.
1. 계좌이체 
2. 신용카드
3. 온라인무통장입금
4. "사이트"과 계약을 맺었거나 "사이트"가 인정한 상품권에 의한 결제  
5. 기타 전자적 지급 방법에 의한 대금 지급 등

<br/>
<br/>
제12조(수신확인통지·구매신청 변경 및 취소)
① "사이트"는 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.
② 수신확인통지를 받은 이용자는 의사표시의 불일치등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 "사이트"는 상품 이용 이전에 요청이 있는 경우에는 지체없이 그 요청에 따라 처리하여야 합니다. 다만 이미 대금을 지불한 경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.
<br/>
<br/>

제13조(재화등의 공급)
① "사이트"는 대금의 전부를 받은 경우에는 즉시 이용할 수 있도록 공급하도록 합니다.
② "사이트"가 기술적/외적 변인으로 인해 공급시기를 지체시 2영업일 이내에 조치를 취합니다. 이때 "사이트"는 이용자가 공급시기의 지체 사유와 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.
<br/>
<br/>

제14조(환급)
① "사이트"는 이용자가 구매신청한 재화등이 기술적 결함 등의 사유로 이용할 수 없을 때에는 지체없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 2영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.
<br/>
<br/>

제15조(청약철회 등)
①"사이트"과 재화등의 구매에 관한 계약을 체결한 이용자는 대금 지급일로부터 7일 이내에는 청약철회 요청을 할 수 있습니다.
② 이용자는 다음 각호의 1에 해당하는 경우에는 환불을 요구할 수 없습니다.
1. 이용자의 개인 맞춤형 유료상품의 결과를 열람한 경우
2. 이용자의 성적으로 지원 가능한 대학 정보를 검색하여 열람한 경우
3. 이용자 구매정보를 공유하여 타 사용자가 이용한 경우
③ "사이트"가 사전에 청약철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 구매 전 체험상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약철회등이 제한되지 않습니다.
④ 이용자는 제1항 및 제2항의 규정에 불구하고 재화등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 때에는 당해 재화등을 공급받은 날부터 3일이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.
<br/>
<br/>

제16조(청약철회 등의 효과)
① "사이트"는 이용자로부터 재화 등을 반환받은 경우 3영업일 이내에 이미 지급받은 재화등의 대금을 환급합니다. 이 경우 "사이트"가 이용자에게 재화등의 환급을 지연한 때에는 그 지연기간에 대하여 공정거래위원회가 정하여 고시하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.
② "사이트"는 위 대금을 환급함에 있어서 이용자가 신용카드 등의 결제수단으로 재화등의 대금을 지급한 때에는 지체없이 당해 결제수단을 제공한 사업자로 하여금 재화등의 대금의 청구를 정지 또는 취소하도록 요청합니다.
③ 청약철회등의 경우 공급받은 재화등의 반환에 필요한 비용은 이용자가 부담합니다.(예: 지급수수료) "사이트"는 이용자에게 청약철회등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행되어 청약철회등을 하는 경우 재화등의 반환에 필요한 비용은 "사이트"가 부담합니다.
<br/>
<br/>

제17조(개인정보보호)
① "사이트"는 이용자의 정보수집시 구매계약 이행에 필요한 최소한의 정보를 수집합니다. 다음 사항을 필수사항으로 하며 그 외 사항은 선택사항으로 합니다. 
1. 성명
2. 주민등록번호(회원의 경우) 또는 외국인등록번호
3. 전자우편주소(또는 이동전화번호)
4. 전화번호
5. 희망ID(회원의 경우)
6. 비밀번호(회원의 경우)
② "사이트"이 이용자의 개인식별이 가능한 개인정보를 수집하는 때에는 반드시 당해 이용자의 동의를 받습니다.
③ 제공된 개인정보는 당해 이용자의 동의없이 목적외의 이용이나 제3자에게 제공할 수 없으며, 다음의 경우에는 예외로 합니다.
1. 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는 경우
2. 재화등의 거래에 따른 대금정산을 위하여 필요한 경우
3. 도용방지를 위하여 본인확인에 필요한 경우
4. 법률의 규정 또는 법률에 의하여 필요한 불가피한 사유가 있는 경우
④ "사이트"이 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 정보통신망이용촉진등에관한법률 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.
⑤ 이용자는 언제든지 "사이트"이 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 "사이트"은 이에 대해 지체없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 "사이트"은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
⑥ "사이트"은 개인정보 보호를 위하여 관리자를 한정하여 그 수를 최소화하며 신용카드, 은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을  집니다.
⑦ "사이트" 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는 당해 개인정보를 지체없이 파기합니다.
<br/>
<br/>

제18조("사이트"의 의무)
① "사이트"는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 유료 정보 상품을 제공하는데 최선을 다하여야 합니다.
② "사이트"는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
<br/>
<br/>

제19조(회원의 ID 및 비밀번호에 대한 의무)
① 제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.
③ 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 "사이트"에 통보하고 "사이트"의 안내가 있는 경우에는 그에 따라야 합니다.

<br/>
<br/>
제20조(이용자의 의무)
이용자는 다음 행위를 하여서는 안됩니다.
1. 신청 또는 변경시 허위 내용의 등록
2. 타인의 정보 도용
3. "사이트"에 게시된 정보의 변경
4. "사이트"가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
5. "사이트" 기타 제3자의 저작권 등 지적재산권에 대한 침해
6. "사이트" 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 사이트에 공개 또는 게시하는 행위

<br/>
<br/>
제21조(연결"사이트"과 피연결"사이트" 간의 관계)
① 상위 "사이트"과 하위 "사이트"가 하이퍼 링크(예: 하이퍼 링크의 대상에는 문자, 그림 및 동화상 등이 포함됨)방식 등으로 연결된 경우, 전자를 연결 "사이트"(웹 사이트)이라고 하고 후자를 피연결 "사이트"(웹사이트)이라고 합니다.
②연결"사이트"는 피연결"사이트"가 독자적으로 제공하는 재화등에 의하여 이용자와 행하는 거래에 대해서 보증책임을 지지 않는다는 뜻을 연결"사이트"의 초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에 대한 보증책임을 지지 않습니다.
<br/>
<br/>

제22조(저작권의 귀속 및 이용제한)
① "사이트"이 작성한 저작물에 대한 저작권 기타 지적재산권은 "사이트"에 귀속합니다.
② 이용자는 "사이트"을 이용함으로써 얻은 정보 중 "사이트"에게 지적재산권이 귀속된 정보를 "사이트"의 사전 승낙없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
③ "사이트"는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.

<br/>
<br/>
제23조(분쟁해결)
① "사이트"는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구(고객문의 게시판)를 설치·운영합니다.
② "사이트"는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
③"사이트"과 이용자간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
<br/>
<br/>

제24조(재판권 및 준거법)
①"사이트"과 이용자간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
②"사이트"과 이용자간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
</p>
              </div>
              <div>
                <label className="block mb-10 text-sm">
                  <input type="checkbox" checked={agree1} onChange={(e) => setAgree1(e.target.checked)} className="mr-2" />
                  이용약관에 동의합니다. (필수)
                </label>
              </div>
              <div className="border p-3 rounded h-32 overflow-y-scroll bg-gray-100">
                <p className="text-sm">
              [수집하는 개인정보 항목]

회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다. 
<br/><br/>
● 수집항목
이름, 로그인ID, 비밀번호, 연락처, 이메일,  서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보, 결제기록, 성적, 모의지원대학
<br/><br/>

● 개인정보 수집방법
홈페이지(회원가입,무료이용), 서면양식, 제휴사로부터의 제공 
<br/><br/>

[개인정보의 수집 및 이용목적] 
<br/><br/>

회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다. 
<br/><br/>


● 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
콘텐츠 제공, 구매 및 요금 결제
<br/><br/>

● 회원 관리
회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인, 만14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인, 불만처리 등 민원처리, 고지사항 전달
<br/><br/>

● 마케팅 및 광고에 활용
입시관련 성적과 목표대학 통계, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계 
<br/><br/>

[개인정보의 보유 및 이용기간]
<br/><br/>

원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다. 
<br/>

- 보존 항목 : 성적, 모의지원대학
- 보존 근거 : 통계용도
- 보존 기간 : 1년 
<br/><br/>

그리고 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 
<br/>

- 표시/광고에 관한 기록 : 6개월 (전자상거래등에서의 소비자보호에 관한 법률)
- 계약 또는 청약철회 등에 관한 기록 : 5년 (전자상거래등에서의 소비자보호에 관한 법률)
- 대금결제 및 재화 등의 공급에 관한 기록 : 5년 (전자상거래등에서의 소비자보호에 관한 법률)
- 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래등에서의 소비자보호에 관한 법률) 
- 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년 (신용정보의 이용 및 보호에 관한 법률) 통신비밀보호법에 따른 통신사실확인자료 3개월 	
</p>
</div>
              <div>
                <label className="block mb-1 text-sm">
                  <input type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)} className="mr-2" />
                  개인정보처리방침에 동의합니다. (필수)
                </label>
              </div>
            </div>
            <div className="flex mt-4 justify-end">
            <Button
            className={`p-3 rounded ${agree1 && agree2 ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
            onClick={() => setPage(2)}
            disabled={!agree1 || !agree2}
          >
            다음
          </Button>

            </div>
          </div>
        )}

{page === 2 && (
  <div>
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-2/3">
        <label className="block mb-1">이름 *</label>
        <input
          type="text"
          placeholder="제출하실 성적표와 같아야 합니다."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
          onKeyDown={(e) => handleKeyDown(e, 'phonenumber')}
          id="name"
        />
      </div>
      <div className="w-2/3">
        <label className="block mb-1">전화번호 *</label>
        <input
          type="text"
          placeholder="01012345678 ('-하이픈없이')"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-3 border rounded"
          onKeyDown={(e) => handleKeyDown(e, 'gender1')}
          id="phonenumber"
        />
      </div>
      <div className="w-2/3">
        <label className="block mb-1">성별 *</label>
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="gender"
              value="남학생"
              checked={gender === "남학생"}
              onChange={(e) => setGender(e.target.value)}
              className="mr-2"
              onKeyDown={(e) => handleKeyDown(e, 'gender2')}
               id="gender1"
            />
            남학생
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="여학생"
              checked={gender === "여학생"}
              onChange={(e) => setGender(e.target.value)}
              className="mr-2"
              onKeyDown={(e) => handleKeyDown(e, 'type')}
             id="gender2"
            />
            여학생
          </label>
        </div>
      </div>
      <div className="w-2/3">
        <label className="block mb-1">전형을 선택하세요 *</label>
        <select
          value={selection_type}
          onChange={(e) => setSelectionType(e.target.value)}
          className="w-full p-3 border rounded"
          onKeyDown={(e) => handleKeyDown(e, 'next')}
          id="type"
        >
          <option value="">전형을 선택하세요</option>
          <option value="기회균형전형">기회균형전형</option>
          <option value="농어촌전형">농어촌전형</option>
          <option value="특성화고전형">특성화고전형</option>
        </select>
      </div>
    </div>
    <div className="flex justify-end mt-4">
      <Button
             className={`p-3 rounded ${isPage2Valid() ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
            onClick={() => setPage(3)}
            disabled={!isPage2Valid()}
            id="next"
            >
            다음
          </Button>
    </div>
  </div>
)}

{page === 3 && (
  <div>
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-2/3">
        <label className="block mb-1">이메일 주소 *</label>
        <input
          type="email"
          placeholder="인증 가능한 이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
          onKeyDown={(e) => handleKeyDown(e, 'passwordInput')}
          id="emailInput"
        />
        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
      </div>
      <div className="w-2/3">
        <label className="block mb-1">비밀번호 입력 *</label>
        <input
          type="password"
          placeholder="8~16자리 사이"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
          onKeyDown={(e) => handleKeyDown(e, 'confirmPasswordInput')}
          id="passwordInput"
        />
        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
      </div>
      <div className="w-2/3">
        <label className="block mb-1">비밀번호 재입력 *</label>
        <input
          type="password"
          placeholder="동일한 비밀번호 입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded"
          onKeyDown={(e) => handleKeyDown(e, 'nextButton')}
          id="confirmPasswordInput"
        />
        {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
      </div>
    </div>
    <div className="flex justify-end mt-4">
      <Button
        className={`p-3 rounded ${isPage3Valid() ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
        onClick={() => {
          handleSignUp();
          if (isPage3Valid()) setPage(4);
        }}        disabled={!isPage3Valid()}
        id="nextButton"
      >
        다음
      </Button>
    </div>
  </div>
)}

        {page === 4 && (
          <div>
            <div className="text-center">
              <h2 className="text-xl font-bold">이메일 인증</h2>
              <p className="text-gray-600 mt-10">기재해주신 이메일 주소로 인증메일을 보내드렸습니다
                <br/>메일함으로 가셔서 인증메일에서 '인증하기' 버튼을 누르시면 완료됩니다.
                <br/>만약 메일이 오지 않은 경우, 스팸 메일함 확인 부탁드립니다.
                <br/>스팸 메일함에도 없다면 고객센터로 문의 바랍니다. </p>
                <Button
                className="mt-4 bg-orange-500 text-white p-3 rounded"
                onClick={ router.push('/')}
            >
                확인
            </Button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
