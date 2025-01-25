'use client'

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from 'react';

// Chart.js 기본 설정 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BackgroundGraph() {
  const [chartData, setChartData] = useState({
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "누적 학생 수",
        data: Array(6).fill(0), // 초기값을 0으로 설정
        borderColor: "#FB923C",
        backgroundColor: "rgba(251, 146, 60, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  });

  const finalData = [60, 220, 520, 900, 1300, 1700];

  useEffect(() => {
    // IntersectionObserver를 사용하여 요소가 화면에 보일 때 애니메이션 시작
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setChartData(prev => ({
            ...prev,
            datasets: [{
              ...prev.datasets[0],
              data: finalData
            }]
          }));
        }
      },
      { threshold: 0.1 }
    );

    const graphElement = document.getElementById('graph-container');
    if (graphElement) {
      observer.observe(graphElement);
    }

    return () => {
      if (graphElement) {
        observer.unobserve(graphElement);
      }
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 그래프 크기 커스터마이징 가능
    plugins: {
      legend: {
        display: false, // 레전드 숨김
      },
      tooltip: {
        enabled: false, // 툴팁 비활성화
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "년도", // x축 제목
          font: {
            size: 16,
          },
        },
        grid: {
          display: false, // x축 그리드 숨김
        },
        ticks: {
        },
      },
      y: {
        title: {
          display: true,
          text: "학생 수", // y축 제목
          font: {
            size: 16,
          },
                },
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)", // y축 그리드 투명도 조정
        },
        ticks: {
          stepSize: 500, // y축 간격 설정
        },
      },
    },
    animation: {
      duration: 2000, // 애니메이션 지속 시간 (ms)
      easing: 'easeInOutQuart', // 이징 함수
    },
    transitions: {
      active: {
        animation: {
          duration: 2000
        }
      }
    },
  };

  return (
    <div className="relative w-full max-w-screen-lg h-[500px] mx-auto my-16" id="graph-container">
      {/* 그래프 배경 */}
      <div className="absolute inset-0 z-0 opacity-70">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
