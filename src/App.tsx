import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {useLayoutEffect, useRef, useState} from 'react';
import './App.css';
import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  CameraControls,
} from '@react-three/drei';
import {Color} from 'three';
import {useControls} from 'leva';
//import prand from 'pure-rand';

function CranePointCloud() {
  const [seed] = useState(() => Math.round(Math.random() * 100));

  const ctrl = useControls({
    totalCranes: {value: 400, min: 1, max: 1000},
    craneSize: {value: 10, min: 1, max: 100},
    randSeed: {value: seed, step: 1},
    ceilingWidth: {value: 350},
    ceilingDepth: {value: 100},
  });

  const {camera} = useThree();

  useFrame(() =>
    console.log(camera.position, camera.rotation, camera.far, camera.applyQuaternion)
  );

  //const rng = useMemo(() => prand.xoroshiro128plus(ctrl.randSeed), [ctrl.randSeed]);

  //const getRand = useCallback(
  //  () => prand.unsafeUniformIntDistribution(0, 1000, rng) / 1000,
  //  [rng]
  //);
  //
  //// Parameters for dispersal in 3D space
  //const heightIncrement = 0.2; // Y-axis increment
  //const depthIncrement = 1; // Z-axis increment
  //const spread = 30; // X-axis random spread

  // Generate crane points in a specific pattern
  const points = Array.from({length: ctrl.totalCranes}, (_, i) => {
    return {
      position: [0, i * 20, 0] as const,
      color: new Color(`hsl(${(i / ctrl.totalCranes) * 360}, 100%, 70%)`), // Optional color variation
    };
  });

  return (
    <group>
      <mesh position={[0, 200, 0]}>
        <boxGeometry args={[ctrl.ceilingWidth, 1, ctrl.ceilingDepth]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {points.map((point, index) => (
        <mesh key={index} position={point.position}>
          <sphereGeometry args={[ctrl.craneSize / 2, 32, 32]} />
          {/* Small sphere for each crane point */}
          <meshStandardMaterial color={point.color} />
        </mesh>
      ))}
    </group>
  );
}

function Controls() {
  const controls = useRef<any>();

  useLayoutEffect(() => {
    console.log(controls.current);
    controls.current?.setLookAt(200, 80, 600, 0, 80, 0);
    console.log(controls);
  }, [controls]);

  return <CameraControls ref={controls} />;
}

function App() {
  return (
    <Canvas id="main" shadows camera={{fov: 30}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      <CranePointCloud />

      <Grid
        position={[0, -0.01, 0]}
        args={[10.5, 10.5]}
        cellSize={15}
        cellThickness={1}
        cellColor={'#6f6f6f'}
        sectionSize={30}
        sectionThickness={1.2}
        sectionColor={'#9d4b4b'}
        fadeDistance={1000}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      <Controls />
      <Environment preset="city" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
}

export default App;
