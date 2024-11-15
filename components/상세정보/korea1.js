// components/ui/서울대학교.js

import React from 'react';

export default function Korea() {
  return (
    <div className="bg-gray-100 p-10 min-h-screen">
      <div className="bg-white p-8 shadow-md mx-auto max-w-4xl">

        {/* Section 3 */}
        <h3 className="text-lg font-semibold mb-4">1. 영역별 반영비</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-orange-500 text-white">
            <th className="py-2 px-4 border"></th>
              <th className="py-2 px-4 border">국어</th>
              <th className="py-2 px-4 border">수학</th>
              <th className="py-2 px-4 border">탐구</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td className="py-2 px-4 border text-center">자연계</td>
              <td className="py-2 px-4 border text-center">200</td>
              <td className="py-2 px-4 border text-center">240</td>
              <td className="py-2 px-4 border text-center">200</td>
            </tr>
            <tr>
            <td className="py-2 px-4 border text-center">인문계</td>
              <td className="py-2 px-4 border text-center">200</td>
              <td className="py-2 px-4 border text-center">200</td>
              <td className="py-2 px-4 border text-center">160</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-ms font-semibold mt-8 mb-4">영어, 한국사 등급별 점수</h3>
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
      <td className="py-2 px-2 border text-center">3</td>
      <td className="py-2 px-2 border text-center">6</td>
      <td className="py-2 px-2 border text-center">9</td>
      <td className="py-2 px-2 border text-center">12</td>
      <td className="py-2 px-2 border text-center">15</td>
      <td className="py-2 px-2 border text-center">18</td>
      <td className="py-2 px-2 border text-center">21</td>
      <td className="py-2 px-2 border text-center">24</td>
    </tr>
    <tr>
      <td className="py-2 px-2 border text-center">한국사 (가점)</td>
      <td className="py-2 px-2 border text-center">10</td>
      <td className="py-2 px-2 border text-center">10</td>
      <td className="py-2 px-2 border text-center">10</td>
      <td className="py-2 px-2 border text-center">10</td>
      <td className="py-2 px-2 border text-center">9.8</td>
      <td className="py-2 px-2 border text-center">9.6</td>
      <td className="py-2 px-2 border text-center">9.4</td>
      <td className="py-2 px-2 border text-center">9.2</td>
      <td className="py-2 px-2 border text-center">8.0</td>
    </tr>

  </tbody>
</table>

<h3 className="text-lg font-semibold mt-8 mb-4">2.수능 응시영역기준</h3>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 border"></th>
              <th className="py-2 px-4 border">수학</th>
              <th className="py-2 px-4 border">탐구</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border text-center">인문계</td>
              <td className="py-2 px-4 border text-center">확률과 통계, 미적분, 기하</td>
              <td className="py-2 px-4 border text-center">과학탐구, 사회탐구</td>
            </tr>
            <tr>
            <td className="py-2 px-4 border text-center">자연계</td>
              <td className="py-2 px-4 border text-center">확률과 통계, 미적분, 기하</td>
              <td className="py-2 px-4 border text-center">과학탐구</td>
            </tr>
          </tbody>
        </table>


        <h3 className="text-lg font-semibold mt-8 mb-4">3.탐구 영역 주의점</h3>
        <p class=" text-ms font-bold text-gray-700 leading-normal">        
          1) 탐구영역은 별도 지정과목이 없으며 반드시 2개 과목을 응시해야 함 <br/>
        ※ 탐구영역 2개 과목은 동일 분야 ‘I + II’를 인정하지 않음
        (예: ‘물리학Ⅰ+생명과학Ⅰ’ 인정, ’화학Ⅰ+화학Ⅱ’ 인정하지 않음) <br/>
        ※ 탐구영역은 제2외국어/한문 영역으로 대체할 수 없으며 직업탐구는 인정하지 않음
        (단, 특성화고전형 지원자는 직업탐구도 인정) 
        
          </p>
        
        <h3 className="text-lg font-semibold mt-8 mb-4">4.지원 전 체크 포인트</h3>
        <p class=" text-ms font-bold text-gray-700 leading-normal">        
        고려대학교가 상향지원에 유리하다는 말은 정말 많이 해서 짧게만 말하겠다. <br/>
        고려대학교가 고른기회 전형으로 선발한 이래로 3등급 이하 합격자가 없었던 적은 단 한 번도 없다. <br/>
        이유는 당연하게도 '심리적 불안감'. <br/><br/>
        고려대학교는 과별 모집으로 선발하는 대학으로 각 모집인원이 1명인 모집단위가 굉장히 많다.
        <br/>고려대의 실질적 지원자는 안정적인 성향을 갖고 있기 때문에 자연스럽게 1명이 지원하는 학과는 기피하게 되고,
        <br/>이로 인해 낮은 지원자에게까지 기회가 돌아간다.

        <br/><br/>고려대를 넣고 싶다면 경쟁률을 고려하지 말자. 모집인원이 1명이기 때문에 3:1, 4:1만 되어도 쉽사리 넣기가 쉽지 않다.
        그 지원자들의 성적이 어떤지도 모르지만 어쩔 수 없는 두려움이 생긴다. 
        
          </p>

      </div>
    </div>
  );
}
