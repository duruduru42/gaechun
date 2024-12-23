import Image from 'next/image';
import photoDetails from '@/components/공지사항.svg';

const NoticePage = () => {
    const notices = [
        {
            date: "2024.12.23",
            updates: [
                {
                    title: "변환표준점수 적용 완료",
                    subtitle: "현재까지 나온 대학들 적용 완료.",
                    details: [
                        "아직 나오지 않은 일부 대학을 제외하고 모두 적용을 완료하였습니다. 또한 이에 맞춰 합격률을 조정했습니다. 나오지 않은 대학의 경우에는 협력 업체의 예측값을 사용했습니다."
                    ],
                },
            ],
        },
        {
            date: "2024.12.20",
            updates: [
                {
                    title: "모의지원 수정권한 3회 추가",
                    subtitle: "모의지원 수정 권한 추가",
                    details: [
                        "모의지원 수정 권한 리셋 완료"
                    ],
                },
            ],
        },
        {
            date: "2024.12.13",
            updates: [
                {
                    title: "모의지원 수정권한 3회 추가",
                    subtitle: "모의지원 수정 권한 추가",
                    details: [
                        "모의지원 수정 권한 리셋 완료"
                    ],
                },
            ],
        },
        {
            date: "2024.12.12",
            updates: [
                {
                    title: "대구교대 환산점수 수정",
                    subtitle: "사회탐구 선택자 한해서 오류",
                    details: [
                        "대구교대에서 사회탐구 선택자 환산 과정에서 오류가 있어 수정했습니다."
                    ],
                },
            ],
        },
        {
            date: "2024.12.11",
            updates: [
                {
                    title: "등수 변경 버그 수정",
                    subtitle: "계속 등수가 바뀌는 버그를 수정했습니다.",
                    details: [
                        "상담 담당 선생님 6명의 아이디가 모의지원 및 전체 표본에 반영되지는 않지만, 과목별 점수 등수에 반영되는 버그를 확인했습니다. 이를 수정했습니다."
                    ],
                },
                {
                    title: "특성화고 합격예측 서비스 정상화",
                    subtitle: "합격예측 이용 가능",
                    details: [
                        "특성화고 전형을 반영하여 환산점수를 환산해 합격예측 기준점을 모두 다시 잡았습니다. 모의지원 및 합격예측 모두 이용 가능합니다."
                    ],
                },
            ],
        },
        
        {
        
            date: "2024.12.06",
            updates: [
                {
                    title: "실채점 기반 합격률 설정 완료",
                    subtitle: "서비스 오픈",
                    details: [
                        "실채점 표준점수를 감안한 합격률 예측이 완료되었습니다."
                    ],
                },
            ],
        },
    ];

    return (
        <div className="max-w-4xl !px-0 sm:px-6 px-4 mx-auto">

            {/* Banner */}
            <div className="sm:px-6 px-4">
                <div
                    className="rounded-lg w-full sm:h-32 h-24 text-center mt-6"
                >               
                <Image
                    src={photoDetails}
                    alt="상세정보 이미지"
                    width={800}
                    height={400}
                    className="rounded-lg shadow-md"
                />
           </div>
            </div>

            {/* Notices */}
            <div className="mt-6">
                {notices.map((notice, index) => (
                    <div key={index} className="mb-6 py-6">
                        {/* Date */}
                        <p className="font-semibold text-orange-400 text-2xl">{notice.date}</p>
                        <div className="my-1"></div>

                        {/* Updates */}
                        {notice.updates.map((update, idx) => (
                            <div key={idx} className="mt-4">
                                <p className="sm:text-xl text-lg font-semibold text-gray-900 mt-8">
                                    {update.title}
                                    <span className="font-light text-gray-400 pl-2 tracking-tight">
                                        {update.subtitle}
                                    </span>
                                </p>
                                <ul className="list-disc ml-5 space-y-4 mt-3">
                                    {update.details.map((detail, i) => (
                                        <li key={i} className="text-gray-800 font-medium text-lg">
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default NoticePage;
