'use client'

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function WrongSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
            datalabels: {
                color: '#fff',
                anchor: 'end',
                align: 'top',
                offset: -5,
                font: {
                    size: 14,
                    weight: 'bold'
                },
                formatter: (value) => value
            }
        },
        scales: {
            y: {
                display: false,
                beginAtZero: true,
                max: 100,
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#808080',
                    callback: function(val) {
                        const label = this.getLabelForValue(val);
                        const parts = label.split('(');
                        return [`${parts[0]}`, `(${parts[1]}`];
                    },
                    font: {
                        size: 12
                    },
                    padding: 10
                }
            }
        },
        barThickness: 40,
    };

    const labels = [
        '최저점 합격자\n(경희대 한약학과)',
        '최고점 합격자\n(경희대 컴퓨터공학과)',
        '일반전형 합격자\n(전체 모집단위 평균)',
    ];

    const data = {
        labels: labels,
        datasets: [
            {
                data: [56.17, 88.5, 89.5],
                backgroundColor: [
                    '#FB923C',
                    '#FB923C',
                    '#D1D5DB',
                ],
                borderRadius: 4,
                datalabels: {
                    color: '#fff',
                    anchor: 'end',
                    align: 'top',
                }
            },
        ],
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.3
            }
        }
    };

    const lineVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const boxVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                delay: 1.5
            }
        }
    };

    return (
        <section className="bg-black py-20">
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="max-w-screen-lg mx-auto px-4"
            >
                <div className="text-left mb-20">
                    <motion.p 
                        variants={lineVariants} 
                        className="text-gray-600 text-5xl font-bold mb-6"
                    >
                        고른기회는 유리하니까
                    </motion.p>
                    <motion.p 
                        variants={lineVariants}
                        className="text-gray-400 text-5xl font-bold mb-6"
                    >
                        적당히 지원하면
                    </motion.p>
                    <motion.p 
                        variants={lineVariants}
                        className="text-gray-200 text-5xl font-bold mb-16"
                    >
                        된다는 생각
                    </motion.p>
                    <motion.h2 
                        variants={lineVariants}
                        className="text-white text-5xl font-bold"
                    >
                        이젠 틀렸습니다.
                    </motion.h2>
                </div>

                <div className="mt-16">
                    <motion.div 
                        variants={boxVariants}
                        className="bg-[#222222] p-12 rounded-lg"
                    >
                        <div className="h-[400px] w-[80%] mx-auto">
                            <Bar options={options} data={data} plugins={[ChartDataLabels]} />
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-gray-500 text-sm">
                                * 합격자 상위 80% 기준, 기회균형 정시 전형 기준
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            
        </section>
    );
}