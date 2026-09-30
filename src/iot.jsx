import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  BatteryCharging, 
  BatteryMedium, 
  BatteryLow, 
  Thermometer, 
  Droplets, 
  RefreshCw, 
  AlertTriangle, 
  Radio, 
  Clock, 
  Activity,
  Sprout
} from 'lucide-react';

// Use mock file path or your backend endpoint
const API_ENDPOINT = '/telemetry.json';

export default function Iot() {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchTelemetryData = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        throw new Error(`Expected JSON but received ${contentType}`);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setNodes(data.nodes || []);
      setError(null);
    } catch (err) {
      console.error('IoT Data Fetch Error:', err);
      setError(err.message || 'Unable to establish connection with IoT bridge.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setLastSync(new Date());
    }
  };

  useEffect(() => {
    fetchTelemetryData();
    const pollInterval = setInterval(() => {
      fetchTelemetryData();
    }, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchTelemetryData();
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'warning':
        return {
          pill: 'bg-amber-50 text-amber-800 border border-amber-300',
          dot: 'bg-amber-500',
          label: 'Warning',
        };
      case 'critical':
      case 'alert':
        return {
          pill: 'bg-rose-50 text-rose-800 border border-rose-300',
          dot: 'bg-rose-500',
          label: 'Critical Alert',
        };
      case 'offline':
        return {
          pill: 'bg-slate-100 text-slate-700 border border-slate-300',
          dot: 'bg-slate-400',
          label: 'Offline',
        };
      case 'normal':
      default:
        return {
          pill: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Operational',
        };
    }
  };

  const renderWifiIndicator = (rssi) => {
    if (rssi === undefined || rssi === null) {
      return <span className="text-slate-400 text-xs">Disconnected</span>;
    }
    if (rssi >= -60) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <Wifi className="w-4 h-4" /> Excellent ({rssi} dBm)
        </span>
      );
    }
    if (rssi >= -75) {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
          <Wifi className="w-4 h-4" /> Stable ({rssi} dBm)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
        <WifiOff className="w-4 h-4" /> Weak ({rssi} dBm)
      </span>
    );
  };

  const renderBattery = (level) => {
    if (level === undefined || level === null) return <span className="text-slate-400">--</span>;
    let badgeStyle = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    let Icon = BatteryCharging;

    if (level <= 20) {
      badgeStyle = 'text-rose-700 bg-rose-50 border-rose-300';
      Icon = BatteryLow;
    } else if (level <= 55) {
      badgeStyle = 'text-amber-700 bg-amber-50 border-amber-300';
      Icon = BatteryMedium;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${badgeStyle}`}>
        <Icon className="w-3.5 h-3.5" />
        {level}%
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 p-8 md:p-10 font-sans" style={{ boxSizing: 'border-box' }}>
      
      {/* Top Header & Status Bar */}
      <div className="mb-8 pb-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2"> 
            <span className="text-slate-400 text-xs font-medium">Sarawak Forestry Hub |</span>
            <span className="text-slate-400 text-xs font-medium">Dummy Data - Refer to telemetry.json</span>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700">Broker Synced</span>
          </div>
          
          <div className="h-4 w-px bg-slate-200"></div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lastSync.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
            title="Refresh stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div>
        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-5 w-36 bg-slate-200 rounded"></div>
                    <div className="h-3 w-48 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((box) => (
                    <div key={box} className="h-20 bg-slate-50 rounded-xl border border-slate-100"></div>
                  ))}
                </div>

                <div className="h-4 w-full bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && nodes.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Active Nodes Found</h3>
            <p className="text-xs text-slate-500 mb-6">
              No live MQTT telemetry data received. Ensure nodes are online.
            </p>
            <button
              onClick={handleManualRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
            </button>
          </div>
        )}

        {/* Error Alert */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 flex items-start gap-3.5 mb-6">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Error: </span>
              {error}
              <button 
                onClick={handleManualRefresh} 
                className="ml-3 underline font-semibold text-rose-900 hover:text-rose-950 inline-block"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && nodes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {nodes.map((node) => {
              const statusCfg = getStatusBadge(node.status);

              return (
                <div
                  key={node.id || node.deviceId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  style={{ padding: '24px' }}
                >
                  {/* Top Bar: Title & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-slate-900 leading-snug">
                        {node.name || `Node #${node.id}`}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Host: <span className="text-slate-800 font-semibold">{node.monitoredHost || 'Field Zone'}</span>
                      </p>
                    </div>

                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shrink-0 ${statusCfg.pill}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* 2x2 Sensor Metric Cards */}
                  <div className="grid grid-cols-2 gap-3.5 my-5">
                    
                    {/* Temperature */}
                    <div 
                      className="bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between"
                      style={{ padding: '14px 16px' }}
                    >
                      <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TEMP</span>
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {node.temperature !== undefined ? `${node.temperature}°C` : '--'}
                      </span>
                    </div>

                    {/* Humidity */}
                    <div 
                      className="bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between"
                      style={{ padding: '14px 16px' }}
                    >
                      <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                        <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">HUMIDITY</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {node.humidity !== undefined ? `${node.humidity}%` : '--'}
                        </span>
                        {node.humidityStatus && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {node.humidityStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Soil Moisture */}
                    <div 
                      className="bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between"
                      style={{ padding: '14px 16px' }}
                    >
                      <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SOIL MOISTURE</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                          {node.soilMoisture !== undefined ? `${node.soilMoisture}%` : '--'}
                        </span>
                        {node.soilMoistureStatus && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {node.soilMoistureStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Battery */}
                    <div 
                      className="bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between"
                      style={{ padding: '14px 16px' }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                        BATTERY
                      </span>
                      <div>
                        {renderBattery(node.battery)}
                      </div>
                    </div>
                  </div>

                  {/* Signal Info */}
                  <div 
                    className="border-t border-slate-100 flex items-center justify-between text-xs pt-3.5"
                  >
                    <span className="text-slate-400 font-medium">Link Signal</span>
                    {renderWifiIndicator(node.wifiRssi ?? node.signalStrength)}
                  </div>

                  {/* Footer Bar */}
                  <div 
                    className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400"
                  >
                    <span className="font-mono text-slate-400 tracking-wide">{node.id || node.deviceId}</span>
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <Activity className="w-3.5 h-3.5 text-emerald-500" />
                      {node.lastHeard ? new Date(node.lastHeard).toLocaleTimeString() : 'Live'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}