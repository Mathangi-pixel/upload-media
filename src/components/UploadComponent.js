import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardComponent.css';
// import poster from '../anniversary-poster.jpg';

const UploadComponent = ({ setMediaSrc, setMediaType, setPreviewText }) => {
  const navigate = useNavigate();
  const [previewSrc, setPreviewSrc] = useState("https://fastly.picsum.photos/id/56/2880/1920.jpg?hmac=BIplhYgNZ9bsjPXYhD0xx6M1yPgmg4HtthKkCeJp6Fk");
  const [previewType, setPreviewType] = useState('image');
  const [text, setText] = useState('Happy Birthday');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      const fileURL = URL.createObjectURL(file);
      setPreviewSrc(fileURL);
      setPreviewType(fileType);
      setMediaSrc(fileURL);
      setMediaType(fileType);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleProceed = () => {
    setPreviewText(text);
    navigate('/preview');
  };

  return (
    <div className="card-container">
      <div className="card" id="card">
        {previewType === 'image' ? (
          <img src={previewSrc} alt="Preview" id="card-media" />
        ) : (
          <video controls id="card-media">
            <source src={previewSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="upload-banner">
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        </div>
        <div className="text-input-container">
          <label htmlFor="text-input">Add your text here:</label>
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text"
          />
        </div>
      </div>
      <button onClick={handleProceed}>Proceed to Preview</button>
    </div>
  );
};

export default UploadComponent;
