'use client'

import React, { useState } from 'react';

export default function VideoPage() {
  const videoList = [
    { id: 1, name: "비디오 1", src: "https://www.youtube.com/embed/JVVKnZbkeac" },
    { id: 2, name: "비디오 2", src: "https://www.youtube.com/embed/JVVKnZbkeac" },
    { id: 3, name: "비디오 3", src: "https://www.youtube.com/embed/JVVKnZbkeac" },
    { id: 4, name: "비디오 4", src: "https://www.youtube.com/embed/JVVKnZbkeac" },
  ];

  const [currentVideo, setCurrentVideo] = useState(videoList[0]); // 기본 동영상 설정

  return (
    <div className="flex flex-col lg:flex-row p-5">
      {/* 메인 동영상 */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold p-5">{currentVideo.name}</h1>
        <div
          className="w-full"
          style={{
            position: "relative",
            paddingBottom: "56.25%", // 16:9 비율 (9 / 16 * 100)
            height: 0,
            overflow: "hidden",
          }}
        >
          <iframe
            key={currentVideo.id} // key 속성 추가
            src={currentVideo.src}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            className="border border-gray-300 shadow-lg rounded-lg"
          ></iframe>
        </div>
      </div>

      {/* 비디오 목차 */}
      <div className="w-full lg:w-1/4 lg:ml-10 mt-5 lg:mt-0">
        <h2 className="text-2xl font-semibold mt-5 mb-3">동영상 목록</h2>
        <ul className="space-y-3">
          {videoList.map((video) => (
            <li
              key={video.id}
              className={`p-3 border rounded-lg cursor-pointer ${
                currentVideo.id === video.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setCurrentVideo(video)} // 클릭 시 동영상 변경
            >
              {video.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
