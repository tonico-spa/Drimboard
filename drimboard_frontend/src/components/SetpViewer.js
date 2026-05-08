'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Bounds, useBounds } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import styles from "../styles/StepViewer.module.css"

// Once the model is loaded, ask Bounds to refit the camera to it.
function FitOnLoad({ deps }) {
  const bounds = useBounds();
  useEffect(() => {
    bounds.refresh().clip().fit();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function Model({ url, startAngle = 0, scrollRotation = 0, pivotOffset = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const meshRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = startAngle + scrollRotation;
      groupRef.current.rotation.x = scrollRotation * 0.5;
    }
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
      <FitOnLoad deps={[scene]} />
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

  // Force Three.js to remeasure once the page settles. The Canvas measures
  // its container at mount, but the container's dimensions aren't final yet
  // (sticky positioning + reveal animation settle on later ticks). Without
  // these resizes, the WebGL viewport stays 0×0 until the user does something
  // — like switching tabs — that triggers a window resize.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'));
    const t1 = setTimeout(fire, 100);
    const t2 = setTimeout(fire, 500);
    const t3 = setTimeout(fire, 1200);
    let observer;
    if (containerRef.current && 'ResizeObserver' in window) {
      observer = new ResizeObserver(fire);
      observer.observe(containerRef.current);
    }
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      observer?.disconnect();
    };
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
        <Canvas camera={{ position: [3, 3, 3], fov: 45, near: 0.01, far: 5000 }} style={{ overflow: 'visible' }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.6} />
          <hemisphereLight args={['#ffffff', '#888888', 0.6]} />

          <Suspense fallback={null}>
            <Bounds fit clip margin={2}>
              <Model
                url={fileUrl}
                startAngle={initialAngle}
                scrollRotation={scrollRotation}
                pivotOffset={pivotOffset}
                scale={scale}
              />
            </Bounds>
          </Suspense>
          <OrbitControls
            enableZoom
            enablePan
            enableRotate
            makeDefault
          />
        </Canvas>
      </div>
    </div>
  );
}