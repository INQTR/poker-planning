"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShaderRippleProps {
  speed?: number;
  lineWidth?: number;
  rippleCount?: number;
  colorLayers?: number;
  backgroundColor?: string;
  rotation?: number;
  timeScale?: number;
  opacity?: number;
  waveIntensity?: number;
  animationSpeed?: number;
  loopDuration?: number;
  scale?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  mod?: number;
  className?: string;
}

export function ShaderRipple({
  speed = 0.05,
  lineWidth = 0.002,
  rippleCount = 8,
  colorLayers = 3,
  backgroundColor = "transparent",
  rotation = 135,
  timeScale = 0.5,
  opacity = 1.0,
  waveIntensity = 0,
  animationSpeed = 1.0,
  loopDuration = 0.7,
  scale = 1,
  color1 = "#FF00FF",
  color2 = "#FF00FF",
  color3 = "#FF6EC7",
  mod = 0.2,
  className = "",
}: ShaderRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: Record<string, { value: unknown }>;
    animationId: number;
  } | null>(null);

  // Convert hex color to vec3
  const hexToVec3 = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? new THREE.Vector3(
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        )
      : new THREE.Vector3(1, 0, 0);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float lineWidth;
      uniform int rippleCount;
      uniform int colorLayers;
      uniform float rotation;
      uniform float timeScale;
      uniform float opacity;
      uniform float waveIntensity;
      uniform float scale;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float loopDuration;
      uniform float modValue;

      vec2 rotate(vec2 v, float a) {
        float s = sin(a);
        float c = cos(a);
        mat2 m = mat2(c, -s, s, c);
        return m * v;
      }

      // Smooth easing function (ease-in-out)
      float easeInOutCubic(float t) {
        return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Apply scale
        uv = uv / scale;
        
        // Apply rotation
        uv = rotate(uv, rotation);
        
        // Add wave distortion
        uv.x += sin(uv.y * 5.0 + time * timeScale * 0.1) * waveIntensity;
        uv.y += cos(uv.x * 5.0 + time * timeScale * 0.1) * waveIntensity;
        
        // Normalize time to loop duration
        float t = mod(time * timeScale * 0.05, loopDuration);
        
        // Calculate smooth fade factor (0 to 1 to 0)
        float fadeProgress = t / loopDuration;
        float smoothFade = sin(fadeProgress * PI);
        smoothFade = easeInOutCubic(smoothFade);

        vec3 finalColor = vec3(0.0);
        float totalIntensity = 0.0;
        
        for(int j = 0; j < 5; j++){
          if(j >= colorLayers) break;
          
          vec3 layerColor;
          if(j == 0) layerColor = color1;
          else if(j == 1) layerColor = color2;
          else layerColor = color3;
          
          float intensity = 0.0;
          for(int i = 0; i < 20; i++){
            if(i >= rippleCount) break;
            float rippleTime = fract(t + float(i)*0.01 - 0.01*float(j));
            // Start from 0 size and expand outward with easing
            float rippleRadius = rippleTime * rippleTime * 8.0;
            intensity += lineWidth*float(i*i) / abs(rippleRadius - length(uv) + mod(uv.x+uv.y, modValue));
          }
          
          finalColor += layerColor * intensity;
          totalIntensity += intensity;
        }
        
        // Normalize to prevent overly bright areas
        if(totalIntensity > 0.0) {
          finalColor = finalColor / max(totalIntensity * 0.3, 1.0);
        }
        
        // Calculate alpha based on intensity for transparency
        float alpha = min(totalIntensity * 0.2, 1.0) * opacity * smoothFade;
        
        gl_FragColor = vec4(finalColor * smoothFade, alpha);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      lineWidth: { type: "f", value: lineWidth },
      rippleCount: { type: "i", value: rippleCount },
      colorLayers: { type: "i", value: colorLayers },
      rotation: { type: "f", value: (rotation * Math.PI) / 180 },
      timeScale: { type: "f", value: timeScale },
      opacity: { type: "f", value: opacity },
      waveIntensity: { type: "f", value: waveIntensity },
      scale: { type: "f", value: scale },
      color1: { type: "v3", value: hexToVec3(color1) },
      color2: { type: "v3", value: hexToVec3(color2) },
      color3: { type: "v3", value: hexToVec3(color3) },
      loopDuration: { type: "f", value: loopDuration },
      modValue: { type: "f", value: mod },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += speed * animationSpeed;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, [
    speed,
    lineWidth,
    rippleCount,
    colorLayers,
    rotation,
    timeScale,
    opacity,
    waveIntensity,
    animationSpeed,
    loopDuration,
    scale,
    color1,
    color2,
    color3,
    mod,
  ]);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full ${className}`}
      style={{
        background: backgroundColor,
        overflow: "hidden",
      }}
    />
  );
}
