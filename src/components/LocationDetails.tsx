import type { NominatimReverseResponse } from '../types';
import type { LocationTimeData } from '../utils';
import { Html } from '@react-three/drei';

const NoticeBoardInformation = ({
  location,
  locationTime,
}: {
  location: NominatimReverseResponse;
  locationTime: LocationTimeData | null;
}) => {
  const city =
    location.address?.city ||
    location.address?.town ||
    location.address?.village ||
    location.address?.hamlet ||
    location.name;

  const skyQuality =
    location.type === 'city'
      ? 'Urban Sky'
      : location.type === 'town'
        ? 'Suburban Sky'
        : location.type === 'village'
          ? 'Rural Sky'
          : 'Dark Sky';

  return (
    <Html
      style={{
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'fixed',
          left: '32px',
          top: '32px',
          width: '260px',
          padding: '24px',
          borderRadius: '24px',
          background: 'rgba(5,8,16,0.38)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: `
          0 0 80px rgba(120,180,255,0.06),
          inset 0 0 0 1px rgba(255,255,255,0.015)
        `,
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          pointerEvents: 'none',
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
          Observing From
        </div>

        <h2
          style={{
            margin: '10px 0 0',
            fontSize: '2rem',
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: '-0.05em',
          }}
        >
          {city}
        </h2>

        <div
          style={{
            marginTop: '8px',
            color: 'rgba(180,200,255,0.7)',
            fontSize: '0.95rem',
          }}
        >
          {location.address?.state}, {location.address?.country}
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
            marginTop: '18px',
            display: 'grid',
            gap: '16px',
          }}
        >
          <InfoRow label="Local Time" value={locationTime?.localTime ?? '--:--'} />

          <InfoRow label="Sky Quality" value={skyQuality} />

          <InfoRow
            label="Latitude"
            value={`${Math.abs(Number(location.lat)).toFixed(2)}° ${
              Number(location.lat) >= 0 ? 'N' : 'S'
            }`}
          />

          <InfoRow
            label="Longitude"
            value={`${Math.abs(Number(location.lon)).toFixed(2)}° ${
              Number(location.lon) >= 0 ? 'E' : 'W'
            }`}
          />
        </div>

        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
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
            Tonight
          </div>

          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <Badge text="Orion" />
            <Badge text="Taurus" />
            <Badge text="Perseus" />
          </div>
        </div>
      </div>
    </Html>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
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
        fontSize: '1rem',
        fontWeight: 600,
      }}
    >
      {value}
    </div>
  </div>
);

const Badge = ({ text }: { text: string }) => (
  <div
    style={{
      padding: '6px 10px',
      borderRadius: '999px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.05)',
      fontSize: '0.8rem',
      color: 'rgba(220,230,255,0.85)',
    }}
  >
    {text}
  </div>
);

export default NoticeBoardInformation;
