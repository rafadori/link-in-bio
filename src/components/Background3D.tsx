import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Stars(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useMemo(() => {
    // Generate points in a sphere (must be divisible by 3)
    const points = random.inSphere(new Float32Array(5001), { radius: 1.5 }) as Float32Array;
    // Validate points to ensure no NaNs
    for (let i = 0; i < points.length; i++) {
        if (isNaN(points[i])) {
            points[i] = 0;
        }
    }
    return [points];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points key={sphere.length} ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#667eea"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 bg-background">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Stars />
      </Canvas>
    </div>
  );
}
