"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "./theme-provider";

function AnimatedShader() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      return typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#e0e5ec") },
      uColorB: { value: new THREE.Color("#f5f7fa") },
      uColorC: { value: new THREE.Color("#fef5f1") },
    }),
    [],
  );

  useEffect(() => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;

    if (resolvedTheme === "dark") {
      material.uniforms.uColorA.value.set("#734a60");
      material.uniforms.uColorB.value.set("#185372");
      material.uniforms.uColorC.value.set("#98cbd0");
    } else {
      material.uniforms.uColorA.value.set("#e0e5ec");
      material.uniforms.uColorB.value.set("#f5f7fa");
      material.uniforms.uColorC.value.set("#fef5f1");
    }
  }, [resolvedTheme]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime() * 0.1;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;

    varying vec2 vUv;
    varying vec3 vPosition;

    // Perlin noise functions
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    vec3 fade(vec3 t) {
      return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    float noise(vec3 P) {
      vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
      vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
      vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
      vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
      vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
      vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
      vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
      gx0 = fract(gx0); gx1 = fract(gx1);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
      gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
      vec3 g0 = vec3(gx0.x, gy0.x, gz0.x), g1 = vec3(gx0.y, gy0.y, gz0.y),
           g2 = vec3(gx0.z, gy0.z, gz0.z), g3 = vec3(gx0.w, gy0.w, gz0.w),
           g4 = vec3(gx1.x, gy1.x, gz1.x), g5 = vec3(gx1.y, gy1.y, gz1.y),
           g6 = vec3(gx1.z, gy1.z, gz1.z), g7 = vec3(gx1.w, gy1.w, gz1.w);
      vec4 norm0 = taylorInvSqrt(vec4(dot(g0, g0), dot(g2, g2), dot(g1, g1), dot(g3, g3)));
      vec4 norm1 = taylorInvSqrt(vec4(dot(g4, g4), dot(g6, g6), dot(g5, g5), dot(g7, g7)));
      g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
      g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
      vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
                         dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
                    vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
                         dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))),
                    f.z);
      return 2.2 * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }

      return value;
    }

    // Simple hash for dithering
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;

      // Create flowing organic motion with lower frequency for smoother gradients
      vec3 p = vec3(uv * 1.5, uTime * 0.5);
      float n1 = fbm(p + vec3(uTime * 0.2, uTime * 0.15, 0.0));
      float n2 = fbm(p + vec3(-uTime * 0.15, uTime * 0.25, 1.0));
      float n3 = fbm(p + vec3(uTime * 0.1, -uTime * 0.2, 2.0));

      // Combine noise layers for complex motion
      float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

      // Map noise to colors with smoother transitions
      vec3 color = mix(uColorA, uColorB, smoothstep(-0.8, 0.8, finalNoise));
      color = mix(color, uColorC, smoothstep(0.0, 1.0, n2));

      // Add subtle dithering to prevent banding
      float dither = (hash(vUv * 1000.0 + uTime) - 0.5) / 255.0;
      color += dither;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 blur-3xl">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <AnimatedShader />
        </Canvas>
      </div>
    </div>
  );
}
