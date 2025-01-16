// src/AppContent.js
import React, { useState, useRef, useEffect } from "react";
//import axios from "axios";

function AppContent() {
  const [videoUrl, setVideoUrl] = useState(""); // 입력된 URL
  const [videoSources, setVideoSources] = useState([]); // 동영상 및 카메라 소스
  const cameraStreamRef = useRef(null); // 카메라 스트림

  // async function fetchTodos() {
  //   const res = await axios.get("http://localhost:3000/todos");
  //   console.log(res.data); // []
  // }
  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : "";
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoSources((prevSources) => {
        if (
          prevSources.length < 4 &&
          !prevSources.find((src) => src.type === "video" && src.id === id)
        ) {
          return [...prevSources, { type: "video", id }];
        } else {
          alert("이미 추가된 링크이거나 최대 4개의 동영상만 추가 가능합니다.");
          return prevSources;
        }
      });
      setVideoUrl(""); // 입력 필드 초기화
    } else {
      alert("유효한 YouTube 링크를 입력하세요.");
    }
  };

  const handleShareCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;

      setVideoSources((prevSources) => {
        if (prevSources.length < 4) {
          return [...prevSources, { type: "camera", stream }];
        } else {
          alert("최대 4개의 화면만 추가 가능합니다.");
          return prevSources;
        }
      });

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        // 카메라 스트림 종료 시 리스트에서 제거
        setVideoSources((prevSources) =>
          prevSources.filter((src) => src.stream !== stream),
        );
      });
    } catch (err) {
      console.error("카메라 스트림 실패:", err);
    }
  };

  const handleStopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      setVideoSources((prevSources) =>
        prevSources.filter((src) => src.type !== "camera"),
      );
      cameraStreamRef.current = null;
    }
  };

  const handleDelete = (indexToDelete) => {
    setVideoSources((prevSources) =>
      prevSources.filter((_, index) => index !== indexToDelete),
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-screen bg-black">
        {/* 동영상 2x2 그리드 */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {videoSources.map((source, index) => (
            <div
              key={index}
              className="group relative rounded border border-gray-700 bg-black text-white shadow-lg"
            >
              {source.type === "video" ? (
                <div className="aspect-h-9 aspect-w-16">
                  <iframe
                    src={`https://www.youtube.com/embed/${source.id}`}
                    title={`YouTube video player ${index}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full rounded"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-h-9 aspect-w-16">
                  <video
                    autoPlay
                    playsInline
                    muted
                    ref={(video) => {
                      if (video) {
                        video.srcObject = source.stream;
                      }
                    }}
                    className="h-full w-full rounded object-cover"
                  ></video>
                </div>
              )}
              {/* 참가자 이름 */}
              <div className="absolute bottom-2 left-2 rounded bg-black bg-opacity-70 px-2 py-1 text-sm">
                {source.type === "video"
                  ? `YouTube ${index + 1}`
                  : `카메라 ${index + 1}`}
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="absolute right-2 top-2 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition-opacity duration-200 hover:bg-red-700 focus:outline-none group-hover:opacity-100"
                aria-label={`Delete ${source.type === "video" ? "YouTube" : "Camera"} ${index + 1}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 하단 버튼 스타일 */}
        <div className="fixed bottom-0 left-0 w-full translate-y-[calc(100%-30px)] transform bg-gray-900 p-4 text-center text-white transition-transform duration-300 ease-in-out hover:translate-y-0">
          <div className="h-[10px] bg-red-700 hover:bg-red-600"></div>
          {videoSources.length < 4 && (
            <form onSubmit={handleUrlSubmit} className="mb-4 mt-4">
              <input
                type="text"
                placeholder="YouTube 링크를 입력하세요"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mr-2 rounded border bg-gray-100 p-2 text-black"
                style={{ width: "300px", fontSize: "16px" }}
              />

              <button
                type="submit"
                className="mx-2 rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
              >
                추가
              </button>
            </form>
          )}
          <button
            onClick={handleShareCamera}
            className="mx-2 rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
          >
            Share Camera
          </button>
          <button
            onClick={handleStopCamera}
            className="mx-2 rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
          >
            Stop Video
          </button>
          <button className="mx-2 rounded bg-red-600 px-4 py-2 hover:bg-red-500">
            Leave
          </button>

          {/* 동영상 링크 리스트 */}
          <div className="mt-4 text-left">
            <h3 className="mb-4 text-lg font-bold text-gray-200">
              복사 가능한 동영상 링크
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {/* 링크 1 */}
              <div className="flex items-center justify-between rounded bg-gray-800 p-4 shadow-md hover:bg-gray-700">
                <a
                  href="https://www.youtube.com/watch?v=M25QfAgS4QA&t=285s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:underline"
                >
                  https://www.youtube.com/watch?v=M25QfAgS4QA&t=285s
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "https://www.youtube.com/watch?v=M25QfAgS4QA&t=285s",
                    )
                  }
                  className="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  복사
                </button>
              </div>

              {/* 링크 2 */}
              <div className="flex items-center justify-between rounded bg-gray-800 p-4 shadow-md hover:bg-gray-700">
                <a
                  href="https://www.youtube.com/watch?v=2NuEY4XvIwI&t=40s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:underline"
                >
                  https://www.youtube.com/watch?v=2NuEY4XvIwI&t=40s
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "https://www.youtube.com/watch?v=2NuEY4XvIwI&t=40s",
                    )
                  }
                  className="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  복사
                </button>
              </div>

              {/* 링크 3 */}
              <div className="flex items-center justify-between rounded bg-gray-800 p-4 shadow-md hover:bg-gray-700">
                <a
                  href="https://www.youtube.com/watch?v=EzYev1dZL5A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:underline"
                >
                  https://www.youtube.com/watch?v=EzYev1dZL5A
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "https://www.youtube.com/watch?v=EzYev1dZL5A",
                    )
                  }
                  className="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  복사
                </button>
              </div>

              {/* 링크 4 */}
              <div className="flex items-center justify-between rounded bg-gray-800 p-4 shadow-md hover:bg-gray-700">
                <a
                  href="https://www.youtube.com/watch?v=9DzF45LkaSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:underline"
                >
                  https://www.youtube.com/watch?v=9DzF45LkaSE
                </a>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "https://www.youtube.com/watch?v=9DzF45LkaSE",
                    )
                  }
                  className="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  복사
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppContent;
