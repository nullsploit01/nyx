import { getLocationByLatAndLng } from '../services/api/location';
import fragmentShader from '../shaders/globe/fragment.glsl';
import vertexShader from '../shaders/globe/vertex.glsl';
import { useGlobeStore } from '../stores/globeStore';
import type { NominatimReverseResponse } from '../types';
import { getLocationTime } from '../utils';
import HelperMessage from './HelperMessage';
import LocationCard from './LocationCard';
import { OrbitControls, Sparkles, useGLTF, useTexture } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, BackSide, Group, type Mesh, Vector3 } from 'three';

const Globe = () => {
  const { camera } = useThree();

  const coords = useGlobeStore((state) => state.coords);
  const setCoords = useGlobeStore((state) => state.setCoords);
  const location = useGlobeStore((state) => state.location);
  const setLocation = useGlobeStore((state) => state.setLocation);
  const setShowGlobe = useGlobeStore((state) => state.setShowGlobe);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const globeRef = useRef<Mesh>(null);
  const introProgress = useRef(0);
  const targetCameraPosition = useRef(new Vector3(4, 2, 8));
  const markerRef = useRef<Group>(null);

  const [marker, setMarker] = useState<Vector3 | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [isCameraMoving, setIsCameraMoving] = useState(false);
  const [loadingMarkedLocation, setLoadingMarkedLocation] = useState(false);
  const [hint, setHint] = useState<string | null>('Tap the globe to select a camp location');

  const [colorMap, bumpMap] = useTexture([
    './textures/earth/8081_earthlights4k.webp',
    './textures/earth/8081_earthbump4k.webp',
  ]);

  const locationPinModel = useGLTF('./models/pin_location/pin_location_compressed.glb');

  useEffect(() => {
    if (!coords || (!coords.lat && !coords.lng)) {
      return;
    }

    getLocationByLatAndLng(coords.lat, coords.lng)
      .then((res) => {
        setLocation(res.data);
      })
      .catch((err) => {
        console.error(err);
        setLocation({ error: 'Service Unavailable' } as NominatimReverseResponse);
      })
      .finally(() => {
        setLoadingMarkedLocation(false);
      });
  }, [coords]);

  const locationTime = useMemo(() => {
    if (!coords) {
      return null;
    }

    return getLocationTime(coords.lat, coords.lng);
  }, [coords]);

  useFrame((_, delta) => {
    if (!globeRef.current || !controlsRef.current) {
      return;
    }

    if (!isCameraMoving && !location) {
      globeRef.current.rotation.y += delta * 0.007;
    }

    if (!introDone) {
      introProgress.current += delta * 0.22;

      const t = Math.min(introProgress.current, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.set(12 - eased * 8, 4 - eased * 3, 18 - eased * 11);

      camera.position.x += Math.sin(t * Math.PI) * 2;

      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      if (t >= 1) {
        setIntroDone(true);
      }

      return;
    }

    if (isCameraMoving) {
      camera.position.lerp(targetCameraPosition.current, delta * 1.8);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetCameraPosition.current) < 0.1) {
        setIsCameraMoving(false);
      }
    }
  });

  const onGlobeClick = (e: ThreeEvent<MouseEvent>) => {
    if (!globeRef.current || !introDone) {
      return;
    }

    const localPoint = globeRef.current.worldToLocal(e.point.clone());
    localPoint.normalize();

    const markerPosition = localPoint.clone().multiplyScalar(4.05);
    setMarker(markerPosition);

    const direction = e.point.clone().normalize();

    const cameraPosition = direction
      .clone()
      .multiplyScalar(8)
      .add(new Vector3(0.8, 0.4, 0.8));

    targetCameraPosition.current.copy(cameraPosition);
    setIsCameraMoving(true);

    const lat = Math.asin(localPoint.y) * (180 / Math.PI);
    let lng = Math.atan2(-localPoint.x, -localPoint.z) * (180 / Math.PI);
    lng += 90;
    lng = ((((lng + 180) % 360) + 360) % 360) - 180;

    const normal = localPoint.clone().normalize();
    markerRef.current?.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), normal);
    markerRef.current?.rotateX(-1.2);
    setCoords({ lat, lng });
    setLoadingMarkedLocation(true);
    setHint(null);
  };

  const onViewSkyBtnClick = () => {
    if (!marker) {
      return;
    }

    const direction = marker.clone().normalize();

    const zoomPosition = direction
      .clone()
      .multiplyScalar(4.8)
      .add(new Vector3(0.2, 0.15, 0.2));

    targetCameraPosition.current.copy(zoomPosition);
    setIsCameraMoving(true);
    setTimeout(() => {
      setShowGlobe(false);
    }, 2000);
  };

  return (
    <>
      <mesh ref={globeRef} onClick={onGlobeClick}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.04} />
        {marker && (
          <>
            <mesh position={marker} ref={markerRef} scale={0.5}>
              <primitive object={locationPinModel.scene} />
            </mesh>
            {location && (
              <LocationCard
                locationTime={locationTime}
                onClick={onViewSkyBtnClick}
                loading={loadingMarkedLocation}
                location={location}
              />
            )}
          </>
        )}
      </mesh>

      {/* atmosphere */}
      <mesh scale={1.006}>
        <sphereGeometry args={[4, 64, 64]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          depthTest
          side={BackSide}
          blending={AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <ambientLight intensity={3} />

      <directionalLight position={[10, 5, 10]} intensity={2} />

      <Sparkles
        count={1000}
        position={[0, 3, 0]}
        scale={100}
        size={1}
        speed={0.2}
        opacity={0.4}
        color="#88ccff"
      />

      <OrbitControls
        ref={controlsRef}
        enabled={introDone && !isCameraMoving}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={20}
      />
      {hint && <HelperMessage message={hint} duration={12500} onComplete={() => setHint(null)} />}
    </>
  );
};

export default Globe;
