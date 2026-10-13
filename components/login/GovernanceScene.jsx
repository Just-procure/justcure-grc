import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { GOV_NODES } from '../../constants/governanceData.js';

/* Palette tuned for a light (#f4f7fb) background: normal blending only. */
const COL = {
  navy: '#163d73',
  blue: '#4f8eff',
  cyan: '#42d9f2',
  ice: '#c4dcff',
  amber: '#ffbd52',
};
const SEG = 28;
const CYCLE = 9; // seconds per symbolic risk -> assurance loop
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();

/* Quadratic bezier between two points with vertical lift. */
function arc(a, b, lift, t, out) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + lift, mz = (a.z + b.z) / 2;
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * mx + t * t * b.x,
    u * u * a.y + 2 * u * t * my + t * t * b.y,
    u * u * a.z + 2 * u * t * mz + t * t * b.z
  );
}

function shieldShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 1.5);
  s.bezierCurveTo(0.5, 1.25, 0.95, 1.2, 1.2, 1.2);
  s.bezierCurveTo(1.2, 0.2, 1.0, -0.7, 0, -1.5);
  s.bezierCurveTo(-1.0, -0.7, -1.2, 0.2, -1.2, 1.2);
  s.bezierCurveTo(-0.95, 1.2, -0.5, 1.25, 0, 1.5);
  return s;
}

/* Shared geometries & materials (created once, disposed on unmount). */
function useAssets(small) {
  const assets = useMemo(() => {
    const shield = new THREE.ExtrudeGeometry(shieldShape(), {
      depth: 0.2, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 24,
    });
    shield.translate(0, 0, -0.1);
    const ptsN = small ? 60 : 140;
    const pp = new Float32Array(ptsN * 3);
    for (let i = 0; i < ptsN; i++) {
      const r = 0.4 + Math.random() * 0.5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pp.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
    }
    const corePts = new THREE.BufferGeometry();
    corePts.setAttribute('position', new THREE.BufferAttribute(pp, 3));

    const G = {
      shield,
      shieldEdges: new THREE.EdgesGeometry(shield, 25),
      corePts,
      ico: new THREE.IcosahedronGeometry(0.4, 1),
      sphere: new THREE.SphereGeometry(0.14, 24, 24),
      ringA: new THREE.TorusGeometry(0.5, 0.008, 8, 80),
      ringB: new THREE.TorusGeometry(0.7, 0.008, 8, 80),
      ringC: new THREE.TorusGeometry(0.9, 0.008, 8, 80),
      node: new THREE.IcosahedronGeometry(0.17, 1),
      nodeRing: new THREE.TorusGeometry(0.3, 0.012, 8, 48),
      halo: new THREE.SphereGeometry(0.34, 20, 20),
      hit: new THREE.SphereGeometry(0.5, 12, 12),
      tenant: new THREE.OctahedronGeometry(0.12, 0),
      tenantShell: new THREE.IcosahedronGeometry(0.3, 1),
      dot: new THREE.SphereGeometry(0.045, 12, 12),
      sig: new THREE.SphereGeometry(0.09, 16, 16),
      sigGlow: new THREE.SphereGeometry(0.2, 16, 16),
      octa: new THREE.OctahedronGeometry(0.1, 0),
      tetra: new THREE.TetrahedronGeometry(0.1, 0),
      orbit: [2.9, 3.5, 4.0].map((r) => new THREE.TorusGeometry(r, 0.006, 6, 160)),
    };
    const lineMat = (c, o) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o });
    const M = {
      glass: new THREE.MeshPhysicalMaterial({
        color: COL.ice, transparent: true, opacity: 0.26, roughness: 0.1, metalness: 0.25,
        clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide, depthWrite: false,
      }),
      shieldEdge: lineMat(COL.cyan, 0.7),
      glow: new THREE.MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.06, side: THREE.BackSide, depthWrite: false }),
      coreWire: new THREE.MeshBasicMaterial({ color: COL.blue, wireframe: true, transparent: true, opacity: 0.55 }),
      coreSolid: new THREE.MeshStandardMaterial({ color: COL.cyan, emissive: COL.cyan, emissiveIntensity: 0.7, roughness: 0.3 }),
      coreRing: lineMat(COL.blue, 0.8),
      pts: new THREE.PointsMaterial({ color: COL.cyan, size: 0.04, transparent: true, opacity: 0.9, sizeAttenuation: true }),
      node: new THREE.MeshStandardMaterial({ color: COL.navy, emissive: COL.blue, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.3 }),
      nodeRing: lineMat(COL.blue, 0.8),
      tenant: new THREE.MeshStandardMaterial({ color: COL.blue, emissive: COL.blue, emissiveIntensity: 0.25, metalness: 0.4, roughness: 0.35 }),
      tenantShell: new THREE.MeshBasicMaterial({ color: COL.navy, wireframe: true, transparent: true, opacity: 0.28 }),
      dot: new THREE.MeshBasicMaterial({ color: COL.cyan }),
      ring: lineMat(COL.blue, 0.28),
      float: new THREE.MeshBasicMaterial({ color: COL.blue, wireframe: true, transparent: true, opacity: 0.4 }),
      dust: new THREE.PointsMaterial({ color: COL.blue, size: 0.03, transparent: true, opacity: 0.45 }),
      hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    };
    return { G, M };
  }, [small]);

  useEffect(
    () => () => {
      const dispose = (o) => (Array.isArray(o) ? o.forEach(dispose) : o.dispose());
      Object.values(assets.G).forEach(dispose);
      Object.values(assets.M).forEach(dispose);
    },
    [assets]
  );
  return assets;
}

/* ---------- Shield + holographic core ---------- */
function Shield({ G, M, signal }) {
  const grp = useRef(), core = useRef(), a = useRef(), b = useRef(), c = useRef(), pts = useRef();
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime, sg = signal.current;
    sg.shield = Math.max(0, sg.shield - dt * 1.3);
    const breathe = 0.5 + 0.5 * Math.sin(t * 1.4);
    grp.current.rotation.y = t * 0.22;
    grp.current.position.y = Math.sin(t * 0.8) * 0.08;
    M.shieldEdge.opacity = 0.55 + 0.2 * breathe + 0.25 * sg.shield;
    M.glow.opacity = 0.05 + 0.04 * breathe + 0.35 * sg.shield;
    core.current.rotation.y = -t * 0.5;
    core.current.rotation.x = t * 0.2;
    a.current.rotation.x = t * 0.9;
    b.current.rotation.y = -t * 0.7;
    c.current.rotation.z = t * 0.5;
    pts.current.rotation.y = t * 0.3;
    core.current.scale.setScalar(1 + 0.05 * breathe + 0.2 * sg.shield);
  });
  return (
    <group ref={grp} scale={0.95}>
      {[[1, -0.18], [0.82, 0], [0.64, 0.18]].map(([s, z], i) => (
        <group key={i} scale={s} position={[0, 0, z]}>
          <mesh geometry={G.shield} material={M.glass} />
          <lineSegments geometry={G.shieldEdges} material={M.shieldEdge} />
        </group>
      ))}
      <mesh geometry={G.shield} material={M.glow} scale={1.1} />
      <group ref={core}>
        <mesh geometry={G.ico} material={M.coreWire} />
        <mesh geometry={G.sphere} material={M.coreSolid} />
        <mesh ref={a} geometry={G.ringA} material={M.coreRing} />
        <mesh ref={b} geometry={G.ringB} material={M.coreRing} />
        <mesh ref={c} geometry={G.ringC} material={M.coreRing} />
        <points ref={pts} geometry={G.corePts} material={M.pts} />
      </group>
    </group>
  );
}

/* ---------- Curved link with a travelling particle ---------- */
function Link({ a, b, lift, hot, G, M, speed, offset }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 3), 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: COL.blue, transparent: true, opacity: 0.3 }), []);
  const line = useMemo(() => {
    const l = new THREE.Line(geo, mat);
    l.frustumCulled = false;
    return l;
  }, [geo, mat]);
  const dot = useRef();
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useFrame(({ clock }) => {
    const p = geo.attributes.position;
    for (let i = 0; i <= SEG; i++) { arc(a, b, lift, i / SEG, _v); p.setXYZ(i, _v.x, _v.y, _v.z); }
    p.needsUpdate = true;
    const h = hot();
    mat.opacity += (0.26 + 0.65 * h - mat.opacity) * 0.12;
    arc(a, b, lift, (clock.elapsedTime * speed + offset) % 1, dot.current.position);
    dot.current.scale.setScalar(0.8 + h * 0.7);
  });
  return (
    <group>
      <primitive object={line} />
      <mesh ref={dot} geometry={G.dot} material={M.dot} />
    </group>
  );
}

/* ---------- Governance node ---------- */
function GovNode({ i, P, G, M, focusRef, signal, onHover, onSelect }) {
  const g = useRef(), ring = useRef();
  const id = GOV_NODES[i].id;
  const halo = useMemo(() => new THREE.MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.15, depthWrite: false }), []);
  useEffect(() => () => halo.dispose(), [halo]);
  useFrame(({ clock }) => {
    const f = focusRef.current === id ? 1 : 0, pulse = signal.current.node[i];
    signal.current.node[i] = Math.max(0, pulse - 0.02);
    g.current.position.copy(P.gov[i]);
    g.current.scale.lerp(_s.setScalar(1 + 0.35 * f + 0.5 * pulse), 0.12);
    halo.opacity = 0.12 + 0.5 * pulse + 0.25 * f;
    ring.current.rotation.set(clock.elapsedTime * 0.6 + i, clock.elapsedTime * 0.4, 0);
  });
  const over = (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(id); };
  const out = () => { document.body.style.cursor = ''; onHover(null); };
  return (
    <group ref={g}>
      <mesh geometry={G.node} material={M.node} />
      <mesh ref={ring} geometry={G.nodeRing} material={M.nodeRing} />
      <mesh geometry={G.halo} material={halo} />
      <mesh geometry={G.hit} material={M.hit} onPointerOver={over} onPointerOut={out}
        onClick={(e) => { e.stopPropagation(); signal.current.node[i] = 1; onSelect(id); }} />
    </group>
  );
}

/* ---------- Tenant node: solid core inside an isolating shell ---------- */
function TenantNode({ i, P, G, M, active, focusRef }) {
  const g = useRef(), shell = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    g.current.position.copy(P.ten[i]);
    const k = (active ? 1.35 : 1) + (focusRef.current === 'tenant' ? 0.2 : 0);
    g.current.scale.lerp(_s.setScalar(k), 0.1);
    g.current.rotation.y = t * 0.6 + i;
    shell.current.rotation.y = -t * 0.3;
  });
  return (
    <group ref={g}>
      <mesh geometry={G.tenant} material={M.tenant} />
      <mesh ref={shell} geometry={G.tenantShell} material={M.tenantShell} />
    </group>
  );
}

/* ---------- Risk -> shield -> assurance signal (symbolic) ---------- */
function Story({ P, signal, G }) {
  const mesh = useRef(), glow = useRef();
  const st = useRef({ cycle: -1, hit1: false, hit2: false });
  const zero = useMemo(() => new THREE.Vector3(), []);
  const c = useMemo(() => ({ a: new THREE.Color(COL.amber), c: new THREE.Color(COL.cyan) }), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: COL.amber }), []);
  const gm = useMemo(() => new THREE.MeshBasicMaterial({ color: COL.amber, transparent: true, opacity: 0.25, depthWrite: false }), []);
  useEffect(() => () => { mat.dispose(); gm.dispose(); }, [mat, gm]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime, cyc = Math.floor(t / CYCLE), u = t % CYCLE, s = st.current;
    if (cyc !== s.cycle) { s.cycle = cyc; s.hit1 = false; s.hit2 = false; }
    const src = P.ten[cyc % P.ten.length], dst = P.gov[(cyc + 1) % 4], m = mesh.current;
    if (!src) { m.visible = false; return; }
    m.visible = true;
    if (u < 2.8) {                       // 1-2: risk travels to shield (amber)
      const p = ease(u / 2.8);
      arc(src, zero, 0.9, p, m.position); mat.color.copy(c.a); m.scale.setScalar(0.8 + 0.4 * p);
    } else if (u < 3.8) {                // 3-4: assessed inside the shield, becomes cyan
      const p = u - 2.8, ang = p * Math.PI * 2;
      m.position.set(Math.cos(ang) * 0.32, Math.sin(ang) * 0.32, 0);
      mat.color.lerpColors(c.a, c.c, p); m.scale.setScalar(1.1 - 0.3 * p);
      if (!s.hit1) { s.hit1 = true; signal.current.shield = 1; }
    } else if (u < 6.6) {                // 5: assurance signal to a governance node
      arc(zero, dst, 0.9, ease((u - 3.8) / 2.8), m.position); mat.color.copy(c.c); m.scale.setScalar(0.9);
    } else {
      m.visible = false;
      if (!s.hit2) { s.hit2 = true; signal.current.node[(cyc + 1) % 4] = 1; }
    }
    gm.color.copy(mat.color);
  });
  return (
    <mesh ref={mesh} geometry={G.sig} material={mat}>
      <mesh ref={glow} geometry={G.sigGlow} material={gm} />
    </mesh>
  );
}

/* ---------- Ambient layers ---------- */
function Orbits({ G, M }) {
  const refs = useRef([]);
  const cfg = [[1.2, 0, 0, 0.05], [1.35, 0.3, 0, -0.035], [1.1, -0.4, 0.2, 0.025]];
  useFrame(({ clock }) => {
    refs.current.forEach((r, i) => { r.rotation.set(cfg[i][0], cfg[i][1], clock.elapsedTime * cfg[i][3] + cfg[i][2]); });
  });
  return G.orbit.map((geo, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={geo} material={M.ring} />
  ));
}

function Floaters({ G, M, count }) {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      p: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 3 - 1.5],
      s: 0.4 + Math.random() * 0.4, sp: 0.2 + Math.random() * 0.4, geo: i % 2 ? G.octa : G.tetra,
    })),
    [count, G]
  );
  const refs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      const it = items[i];
      m.rotation.set(t * it.sp, t * it.sp * 0.7, 0);
      m.position.y = it.p[1] + Math.sin(t * it.sp + i) * 0.2;
    });
  });
  return items.map((it, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={it.geo} material={M.float} position={it.p} scale={it.s} />
  ));
}

function Dust({ M, count }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry(), a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) a.set([(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5 - 1], i * 3);
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, dt) => {
    const p = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = p.getY(i) + dt * 0.18;
      if (y > 3) y = -3;
      p.setY(i, y);
    }
    p.needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} material={M.dust} frustumCulled={false} />;
}

function Grid() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(14, 28, COL.blue, COL.ice);
    g.material.transparent = true; g.material.opacity = 0.35; g.position.y = -2.6;
    return g;
  }, []);
  useEffect(() => () => { grid.geometry.dispose(); grid.material.dispose(); }, [grid]);
  return <primitive object={grid} />;
}

/* ---------- World: positions, camera parallax, label projection ---------- */
function World({ tenants, activeIndex, focusRef, signal, labelRefs, ptr, small, onHover, onSelect }) {
  const { G, M } = useAssets(small);
  const n = Math.max(1, tenants.length);
  const P = useMemo(
    () => ({ gov: GOV_NODES.map(() => new THREE.Vector3()), ten: Array.from({ length: n }, () => new THREE.Vector3()), zero: new THREE.Vector3() }),
    [n]
  );

  // Update positions + camera + HTML label anchors (runs before child frames).
  useFrame(({ clock, camera, size }) => {
    const t = clock.elapsedTime;
    GOV_NODES.forEach((_, i) => {
      const a = i * (Math.PI / 2) + t * (0.12 + i * 0.01);
      P.gov[i].set(Math.cos(a) * 2.2, Math.sin(a * 1.3 + i) * 0.5, Math.sin(a) * 1.8);
    });
    for (let i = 0; i < n; i++) {
      const a = (i * Math.PI * 2) / n + t * (0.07 + 0.015 * i) * (i % 2 ? -1 : 1);
      P.ten[i].set(Math.cos(a) * (3.0 + (i % 2) * 0.45), Math.sin(t * 0.5 + i) * 0.35 - 0.2, Math.sin(a) * 2.2);
    }
    camera.position.x += (ptr.current.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (0.8 + ptr.current.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    GOV_NODES.forEach((_, i) => {
      const el = labelRefs.current[i];
      if (!el) return;
      _v.copy(P.gov[i]).project(camera);
      el.style.transform = `translate(${(_v.x * 0.5 + 0.5) * size.width}px, ${(-_v.y * 0.5 + 0.5) * size.height}px) translate(-50%, 20px)`;
      el.style.opacity = '1';
    });
  }, -1);

  const hotGov = (i) => () => (focusRef.current === GOV_NODES[i].id ? 1 : 0);
  const hotTen = () => (focusRef.current === 'tenant' ? 1 : 0);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <pointLight position={[-4, 2, 3]} intensity={40} color={COL.cyan} />
      <pointLight position={[4, -1, 2]} intensity={30} color={COL.blue} />
      <Grid />
      <Orbits G={G} M={M} />
      <Dust M={M} count={small ? 70 : 180} />
      <Floaters G={G} M={M} count={small ? 5 : 11} />
      <Shield G={G} M={M} signal={signal} />
      {GOV_NODES.map((_, i) => (
        <group key={i}>
          <GovNode i={i} P={P} G={G} M={M} focusRef={focusRef} signal={signal} onHover={onHover} onSelect={onSelect} />
          <Link a={P.gov[i]} b={P.zero} lift={0.5} hot={hotGov(i)} G={G} M={M} speed={0.12} offset={i * 0.25} />
        </group>
      ))}
      {P.ten.map((_, i) => (
        <group key={i}>
          <TenantNode i={i} P={P} G={G} M={M} active={i === activeIndex} focusRef={focusRef} />
          <Link a={P.ten[i]} b={P.gov[3]} lift={0.6} hot={hotTen} G={G} M={M} speed={0.09} offset={i / n} />
        </group>
      ))}
      <Story P={P} signal={signal} G={G} />
    </>
  );
}

export default function GovernanceScene(props) {
  const { small, running } = props;
  return (
    <Canvas
      dpr={[1, small ? 1.5 : 2]}
      camera={{ position: [0, 0.8, 12.5], fov: 36 }}
      gl={{ antialias: !small, alpha: true, powerPreference: 'high-performance' }}
      frameloop={running ? 'always' : 'never'}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
      aria-hidden="true"
    >
      <World {...props} />
    </Canvas>
  );
}
