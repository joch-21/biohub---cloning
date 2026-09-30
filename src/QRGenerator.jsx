import { ArrowLeft } from 'lucide-react';

export default function QRGenerator({ onBack }) {
  return (
    //temporary placeholder, please remove when developing page 
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#64748b',
        padding: '1.5rem',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <span 
          style={{ 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: '#94a3b8' 
          }}
        >
          QR Generator
        </span>
        
        <h1 
          className="text-2xl font-semibold tracking-tight text-slate-700"
          style={{ fontSize: '1.5rem', fontWeight: 600, color: '#334155', margin: 0 }}
        >
          Crickets... nothing here.
        </h1>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#0d8253',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        )}
      </div>
    </div>
  );
}