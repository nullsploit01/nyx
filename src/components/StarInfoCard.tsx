import type { VisibleStar } from '../types';
import {
  formatDistance,
  getSpectralGlow,
  getStarAtmosphereText,
  getStarDescription,
  getVisibilityText,
} from '../utils';
import { Html } from '@react-three/drei';

const StarInfoCard = ({ star }: { star: VisibleStar }) => {
  return (
    <Html position={[star.worldPosition.x, star.worldPosition.y, star.worldPosition.z]}>
      <div
        style={{
          minWidth: '240px',
          padding: '18px 20px',
          borderRadius: '24px',
          background: 'rgba(5,8,16,0.34)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.05)',
          transform: 'translate3d(48px,-50%,0)',
          boxShadow: `
                0 0 80px rgba(120,180,255,0.06),
                inset 0 0 0 1px rgba(255,255,255,0.015)
              `,
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: getSpectralGlow(star.spectral),
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(180,200,255,0.38)',
            }}
          >
            {star.constellation}
          </div>
          <h2
            style={{
              margin: '10px 0 0',
              fontSize: '1.85rem',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-0.05em',
            }}
          >
            {star.name}
          </h2>

          <div
            style={{
              marginTop: '12px',
              color: 'rgba(220,230,255,0.76)',
              fontSize: '1rem',
            }}
          >
            {getStarDescription(star.spectral)}
          </div>

          <div
            style={{
              marginTop: '14px',
              color: 'rgba(190,205,255,0.58)',
              lineHeight: 1.6,
              fontSize: '0.92rem',
            }}
          >
            {getStarAtmosphereText(star)}
          </div>

          <div
            style={{
              marginTop: '18px',
              height: '1px',
              background: 'rgba(255,255,255,0.05)',
            }}
          />

          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(160,180,220,0.42)',
                }}
              >
                Distance
              </div>

              <div
                style={{
                  marginTop: '6px',
                  fontSize: '1.02rem',
                  fontWeight: 600,
                }}
              >
                {formatDistance(star.distance)}
              </div>
            </div>

            <div
              style={{
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(160,180,220,0.42)',
                }}
              >
                Visibility
              </div>

              <div
                style={{
                  marginTop: '6px',
                  fontSize: '1.02rem',
                  fontWeight: 600,
                }}
              >
                {getVisibilityText(star.magnitude)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default StarInfoCard;
