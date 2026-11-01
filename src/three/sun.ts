import * as THREE from "three";

// Ashima Arts-ийн 3D simplex noise (MIT) — нарны гадаргуу буцлах мэт хөдөлнө
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

function glowTexture(stops: [number, string][]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

/** Төвөөс гадагш цацрах нарийн туяанууд */
function raysTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(256, 256);
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2 + Math.random() * 0.05;
    const len = 150 + Math.random() * 100;
    const w = 0.012 + Math.random() * 0.02;
    const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
    g.addColorStop(0, "rgba(255,200,120,0.5)");
    g.addColorStop(1, "rgba(255,140,60,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, len, a - w, a + w);
    ctx.closePath();
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

/** Нар: буцалдаг гадаргуу, дулаан титэм, аажуухан эргэх туяа */
export function createSun(radius: number) {
  const group = new THREE.Group();
  const uniforms = { time: { value: 0 } };

  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 96, 48),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vPos; varying vec3 vN; varying vec3 vV;
        void main(){
          vPos = position;
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float time; varying vec3 vPos; varying vec3 vN; varying vec3 vV;
        ${SIMPLEX}
        void main(){
          vec3 p = normalize(vPos);
          float n = snoise(p * 3.0 + vec3(0.0, time * 0.05, time * 0.03)) * 0.5
                  + snoise(p * 7.0 - vec3(time * 0.08)) * 0.3
                  + snoise(p * 16.0 + vec3(time * 0.12)) * 0.2;
          float cells = smoothstep(-0.4, 0.6, n);
          vec3 hot = vec3(1.0, 0.93, 0.68);
          vec3 warm = vec3(1.0, 0.58, 0.16);
          vec3 deep = vec3(0.86, 0.26, 0.04);
          vec3 col = mix(deep, warm, cells);
          col = mix(col, hot, pow(cells, 3.0));
          // Ирмэг рүүгээ бараан (limb darkening), төв нь илүү гэрэлтэй
          float facing = max(dot(vN, vV), 0.0);
          col *= 0.55 + 0.65 * pow(facing, 0.6);
          gl_FragColor = vec4(col * 1.35, 1.0);
        }`,
    }),
  );
  group.add(surface);

  const corona = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture([
        [0, "rgba(255,236,190,1)"],
        [0.22, "rgba(255,190,100,0.75)"],
        [0.45, "rgba(255,130,50,0.22)"],
        [1, "rgba(255,110,40,0)"],
      ]),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  corona.scale.setScalar(radius * 5.2);

  const haze = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture([
        [0, "rgba(255,170,90,0.35)"],
        [1, "rgba(255,120,60,0)"],
      ]),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  haze.scale.setScalar(radius * 12);

  const rays = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: raysTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }),
  );
  rays.scale.setScalar(radius * 6);

  // Гэрэлтэлт гадаргууны ард харагдана
  corona.renderOrder = rays.renderOrder = haze.renderOrder = -1;
  group.add(haze, rays, corona);

  const update = (t: number) => {
    uniforms.time.value = t;
    rays.material.rotation = t * 0.03;
    const pulse = 1 + Math.sin(t * 0.8) * 0.03;
    corona.scale.setScalar(radius * 5.2 * pulse);
  };

  return { group, surface, update };
}
