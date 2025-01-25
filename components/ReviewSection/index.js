'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css/effect-coverflow';
import styles from '@/styles/ReviewSection.module.css';
import Image from 'next/image';

import SeoulLogo from '@/components/seoul.svg';
import WonkwangLogo from '@/components/wonkwang.svg';
import YonseiLogo from '@/components/yonsei.svg';
import HanyangLogo from '@/components/hanyang.svg';
import EwhaLogo from '@/components/ewha.svg';
import KunkookLogo from '@/components/kunkook.svg';

export default function SwiperComponents() {
  const reviews = [
    {
      name: "서울대 국어교육과 장xx 학생",
      period: "수시원서, 생기부 관리",
      content: "개천용 덕분에 서울대라는 꿈을 이룰 수 있게 되었습니다. 솔직히 제 생기부로 서울대를 말씀하셨을 때 의심스러웠는데, 지원근거와 불합격을 대비한 전략까지 모두 짜주셔서 과감하게 쓸 수 있었던 것 같아요. 또한 고른기회 전형만 하신다고 하셔서 생기부 컨설팅을 다른 업체와 병행해서 했는데 솔직히 열정도 그렇고 실력, 피드백 속도도 모두 타업체에 비해 뛰어났습니다.",
      logo: SeoulLogo
    },
    {
      name: "원광대 의예과 김xx 학생",
      period: "수시원서, 생기부 관리",
      content: "중학교 때부터 꿈꿔오던 의사의 꿈을 이루게 되었습니다. 처음엔 기회균형담당이라는 이유만으로 상담의 퀄리티가 다소 떨어질 것이라 생각했지만, 정반대였습니다. 선생님과 만들었던 생기부는 지금까지 본 것 중에 최고였습니다. 중학교 2학년 때부터 꿈꿔오던 의사라는 꿈을 이루기 위해서는 내신을 일단 잘 따놓자는 생각에 지금 학교를 선택하게 되었고, 결국 선생님께서 그 마지막을 채워주셨습니다.",
      logo: WonkwangLogo
    },
    {
      name: "연세대 경영학과 이xx 학생",
      period: "수시원서",
      content: "다른 컨설팅 업체와는 뭔가 다르다는 것을 느꼈습니다. 오랫동안 개천용 컨설팅 블로그를 보고, 컨설팅 맡겨봐야겠다고 생각하였습니다. 뭔가 고른기회 전형 학생들의 입장을 고려해서 상담을 해주시는 점이 좋았습니다. 또한, 왜 이렇게까지 해주시지? 싶을 정도로 상담 이후에 Q&A도 지극 정성으로 해주셨습니다. 개천용 덕분에 성공적인 입시 치룰 수 있었습니다. 감사합니다.",
      logo: YonseiLogo
    },
    {
      name: "한양대 전기생체공학과 신xx 학생",
      period: "정시원서",
      content: "3장 모두 최초합으로 마무리 했습니다. 기균이라 정보도 없고 막막했는데 속 시원하게 집어주셔서 너무 좋았습니다. 한양대 붙을 줄 생각도 못했는데 붙어서 너무 좋네요. 본 컨설팅 끝나고도 추가로 자유롭게 질문이 가능한 것도 너무 좋았고 원서 쓰기 전에 불안해서 이것저것 여쭤본 거 같은데 다 친절히 알려주셔서 너무 감사했습니다.",
      logo: HanyangLogo
    },
    {
      name: "이화여대 인공지능대학 한xx 학생",
      period: "정시원서",
      content: "이화여대 합격 했습니다. 소신권이라 많이 불안하고 정말 가고 싶었는데, 합격하게 돼서 너무 기쁘네요. 특별전형 특성 상 정보가 매우 적어서 준비하는 동안 막막했는데 신경 써주시고 응원해 주신 덕분에 좋은 결과 나온 거 같아요! 진심으로 감사드립니다.",
      logo: EwhaLogo
    },
    {
      name: "건국대 의류디자인학과 배xx 학생",
      period: "정시원서",
      content: "밤새 상담도 했는데 예비로 입시 끝날까봐 엄청 마음 졸였는데 진짜 덕분에 좋은 결과 나왔어요 감사해요. 혼자 했으면 고민하다 절대 못 넣었을 학교인데 아직 꿈만 같습니다. 주변에 누가 농어촌 정시한다고 하면 추천 꼭 할게요 진짜 컨설팅이 다 한 거 같아요",
      logo: KunkookLogo
    }
  ];

  return (
    <div className="w-full py-20 bg-[#0F0B1B] flex flex-col items-center">
      <h2 className="text-center text-white text-4xl font-bold mb-16">
        수강생들의 생생한 수강 후기
      </h2>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2.5}
        initialSlide={1}
        coverflowEffect={{
          rotate: 0,
          stretch: 50,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        navigation={true}
        loop={true}
        modules={[Navigation, EffectCoverflow]}
        className={styles.reviewSwiper}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="w-[400px]">
            <div className="bg-white rounded-[32px] p-8 transition-all duration-300 min-h-[500px] flex flex-col">
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center relative">
                  <Image 
                    src={review.logo}
                    alt={`${review.name} 프로필`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-orange-400 font-bold text-xl mb-1">{review.name}</h3>
                  <p className="text-gray-400 text-lg">{review.period} 컨설팅</p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed text-base text-center flex-1">
                {review.content}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
