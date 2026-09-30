import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Database,
  RefreshCw,
  FolderTree,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export default function BioRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/duRecords.json');
      if (!response.ok) throw new Error('Network response failed');
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.warn('Backend not ready or unreachable:', err.message);
      setRecords([]);
    } finally {
      setTimeout(() => setLoading(false), 450);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = records.length;
  const approvedCount = records.filter((r) => r.status === 'Approved').length;
  const pendingCount = records.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 sm:px-10 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900"></h1>
            <p className="text-sm text-slate-500 mt-0.5">Biological ground-truthing records and verification queue</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRecords}
              className="inline-flex items-center justify-center p-2.5 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 shadow-2xs transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/records/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full mx-auto px-6 sm:px-10 pt-8 space-y-6">
        
        {/* Metric Badges / Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Entries</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{loading ? '—' : totalCount}</p>
            </div>
            <div className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Approved Vouchers</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{loading ? '—' : approvedCount}</p>
            </div>
            <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Awaiting Review</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{loading ? '—' : pendingCount}</p>
            </div>
            <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by ID, scientific name, or common name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/60 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/60 border border-slate-300 rounded-xl w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer pr-2"
              >
                <option value="ALL">All Records</option>
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spacious Table Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-7">Record ID</th>
                  <th className="py-4 px-7">Scientific Name</th>
                  <th className="py-4 px-7">Common Name</th>
                  <th className="py-4 px-7">Verification Status</th>
                  <th className="py-4 px-7 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                
                {/* SKELETON UI */}
                {loading && (
                  <>
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-6 px-7">
                          <div className="h-4 bg-slate-200 rounded w-28"></div>
                        </td>
                        <td className="py-6 px-7">
                          <div className="h-5 bg-slate-200 rounded w-52 mb-1.5"></div>
                          <div className="h-3 bg-slate-100 rounded w-24"></div>
                        </td>
                        <td className="py-6 px-7">
                          <div className="h-4 bg-slate-200 rounded w-36"></div>
                        </td>
                        <td className="py-6 px-7">
                          <div className="h-7 bg-slate-200 rounded-full w-24"></div>
                        </td>
                        <td className="py-6 px-7 text-right">
                          <div className="h-8 bg-slate-200 rounded-lg w-20 ml-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-slate-400">
                      <Database className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-base font-semibold text-slate-700">No matching bio records found</p>
                      <p className="text-xs text-slate-400 mt-1">Try clearing your filters or adding a new specimen entry.</p>
                    </td>
                  </tr>
                )}

                {/* LOADED ROWS */}
                {!loading && filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/records/view/${item.id}`)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors duration-150 group"
                  >
                    <td className="py-5 px-7">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 group-hover:border-slate-300 transition">
                        #{item.id}
                      </span>
                    </td>
                    <td className="py-5 px-7">
                      <span className="font-bold italic text-slate-900 block text-[15px] group-hover:text-emerald-700 transition">
                        {item.scientificName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.family || 'Botanical Taxon'}
                      </span>
                    </td>
                    <td className="py-5 px-7 text-slate-700 font-medium">
                      {item.commonName || '—'}
                    </td>
                    <td className="py-5 px-7">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-5 px-7 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/records/view/${item.id}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}