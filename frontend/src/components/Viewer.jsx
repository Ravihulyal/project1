import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Printer, XCircle, Loader2, Lock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8081/api/files`;

export default function Viewer() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFile();
    
    // Cleanup listener for print completion
    const handleAfterPrint = () => {
      confirmPrintAndCleanup();
    };
    
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [token]);

  const fetchFile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/view/${token}`, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
    } catch (err) {
      setError("This link is expired or has already been used for printing.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const confirmPrintAndCleanup = async () => {
    try {
      await axios.post(`${API_BASE}/print-complete/${token}`);
      alert("Print completed. Access has been revoked and file deleted from server.");
      navigate('/');
    } catch (err) {
      console.error("Cleanup failed", err);
    }
  };

  if (loading) {
    return (
      <div className="viewer-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={48} />
        <p style={{ marginTop: '1rem' }}>Decrypting Secure Document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewer-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <XCircle size={64} color="#ef4444" />
        <h1 style={{ marginTop: '2rem' }}>Access Denied</h1>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back Home</button>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <div className="viewer-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Lock size={20} color="#10b981" />
          <span style={{ fontWeight: 600 }}>Secure One-Time Viewer</span>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={18} />
          Print Now
        </button>
      </div>
      
      {/* Hidden PDF for printing - some browsers need this for window.print to work on the object */}
      <iframe 
        id="pdf-frame"
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
        title="Secure PDF Viewer"
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .viewer-toolbar { display: none !important; }
          body { background: white !important; }
          .viewer-container { height: auto !important; }
          iframe { height: 100vh !important; width: 100vw !important; }
        }
      `}} />
    </div>
  );
}
