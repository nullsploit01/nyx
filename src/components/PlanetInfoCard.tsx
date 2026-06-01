import type { VisiblePlanet } from '../types';
import { Html } from '@react-three/drei';

const PLANET_DESCRIPTIONS: Record<string, string> = {
  Mercury: 'Rocky Planet',
  Venus: 'Terrestrial Planet',
  Mars: 'The Red Planet',
  Jupiter: 'Gas Giant',
  Saturn: 'Ringed Gas Giant',
};

const PLANET_TEXT: Record<string, string> = {
  Mercury: 'A scorched rocky world orbiting closest to the Sun.',
  Venus: 'Hidden beneath thick clouds and the hottest planet in the solar system.',
  Mars: 'A dusty desert world known for its red appearance.',
  Jupiter:
    'The largest planet in the solar system, visible as one of the brightest objects in the night sky.',
  Saturn: 'Famous for its magnificent rings and golden appearance.',
};

const PLANET_GLOWS: Record<string, string> = {
  Mercury: 'radial-gradient(circle at center, rgba(220,220,220,0.25), transparent 70%)',
  Venus: 'radial-gradient(circle at center, rgba(255,245,210,0.25), transparent 70%)',
  Mars: 'radial-gradient(circle at center, rgba(255,120,80,0.25), transparent 70%)',
  Jupiter: 'radial-gradient(circle at center, rgba(255,220,170,0.25), transparent 70%)',
  Saturn: 'radial-gradient(circle at center, rgba(255,235,180,0.25), transparent 70%)',
};

const formatDistance = (km: number) => {
  if (km > 1_000_000_000) {
    return `${(km / 1_000_000_000).toFixed(2)} B km`;
  }

  return `${(km / 1_000_000).toFixed(1)} M km`;
};

const getVisibilityText = (mag: number) => {
  if (mag < -2) return 'Extremely Bright';
  if (mag < 0) return 'Very Bright';
  if (mag < 2) return 'Bright';
  return 'Visible';
};

const PlanetInfoCard = ({ planet }: { planet: VisiblePlanet }) => {
  return (
    <Html position={[planet.worldPosition.x, planet.worldPosition.y, planet.worldPosition.z]}>
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
            background: PLANET_GLOWS[planet.name],
            opacity: 0.7,
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
            Solar System
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
            {planet.name}
          </h2>

          <div
            style={{
              marginTop: '6px',
              fontSize: '0.82rem',
              color: 'rgba(190,205,255,0.55)',
            }}
          >
            {PLANET_DESCRIPTIONS[planet.name]}
          </div>

          <div
            style={{
              marginTop: '12px',
              color: 'rgba(220,230,255,0.76)',
              fontSize: '1rem',
            }}
          >
            {PLANET_DESCRIPTIONS[planet.name]}
          </div>

          <div
            style={{
              marginTop: '12px',
              color: 'rgba(190,205,255,0.58)',
              lineHeight: 1.55,
              fontSize: '0.9rem',
            }}
          >
            {PLANET_TEXT[planet.name]}
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
            <InfoItem label="Distance" value={formatDistance(planet.distanceKm)} />

            <InfoItem label="Visibility" value={getVisibilityText(planet.magnitude)} />

            <InfoItem label="Magnitude" value={planet.magnitude.toFixed(1)} />

            <InfoItem label="Feature" value={planet.hasRing ? 'Rings' : 'Planet'} />
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

export default PlanetInfoCard;
