import React, { useState } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, CheckCircle, Share2, FileText, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8081/api/files`;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData);
      setMetadata(response.data);
    } catch (error) {
      alert('Upload failed. Is the backend running?');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getShareLink = () => {
    return `${window.location.origin}/view/${metadata.jwtToken}`;
  };

  const shareToWhatsApp = () => {
    const text = `Hi, please print this secure document: ${getShareLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (metadata) {
    return (
      <div className="glass-card">
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
          <h1>File Encrypted!</h1>
          <p>Your document is now stored securely in MongoDB Atlas and encrypted with AES-256.</p>
          
          <div className="file-info">
            <FileText size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>{metadata.fileName}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Expires in 30 minutes</div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-whatsapp" onClick={shareToWhatsApp}>
              <Share2 size={18} />
              Share to WhatsApp
            </button>
            <button className="btn btn-primary" onClick={() => setMetadata(null)}>
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h1>Secure Print</h1>
      <p>Upload your PDF to encrypt and generate a temporary, one-time printing link.</p>
      
      <label className="upload-zone">
        <input 
          type="file" 
          accept=".pdf" 
          hidden 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <UploadIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        {file ? (
          <div style={{ fontWeight: 600, color: '#818cf8' }}>{file.name}</div>
        ) : (
          <div>Click to select or drag PDF</div>
        )}
      </label>

      <div style={{ marginTop: '2rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Encrypt & Upload'}
        </button>
      </div>
    </div>
  );
}
