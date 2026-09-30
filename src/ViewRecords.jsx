import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Printer,
  Compass,
  Camera,
  MessageSquare,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export default function ViewRecords() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Role: Conservationist | Senior Conservationist | SysAdmin
  const [currentUserRole, setCurrentUserRole] = useState('Conservationist'); 
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  // 1. Fetch Single Record Details
  const fetchRecordDetails = async () => {
    setLoading(true);
    try {
      /* =========================================================================
         [DUMMY MODE START] - Comment or remove this block when backend is ready
         ========================================================================= */
      const dummyRes = await fetch('/duRecords.json');
      const allRecords = await dummyRes.json();
      const matched = allRecords.find((r) => String(r.id) === String(id));
      
      const localUpdated = sessionStorage.getItem(`record_status_${id}`);
      if (localUpdated && matched) {
        setRecord({ ...matched, ...JSON.parse(localUpdated) });
      } else {
        setRecord(matched || null);
      }
      setTimeout(() => setLoading(false), 400);
      return; 
      /* =========================================================================
         [DUMMY MODE END]
         ========================================================================= */

      // REAL BACKEND API CALL
      const res = await fetch(`/api/records/${id}`);
      if (!res.ok) throw new Error('Could not fetch record');
      const data = await res.json();
      setRecord(data);
    } catch (err) {
      console.warn('Backend not ready or record missing:', err.message);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordDetails();
  }, [id]);

  const canReview = ['Conservationist', 'Senior Conservationist'].includes(currentUserRole);

  // 2. Status Update Handler (Approve / Reject)
  const handleUpdateStatus = async (newStatus, reason = '') => {
    setIsSubmitting(true);
    try {
      /* =========================================================================
         [DUMMY MODE START] - Comment or remove this block when backend is ready
         ========================================================================= */
      sessionStorage.setItem(
        `record_status_${id}`,
        JSON.stringify({
          status: newStatus,
          rejectionReason: reason || null,
          reviewedByRole: currentUserRole,
        })
      );
      setRecord((prev) => ({
        ...prev,
        status: newStatus,
        rejectionReason: reason || prev.rejectionReason,
        reviewedByRole: currentUserRole,
      }));
      setShowRejectModal(false);
      setRejectionReason('');
      setIsSubmitting(false);
      return;
      /* =========================================================================
         [DUMMY MODE END]
         ========================================================================= */

      // REAL BACKEND PATCH
      const res = await fetch(`/api/records/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus, 
          rejectionReason: reason,
          reviewedByRole: currentUserRole 
        })
      });

      if (!res.ok) throw new Error('Status sync to backend failed');

      setRecord((prev) => ({
        ...prev,
        status: newStatus,
        rejectionReason: reason || prev.rejectionReason,
        reviewedByRole: currentUserRole,
      }));

      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setRejectError('Please specify why this record is being rejected.');
      return;
    }
    setRejectError('');
    handleUpdateStatus('Rejected', rejectionReason.trim());
  };

  // QR Payload (excludes GPS and images)
  const qrPayload = record ? JSON.stringify({
    sci: record.scientificName || '',
    com: record.commonName || '',
    fam: record.family || '',
    h: record.height ? `${record.height}m` : '',
    notes: record.morphologicalNotes || '',
  }) : '';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 sm:px-10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/records')}
              className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Return to Bio Records"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Record #{id}
                </h1>
                {record?.status && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border shadow-2xs ${
                    record.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    record.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {record.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    {record.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {record.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {record.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Biological ground-truthing voucher verification file</p>
            </div>
          </div>

          {/* Role Indicator & Action Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Role Simulator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-600">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Role:</span>
              <select 
                value={currentUserRole} 
                onChange={(e) => setCurrentUserRole(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Conservationist">Conservationist</option>
                <option value="Senior Conservationist">Senior Conservationist</option>
                <option value="SysAdmin">SysAdmin</option>
              </select>
            </div>

            {/* Approval Controls */}
            {canReview && record && (
              <div className="flex items-center gap-2">
                <button
                  disabled={isSubmitting || record.status === 'Rejected'}
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 disabled:opacity-40 transition shadow-2xs"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  disabled={isSubmitting || record.status === 'Approved'}
                  onClick={() => handleUpdateStatus('Approved')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full px-6 sm:px-10 pt-8">
        
        {/* SKELETON UI */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                </div>
                <div className="h-32 bg-slate-100 rounded-xl"></div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                  <div className="h-16 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-56 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        )}

        {/* NOT FOUND / SERVER UNPLUGGED */}
        {!loading && !record && (
          <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto shadow-xs">
            <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Record Not Located</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
              We couldn't retrieve Record <strong>#{id}</strong>. Make sure it exists in <code>duRecords.json</code> or that your backend service is running.
            </p>
            <button
              onClick={() => navigate('/records')}
              className="px-5 py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900 transition shadow-sm"
            >
              Return to Bio Records
            </button>
          </div>
        )}

        {/* LOADED DETAILS */}
        {!loading && record && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 cols): Large Card Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Rejection Justification Box */}
              {record.status === 'Rejected' && record.rejectionReason && (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5 text-rose-900 shadow-2xs">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Rejection Justification Logged</h4>
                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">{record.rejectionReason}</p>
                    {record.reviewedByRole && (
                      <p className="text-[11px] text-rose-500 font-medium mt-2">Logged by: {record.reviewedByRole}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Taxonomy Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-7 space-y-6">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Taxonomic Classification & Sizing</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-xl">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Scientific Name
                    </span>
                    <span className="text-base font-bold italic text-slate-900 block">
                      {record.scientificName || '—'}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-xl">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Common Name
                    </span>
                    <span className="text-base font-semibold text-slate-800 block">
                      {record.commonName || '—'}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-xl">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Botanical Family
                    </span>
                    <span className="text-sm font-semibold text-slate-800 block">
                      {record.family || '—'}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-xl">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Estimated Specimen Height
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-700 block">
                      {record.height ? `${record.height} meters` : '—'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Morphological Observations & Traits
                  </span>
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed min-h-[90px] whitespace-pre-wrap">
                    {record.morphologicalNotes || 'No specific morphological observations noted.'}
                  </div>
                </div>
              </div>

              {/* Coordinates Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Geospatial Coordinates</h2>
                  </div>
                  {record.accuracy && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      ±{record.accuracy}m Accuracy
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">GPS Latitude</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{record.latitude || '—'}</span>
                    </div>
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">GPS Longitude</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{record.longitude || '—'}</span>
                    </div>
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Photos Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-7 space-y-6">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Voucher Imagery & Proofs</h2>
                </div>

                {record.images && record.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {record.images.map((imgUrl, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 shadow-2xs">
                        <img 
                          src={imgUrl} 
                          alt={`specimen-${i}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-xs font-semibold text-white">Voucher Photo #{i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No photographs attached to this specimen record.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (4 cols): Sticky Specimen Tag */}
            <aside className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Physical Tag Preview</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>

                {/* Voucher Tag Simulation Card */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 text-center sm:text-left lg:text-center">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs shrink-0">
                      <QRCodeSVG value={qrPayload} size={135} level="M" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                        {record.family || 'Family Unassigned'}
                      </p>
                      <h4 className="text-base font-bold italic text-slate-900 truncate mt-0.5">
                        {record.scientificName || 'Botanical Specimen'}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{record.commonName || '—'}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-2">
                        Height: {record.height ? `${record.height}m` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">QR Tag Encoding: </span>
                    Includes taxonomic attributes and morphological notes. Coordinates and image binaries are excluded.
                  </div>
                </div>

                {/* Inspect Raw Tag JSON */}
                <details className="text-xs text-slate-500 group">
                  <summary className="cursor-pointer font-semibold hover:text-slate-800 transition select-none">
                    Inspect Tag Encoded JSON
                  </summary>
                  <pre className="mt-2.5 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {qrPayload}
                  </pre>
                </details>
              </div>
            </aside>

          </div>
        )}
      </main>

      {/* REJECTION REASON MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Provide Rejection Justification</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-normal">
              State taxonomic inconsistencies, coordinate discrepancies, or foliage mismatches requiring ground revisions.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Foliage venation in photos does not match Shorea albida; please inspect root and canopy again."
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
            />

            {rejectError && (
              <p className="text-xs font-semibold text-rose-600">{rejectError}</p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectError('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}