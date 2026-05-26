import type { NominatimReverseResponse } from '../types';
import { Html } from '@react-three/drei';

const LocationCard = ({ location }: { location: NominatimReverseResponse }) => {
  const hasError = 'error' in location;

  return (
    <Html
      center
      style={{
        transform: 'translate3d(-50%, 120px, 0)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '280px',
          padding: '20px',
          borderRadius: '26px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(5,10,25,0.95), rgba(7,12,24,0.82))',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(120,160,255,0.14)',
          boxShadow: `
            0 0 60px rgba(50,120,255,0.10),
            inset 0 1px 0 rgba(255,255,255,0.04),
            0 20px 50px rgba(0,0,0,0.45)
        `,
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-60px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(70,140,255,0.22), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {hasError ? (
          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              No location data available
            </h2>

            <p
              style={{
                margin: '10px 0 0',
                color: 'rgba(255,255,255,0.72)',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              This location appears to be somewhere between ocean, wilderness, and humanity not
              documenting things properly.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: '#ff4d4d',
                    boxShadow: '0 0 20px rgba(255,70,70,0.9)',
                  }}
                />

                <div
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.22em',
                    color: 'rgba(160,190,255,0.7)',
                    textTransform: 'uppercase',
                  }}
                >
                  {location.type}
                </div>
              </div>

              <h1
                style={{
                  margin: '14px 0 0',
                  fontSize: '2rem',
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                }}
              >
                {location.name}
              </h1>

              <div
                style={{
                  marginTop: '10px',
                  color: 'rgba(180,200,255,0.76)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                }}
              >
                {location.address.state || location.address.state_district}
                {' · '}
                {location.address.country}
              </div>
            </div>

            <div
              style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(150,170,220,0.55)',
                  }}
                >
                  Latitude
                </div>

                <div
                  style={{
                    marginTop: '6px',
                    fontSize: '1rem',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {Math.abs(Number(location.lat)).toFixed(2)}°{' '}
                  {Number(location.lat) >= 0 ? 'N' : 'S'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.7rem',

                    letterSpacing: '0.18em',

                    textTransform: 'uppercase',

                    color: 'rgba(150,170,220,0.55)',
                  }}
                >
                  Longitude
                </div>

                <div
                  style={{
                    marginTop: '6px',

                    fontSize: '1rem',

                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {Math.abs(Number(location.lon)).toFixed(2)}°{' '}
                  {Number(location.lon) >= 0 ? 'E' : 'W'}
                </div>
              </div>
            </div>

            <button
              style={{
                marginTop: '22px',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                border: '1px solid rgba(120,160,255,0.14)',
                background: 'linear-gradient(to bottom, rgba(25,35,70,0.65), rgba(15,22,40,0.82))',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 24px rgba(60,120,255,0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.border = '1px solid rgba(140,180,255,0.28)';
                e.currentTarget.style.boxShadow = `
                    0 0 30px rgba(80,140,255,0.22),
                    0 0 60px rgba(80,140,255,0.08)
                `;
                e.currentTarget.style.background =
                  'linear-gradient(to bottom, rgba(40,60,120,0.88), rgba(20,30,55,0.95))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.border = '1px solid rgba(120,160,255,0.14)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(60,120,255,0.12)';
                e.currentTarget.style.background =
                  'linear-gradient(to bottom, rgba(25,35,70,0.65), rgba(15,22,40,0.82))';
              }}
            >
              <span
                style={{
                  color: '#9ec5ff',
                  marginRight: '8px',
                }}
              >
                ✦
              </span>
              View Night Sky
            </button>
          </>
        )}
      </div>
    </Html>
  );
};

export default LocationCard;
