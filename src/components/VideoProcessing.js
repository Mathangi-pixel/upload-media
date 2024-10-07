import React, { useRef, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const VideoProcessing = ({ videoSrc }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef(null);

  const convertVideo = async () => {
    setProcessing(true);
    await ffmpeg.load();

    const response = await fetch(videoSrc);
    const data = await response.arrayBuffer();
    ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(data));
    await ffmpeg.run('-i', 'input.mp4', 'output.mp4');

    const outputData = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
    setVideoUrl(URL.createObjectURL(videoBlob));
    setProcessing(false);
  };

  return (
    <div>
      <button onClick={convertVideo} disabled={processing}>
        {processing ? 'Processing...' : 'Convert to MP4'}
      </button>
      {videoUrl && <video src={videoUrl} controls width="640"></video>}
    </div>
  );
};

export default VideoProcessing;
