'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import styles from "../styles/StepViewer.module.css"
function Model({ url, startAngle = 0, scrollRotation = 0, pivotOffset = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const meshRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = startAngle + scrollRotation;
      groupRef.current.rotation.x = scrollRotation * 0.5;
    }
    
    // Apply scale smoothly
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive 
          ref={meshRef}
          object={scene} 
          position={pivotOffset}
          rotation={[0, 0, 0]}
        />
      </Center>
    </group>
  );
}

export default function StepViewer({ 
  fileUrl, 
  initialAngle = Math.PI / 2,
  pivotOffset = [0, 0, 0]
}) {
  const [scrollRotation, setScrollRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const lastScrollY = useRef(0);
  const previousRotation = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY.current;
        lastScrollY.current = currentScrollY;
        
        setScrollRotation(prev => {
          const newRotation = prev + scrollDelta * 0.004;
          
          // Check if rotation direction changed (user scrolled back up/down significantly)
          // This detects when a new rotation cycle starts
          const rotationDelta = newRotation - previousRotation.current;
          
          // If rotation changes direction or resets, reset scale
          if (Math.abs(rotationDelta) > 0.1) {
            // Check if we've completed a cycle or changed direction
            const currentCycle = Math.floor(Math.abs(newRotation) / (Math.PI * 2));
            const previousCycle = Math.floor(Math.abs(previousRotation.current) / (Math.PI * 2));
            
            if (currentCycle !== previousCycle) {
              setScale(1); // Reset to original size
            }
          }
          
          previousRotation.current = newRotation;
          return newRotation;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3)); // Max scale 3x
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5)); // Min scale 0.5x
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  return (
    <div style={{ position: 'relative' , overflow: 'visible', width: '100%', height: '100%'}}>
      {/* Zoom Controls */}
      <div className={styles.stepViewerButtons} >
        <button
          onClick={handleZoomIn}
          className={styles.stepViewerButton}
          onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
        >
          +
        </button>
        
        <button
          onClick={handleZoomOut}
          className={styles.stepViewerButton}
          onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
        >
          −
        </button>

        <button
          onClick={handleResetZoom}
          className={styles.stepViewerButton}
          onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
          title="Reset zoom"
        >
          ⟲
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        {(scale * 100).toFixed(0)}%
      </div>

      <div ref={containerRef} className={styles.canvasContainer}>
        <Canvas camera={{ position: [130, 130, 130], fov: 50 }} style={{ overflow: 'visible' }}>
          <Suspense fallback={null} >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            
            <Model 
              url={fileUrl} 
              startAngle={initialAngle}
              scrollRotation={scrollRotation}
              pivotOffset={pivotOffset}
              scale={scale}
            />
          </Suspense>
          <OrbitControls 
            enableZoom={false}
            enablePan={true}
            enableRotate={true}
            minDistance={225}
            maxDistance={225}
          />
        </Canvas>
      </div>
    </div>
  );
}