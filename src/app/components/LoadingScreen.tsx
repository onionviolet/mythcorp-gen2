// src/app/components/LoadingScreen.tsx
'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera } from '@react-three/drei';
import { useProgress } from "@react-three/drei";
import * as THREE from 'three';

// --- Configuration for the Shapes ---
const shapeRadius = 2.2;
const binaryFontSize = 0.1;
const pointCount = 500;

// Loading messages with glitching effect
const loadingMessages = [
  'LOADING GUINEA PIGS',
  'LOADING ELEMENTS',
  'INITIALIZING SYSTEMS',
  'COMPILING REALITY',
  'ASSEMBLING PARTICLES',
  'BOOTSTRAPPING MATRIX',
];

function randomDigit() {
  return Math.random() > 0.5 ? '1' : '0';
}

function makeShapePoints(shapeType: 'sphere' | 'cube' | 'torus') {
  const temp = [];
  for (let i = 0; i < pointCount; i++) {
    let endPos: THREE.Vector3;
    
    if (shapeType === 'cube') {
      // Cube distribution - place points on 6 faces of a cube
      const side = Math.floor(Math.random() * 6);
      const u = Math.random() - 0.5;
      const v = Math.random() - 0.5;
      const size = shapeRadius;
      
      switch(side) {
        case 0: endPos = new THREE.Vector3(size, u * size * 2, v * size * 2); break;
        case 1: endPos = new THREE.Vector3(-size, u * size * 2, v * size * 2); break;
        case 2: endPos = new THREE.Vector3(u * size * 2, size, v * size * 2); break;
        case 3: endPos = new THREE.Vector3(u * size * 2, -size, v * size * 2); break;
        case 4: endPos = new THREE.Vector3(u * size * 2, v * size * 2, size); break;
        default: endPos = new THREE.Vector3(u * size * 2, v * size * 2, -size); break;
      }
    } else if (shapeType === 'torus') {
      // Torus distribution - place points on a donut shape
      const angle = Math.random() * Math.PI * 2;
      const tubeAngle = Math.random() * Math.PI * 2;
      const tubeRadius = 0.6;
      endPos = new THREE.Vector3(
        (shapeRadius * 0.7 + tubeRadius * Math.cos(tubeAngle)) * Math.cos(angle),
        tubeRadius * Math.sin(tubeAngle),
        (shapeRadius * 0.7 + tubeRadius * Math.cos(tubeAngle)) * Math.sin(angle)
      );
    } else {
      // Sphere distribution - place points randomly on a sphere surface
      endPos = new THREE.Vector3().randomDirection().multiplyScalar(shapeRadius);
    }
    
    // Start position is far away, then animates to the final position
    const startPos = endPos.clone().multiplyScalar(5); 
    temp.push({ start: startPos, end: endPos });
  }
  return temp;
}

// --- A single binary digit component ---
function BinaryDigit({ startPosition, endPosition, progress }: { startPosition: THREE.Vector3, endPosition: THREE.Vector3, progress: number }) {
  // drei's <Text> renders a troika mesh, so Mesh is the real type. Only
  // .position is touched below, which Object3D provides.
  const textRef = useRef<THREE.Mesh>(null);
  const digit = useMemo(() => randomDigit(), []);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.lerpVectors(startPosition, endPosition, progress);
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={binaryFontSize}
      color="#00ffff"
      anchorX="center"
      anchorY="middle"
    >
      {digit}
    </Text>
  );
}

// --- The Binary Shape Component (Sphere, Cube, or other) ---
// This component creates a 3D shape made of binary digits (0s and 1s)
// The shape can be a sphere, cube, or torus - randomly selected on each load
function DataShape({ progress, shapeType }: { progress: number, shapeType: 'sphere' | 'cube' | 'torus' }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Generate points based on the selected shape type
  const points = useMemo(() => makeShapePoints(shapeType), [shapeType]);

  // Rotate the shape slowly over time
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x -= delta / 20;
      groupRef.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <BinaryDigit key={i} startPosition={point.start} endPosition={point.end} progress={progress / 100} />
      ))}
    </group>
  );
}

// --- The Main Loading Screen ---
export function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const { progress } = useProgress();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [shapeType] = useState<'sphere' | 'cube' | 'torus'>(() => {
    const rand = Math.random();
    if (rand < 0.4) return 'sphere';
    if (rand < 0.7) return 'cube';
    return 'torus';
  });

  // Glitching message effect
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
        setIsGlitching(false);
      }, 150);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const minDisplayTime = 1; // 4 seconds
    if (progress === 100) {
      const timer = setTimeout(() => {
        onFinished();
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  return (
    <div
      // suppressHydrationWarning: extensions like Dark Reader rewrite
      // this inline style (turning `background` shorthand into longhand
      // properties), which would otherwise trigger React's hydration warning.
      suppressHydrationWarning
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%, #000008 100%)',
        zIndex: 1000,
      }}>
      {/* Add some CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          50% { text-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.6); }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
      `}</style>
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
        <DataShape progress={progress} shapeType={shapeType} />
      </Canvas>
      
      {/* Enhanced loading text */}
      <div style={{
        position: 'absolute', bottom: '15%', width: '100%',
        textAlign: 'center', color: '#00ffff', fontFamily: '"Roboto Mono", monospace',
        pointerEvents: 'none',
        animation: 'fadeIn 1s ease-out'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          letterSpacing: '0.3rem',
          marginBottom: '1rem',
          animation: 'glow 2s infinite'
        }}>
          MYTHCORP
        </div>
        
        <h2 style={{ 
          letterSpacing: '0.2rem', 
          textTransform: 'uppercase', 
          animation: isGlitching ? 'glitch 0.15s infinite' : 'pulse 2s infinite',
          fontSize: '1.2rem',
          marginBottom: '0.5rem',
          filter: isGlitching ? 'blur(1px)' : 'none',
          color: isGlitching ? '#ff00ff' : '#00ffff',
        }}>
          {loadingMessages[currentMessage]}... {Math.round(progress)}%
        </h2>
        
        {/* Progress bar */}
        <div style={{
          width: '300px',
          height: '4px',
          background: 'rgba(0, 255, 255, 0.2)',
          margin: '1rem auto',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ffff, #0080ff, #00ffff)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
          }} />
        </div>
        
        <p style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.9rem', 
          opacity: 0.6,
          letterSpacing: '0.1rem'
        }}>
          • HEADPHONES RECOMMENDED FOR BEST EXPERIENCE (eventually)
        </p>
        
        <p style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.7rem', 
          opacity: 0.4,
          letterSpacing: '0.05rem'
        }}>
          {shapeType === 'cube' ? '▣ CUBE MODE' : shapeType === 'torus' ? '◯ TORUS MODE' : '● SPHERE MODE'}
        </p>
      </div>
    </div>
  );
}
