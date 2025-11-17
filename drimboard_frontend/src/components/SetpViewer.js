'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url, startAngle = 0 }) {
  const { scene } = useGLTF(url);

  return (
    <primitive 
      object={scene} 
      rotation={[0, startAngle, 0]} 
    />
  );
}

export default function StepViewer({ fileUrl, initialAngle = Math.PI / 2 }) {
  return (
<div style={{ width: '100%', height: '600px' }}>
      <Canvas camera={{ position: [130, 130, 130], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Add manual lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          
          <Model 
            url={fileUrl} 
            startAngle={initialAngle}
          />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minDistance={225}
          maxDistance={225}
        />
      </Canvas>
    </div>
  );
}