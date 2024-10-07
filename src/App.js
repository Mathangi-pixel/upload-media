import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadComponent from './components/UploadComponent';
import PreviewComponent from './components/PreviewComponent';
// import TrimmerPage from './components/TrimmerPage';


const App = () => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [previewText, setPreviewText] = useState('');
  // const [trimmedMediaSrc, setTrimmedMediaSrc] = useState(null);


  return (
    <Router>
      <Routes>
      {/* <Route
          path="/trimmer"
          element={
            <TrimmerPage 
              setTrimmedMediaSrc={setTrimmedMediaSrc}
              setMediaType={setMediaType}
              previewText={previewText}
            />
          }
        /> */}
        <Route path="/" element={<UploadComponent setMediaSrc={setMediaSrc} setMediaType={setMediaType} setPreviewText={setPreviewText} />} />
        <Route path="/preview" element={<PreviewComponent mediaSrc={mediaSrc} mediaType={mediaType} previewText={previewText} />} />
      </Routes>
    </Router>
  );
};

export default App;
