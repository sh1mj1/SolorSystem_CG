import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import planetData from "./data.js";
import "./App.css";

import sunImg from "./textures/sun.jpg";
import mercuryImg from "./textures/mercury.jpg";
import venusImg from "./textures/venus.jpg";
import earthImg from "./textures/earth.jpg";
import marsImg from "./textures/mars.jpg";
import jupiterImg from "./textures/jupiter.jpg";
import saturnImg from "./textures/saturn.jpg";
import uranusImg from "./textures/uranus.jpg";
import neptuneImg from "./textures/neptune.jpg";
import spaceBackgroundImg from "./textures/stars.jpg";

const radiusUnit = 0.0001;
const radiusUnit2 = 0.000003;
const distanceUnit = 0.0000001;
// const periodUnit = 0.000000000000000001

export default function App() {
  // planet img
  const [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune] =
    useLoader(THREE.TextureLoader, [
      mercuryImg,
      venusImg,
      earthImg,
      marsImg,
      jupiterImg,
      saturnImg,
      uranusImg,
      neptuneImg,
    ]);

  return (
    <>
      <a
        href="https://medium.com/geekculture/build-3d-apps-with-react-animated-solar-system-part-2-1186a5c8bd1"
        className="article-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Step by step guide to how I build this
      </a>
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
        <BgSpace />
        <Sun />
        {/* mercury */}
        <Planet
          planet={{
            orbitDistance: 579e5 * distanceUnit,
            size: (4878 / 2) * radiusUnit,
            img: mercury,
            orbitalPeriod: 0.24 * 365,
            rotationPeriod: 58.65,
          }}
        />
        {/* venus */}
        <Planet
          planet={{
            orbitDistance: 1082e5 * distanceUnit,
            size: (12104 / 2) * radiusUnit,
            img: venus,
            orbitalPeriod: 0.62 * 365,
            rotationPeriod: 243,
          }}
        />
        {/* earth */}
        <Planet
          planet={{
            orbitDistance: 1496e5 * distanceUnit,
            size: (12756 / 2) * radiusUnit,
            img: earth,
            orbitalPeriod: 1 * 365,
            rotationPeriod: 1,
          }}
        />

        {/* mars */}
        <Planet
          planet={{
            orbitDistance: 2279e5 * distanceUnit,
            size: (6787 / 2) * radiusUnit,
            img: mars,
            orbitalPeriod: 1.88 * 365,
            rotationPeriod: 1.03,
          }}
        />
        {/* jupiter */}
        <Planet
          planet={{
            orbitDistance: 7783e5 * distanceUnit,
            size: (1427960 / 2) * radiusUnit2,
            img: jupiter,
            orbitalPeriod: 11.86 * 365,
            rotationPeriod: 0.41,
          }}
        />
        {/* saturn */}
        <Planet
          planet={{
            orbitDistance: 1427e6 * distanceUnit,
            size: (120660 / 2) * radiusUnit * 0.5,
            img: saturn,
            orbitalPeriod: 29.46 * 365,
            rotationPeriod: 0.44,
          }}
        />

        {/* uranus */}
        <Planet
          planet={{
            orbitDistance: 2871e6 * distanceUnit,
            size: (51118 / 2) * radiusUnit,
            img: uranus,
            orbitalPeriod: 84.01 * 365,
            rotationPeriod: -0.72,
          }}
        />
        {/* neptune */}
        <Planet
          planet={{
            orbitDistance: 44971e5 * distanceUnit,
            size: (48600 / 2) * radiusUnit,
            img: neptune,
            orbitalPeriod: 164.8 * 365,
            rotationPeriod: 0.72,
          }}
        />

        <Lights />
        <OrbitControls />
      </Canvas>
    </>
  );
}

function Sun() {
  const sun = useLoader(THREE.TextureLoader, sunImg);
  const sunRef = React.useRef();
  useFrame(() => {
    sunRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshStandardMaterial map={sun} />
    </mesh>
  );
}

function Planet({
  planet: { orbitDistance, size, img, orbitalPeriod, rotationPeriod },
}) {
  const planetRef = React.useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() / (orbitalPeriod * 0.001);
    const x = orbitDistance * Math.sin(t);
    const z = orbitDistance * Math.cos(t);
    planetRef.current.position.x = x;
    planetRef.current.position.z = z;
    planetRef.current.rotation.y += 0.1 / rotationPeriod;
  });

  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={img} />
      </mesh>
      <Ecliptic xRadius={orbitDistance} zRadius={orbitDistance} />
    </>
  );
}

function BgSpace() {
  const spaceBackground = useLoader(THREE.TextureLoader, spaceBackgroundImg);
  const sunRef = React.useRef();
  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshStandardMaterial side={THREE.DoubleSide} map={spaceBackground} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
    </>
  );
}

function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const points = [];
  for (let index = 0; index < 64; index++) {
    const angle = (index / 64) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  points.push(points[0]);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#BFBBDA" linewidth={10} />
    </line>
  );
}
