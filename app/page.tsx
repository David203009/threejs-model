'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';

function Model() {
  const { scene } = useGLTF('/models/capibara.glb');
  const groupRef = useRef<any>(null);

  useEffect(() => {
    scene.traverse((child) => {
      child.visible = true;
    });
  }, [scene]);

  // Rotación automática lenta
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={1}
        position={[0, -2.5, 0]}
        rotation={[0.01, -2, 0]}
      />
    </group>
  );
}

export default function Home() {
  const [lightsOn, setLightsOn] = useState(true);

  const toggleLights = () => {
    setLightsOn(!lightsOn);
  };

  return (
    <main
      className="w-full h-screen bg-gradient-to-b from-orange-900 via-orange-500 to-orange-700 relative cursor-pointer overflow-hidden"
      onClick={toggleLights}
    >
      {/* Título HTML overlay - Responsive */}
      <div className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-4">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          I'M DAVID, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">DEVELOPER</span>
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-white/80 mt-1 md:mt-2 font-light tracking-wider">
          Creating awesome 3D experiences
        </p>
      </div>

      {/* Instrucciones - Responsive */}
      <div className="absolute left-4 md:right-6 bottom-4 md:top-1/2 md:-translate-y-1/2 z-10 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3 text-white text-xs md:text-sm space-y-1 md:space-y-2 pointer-events-none">
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg">🖱️</span>
          <span className="hidden sm:inline">Click + Drag = Rotar</span>
          <span className="sm:hidden">Drag = Rotar</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg">🔍</span>
          <span className="hidden sm:inline">Scroll = Zoom</span>
          <span className="sm:hidden">Pinch = Zoom</span>
        </p>
        <p className="flex items-center gap-2 hidden sm:flex">
          <span className="text-lg">✋</span> Right Click = Mover
        </p>
        <p className="flex items-center gap-2">
          <span className="text-base md:text-lg">💡</span>
          <span className="hidden sm:inline">Click = {lightsOn ? 'Apagar' : 'Prender'}</span>
          <span className="sm:hidden">Tap = Luz</span>
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
        // Touch-friendly
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={lightsOn ? 1 : 0.1} />
        <directionalLight position={[5, 5, 5]} intensity={lightsOn ? 5 : 0.2} />
        {lightsOn && <Environment preset="sunset" />}

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          // Touch-friendly
          touches={{
            ONE: 0,   // Un dedo = Rotar
            TWO: 2    // Dos dedos = Zoom/Pan
          }}
          mouseButtons={{
            LEFT: 0,
            MIDDLE: 1,
            RIGHT: 2
          }}
        />
      </Canvas>
    </main>
  );
}