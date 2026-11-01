import * as THREE from "three";
import { fbm } from "./noise";
import {
  cloudTexture,
  earthTexture,
  europaTexture,
  jupiterTexture,
  marsTexture,
  moonTexture,
  ringTexture,
  saturnTexture,
  starSprite,
  vestaTexture,
} from "./textures";
import { createSun } from "./sun";
import { journey } from "@/lib/journey";

export type BodyKind = "earth" | "moon" | "mars" | "vesta" | "rocks" | "europa" | "saturn" | "sun";

interface Body {
  group: THREE.Group;
  /** Тэнхлэгээ тойрон эргэх хэсгүүд ба хурд */
  spin: [THREE.Object3D, number][];
  /** Ойртох үеийн камераас зай: алс → ойр */
  far: number;
  near: number;
  /** Дэлгэцийн байрлалаас доош шилжүүлэх (дэлхийн муруйд) */
  drop: number;
  /** Өнгөрөхдөө хажуугаар нисэхийн оронд доошоо живж холдоно */
  recede?: boolean;
  tick?: (dt: number, p: number) => void;
}

const STAR_COUNT = 1800;
const EARTH_R = 13;
/** Stack-ийн 4 бүлгийн тойрог зам: хазайлт ба эргэх хурд (ээлжлэн эсрэг чиглэлд) */
const RINGS = [
  { tiltX: 0.32, tiltZ: 0.18, speed: 0.13 },
  { tiltX: 0.55, tiltZ: -0.38, speed: -0.1 },
  { tiltX: 0.22, tiltZ: 0.52, speed: 0.08 },
  { tiltX: 0.7, tiltZ: -0.12, speed: -0.06 },
];
const BOX = { x: 90, y: 55, zFar: -280, zNear: -14 };

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Хуудасны ард ажиллах 3D сансар.
 * DOM дахь `[data-body]` элемент бүрийн байрлалд гараг гаргаж, тухайн хэсгийг гүйлгэх тусам
 * гараг алсаас ойртоно. Одод scroll-ын хурдаар урсаж, хурдан үед зураас болно.
 */
export class Space {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.1, 600);
  private clock = new THREE.Clock();
  private bodies = new Map<HTMLElement, Body>();
  private stars!: THREE.Points;
  private streaks!: THREE.LineSegments;
  private starPos!: Float32Array;
  private streakPos!: Float32Array;
  private satellites: { mesh: THREE.Object3D; label: HTMLElement; ring: number; phase: number; local: THREE.Vector3 }[] = [];
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  /** Дэлхий ойрхон байх үед л дагуулын шошго харагдана */
  private labelsOn = false;
  private lastProgress = journey.progress;
  private velocity = 0;
  private frame = 0;
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  private tmp = new THREE.Vector3();

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Нар зүүн дээрээс тусна
    const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
    sun.position.set(-12, 7, 6);
    this.scene.add(sun, new THREE.AmbientLight(0x6070a0, 0.12));

    this.buildStars();
    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer);
    this.frame = requestAnimationFrame(this.loop);
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointer);
    this.scene.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach(mat => {
        (mat as THREE.MeshStandardMaterial).map?.dispose();
        mat.dispose();
      });
    });
    this.renderer.dispose();
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Босоо дэлгэц дээр гарагууд хэт томрохгүй
    this.camera.fov = w < h ? 60 : 45;
    this.camera.updateProjectionMatrix();
  };

  private onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    this.pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  // ---------- Одод ----------
  private buildStars() {
    this.starPos = new Float32Array(STAR_COUNT * 3);
    this.streakPos = new Float32Array(STAR_COUNT * 6);
    for (let i = 0; i < STAR_COUNT; i++) {
      this.starPos[i * 3] = (Math.random() * 2 - 1) * BOX.x;
      this.starPos[i * 3 + 1] = (Math.random() * 2 - 1) * BOX.y;
      this.starPos[i * 3 + 2] = BOX.zFar + Math.random() * (BOX.zNear - BOX.zFar);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(this.starPos, 3));
    this.stars = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size: 0.32,
        map: starSprite(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    );
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(this.streakPos, 3));
    this.streaks = new THREE.LineSegments(
      sg,
      new THREE.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.scene.add(this.stars, this.streaks);
  }

  private updateStars(dt: number, visibility: number) {
    const v = this.reduced ? 0 : this.velocity;
    // Нүд ядраахгүйн тулд хурд, зураасыг хязгаарлана
    const boost = Math.max(-10, Math.min(10, v * 12));
    const speed = (this.reduced ? 0 : 1.2) + boost;
    const len = Math.min(5, Math.abs(boost) * 0.5);
    const range = BOX.zNear - BOX.zFar;
    for (let i = 0; i < STAR_COUNT; i++) {
      const k = i * 3;
      let z = this.starPos[k + 2]! + speed * dt;
      if (z > BOX.zNear) z -= range;
      if (z < BOX.zFar) z += range;
      this.starPos[k + 2] = z;
      const s = i * 6;
      this.streakPos[s] = this.streakPos[s + 3] = this.starPos[k]!;
      this.streakPos[s + 1] = this.streakPos[s + 4] = this.starPos[k + 1]!;
      this.streakPos[s + 2] = z;
      this.streakPos[s + 5] = z - len * Math.sign(speed || 1);
    }
    this.stars.geometry.attributes.position!.needsUpdate = true;
    this.streaks.geometry.attributes.position!.needsUpdate = true;
    (this.stars.material as THREE.PointsMaterial).opacity = visibility * 0.85;
    (this.streaks.material as THREE.LineBasicMaterial).opacity = visibility * Math.min(0.18, Math.abs(boost) / 60);
  }

  // ---------- Гарагууд ----------
  private sphere(radius: number, map: THREE.Texture, segments = 64) {
    return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments / 2), new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0 }));
  }

  private atmosphere(radius: number, color: THREE.ColorRepresentation, power = 3) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 32),
      new THREE.ShaderMaterial({
        uniforms: { glow: { value: new THREE.Color(color) }, power: { value: power } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 glow; uniform float power; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), power); gl_FragColor = vec4(glow * f, f); }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
  }

  private create(kind: BodyKind): Body {
    const group = new THREE.Group();
    const body: Body = { group, spin: [], far: 80, near: 20, drop: 0 };

    if (kind === "earth") {
      const R = EARTH_R;
      const tilted = new THREE.Group();
      tilted.rotation.z = 0.25;
      const earth = this.sphere(R, earthTexture(), 128);
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.012, 128, 64),
        new THREE.MeshStandardMaterial({ map: cloudTexture(), transparent: true, depthWrite: false }),
      );
      tilted.add(earth, clouds);
      group.add(tilted, this.atmosphere(R * 1.05, 0x5aa8ff, 2.4));
      body.spin.push([earth, 0.02], [clouds, 0.032]);
      Object.assign(body, { far: 90, near: 42, recede: true });

      // Tech stack бүр нэг дагуул: бүлэг бүр өөрийн хазайсан тойрог замтай
      const rings = RINGS.map(r => new THREE.Quaternion().setFromEuler(new THREE.Euler(r.tiltX, 0, r.tiltZ)));
      document.querySelectorAll<HTMLElement>("[data-sat]").forEach(label => {
        const ring = Number(label.dataset.ring ?? 0);
        const sat = this.satellite();
        group.add(sat);
        this.satellites.push({
          mesh: sat,
          label,
          ring,
          phase: (Number(label.dataset.slot ?? 0) / Number(label.dataset.count ?? 1)) * Math.PI * 2 + ring * 0.7,
          local: new THREE.Vector3(),
        });
      });
      body.tick = dt => {
        const t = this.reduced ? 0 : this.clock.elapsedTime;
        for (const s of this.satellites) {
          const cfg = RINGS[s.ring] ?? RINGS[0]!;
          const a = s.phase + t * cfg.speed;
          const r = R + 2.6 + s.ring * 1.9;
          s.local.set(Math.cos(a) * r, 0, Math.sin(a) * r).applyQuaternion(rings[s.ring] ?? rings[0]!);
          s.mesh.position.copy(s.local);
          s.mesh.rotation.y += dt * 0.6;
        }
      };
    }

    if (kind === "moon") {
      const m = this.sphere(3.4, moonTexture());
      group.add(m);
      body.spin.push([m, 0.05]);
    }

    if (kind === "mars") {
      const m = this.sphere(3.6, marsTexture());
      group.add(m, this.atmosphere(3.75, 0xff9a6a, 4));
      body.spin.push([m, 0.08]);
    }

    if (kind === "vesta") {
      const geo = new THREE.IcosahedronGeometry(3, 24);
      const pos = geo.attributes.position!;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = v.clone().normalize();
        // Хонхорхой, товгор — жинхэнэ астероид шиг
        const d = 1 + fbm(n.x * 1.4, n.y * 1.4, n.z * 1.4, 4) * 0.45 + (n.y > 0.75 ? -0.18 : 0);
        v.multiplyScalar(d);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      const rock = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: vestaTexture(), roughness: 1 }));
      group.add(rock);
      body.spin.push([rock, 0.12]);

      // Эргэн тойрон хөвөх чулуунууд
      const field = this.asteroidField(140, 5, 11, 2.4, 0.4, 1.8);
      group.add(field.mesh);
      body.tick = field.update;
      group.rotation.x = 0.35;
    }

    if (kind === "rocks") {
      // Бүсийн гүн: том талбайд тархсан чулуунууд дунд нисэнэ
      const field = this.asteroidField(170, 5, 18, 8, 0.5, 2.6);
      group.add(field.mesh);
      body.tick = field.update;
      group.rotation.x = 0.5;
      Object.assign(body, { far: 70, near: 34 });
    }

    if (kind === "europa") {
      const europa = this.sphere(2, europaTexture());
      const jupiter = this.sphere(13, jupiterTexture(), 128);
      jupiter.position.set(13, 4, -42);
      jupiter.rotation.z = 0.05;
      group.add(europa, jupiter);
      body.spin.push([europa, 0.06], [jupiter, 0.03]);
      Object.assign(body, { far: 70, near: 16 });
    }

    if (kind === "saturn") {
      const saturn = this.sphere(3.2, saturnTexture());
      const ringGeo = new THREE.RingGeometry(4.2, 8, 160, 1);
      // UV-г радиусаар дахин тооцно: текстур төвөөс гадагш зурагдана
      const p = ringGeo.attributes.position!;
      const uv = ringGeo.attributes.uv!;
      for (let i = 0; i < p.count; i++) {
        const r = Math.hypot(p.getX(i), p.getY(i));
        uv.setXY(i, (r - 4.2) / 3.8, 0.5);
      }
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshStandardMaterial({ map: ringTexture(), transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: 1 }),
      );
      ring.rotation.x = -Math.PI / 2 + 0.42;
      const tilt = new THREE.Group();
      tilt.rotation.z = -0.35;
      tilt.add(saturn, ring);
      group.add(tilt);
      body.spin.push([saturn, 0.09]);
      Object.assign(body, { far: 80, near: 22 });
    }

    if (kind === "sun") {
      const sun = createSun(5);
      group.add(sun.group);
      body.spin.push([sun.surface, 0.02]);
      body.tick = () => sun.update(this.reduced ? 0 : this.clock.elapsedTime);
      Object.assign(body, { far: 160, near: 26 });
    }

    this.scene.add(group);
    return body;
  }

  /** Цагираг хэлбэрээр тархаж эргэлдэх олон жижиг чулуу (нэг draw call) */
  private asteroidField(count: number, rMin: number, rMax: number, spreadY: number, sMin: number, sMax: number) {
    const mesh = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(0.22, 0),
      new THREE.MeshStandardMaterial({ color: 0x9c8b78, roughness: 1, flatShading: true }),
      count,
    );
    // Instance-ууд өргөн тархсан тул үндсэн геометрийн хүрээгээр тасдаж болохгүй
    mesh.frustumCulled = false;
    const seeds = Array.from({ length: count }, () => ({
      a: Math.random() * Math.PI * 2,
      r: rMin + Math.random() * (rMax - rMin),
      y: (Math.random() - 0.5) * spreadY,
      s: sMin + Math.random() * (sMax - sMin),
      w: 0.03 + Math.random() * 0.1,
    }));
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const scale = new THREE.Vector3();
    const update = () => {
      const t = this.reduced ? 0 : this.clock.elapsedTime;
      seeds.forEach((s, i) => {
        const a = s.a + t * s.w;
        e.set(t * s.w * 4, t * s.w * 3, 0);
        q.setFromEuler(e);
        m4.compose(this.tmp.set(Math.cos(a) * s.r, s.y, Math.sin(a) * s.r), q, scale.setScalar(s.s));
        mesh.setMatrixAt(i, m4);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    return { mesh, update };
  }

  private satellite() {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd9dde8, metalness: 0.6, roughness: 0.4 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x2b4fb8, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.5), bodyMat));
    for (const x of [-0.65, 0.65]) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.3), panelMat);
      p.position.x = x;
      g.add(p);
    }
    return g;
  }

  // ---------- Гол давталт ----------
  private loop = () => {
    this.frame = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Аяллын хурд (scene/сек), зөөлрүүлсэн — шилжилтийн үед одод урсана
    const progress = journey.progress;
    const vel = (progress - this.lastProgress) / Math.max(dt, 1e-3);
    this.lastProgress = progress;
    this.velocity += (vel - this.velocity) * 0.15;

    // Хулганыг дагах бага зэргийн parallax
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.04;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.04;
    this.camera.position.set(this.pointer.x * 0.9, -this.pointer.y * 0.6, 0);
    this.camera.rotation.set(this.pointer.y * 0.02, this.pointer.x * 0.03, 0);
    this.camera.updateMatrixWorld();

    // Одод: үүлсийг давж гарахаас эхлэн тодорно
    this.updateStars(dt, clamp01((progress - 0.5) / 1.3));

    // Гарагууд: scene-ийнхээ дугаараар ирж, өнгөрнө
    this.labelsOn = false;
    document.querySelectorAll<HTMLElement>("[data-body]").forEach(el => {
      const scene = Number(el.closest<HTMLElement>("[data-scene]")?.dataset.scene ?? -99);
      // rel: -1 = нэг scene-ийн өмнө (ирж байна), 0 = энд, +1 = өнгөрсөн
      const rel = progress - scene;
      const rect = el.getBoundingClientRect();
      let body = this.bodies.get(el);
      // Шилжилтийн дунд текстур үүсгэж гацахгүйн тулд хоёр scene-ийн өмнө бэлдэнэ
      if (rel < -2.5 || rel > 1.2 || rect.width === 0) {
        if (body) body.group.visible = false;
        return;
      }
      if (!body) {
        body = this.create(el.dataset.body as BodyKind);
        this.bodies.set(el, body);
      }
      // Зөвхөн өөрийн scene болон түүн рүү/түүнээс нисэх үед харагдана
      const visible = rel > -0.92 && rel < 0.9;
      body.group.visible = visible;
      if (!visible) return;

      let depth: number;
      let yOff: number;
      if (rel <= 0) {
        // Ирж байна: дээрээс алсаас ойртоно
        const t = smooth(clamp01(1 + rel));
        depth = THREE.MathUtils.lerp(body.far, body.near, t);
        yOff = -(1 - t) * vh * 0.5;
      } else if (body.recede) {
        // Дэлхий: доошоо живж холдоно — бид дээшээ нисч байна
        const t = smooth(clamp01(rel));
        depth = THREE.MathUtils.lerp(body.near, 220, t);
        yOff = t * vh * 0.75;
      } else {
        // Хажуугаар нь нисэн өнгөрнө: ойртож, доошоо гарна
        const t = smooth(clamp01(rel));
        depth = THREE.MathUtils.lerp(body.near, body.near * 0.55, t);
        yOff = t * vh * 1.1;
      }

      // Байрлал заагч элементийн дэлгэц дээрх төвийг 3D орон зайд буулгана
      const cy = rect.top + rect.height / 2 + yOff;
      const ndcX = ((rect.left + rect.width / 2) / vw) * 2 - 1;
      const ndcY = -(cy / vh) * 2 + 1;
      this.tmp.set(ndcX, ndcY, 0.5).unproject(this.camera).sub(this.camera.position).normalize();
      body.group.position.copy(this.camera.position).addScaledVector(this.tmp, depth);
      body.group.position.y -= body.drop;
      if (body.recede && Math.abs(rel) < 0.35) this.labelsOn = true;

      const spinBoost = this.reduced ? 0 : Math.abs(this.velocity) * 0.01;
      for (const [obj, speed] of body.spin) obj.rotation.y += dt * speed * (this.reduced ? 0 : 1) + spinBoost;
      body.tick?.(dt, rel);
    });

    this.updateLabels(vw, vh);
    this.renderer.render(this.scene, this.camera);
  };

  /** Дагуулуудын HTML шошгыг 3D байрлалд нь дагуулна; дэлхийн ард орвол бүдгэрнэ */
  private updateLabels(vw: number, vh: number) {
    for (const s of this.satellites) {
      if (!s.label) continue;
      if (!s.mesh.parent?.visible || !this.labelsOn) {
        s.label.style.opacity = "0";
        continue;
      }
      // Дэлхийн ард орвол далдлагдана, хажуугаар нь ард өнгөрөхдөө бүдэг харагдана
      const back = s.local.z < 0;
      const hidden = back && Math.hypot(s.local.x, s.local.y) < EARTH_R * 1.04;
      s.mesh.getWorldPosition(this.tmp);
      this.tmp.project(this.camera);
      const x = (this.tmp.x * 0.5 + 0.5) * vw;
      const y = (-this.tmp.y * 0.5 + 0.5) * vh;
      s.label.style.transform = `translate3d(${x + 10}px, ${y - 10}px, 0) scale(${back ? 0.85 : 1})`;
      s.label.style.opacity = hidden || this.tmp.z > 1 ? "0" : back ? "0.35" : "1";
    }
  }
}
