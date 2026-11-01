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

export type BodyKind = "earth" | "moon" | "mars" | "vesta" | "europa" | "saturn";

interface Body {
  group: THREE.Group;
  /** Тэнхлэгээ тойрон эргэх хэсгүүд ба хурд */
  spin: [THREE.Object3D, number][];
  /** Ойртох үеийн камераас зай: алс → ойр */
  far: number;
  near: number;
  /** Дэлгэцийн байрлалаас доош шилжүүлэх (дэлхийн муруйд) */
  drop: number;
  /** Дэлгэцийн өндрийн энэ хувиас дээш гарахгүй — дээш нисэхэд доор хоцорно */
  pinY?: number;
  /** Хэсгийн хоёрдугаар хагаст алс руу холдоно */
  recede?: boolean;
  tick?: (dt: number, p: number) => void;
}

const STAR_COUNT = 2600;
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
  private satellites: { mesh: THREE.Object3D; label: HTMLElement | null }[] = [];
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  /** Дэлхий ойрхон байх үед л дагуулын шошго харагдана */
  private labelsOn = false;
  private lastScroll = window.scrollY;
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
    const speed = (this.reduced ? 0 : 4) + v * 1.1;
    const len = Math.min(14, Math.abs(v) * 0.3);
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
    (this.stars.material as THREE.PointsMaterial).opacity = visibility;
    (this.streaks.material as THREE.LineBasicMaterial).opacity = visibility * Math.min(0.55, Math.abs(v) / 45);
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
      const R = 16;
      const earth = this.sphere(R, earthTexture(), 128);
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.012, 128, 64),
        new THREE.MeshStandardMaterial({ map: cloudTexture(), transparent: true, depthWrite: false }),
      );
      group.add(earth, clouds, this.atmosphere(R * 1.05, 0x5aa8ff, 2.4));
      group.rotation.z = 0.25;
      body.spin.push([earth, 0.02], [clouds, 0.032]);
      Object.assign(body, { far: 60, near: 38, drop: R * 0.8, pinY: 0.7, recede: true });

      // Stack-ийн 4 дагуул тойрог замаар эргэнэ
      const labels = Array.from(document.querySelectorAll<HTMLElement>("[data-sat]"));
      for (let i = 0; i < 4; i++) {
        const sat = this.satellite();
        group.add(sat);
        this.satellites.push({ mesh: sat, label: labels[i] ?? null });
      }
      body.tick = dt => {
        const t = this.clock.elapsedTime;
        this.satellites.forEach((s, i) => {
          const a = t * (0.16 - i * 0.025) + i * 1.7;
          const r = R + 2.2 + i * 1.3;
          s.mesh.position.set(Math.cos(a) * r, Math.sin(a * 0.9) * 1.2 + 2 + i * 0.6, Math.sin(a) * r);
          s.mesh.rotation.y += dt * 0.6;
        });
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
      const count = 140;
      const rocks = new THREE.InstancedMesh(
        new THREE.DodecahedronGeometry(0.22, 0),
        new THREE.MeshStandardMaterial({ color: 0x9c8b78, roughness: 1, flatShading: true }),
        count,
      );
      const seeds = Array.from({ length: count }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 5 + Math.random() * 6,
        y: (Math.random() - 0.5) * 2.4,
        s: 0.4 + Math.random() * 1.8,
        w: 0.05 + Math.random() * 0.12,
      }));
      const m4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const e = new THREE.Euler();
      body.tick = () => {
        const t = this.clock.elapsedTime;
        seeds.forEach((s, i) => {
          const a = s.a + t * s.w;
          e.set(t * s.w * 4, t * s.w * 3, 0);
          q.setFromEuler(e);
          m4.compose(this.tmp.set(Math.cos(a) * s.r, s.y, Math.sin(a) * s.r), q, new THREE.Vector3(s.s, s.s, s.s));
          rocks.setMatrixAt(i, m4);
        });
        rocks.instanceMatrix.needsUpdate = true;
      };
      group.add(rocks);
      group.rotation.x = 0.35;
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

    this.scene.add(group);
    return body;
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

    // Scroll хурд (px/frame), зөөлрүүлсэн
    const sy = window.scrollY;
    this.velocity += (sy - this.lastScroll - this.velocity) * 0.2;
    this.lastScroll = sy;

    // Хулганыг дагах бага зэргийн parallax
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.04;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.04;
    this.camera.position.set(this.pointer.x * 0.9, -this.pointer.y * 0.6, 0);
    this.camera.rotation.set(this.pointer.y * 0.02, this.pointer.x * 0.03, 0);
    this.camera.updateMatrixWorld();

    // Одод: үүлсийн дээрээс эхлэн тодорно
    const about = document.getElementById("about");
    const orbit = document.getElementById("orbit");
    let starVis = 1;
    if (about && orbit) {
      // about дэлгэцэнд орж ирэхээс orbit дэлгэцийн 40%-д хүрэх хооронд 0 → 1
      const climbed = Math.max(0, vh - about.getBoundingClientRect().top);
      const left = Math.max(0, orbit.getBoundingClientRect().top - vh * 0.4);
      starVis = climbed + left === 0 ? 1 : clamp01(climbed / (climbed + left));
    }
    this.updateStars(dt, starVis);

    // Гарагууд
    document.querySelectorAll<HTMLElement>("[data-body]").forEach(el => {
      const rect = el.getBoundingClientRect();
      // Нуугдсан (display: none) элемент 0 хэмжээтэй — гараг гаргахгүй
      const near = rect.width > 0 && rect.bottom > -vh * 0.8 && rect.top < vh * 1.8;
      let body = this.bodies.get(el);
      if (!near) {
        if (body) body.group.visible = false;
        return;
      }
      if (!body) {
        body = this.create(el.dataset.body as BodyKind);
        this.bodies.set(el, body);
      }
      body.group.visible = true;

      const scope = el.dataset.progress === "section" ? (el.closest("section") ?? el) : el;
      const r = scope.getBoundingClientRect();
      const p = (vh - r.top) / (vh + r.height);
      const depth = body.recede
        ? p < 0.5
          ? THREE.MathUtils.lerp(body.far, body.near, smooth(clamp01(p * 2)))
          : THREE.MathUtils.lerp(body.near, 220, smooth(clamp01((p - 0.5) * 2)))
        : THREE.MathUtils.lerp(body.far, body.near, smooth(clamp01(p * 1.25)));

      // Элементийн дэлгэц дээрх төвийг 3D орон зайд буулгана
      let cy = rect.top + rect.height / 2;
      if (body.pinY !== undefined) cy = Math.max(cy, vh * body.pinY);
      const ndcX = ((rect.left + rect.width / 2) / vw) * 2 - 1;
      const ndcY = -(cy / vh) * 2 + 1;
      this.tmp.set(ndcX, ndcY, 0.5).unproject(this.camera).sub(this.camera.position).normalize();
      body.group.position.copy(this.camera.position).addScaledVector(this.tmp, depth);
      body.group.position.y -= body.drop;
      if (body.recede) this.labelsOn = depth < 55;

      for (const [obj, speed] of body.spin) obj.rotation.y += dt * speed * (this.reduced ? 0 : 1) + this.velocity * 0.0004;
      body.tick?.(dt, p);
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
      s.mesh.getWorldPosition(this.tmp);
      const behind = s.mesh.position.z < -2;
      this.tmp.project(this.camera);
      const x = (this.tmp.x * 0.5 + 0.5) * vw;
      const y = (-this.tmp.y * 0.5 + 0.5) * vh;
      s.label.style.transform = `translate3d(${x + 14}px, ${y - 12}px, 0)`;
      s.label.style.opacity = behind || this.tmp.z > 1 ? "0" : "1";
    }
  }
}
