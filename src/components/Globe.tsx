import { getLocationByLatAndLng } from '../services/api/location';
import fragmentShader from '../shaders/globe/fragment.glsl';
import vertexShader from '../shaders/globe/vertex.glsl';
import type { NominatimReverseResponse } from '../types';
import LocationCard from './LocationCard';
import { OrbitControls, Sparkles, useGLTF, useTexture } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { AdditiveBlending, BackSide, Group, type Mesh, Vector3 } from 'three';

const Globe = () => {
  const { camera } = useThree();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const globeRef = useRef<Mesh>(null);
  const introProgress = useRef(0);
  const targetCameraPosition = useRef(new Vector3(4, 2, 8));
  const markerRef = useRef<Group>(null);

  const [marker, setMarker] = useState<Vector3 | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [isCameraMoving, setIsCameraMoving] = useState(false);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [markedLocation, setMarkedLocation] = useState<NominatimReverseResponse | null>(null);
  const [loadingMarkedLocation, setLoadingMarkedLocation] = useState(false);
  const [colorMap, bumpMap] = useTexture([
    './textures/earth/earth-night.jpg',
    './textures/earth/earth-topology.png',
  ]);

  const locationPinModel = useGLTF('./models/pin_location/pin_location.glb');

  useEffect(() => {
    if (!coords.lat && !coords.lon) {
      return;
    }

    getLocationByLatAndLng(coords.lat, coords.lon)
      .then((res) => {
        setMarkedLocation(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMarkedLocation({ error: 'Service Unavailable' } as NominatimReverseResponse);
      })
      .finally(() => {
        setLoadingMarkedLocation(false);
      });
  }, [coords]);

  useFrame((_, delta) => {
    if (!globeRef.current || !controlsRef.current) {
      return;
    }

    // pause rotation during camera movement
    if (!isCameraMoving && !markedLocation) {
      globeRef.current.rotation.y += delta * 0.02;
    }

    // cinematic intro
    if (!introDone) {
      introProgress.current += delta * 0.22;

      const t = Math.min(introProgress.current, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.set(12 - eased * 8, 4 - eased * 3, 18 - eased * 11);

      // slight cinematic arc
      camera.position.x += Math.sin(t * Math.PI) * 2;

      // orbit controls owns rotation
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      if (t >= 1) {
        setIntroDone(true);
      }

      return;
    }

    // smooth camera movement
    if (isCameraMoving) {
      camera.position.lerp(targetCameraPosition.current, delta * 1.8);
      controlsRef.current.update();

      // finish movement
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

    // marker above surface
    const markerPosition = localPoint.clone().multiplyScalar(4.05);
    setMarker(markerPosition);

    // world direction
    const direction = e.point.clone().normalize();

    // smoother camera angle
    const cameraPosition = direction
      .clone()
      .multiplyScalar(8)
      .add(new Vector3(0.8, 0.4, 0.8));

    targetCameraPosition.current.copy(cameraPosition);
    setIsCameraMoving(true);

    // lat/lng
    const lat = Math.asin(localPoint.y) * (180 / Math.PI);
    let lng = Math.atan2(-localPoint.x, -localPoint.z) * (180 / Math.PI);
    lng += 90;
    lng = ((((lng + 180) % 360) + 360) % 360) - 180;

    const normal = localPoint.clone().normalize();
    markerRef.current?.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), normal);
    markerRef.current?.rotateX(-1.2);
    setCoords({ lat, lon: lng });
    setLoadingMarkedLocation(true);
  };

  const onViewSkyBtnClick = () => {
    if (!marker) {
      return;
    }

    const direction = marker.clone().normalize();

    const zoomPosition = direction
      .clone()
      .multiplyScalar(4.35)
      .add(new Vector3(0.08, 0.05, 0.08));

    targetCameraPosition.current.copy(zoomPosition);
    setIsCameraMoving(true);
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
            {markedLocation && (
              <LocationCard
                onClick={onViewSkyBtnClick}
                loading={loadingMarkedLocation}
                location={markedLocation}
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
    </>
  );
};

export default Globe;
