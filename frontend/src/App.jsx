import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import Viewer from './components/Viewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/view/:token" element={<Viewer />} />
      </Routes>
    </Router>
  );
}

export default App;
