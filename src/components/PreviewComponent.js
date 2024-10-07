import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardComponent.css';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const PreviewComponent = ({ mediaSrc, mediaType, previewText }) => {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  const handleBack = () => {
    navigate('/');
  };

  // Function to generate SVG from canvas
  const handleGenerateSVG = () => {
    if (!previewRef.current) {
      console.error('Preview element not found.');
      return;
    }

    html2canvas(previewRef.current).then(canvas => {
      canvas.toBlob(blob => {
        saveAs(blob, 'preview.svg');
      });
    }).catch(error => {
      console.error('Error generating SVG:', error);
    });
  };

  // Function to generate WebM video from canvas
  const handleGenerateWebM = async () => {
    if (!canvas) {
      console.error('Canvas element not found.');
      return;
    }

    try {
      const stream = canvas.captureStream(30); // Capture at 30fps
      if (!stream) {
        console.error('Failed to capture stream from canvas.');
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (chunks.length === 0) {
          console.error('No data chunks collected');
          return;
        }

        const blob = new Blob(chunks, { type: 'video/webm' });

        if (blob.size === 0) {
          console.error('The generated WebM file is empty.');
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'preview.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
      };

      recorder.onerror = (event) => {
        console.error('Recorder error:', event);
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, 5000); // Record for 5 seconds
    } catch (error) {
      console.error('Error generating WebM video:', error);
    }
  };

  useEffect(() => {
    if (previewRef.current) {
      html2canvas(previewRef.current).then(canvas => {
        setCanvas(canvas);
      }).catch(error => {
        console.error('Error creating canvas:', error);
      });
    }
  }, [mediaSrc, mediaType]);

  return (
    <div className="card-container">
      <div className="preview-card" ref={previewRef}>
        {mediaType === 'image' ? (
          <img src={mediaSrc} alt="Preview" id="preview-media" />
        ) : (
          <video controls id="preview-media">
            <source src={mediaSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <p>{previewText}</p>
        <div className="watermark">post-cards</div>
      </div>
      <button className="preview-button" onClick={handleBack}>Back to Upload</button>
      {mediaType === 'image' && (
        <>
          <button className="preview-button" onClick={handleGenerateSVG}>Generate SVG</button>
        </>
      )}
      {mediaType === 'video' && (
        <button className="preview-button" onClick={handleGenerateWebM}>Generate WebM</button>
      )}
    </div>
  );
};

export default PreviewComponent;
