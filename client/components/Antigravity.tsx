/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const AntigravityInner = ({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.15,
  color = '#FF9FFC',
  colors,
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10,
  spokes = 92,
  radialFlow = 0.18
}: any) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;
    const maxRadius = Math.sqrt(width * width + height * height) * 0.62;
    const ringCount = Math.max(1, Math.ceil(count / spokes));
    const palette = colors || [color];

    for (let i = 0; i < count; i++) {
      const lane = i % spokes;
      const ring = Math.floor(i / spokes);
      const laneJitter = (seededRandom(i + 4) - 0.5) * 0.14;
      const ringJitter = (seededRandom(i + 9) - 0.5) * 0.8;
      const ringProgress = (ring + 1 + seededRandom(i + 17) * 0.55) / (ringCount + 1);
      const easedRadius = Math.pow(ringProgress, 0.78) * maxRadius;
      const angle = ((lane / spokes) * Math.PI * 2) + laneJitter + (ring % 2) * 0.018;
      const x = Math.cos(angle) * (easedRadius + ringJitter);
      const y = Math.sin(angle) * (easedRadius + ringJitter) * 0.72;
      const z = (-18 + ringProgress * 22 + (seededRandom(i + 31) - 0.5) * 8) * depthFactor;
      const pColor = palette[Math.floor(seededRandom(i + 73) * palette.length)];

      temp.push({
        t: seededRandom(i + 101) * 100,
        lane,
        ring,
        ringProgress,
        angle,
        radius: easedRadius,
        speed: 0.08 + seededRandom(i + 29) * 0.12,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        randomRadiusOffset: (seededRandom(i + 43) - 0.5) * 2,
        scaleSeed: 0.72 + seededRandom(i + 59) * 0.72,
        color: pColor
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height, color, colors, spokes, depthFactor]);

  // Set colors initially
  useLayoutEffect(() => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        tempColor.set(p.color);
        meshRef.current!.setColorAt(i, tempColor);
      });
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [particles]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v, pointer: m } = state;

    const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      // Gently center the galaxy behind the text when idle, instead of wandering wildly.
      destX = 0; 
      destY = 0;
    }

    const smoothFactor = 0.16;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    const time = state.clock.getElapsedTime();
    const globalRotation = time * rotationSpeed;

    particles.forEach((particle, i) => {
      let { t, speed, angle, radius, mz, ringProgress, randomRadiusOffset, scaleSeed } = particle;

      t = particle.t += speed * 0.012;

      const liftWave = Math.sin(time * waveSpeed + ringProgress * 12 + randomRadiusOffset) * waveAmplitude;
      const flow = ((time * radialFlow + ringProgress) % 1) * maxRadiusAdjustment(ringProgress);
      const currentRadius = radius + liftWave + flow;
      const currentAngle = angle + globalRotation + Math.sin(time * 0.16 + ringProgress * 8) * 0.01;
      const baseX = Math.cos(currentAngle) * currentRadius;
      const baseY = Math.sin(currentAngle) * currentRadius * 0.72;

      const projectionFactor = 1 - particle.cz / 60;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = baseX - projectedTargetX;
      const dy = baseY - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetPos = { x: baseX, y: baseY, z: mz };

      if (dist < magnetRadius) {
        const cursorAngle = Math.atan2(dy, dx);
        const falloff = 1 - dist / magnetRadius;
        const pull = Math.pow(falloff, 2) * fieldStrength;
        const tangent = rotationSpeed >= 0 ? 1 : -1;

        targetPos.x += Math.cos(cursorAngle) * pull + Math.cos(cursorAngle + Math.PI / 2) * pull * 0.18 * tangent;
        targetPos.y += Math.sin(cursorAngle) * pull + Math.sin(cursorAngle + Math.PI / 2) * pull * 0.18 * tangent;
        targetPos.z += falloff * 8 * depthFactor;
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);

      dummy.rotation.set(0, 0, currentAngle + Math.PI / 2);

      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
      );

      const ringHighlight = 1 - Math.min(1, Math.abs(currentDistToMouse - ringRadius) / Math.max(8, ringRadius));
      const perspectiveScale = 0.18 + ringProgress * 0.82;
      const pulse = 1 + Math.sin(t * pulseSpeed + i * 0.03) * 0.08 * particleVariance;
      const finalScale = (perspectiveScale + ringHighlight * 0.34) * pulse * scaleSeed * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.045, 0.35, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.055, 10, 10]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial toneMapped={false} transparent opacity={0.82} />
    </instancedMesh>
  );
};

const Antigravity = (props: any) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;

function maxRadiusAdjustment(progress: number) {
  return 1.6 + Math.sin(progress * Math.PI) * 0.9;
}
