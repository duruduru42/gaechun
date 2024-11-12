import React from 'react';

const videos = [
  { id: 'IfOCupDW3EA', title: '고른기회 전형 활용하기 1' },
  { id: '0y7gpTF2PHQ', title: '고른기회 전형 활용하기 2' },
  // 추가 동영상 링크
];

export default function VideoPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">동영상</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map(video => (
          <div key={video.id} className="bg-white p-3 rounded-lg shadow-md">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h2 className="text-lg font-semibold mt-3">{video.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
