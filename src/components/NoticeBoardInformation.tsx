import type { NominatimReverseResponse } from '../types';
import type { LocationTimeData } from '../utils';
import { Html } from '@react-three/drei';

const NoticeBoardInformation = ({
  location,
  locationTime,
  onClick,
}: {
  location: NominatimReverseResponse | null | undefined;
  locationTime: LocationTimeData | null;
  onClick: () => void;
}) => {
  const city =
    location?.address?.city ||
    location?.address?.town ||
    location?.address?.village ||
    location?.address?.hamlet ||
    location?.name ||
    'Unknown Realm';

  const stateRegion = location?.address?.state
    ? `${location.address.state}, ${location?.address?.country ?? ''}`
    : location?.address?.country || 'Unmapped Territories';

  const skyQuality =
    location?.type === 'city'
      ? 'Urban Sky'
      : location?.type === 'town'
        ? 'Suburban Sky'
        : 'Dark Sky';

  const latitude =
    location?.lat && !isNaN(Number(location.lat)) ? `${Number(location.lat).toFixed(2)}°N` : '--';
  const longitude =
    location?.lon && !isNaN(Number(location.lon)) ? `${Number(location.lon).toFixed(2)}°W` : '--';

  return (
    <Html position={[-10, 20, 0]} center style={{ pointerEvents: 'auto' }}>
      <div
        style={{
          position: 'fixed',
          left: '32px',
          top: '32px',
          width: '270px',
          padding: '16px',
          background: 'rgba(20, 22, 26, 0.96)',
          backdropFilter: 'blur(6px)',
          borderRadius: '4px',
          border: '1px solid rgba(224, 214, 196, 0.12)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
          color: '#e2e8f0',
          fontFamily: '"Georgia", serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '8px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#c5b69c',
              fontWeight: 'bold',
            }}
          >
            Camp Observatory
          </div>
          <button
            onClick={onClick}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(224, 214, 196, 0.4)',
              fontSize: '14px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e0d6c4')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(224, 214, 196, 0.4)')}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f5f5f7', lineHeight: 1.1 }}>
            {city}
          </div>
          <div
            style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontStyle: 'italic' }}
          >
            {stateRegion}
          </div>
        </div>

        <div
          style={{ fontSize: '11.5px', lineHeight: '1.45', color: '#cbd5e1', marginTop: '10px' }}
        >
          The star positions, constellation vectors, and moon phases in this sky are{' '}
          <strong style={{ color: '#ffffff' }}>mathematically identical</strong> to the real-world
          horizon over <strong>{city}</strong> right now under a clear{' '}
          <strong>{skyQuality.toLowerCase()}</strong>.
          <span style={{ color: '#f87171', fontStyle: 'italic', marginLeft: '4px' }}>
            Warning: This world is flat. Do not venture past the edge.
          </span>
        </div>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid rgba(224, 214, 196, 0.08)',
            margin: '10px 0',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <div
              style={{
                fontSize: '7.5px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#c5b69c',
              }}
            >
              Local Time
            </div>
            <div
              style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '1px', color: '#f5f5f7' }}
            >
              {locationTime?.localTime ?? '--:--'}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '7.5px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#c5b69c',
              }}
            >
              Vectors
            </div>
            <div
              style={{ fontSize: '11.5px', fontWeight: 'bold', marginTop: '1px', color: '#f5f5f7' }}
            >
              {latitude}, {longitude}
            </div>
          </div>
        </div>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid rgba(224, 214, 196, 0.08)',
            margin: '10px 0',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '9.5px',
            color: '#94a3b8',
          }}
        >
          <span style={{ fontStyle: 'italic', fontSize: '9px', opacity: 0.8, color: '#c5b69c' }}>
            * Simulated mathematically. Real-world cosmic anomalies and localized visibility
            parameters may vary.
          </span>
          <button
            onClick={() => window.open('https://github.com/nullsploit01/nyx', '_blank')}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              fontSize: '9.5px',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '12px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f5f5f7')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Credits
          </button>
        </div>
      </div>
    </Html>
  );
};

export default NoticeBoardInformation;
