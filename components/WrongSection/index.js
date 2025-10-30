'use client'

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WrongSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    handler(mql);
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, []);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      // 좌우 약간의 내부 여백으로 잘림 방지 (데스크톱은 기존 느낌 유지 수준)
      padding: { left: isDesktop ? 12 : 16, right: isDesktop ? 12 : 16 },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'top',
        offset: isDesktop ? -5 : -3,
        font: { size: isDesktop ? 14 : 12, weight: 'bold' },
        formatter: (value) => value,
        clip: true, // 🔒 라벨이 차트 밖으로 나가며 가로 스크롤 유발하는 것 방지
      },
    },
    scales: {
      y: { display: false, beginAtZero: true, max: 100 },
      x: {
        grid: { display: false },
        ticks: {
          color: '#FFFFFF',
          callback: function (val) {
            const label = this.getLabelForValue(val);
            return typeof label === 'string' ? label.split('\n') : label;
          },
          font: { size: isDesktop ? 12 : 10 },
          padding: isDesktop ? 10 : 8,
          maxRotation: 0,
          autoSkip: false,
        },
      },
    },
    barThickness: isDesktop ? 40 : 28,
  }), [isDesktop]);

  const labels = [
    '최저 백분위\n(경희대 한약학과)',
    '최고 백분위\n(경희대 컴퓨터공학과)',
    '일반전형 백분위\n(전체 평균)',
  ];

  const data = {
    labels,
    datasets: [
      {
        data: [56.17, 88.5, 89.5],
        backgroundColor: ['#FB923C', '#FB923C', '#D1D5DB'],
        borderRadius: 4,
        datalabels: { color: '#fff', anchor: 'end', align: 'top' },
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.3 } },
  };
  const lineVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const boxVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 1.5 } } };

  return (
    // 🔒 섹션 레벨에서 가로 오버플로 차단
    <section className="bg-black py-16 md:py-20">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-screen-lg mx-auto px-4 pl-[max(env(safe-area-inset-left),1rem)] pr-[max(env(safe-area-inset-right),1rem)]"
      >
        <div className="text-left mr-2 mb-12 md:mb-20">
          <motion.p variants={lineVariants} className="text-gray-600 text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            '같은 대학이면 성적 비슷하겠지'
          </motion.p>
          <motion.p variants={lineVariants} className="text-gray-400 text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            '유리하니까 적당히 넣어야지'
          </motion.p>
          <motion.p variants={lineVariants} className="text-gray-200 text-3xl md:text-5xl font-bold mb-10 md:mb-16">
            라는 생각,
          </motion.p>
          <motion.h2 variants={lineVariants} className="text-white text-3xl md:text-5xl font-bold">
            고른기회에선 <span className="text-red-500">손해</span>입니다.
          </motion.h2>
        </div>

        <div className="mt-10 md:mt-16">
          {/* 🔒 카드 자체도 가로 오버플로 방지 */}
          <motion.div variants={boxVariants} className="bg-[#222222] p-2 md:p-12 rounded-lg overflow-x-hidden">
            {/* 모바일: w-full, 데스크탑: w-[80%] (원본 유지) */}
            <div className="h-[260px] md:h-[400px] w-full md:w-[80%] mx-auto">
              <Bar options={options} data={data} plugins={[ChartDataLabels]} />
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-500 text-xs md:text-sm">
                * 합격자 상위 80% 기준, 기회균형 정시 전형 기준
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
