import Image from 'next/image';
import photoDetails from '@/components/공지사항.svg';

const NoticePage = () => {
    const notices = [

        {
            date: "2025.12.13",
            updates: [
                {
                    title: "실채점 기반 합격률 설정 완료",
                    details: [
                        "실채점 기준 합격률 설정 완료입니다. "
                    ],
                },
                {
                    title: "성균관대 (농어촌 정시)",
                    details: [
                        "성균관대 농어촌 정시의 경우 추후 반영할 예정입니다.(변환 표준점수 발표 후)"
                    ],
                },
            ],
        },
        {
            date: "2025.12.20",
            updates: [
                {
                    title: "모의지원 횟수 리셋",
                    details: [
                        "모의지원 횟수가 초기화되었습니다. 이외에 실제 모의지원 수가 잘못보이는 오류를 수정했습니다. "
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
