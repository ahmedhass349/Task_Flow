export function TaskFlowLogo() {
  return (
    <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
      {/* Pixel-grid icon */}
      <div style={{ width: 40, height: 48, position: 'relative' }}>
        <div style={{ width: 10, height: 10, left: 0,  top: 4,  position: 'absolute', background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 10, top: 4,  position: 'absolute', opacity: 0,    background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 20, top: 4,  position: 'absolute', opacity: 0.60, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 30, top: 4,  position: 'absolute', opacity: 0,    background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 0,  top: 14, position: 'absolute', opacity: 0,    background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 10, top: 14, position: 'absolute', opacity: 0.60, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 20, top: 14, position: 'absolute', opacity: 0.45, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 30, top: 14, position: 'absolute', opacity: 0.30, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 0,  top: 24, position: 'absolute', opacity: 0.60, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 10, top: 24, position: 'absolute', opacity: 0.45, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 20, top: 24, position: 'absolute', opacity: 0.30, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 30, top: 24, position: 'absolute', opacity: 0.15, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 0,  top: 34, position: 'absolute', opacity: 0,    background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 10, top: 34, position: 'absolute', opacity: 0.30, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 20, top: 34, position: 'absolute', opacity: 0.15, background: '#155EEF' }} />
        <div style={{ width: 10, height: 10, left: 30, top: 34, position: 'absolute', opacity: 0,    background: '#155EEF' }} />
      </div>
      {/* Wordmark */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#0A0D12', fontFamily: '"Press Start 2P", monospace', fontSize: 18, whiteSpace: 'nowrap', lineHeight: 2.2, letterSpacing: '0.05em' }}>
          TaskFlow
        </span>
      </div>
    </div>
  );
}
