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
          minWidth: '260px',
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
              fontSize: '1.7rem',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-0.05em',
            }}
          >
            {star.name}
          </h2>

          {star.designation && (
            <div
              style={{
                marginTop: '6px',
                fontSize: '0.82rem',
                color: 'rgba(190,205,255,0.55)',
              }}
            >
              {star.designation}
            </div>
          )}

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
              marginTop: '12px',
              color: 'rgba(190,205,255,0.58)',
              lineHeight: 1.55,
              fontSize: '0.9rem',
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
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px 24px',
            }}
          >
            <InfoItem label="Distance" value={formatDistance(star.distance)} />
            <InfoItem label="Visibility" value={getVisibilityText(star.magnitude)} />

            <InfoItem
              label="Luminosity"
              value={
                star.luminosity > 0
                  ? `${Math.round(star.luminosity).toLocaleString()}× Sun`
                  : 'Unknown'
              }
            />

            <InfoItem label="Type" value={getStarDescription(star.spectral)} />
          </div>
        </div>
      </div>
    </Html>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div
      style={{
        fontSize: '0.68rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(160,180,220,0.42)',
      }}
    >
      {label}
    </div>

    <div
      style={{
        marginTop: '4px',
        fontSize: '0.95rem',
        fontWeight: 600,
      }}
    >
      {value}
    </div>
  </div>
);

export default StarInfoCard;
