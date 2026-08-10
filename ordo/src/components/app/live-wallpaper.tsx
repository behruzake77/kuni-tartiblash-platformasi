"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Ordo Live Wallpaper — WebGL fragment-shader based 3D backgrounds.
 * Renders a fullscreen canvas behind app content.
 * Each preset is a GLSL fragment shader that creates a cinematic scene.
 */

type WallpaperPreset = "nebula" | "aurora-mountains" | "ocean" | "cyberpunk";

type LiveWallpaperProps = {
  preset?: WallpaperPreset;
  className?: string;
};

/* ─── Vertex shader (shared) ─── */
const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/* ─── Fragment shaders per preset ─── */
const FRAG_NEBULA = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 m = u_mouse * 0.3;
  
  float t = u_time * 0.08;
  
  // Nebula layers
  float n1 = fbm(p * 1.5 + vec2(t * 0.3, t * 0.2) + m);
  float n2 = fbm(p * 2.5 + vec2(-t * 0.2, t * 0.15) - m * 0.5);
  float n3 = fbm(p * 3.5 + vec2(t * 0.1, -t * 0.25) + m * 0.7);
  
  // Color palette — deep space purples, blues, teals
  vec3 c1 = vec3(0.05, 0.02, 0.15); // deep purple
  vec3 c2 = vec3(0.15, 0.05, 0.35); // nebula purple
  vec3 c3 = vec3(0.02, 0.25, 0.45); // teal
  vec3 c4 = vec3(0.2, 0.05, 0.5);  // violet
  vec3 c5 = vec3(0.0, 0.6, 0.8);   // cyan accent
  
  vec3 col = c1;
  col = mix(col, c2, smoothstep(0.3, 0.7, n1));
  col = mix(col, c3, smoothstep(0.4, 0.8, n2) * 0.6);
  col = mix(col, c4, smoothstep(0.5, 0.9, n3) * 0.4);
  
  // Bright nebula core
  float core = smoothstep(0.6, 0.0, length(p - vec2(0.3, 0.2) + m));
  col += c5 * core * 0.3 * n1;
  
  // Stars
  float stars = hash(floor(gl_FragCoord.xy * 0.5));
  float twinkle = sin(u_time * 2.0 + stars * 50.0) * 0.5 + 0.5;
  col += vec3(stars > 0.995 ? twinkle * 0.8 : 0.0);
  
  // Vignette
  float vig = 1.0 - length(p) * 0.4;
  col *= vig;
  
  gl_FragColor = vec4(col, 1.0);
}`;

const FRAG_AURORA = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 m = u_mouse * 0.2;
  float t = u_time * 0.06;
  
  // Sky gradient
  vec3 sky = mix(vec3(0.02, 0.06, 0.15), vec3(0.01, 0.02, 0.08), uv.y);
  
  // Aurora bands
  float aurora = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float y = 0.15 + fi * 0.12 + sin(t * 1.5 + fi * 1.3 + p.x * 2.0) * 0.08;
    float wave = fbm(vec2(p.x * 3.0 + t + fi * 0.5, fi * 10.0)) * 0.15;
    float band = smoothstep(0.06, 0.0, abs(uv.y - y - wave + m.y * 0.05));
    aurora += band;
  }
  
  vec3 auroraCol = mix(
    vec3(0.2, 1.0, 0.6),  // green
    vec3(0.3, 0.5, 1.0),   // blue
    sin(t * 0.5 + p.x * 3.0) * 0.5 + 0.5
  );
  auroraCol = mix(auroraCol, vec3(0.6, 0.2, 1.0), sin(t * 0.3 + 2.0) * 0.3 + 0.3);
  
  vec3 col = sky + auroraCol * aurora * 0.6;
  
  // Mountain silhouettes (3 layers)
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float h = 0.12 + fi * 0.1;
    float mountain = fbm(vec2(p.x * (1.5 + fi * 0.8) + fi * 5.0, fi));
    float line = h + mountain * 0.12;
    if (uv.y < line) {
      float shade = 0.015 + fi * 0.012;
      col = vec3(shade, shade + 0.01, shade + 0.03);
    }
  }
  
  // Snow particles
  float snow = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 sp = uv * vec2(40.0, 20.0) + vec2(float(i) * 7.3, t * (1.0 + float(i) * 0.3));
    float flake = hash(floor(sp));
    float fall = fract(sp.y + t * (0.5 + flake));
    float d = length(fract(sp) - vec2(0.5));
    snow += smoothstep(0.03, 0.0, d) * smoothstep(0.0, 0.2, fall) * smoothstep(1.0, 0.8, fall) * 0.5;
  }
  col += vec3(snow * 0.7);
  
  // Stars
  float stars = hash(floor(gl_FragCoord.xy * 0.4));
  col += vec3(stars > 0.997 ? (sin(u_time + stars * 40.0) * 0.3 + 0.5) * 0.6 : 0.0);
  
  col *= 1.0 - length(p) * 0.3;
  gl_FragColor = vec4(col, 1.0);
}`;

const FRAG_OCEAN = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.05;
  vec2 m = u_mouse * 0.15;
  
  // Sky
  vec3 sky = mix(vec3(0.02, 0.08, 0.2), vec3(0.15, 0.3, 0.6), uv.y * 0.8);
  sky = mix(sky, vec3(0.8, 0.4, 0.2), smoothstep(0.4, 0.55, uv.y) * smoothstep(0.7, 0.55, uv.y) * 0.4);
  
  // Moon
  float moon = smoothstep(0.06, 0.04, length(uv - vec2(0.75, 0.78)));
  float moonGlow = smoothstep(0.3, 0.0, length(uv - vec2(0.75, 0.78))) * 0.15;
  sky += vec3(moon * 0.9 + moonGlow);
  
  // Ocean
  vec3 col = sky;
  if (uv.y < 0.5) {
    float waterLine = 0.5;
    float depth = (waterLine - uv.y) / waterLine;
    
    float wave1 = sin(p.x * 4.0 + t * 3.0) * 0.015;
    float wave2 = sin(p.x * 8.0 - t * 2.0 + 1.0) * 0.008;
    float wave3 = fbm(vec2(p.x * 3.0 + t, t * 0.5)) * 0.012;
    
    float surface = waterLine + wave1 + wave2 + wave3 + m.y * 0.02;
    
    // Water color
    vec3 waterDeep = vec3(0.01, 0.04, 0.1);
    vec3 waterMid = vec3(0.02, 0.1, 0.25);
    vec3 waterSurface = vec3(0.05, 0.2, 0.4);
    
    col = mix(waterSurface, waterMid, depth);
    col = mix(col, waterDeep, depth * depth);
    
    // Moon reflection
    float reflX = abs(uv.x - 0.75);
    float shimmer = sin(uv.y * 40.0 + t * 5.0 + reflX * 20.0) * 0.5 + 0.5;
    float refl = smoothstep(0.15, 0.0, reflX) * shimmer * smoothstep(0.5, 0.1, uv.y) * 0.3;
    col += vec3(0.6, 0.7, 0.9) * refl;
    
    // Foam
    float foam = smoothstep(0.48, surface, uv.y) * 0.3;
    col += vec3(foam);
  }
  
  col *= 1.0 - length(p) * 0.2;
  gl_FragColor = vec4(col, 1.0);
}`;

const FRAG_CYBERPUNK = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.04;
  vec2 m = u_mouse * 0.2;
  
  // Dark base with grid
  vec3 col = vec3(0.02, 0.01, 0.05);
  
  // Grid lines
  vec2 grid = fract(uv * vec2(30.0, 20.0));
  float gridLine = smoothstep(0.02, 0.0, grid.x) + smoothstep(0.02, 0.0, grid.y);
  col += vec3(0.1, 0.0, 0.2) * gridLine * 0.15;
  
  // Horizon glow
  float horizon = smoothstep(0.5, 0.0, abs(uv.y - 0.45));
  col += vec3(0.8, 0.0, 0.4) * horizon * 0.3;
  col += vec3(0.0, 0.5, 1.0) * horizon * 0.15 * sin(t * 2.0);
  
  // Neon beams
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float x = 0.2 * sin(t + fi * 1.5) + m.x * 0.1;
    float beam = smoothstep(0.03, 0.0, abs(p.x - x));
    float fade = smoothstep(0.5, -0.5, uv.y);
    vec3 beamCol = mix(vec3(1.0, 0.0, 0.5), vec3(0.0, 0.8, 1.0), sin(fi * 1.2) * 0.5 + 0.5);
    col += beamCol * beam * fade * 0.2;
  }
  
  // Floating particles
  for (int i = 0; i < 20; i++) {
    float fi = float(i);
    vec2 pos = vec2(
      fract(hash(vec2(fi, 0.0)) + t * 0.1 * (0.5 + hash(vec2(fi, 1.0)))),
      fract(hash(vec2(fi, 2.0)) + t * 0.05 * hash(vec2(fi, 3.0)))
    );
    float d = length(uv - pos);
    float size = 0.002 + hash(vec2(fi, 4.0)) * 0.003;
    float brightness = smoothstep(size, 0.0, d);
    vec3 pCol = mix(vec3(1.0, 0.0, 0.8), vec3(0.0, 1.0, 0.8), hash(vec2(fi, 5.0)));
    col += pCol * brightness * 0.5;
  }
  
  // City silhouette
  if (uv.y < 0.35) {
    float buildings = hash(floor(vec2(p.x * 15.0, 0.0)));
    float height = 0.35 - buildings * 0.25;
    if (uv.y < height) {
      col = vec3(0.01, 0.005, 0.02);
      // Windows
      vec2 win = fract(vec2(p.x * 15.0, uv.y * 40.0));
      float lit = step(0.4, hash(floor(vec2(p.x * 15.0, uv.y * 40.0)))) * step(0.15, win.x) * step(win.x, 0.85) * step(0.15, win.y) * step(win.y, 0.85);
      col += vec3(1.0, 0.7, 0.3) * lit * 0.4;
    }
  }
  
  col *= 1.0 - length(p) * 0.25;
  gl_FragColor = vec4(col, 1.0);
}`;

const SHADERS: Record<WallpaperPreset, string> = {
  nebula: FRAG_NEBULA,
  "aurora-mountains": FRAG_AURORA,
  ocean: FRAG_OCEAN,
  cyberpunk: FRAG_CYBERPUNK,
};

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vert);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

export function LiveWallpaper({ preset = "nebula", className }: LiveWallpaperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);

  const handleMouse = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: 1.0 - e.clientY / window.innerHeight,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const fragSrc = SHADERS[preset] || SHADERS.nebula;
    const program = createProgram(gl, VERT, fragSrc);
    if (!program) return;

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5); // cap for perf
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const start = performance.now();
    function draw() {
      const t = (performance.now() - start) / 1000;
      gl!.useProgram(program);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
    };
  }, [preset, handleMouse]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -2,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
