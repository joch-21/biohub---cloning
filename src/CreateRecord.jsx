import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  UploadCloud, 
  MapPin, 
  X, 
  QrCode, 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  Camera
} from 'lucide-react';

export default function CreateRecord({ onBack, onSaveSuccess }) {
  // Form state
  const [formData, setFormData] = useState({
    scientificName: '',
    commonName: '',
    family: '',
    height: '',
    latitude: '',
    longitude: '',
    morphologicalNotes: '',
  });

  // Images state
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // UI state
  const [showQR, setShowQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLocating, setIsLocating] = useState(false);

  // Field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image upload handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Remove individual image preview
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-fetch GPS coordinates using browser Geolocation API
  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setStatusMessage({ type: 'error', text: `Location error: ${error.message}` });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Data payload encoded in the QR code
  const qrPayload = JSON.stringify({
    scientificName: formData.scientificName.trim(),
    commonName: formData.commonName.trim(),
    family: formData.family.trim(),
    height: formData.height ? `${formData.height} m` : '',
    notes: formData.morphologicalNotes.trim(),
  }, null, 2);

  // Form submission linking to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const payload = new FormData();
      payload.append('scientificName', formData.scientificName);
      payload.append('commonName', formData.commonName);
      payload.append('family', formData.family);
      payload.append('height', formData.height);
      payload.append('latitude', formData.latitude);
      payload.append('longitude', formData.longitude);
      payload.append('morphologicalNotes', formData.morphologicalNotes);

      selectedImages.forEach((file) => {
        payload.append('images', file);
      });

      const response = await fetch('/api/records', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save specimen record.');
      }

      const result = await response.json();
      setStatusMessage({ type: 'success', text: 'Specimen record created successfully!' });

      if (onSaveSuccess) {
        onSaveSuccess(result);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased"
      style={{ padding: '2rem 2.5rem', minHeight: '100vh', backgroundColor: '#f8fafc' }}
    >
      <div 
        className="w-full mx-auto " 
        style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
      >
        
        {/* Top Dark Banner Strip */}
        <div 
          className="bg-[#0b1c15] text-white rounded-xl shadow-md flex items-center justify-between"
          style={{ 
            backgroundColor: '#0b1c15', 
            color: '#ffffff', 
            padding: '1rem 1.5rem', 
            borderRadius: '12px',
            marginBottom: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span 
              style={{
                backgroundColor: '#eab308',
                color: '#0f172a',
                fontWeight: '700',
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}
            >
              NEW SPECIMEN
            </span>
            <span style={{ fontStyle: 'italic', fontWeight: '600', fontSize: '1.1rem', color: '#f1f5f9' }}>
              {formData.scientificName.trim() || 'New Taxon Entry'}
            </span>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: '#cbd5e1', 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Global Alert Notification */}
        {statusMessage.text && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              backgroundColor: statusMessage.type === 'success' ? '#f0fdf4' : '#fff1f2',
              color: statusMessage.type === 'success' ? '#14532d' : '#881337',
              border: `1px solid ${statusMessage.type === 'success' ? '#bbf7d0' : '#fecdd3'}`
            }}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={20} color="#16a34a" />
            ) : (
              <AlertCircle size={20} color="#e11d48" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Main Grid Viewport */}
        <form 
          id="specimen-form" 
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
              gap: '2rem',
              alignItems: 'start'
            }}
          >
            
            {/* Left Column: Media & Ground Tagging */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Field Photo Stage */}
              <div 
                style={{ 
                  backgroundColor: '#f1f5f9', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '14px', 
                  position: 'relative',
                  minHeight: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1.25rem'
                }}
              >
                {previewUrls.length > 0 ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative', height: '240px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #94a3b8' }}>
                      <img 
                        src={previewUrls[0]} 
                        alt="Ground-Truth Specimen" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(0)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Secondary Thumbnails */}
                    {previewUrls.length > 1 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                        {previewUrls.slice(1).map((url, idx) => (
                          <div key={idx + 1} style={{ position: 'relative', height: '65px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            <img src={url} alt={`field-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx + 1)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <label 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      padding: '2.5rem 1rem',
                      textAlign: 'center'
                    }}
                  >
                    <Camera size={44} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155' }}>
                      Select Ground-Truth Photos
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                      PNG, JPG, or WEBP (Multiple files supported)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}

                <div 
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px'
                  }}
                >
                  Ground-Truth Field Photo
                </div>
              </div>

              {/* Add More Photos Bar */}
              {previewUrls.length > 0 && (
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: '1px dashed #94a3b8',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  <UploadCloud size={18} />
                  <span>Upload additional field shots</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}

              {/* Central QR Ground Tag */}
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  padding: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div 
                  style={{ 
                    padding: '0.6rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '10px', 
                    backgroundColor: '#fff',
                    flexShrink: 0
                  }}
                >
                  {formData.scientificName.trim() ? (
                    <QRCodeSVG value={qrPayload} size={88} level="M" />
                  ) : (
                    <div 
                      style={{ 
                        width: '88px', 
                        height: '88px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#94a3b8',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '8px'
                      }}
                    >
                      <QrCode size={28} />
                      <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Needs Name</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                    Central QR Ground Tag
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                    Encodes taxonomic details and morphology for field verification.
                  </p>
                  <div>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontFamily: 'monospace', 
                        fontWeight: '700', 
                        backgroundColor: '#f1f5f9', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        color: '#334155'
                      }}
                    >
                      TAG: {formData.scientificName ? 'SPECIMEN-PENDING-SYNC' : 'EMPTY-SPECIMEN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* GPS Precision Card */}
              <div 
                style={{ 
                  backgroundColor: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: '14px', 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#166534' }}>
                    GPS Precision Lock
                  </span>
                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    disabled={isLocating}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: '#dcfce7',
                      color: '#14532d',
                      border: '1px solid #86efac',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <MapPin size={14} />
                    <span>{isLocating ? 'Acquiring...' : 'Acquire GPS'}</span>
                  </button>
                </div>

                <div 
                  style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#14532d',
                    backgroundColor: '#ffffff',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                  }}
                >
                  {formData.latitude && formData.longitude ? (
                    `${formData.latitude}° N, ${formData.longitude}° E`
                  ) : (
                    <span style={{ fontStyle: 'italic', color: '#94a3b8', fontFamily: 'inherit', fontWeight: 'normal', fontSize: '0.85rem' }}>
                      No coordinates acquired. Click "Acquire GPS" or enter coordinates manually.
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Specimen Data Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Botanical Classification Card */}
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Botanical Classification
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                      Scientific Name <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="scientificName"
                      required
                      value={formData.scientificName}
                      onChange={handleInputChange}
                      placeholder="e.g. Shorea albida"
                      style={{
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.95rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                      Common / Vernacular Name
                    </label>
                    <input
                      type="text"
                      name="commonName"
                      value={formData.commonName}
                      onChange={handleInputChange}
                      placeholder="e.g. Alan Bunga / Meranti"
                      style={{
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.95rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Sub-Card Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div 
                    style={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '10px', 
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Family
                    </label>
                    <input
                      type="text"
                      name="family"
                      value={formData.family}
                      onChange={handleInputChange}
                      placeholder="e.g. Dipterocarpaceae"
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div 
                    style={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '10px', 
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Height / Span (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="e.g. 15.5"
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Field Observations Card */}
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Botanist Field Observations
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                    Morphological Notes & Substrate Traits
                  </label>
                  <textarea
                    name="morphologicalNotes"
                    rows={4}
                    value={formData.morphologicalNotes}
                    onChange={handleInputChange}
                    placeholder="Describe leaf structure, bark fissuring, buttress root traits, flower/fruit presence, or substrate details..."
                    style={{
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Spatial Pinning Coordinates Card */}
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Ground Spatial Pinning
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                      Latitude (°N/S) <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      required
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="e.g. 3.8160"
                      style={{
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.95rem',
                        fontFamily: 'monospace',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                      Longitude (°E/W) <span style={{ color: '#e11d48' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      required
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="e.g. 113.7845"
                      style={{
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.95rem',
                        fontFamily: 'monospace',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Action Footer */}
          <div 
            style={{ 
              marginTop: '1rem',
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e2e8f0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <button
              type="button"
              onClick={() => setShowQR(!showQR)}
              style={{
                background: 'none',
                border: 'none',
                color: '#475569',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              {showQR ? 'Hide Encoded QR JSON' : 'Inspect Encoded QR Payload'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: '#0d8253',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px -1px rgba(13, 130, 83, 0.25)',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Saving Specimen...' : 'Approve & Save to Central DB'}</span>
            </button>
          </div>
        </form>

        {/* Encoded QR Payload Drawer */}
        {showQR && (
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '1.25rem',
              marginTop: '1rem'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Encoded QR Payload Preview
            </span>
            <pre 
              style={{ 
                margin: 0,
                backgroundColor: '#0f172a', 
                color: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.8rem',
                overflowX: 'auto',
                fontFamily: 'monospace'
              }}
            >
              {qrPayload}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}