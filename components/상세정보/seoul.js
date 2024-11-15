// components/ui/서울대학교.js

import React from 'react';

export default function Seoul() {
  return (
    <div className="bg-gray-100 p-10 min-h-screen">
      <div className="bg-white p-8 shadow-md mx-auto max-w-4xl">

        {/* Section 1 */}
        <h3 className="text-lg font-semibold mb-4">1. 수능 최저학력기준</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 border">전형</th>
              <th className="py-2 px-4 border">모집단위</th>
              <th className="py-2 px-4 border">수능 최저학력기준</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border text-center">기회균형특별전형 (농어촌·저소득)</td>
              <td className="py-2 px-4 border text-center">전 모집단위 (미술대학, 음악대학 제외)</td>
              <td className="py-2 px-4 border text-center">4개 영역(국어, 수학, 영어, 탐구) 중 3개 영역 등급 합이 7등급 이내</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm mt-2">✢ 탐구영역의 등급은 2개 과목 등급 평균을 반영함</p>
       
        {/* Section 3 */}
        <h3 className="text-lg font-semibold mt-8 mb-4">2. 영역별 반영비</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 border">국어</th>
              <th className="py-2 px-4 border">수학</th>
              <th className="py-2 px-4 border">탐구</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border text-center">100</td>
              <td className="py-2 px-4 border text-center">120</td>
              <td className="py-2 px-4 border text-center">80</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-ms font-semibold mt-8 mb-4">제2외국어, 영어, 한국사 등급별 점수</h3>
        <table className="mt-5 min-w-full border table-fixed">
  <thead>
    <tr className="bg-orange-500 text-white text-sm">
      <th className="py-2 px-2 border w-1/10">등급</th>
      <th className="py-2 px-2 border w-1/10">1</th>
      <th className="py-2 px-2 border w-1/10">2</th>
      <th className="py-2 px-2 border w-1/10">3</th>
      <th className="py-2 px-2 border w-1/10">4</th>
      <th className="py-2 px-2 border w-1/10">5</th>
      <th className="py-2 px-2 border w-1/10">6</th>
      <th className="py-2 px-2 border w-1/10">7</th>
      <th className="py-2 px-2 border w-1/10">8</th>
      <th className="py-2 px-2 border w-1/10">9</th>
    </tr>
  </thead>
  <tbody className="text-sm">
    <tr>
      <td className="py-2 px-2 border text-center">영어 (감점)</td>
      <td className="py-2 px-2 border text-center">0</td>
      <td className="py-2 px-2 border text-center">0.5</td>
      <td className="py-2 px-2 border text-center">2.0</td>
      <td className="py-2 px-2 border text-center">4.0</td>
      <td className="py-2 px-2 border text-center">6.0</td>
      <td className="py-2 px-2 border text-center">8.0</td>
      <td className="py-2 px-2 border text-center">10</td>
      <td className="py-2 px-2 border text-center">12</td>
      <td className="py-2 px-2 border text-center">14</td>
    </tr>
    <tr>
      <td className="py-2 px-2 border text-center">한국사 (감점)</td>
      <td className="py-2 px-2 border text-center">0</td>
      <td className="py-2 px-2 border text-center">0</td>
      <td className="py-2 px-2 border text-center">0</td>
      <td className="py-2 px-2 border text-center">0.4</td>
      <td className="py-2 px-2 border text-center">0.8</td>
      <td className="py-2 px-2 border text-center">1.2</td>
      <td className="py-2 px-2 border text-center">1.6</td>
      <td className="py-2 px-2 border text-center">2.0</td>
      <td className="py-2 px-2 border text-center">2.4</td>
    </tr>
    <tr>
      <td className="py-2 px-2 border text-center">제2외국어 (감점)</td>
      <td className="py-2 px-2 border text-center">0</td>
      <td className="py-2 px-2 border text-center">0</td>
      <td className="py-2 px-2 border text-center">0.5</td>
      <td className="py-2 px-2 border text-center">1.0</td>
      <td className="py-2 px-2 border text-center">1.5</td>
      <td className="py-2 px-2 border text-center">2.0</td>
      <td className="py-2 px-2 border text-center">2.5</td>
      <td className="py-2 px-2 border text-center">3.0</td>
      <td className="py-2 px-2 border text-center">3.5</td>
    </tr>
  </tbody>
</table>



        {/* Section 2 */}
        <h3 className="text-lg font-semibold mt-8 mb-4">3.2025학년도 수능 응시영역기준</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 border">모집단위</th>
              <th className="py-2 px-4 border">수능 응시영역기준</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className="py-2 px-4 border text-center whitespace-nowrap">
            인문대학, 사회과학대학, 간호대학, 경영대학 <br/>
            농경제사회학부,
            교육학과, 국어교육과, 영어교육과, <br/>
            독어교육과, 불어교육과, 사회교육과, 역사교육과, <br/>지리교육과,
            윤리교육과,
            소비자아동학부, 의류학과</td>
            <td className="py-2 px-4 border">
                수학, 탐구 구분 X <br/>
                제2외국어 / 한문 필수
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border text-center whitespace-nowrap">
              물리·천문학부 물리학전공, 물리·천문학부 천문학전공, <br/>화학부, 
              기계공학부, 전기·정보공학부, 에너지자원공학과, <br/>항공우주공학과,
              식물생산과학부, 식품·동물생명공학부, <br/>조경·지역시스템공학부, 바이오시스템·소재학부
              <br/>물리교육과, 화학교육과, 생물교육과,
              의과대학</td>
              <td className="py-2 px-4 border">
                <p>
                ‘물리학Ⅰ, 물리학Ⅱ, 화학Ⅰ, 화학Ⅱ’ 중<br/>
                  1개 과목 이상
                  반드시 응시해야 함<br/>
                또한, Ⅰ+Ⅱ 조합으로 응시할 경우 서로 다른 분야의 과목을 응시해야 함
                  </p>
                <br/><p>수학 선택: 미적분, 기하 중 택1</p>
              </td>
            </tr>

            <tr>
              <td className="py-2 px-4 border text-center whitespace-nowrap">
              수리과학부, 통계학과, 생명과학부, 지구환경과학부, <br/>
              간호대학,
              광역, 건설환경공학부, 재료공학부, <br/>
              컴퓨터공학부, 화학생물공학부, 건축학과, 산업공학과, <br/>
              원자핵공학과, 조선해양공학과
              산림과학부, 응용생물화학부, <br/>
              스마트시스템과학과,
              수학교육과, 지구과학교육과, <br/>
              식품영양학과, 의류학과,
              수의과대학,
              약학대학, <br/>
              첨단융합학부,
              치의학대학원 치의학과</td>
              <td className="py-2 px-4 border">
              과학탐구: 8과목 중 택2
              <br/>
              수학 선택: 미적분, 기하 중 택1



              </td>
            </tr>
          </tbody>
        </table>



        {/* Section 4 */}
        <h3 className="text-ms font-semibold mt-8 mb-4">과학탐구영역 조정점수</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 border">과학탐구 조합</th>
              <th className="py-2 px-4 border">조정점수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border text-center">Ⅰ+Ⅰ</td>
              <td className="py-2 px-4 border text-center">없음</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border text-center">Ⅰ+Ⅱ</td>
              <td className="py-2 px-4 border text-center">3</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border text-center">Ⅱ+Ⅱ</td>
              <td className="py-2 px-4 border text-center">5</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold mt-8 mb-4">4.지원 전 체크 포인트</h3>
        <p class=" text-ms font-bold text-gray-700 leading-normal">
        최저기준이 3합 7이지만, 아무리 고른기회 전형이라고 해도 서울대 지원자가 3합 7을 못 넘는 경우는 거의 없다. 
        <br/>또한 이 최저기준때문에 소위 '상향지원'이 잘되지 않을까?라고 생각한다면 오산이다.

        <br/> <br/>
        기본적으로 서울대학교는 계열별 모집 베이스이다. 하지만, 계열 모집이라도 각 학과 선발 인원이 없지 않다. <br/>
        기회균형특별전형의 학과·전공별 선발 인원은 고등교육법 시행령에 따라 최대 선발 가능 인원은 <br/>
        농어촌 학생: 학과(부)·전공별 입학 정원의 10% 이내, <br/>
        저소득 학생: 학과(부)·전공별 입학 정원의 20% 이내을 초과하지 않는다.
        <br/> <br/>

        예를 들어 사범대학교는 모집인원은 8명이지만, 국어교육과는 10명, 영어교육과는 8명의 합계 정원을 갖고 있다.<br/>
        이런 경우 농어촌은 각각 1명, 기균은 2명씩 선발하게 된다. 이 부분까지 고려해서 지원 학과를 결정해야 한다.
        
        <br/> <br/>
        과탐 조정점수와 제2외국어 등급별 감점은 합불을 결정할만큼 결정적이진 않다. 충분히 만회 가능하니,<br/>
        등급이 낮거나 Ⅱ과목을 고르지 않았더라도 지원을 기피할 필요는 없다.

        <br/> <br/>
        일반 전형과 다르게 수능 성적 100%를 반영한다.

        </p>

      </div>
    </div>
  );
}
