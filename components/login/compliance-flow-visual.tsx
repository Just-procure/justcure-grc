"use client";

import { useEffect, useRef } from "react";

type Point = readonly [number, number];

type Service = {
  label: string;
  color: string;
  x: number;
  y: number;
};

type Route = {
  start: Point;
  control1: Point;
  control2: Point;
  end: Point;
  color: string;
  duration: number;
};

type ArcTable = {
  points: Point[];
  lengths: number[];
  totalLength: number;
};

const SCENE_SIZE = 400;
const CENTER: Point = [200, 202];
const GLOBE_RADIUS = 69;
const CURVE_SEGMENTS = 80;

const SERVICES: Service[] = [
  { label: "CONSENT", color: "#f2c879", x: 200, y: 58 },
  { label: "PROCESSORS", color: "#9bd3a6", x: 306, y: 96 },
  { label: "RISK & DPIA", color: "#e8ac62", x: 350, y: 202 },
  { label: "DATA RIGHTS", color: "#e69b86", x: 306, y: 308 },
  { label: "RETENTION", color: "#a8d8c1", x: 200, y: 346 },
  { label: "AUDIT TRAIL", color: "#d2c2a8", x: 94, y: 308 },
  { label: "INCIDENTS", color: "#ed887b", x: 50, y: 202 },
  { label: "DATA MAP", color: "#bdcf8f", x: 94, y: 96 },
];

function bezierPoint(route: Route, t: number): Point {
  const inverse = 1 - t;
  return [
    inverse ** 3 * route.start[0] +
      3 * inverse ** 2 * t * route.control1[0] +
      3 * inverse * t ** 2 * route.control2[0] +
      t ** 3 * route.end[0],
    inverse ** 3 * route.start[1] +
      3 * inverse ** 2 * t * route.control1[1] +
      3 * inverse * t ** 2 * route.control2[1] +
      t ** 3 * route.end[1],
  ];
}

function createRoute(service: Service, index: number): Route {
  const dx = CENTER[0] - service.x;
  const dy = CENTER[1] - service.y;
  const distance = Math.hypot(dx, dy);
  const direction: Point = [dx / distance, dy / distance];
  const normal: Point = [-direction[1], direction[0]];
  const startOffset = 0;
  const endOffset = distance - GLOBE_RADIUS - 5;
  const bend = (index % 2 === 0 ? 1 : -1) * 8;
  const start: Point = [
    service.x + direction[0] * startOffset,
    service.y + direction[1] * startOffset,
  ];
  const end: Point = [
    service.x + direction[0] * endOffset,
    service.y + direction[1] * endOffset,
  ];
  const control1: Point = [
    start[0] + direction[0] * (endOffset - startOffset) * 0.34 + normal[0] * bend,
    start[1] + direction[1] * (endOffset - startOffset) * 0.34 + normal[1] * bend,
  ];
  const control2: Point = [
    start[0] + direction[0] * (endOffset - startOffset) * 0.68 + normal[0] * bend,
    start[1] + direction[1] * (endOffset - startOffset) * 0.68 + normal[1] * bend,
  ];

  return {
    start,
    control1,
    control2,
    end,
    color: service.color,
    duration: 3.8 + (index % 4) * 0.35,
  };
}

const ROUTES = SERVICES.map(createRoute);

function createArcTable(route: Route): ArcTable {
  const points = Array.from({ length: CURVE_SEGMENTS + 1 }, (_, index) =>
    bezierPoint(route, index / CURVE_SEGMENTS),
  );
  const lengths = [0];

  for (let index = 1; index < points.length; index += 1) {
    lengths.push(
      lengths[index - 1] +
        Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]),
    );
  }

  return { points, lengths, totalLength: lengths[lengths.length - 1] };
}

const ROUTE_ARCS = ROUTES.map(createArcTable);

function getPointOnRoute(arc: ArcTable, progress: number): Point {
  const target = arc.totalLength * progress;
  let index = 1;
  while (index < arc.lengths.length - 1 && arc.lengths[index] < target) index += 1;

  const segmentLength = arc.lengths[index] - arc.lengths[index - 1];
  const localProgress =
    segmentLength === 0 ? 0 : (target - arc.lengths[index - 1]) / segmentLength;
  const from = arc.points[index - 1];
  const to = arc.points[index];
  return [
    from[0] + (to[0] - from[0]) * localProgress,
    from[1] + (to[1] - from[1]) * localProgress,
  ];
}

function drawAtmosphere(context: CanvasRenderingContext2D) {
  const [x, y] = CENTER;
  const halo = context.createRadialGradient(x, y, 28, x, y, 196);
  halo.addColorStop(0, "rgba(190, 190, 190, 0.2)");
  halo.addColorStop(0.58, "rgba(125, 125, 125, 0.1)");
  halo.addColorStop(1, "rgba(80, 80, 80, 0)");
  context.fillStyle = halo;
  context.beginPath();
  context.arc(x, y, 188, 0, Math.PI * 2);
  context.fill();

  context.textBaseline = "middle";
  context.textAlign = "left";
  context.font = "700 10px Arial, sans-serif";
  context.fillStyle = "#dedede";
  context.fillText("AEGIS  /  PRIVACY NETWORK", 12, 19);
  context.textAlign = "right";
  context.font = "600 8px Arial, sans-serif";
  context.fillStyle = "#888888";
  context.fillText("DPDP CONTROL PLANE", 388, 19);
}

function drawOrbit(context: CanvasRenderingContext2D) {
  const [x, y] = CENTER;

  context.save();
  context.translate(x, y);

  context.beginPath();
  context.ellipse(0, 0, 156, 146, 0, 0, Math.PI * 2);
  context.strokeStyle = "rgba(225, 225, 225, 0.27)";
  context.lineWidth = 1;
  context.stroke();

  context.beginPath();
  context.ellipse(0, 0, 128, 119, 0, Math.PI * 0.08, Math.PI * 1.91);
  context.setLineDash([2, 7]);
  context.strokeStyle = "rgba(205, 205, 205, 0.32)";
  context.lineWidth = 1;
  context.stroke();
  context.setLineDash([]);

  for (const angle of [-Math.PI * 0.36, Math.PI * 0.16, Math.PI * 0.63, Math.PI * 0.88]) {
    const dotX = Math.cos(angle) * 156;
    const dotY = Math.sin(angle) * 146;
    context.fillStyle = "#dddddd";
    context.beginPath();
    context.arc(dotX, dotY, 2, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawRoutes(context: CanvasRenderingContext2D) {
  ROUTES.forEach((route, index) => {
    context.beginPath();
    context.moveTo(route.start[0], route.start[1]);
    context.bezierCurveTo(
      route.control1[0],
      route.control1[1],
      route.control2[0],
      route.control2[1],
      route.end[0],
      route.end[1],
    );
    context.strokeStyle = `${route.color}35`;
    context.lineWidth = 4;
    context.lineCap = "round";
    context.stroke();
    context.strokeStyle = `${route.color}c0`;
    context.lineWidth = 1.5;
    context.setLineDash(index % 2 === 0 ? [3, 3] : [2, 3]);
    context.stroke();
    context.setLineDash([]);

    const tip = bezierPoint(route, 0.88);
    const beforeTip = bezierPoint(route, 0.82);
    const angle = Math.atan2(tip[1] - beforeTip[1], tip[0] - beforeTip[0]);
    context.fillStyle = route.color;
    context.beginPath();
    context.moveTo(tip[0], tip[1]);
    context.lineTo(tip[0] - Math.cos(angle - Math.PI / 6) * 5, tip[1] - Math.sin(angle - Math.PI / 6) * 5);
    context.lineTo(tip[0] - Math.cos(angle + Math.PI / 6) * 5, tip[1] - Math.sin(angle + Math.PI / 6) * 5);
    context.closePath();
    context.fill();
  });
}

function drawContinent(context: CanvasRenderingContext2D) {
  const landmasses = [
    new Path2D("M-49 -31 Q-44 -43 -33 -45 L-24 -42 -18 -36 -10 -33 -13 -25 -19 -22 -18 -15 -27 -13 -31 -5 -38 -8 -42 -17 -48 -20 Z M-31 -7 Q-25 -5 -22 1 L-18 6 -21 12 -26 8 -30 1 Z"),
    new Path2D("M-22 0 Q-17 -4 -11 0 L-7 8 -10 18 -13 29 -19 43 -24 36 -27 24 -29 13 -33 7 Z"),
    new Path2D("M-7 -32 Q-1 -39 9 -38 L16 -34 24 -36 34 -31 44 -25 41 -19 34 -18 29 -12 21 -13 16 -8 9 -11 4 -17 -4 -20 Z"),
    new Path2D("M5 -8 Q13 -13 21 -8 L28 -3 30 6 26 14 24 23 18 35 12 31 8 23 6 14 1 7 Z"),
    new Path2D("M31 25 Q37 21 44 25 L47 31 42 36 35 34 Z"),
  ];

  context.fillStyle = "rgba(92, 150, 111, 0.82)";
  context.strokeStyle = "rgba(190, 231, 177, 0.72)";
  context.lineWidth = 0.9;
  for (const landmass of landmasses) {
    context.fill(landmass);
    context.stroke(landmass);

    context.save();
    context.clip(landmass);
    context.fillStyle = "#d8f2b0";
    for (let y = -42; y <= 42; y += 4) {
      for (let x = -48 + (Math.abs(y / 4) % 2) * 2; x <= 48; x += 4) {
        context.beginPath();
        context.arc(x, y, 1.45, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.restore();
  }
}

function drawGlobeRing(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save();
  context.translate(x, y);
  context.scale(0.77, 0.34);
  context.rotate(-0.37);
  context.beginPath();
  context.ellipse(0, 0, 104, 80, 0, Math.PI * 1.03, Math.PI * 2.02);
  context.strokeStyle = "rgba(215, 215, 215, 0.64)";
  context.lineWidth = 1.4;
  context.stroke();
  context.beginPath();
  context.ellipse(0, 0, 104, 80, 0, 0.03, Math.PI * 0.97);
  context.strokeStyle = "rgba(215, 215, 215, 0.32)";
  context.setLineDash([2, 4]);
  context.stroke();
  context.setLineDash([]);
  context.restore();
}

function drawGlobe(context: CanvasRenderingContext2D, time: number, reducedMotion: boolean) {
  const [x, y] = CENTER;
  const rotation = reducedMotion ? 0 : time / 2800;
  const longitudeWidth = Math.abs(Math.cos(rotation));

  drawGlobeRing(context, x, y);

  context.save();
  context.translate(x, y);

  const glow = context.createRadialGradient(0, 0, 30, 0, 0, 101);
  glow.addColorStop(0, "rgba(67, 179, 128, 0.28)");
  glow.addColorStop(0.8, "rgba(31, 121, 87, 0.13)");
  glow.addColorStop(1, "rgba(13, 62, 48, 0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(0, 0, 101, 0, Math.PI * 2);
  context.fill();

  const sphere = context.createRadialGradient(-28, -38, 6, 3, 4, GLOBE_RADIUS + 10);
  sphere.addColorStop(0, "#67b995");
  sphere.addColorStop(0.52, "#176f58");
  sphere.addColorStop(1, "#0a3c35");
  context.fillStyle = sphere;
  context.strokeStyle = "rgba(174, 231, 185, 0.82)";
  context.lineWidth = 1.2;
  context.beginPath();
  context.arc(0, 0, GLOBE_RADIUS, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.save();
  context.beginPath();
  context.arc(0, 0, GLOBE_RADIUS - 1, 0, Math.PI * 2);
  context.clip();

  context.strokeStyle = "rgba(214, 245, 211, 0.3)";
  context.lineWidth = 0.8;
  for (const latitude of [24, 47]) {
    context.beginPath();
    context.ellipse(0, 0, 66, latitude, 0, 0, Math.PI * 2);
    context.stroke();
  }
  for (const offset of [0, Math.PI / 3, (Math.PI * 2) / 3]) {
    const width = Math.max(5, 64 * Math.abs(Math.cos(rotation + offset)));
    context.beginPath();
    context.ellipse(0, 0, width, 66, 0, 0, Math.PI * 2);
    context.globalAlpha = 0.45 + width / 110;
    context.stroke();
  }
  context.globalAlpha = 1;

  context.save();
  context.scale(Math.cos(rotation), 1);
  drawContinent(context);
  context.restore();

  context.beginPath();
  context.arc(-19 * Math.cos(rotation), -20, 2, 0, Math.PI * 2);
  context.fillStyle = "#f2f2f2";
  context.fill();
  context.restore();

  const lightX = Math.sin(rotation) * 36;
  const gloss = context.createLinearGradient(lightX - 42, -55, lightX + 42, 59);
  gloss.addColorStop(0, "rgba(255, 255, 255, 0.17)");
  gloss.addColorStop(0.48, "rgba(255, 255, 255, 0.08)");
  gloss.addColorStop(1, "rgba(0, 20, 13, 0.3)");
  context.fillStyle = gloss;
  context.beginPath();
  context.arc(0, 0, GLOBE_RADIUS, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.beginPath();
  context.arc(0, 0, GLOBE_RADIUS, 0, Math.PI * 2);
  context.clip();
  const terminatorWidth = Math.max(2, 20 * longitudeWidth);
  context.beginPath();
  context.ellipse(-Math.cos(rotation) * 38, 0, terminatorWidth, 66, 0, 0, Math.PI * 2);
  context.fillStyle = "rgba(0, 28, 18, 0.2)";
  context.fill();
  context.restore();
  context.restore();

  drawShield(context, x, y);
}

function drawShield(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save();
  context.translate(x, y + 2);
  context.fillStyle = "rgba(24, 24, 24, 0.96)";
  context.strokeStyle = "rgba(235, 235, 235, 0.72)";
  context.lineWidth = 1.1;
  context.beginPath();
  context.moveTo(0, -17);
  context.lineTo(13, -12);
  context.lineTo(12, 1);
  context.bezierCurveTo(11, 10, 5, 15, 0, 19);
  context.bezierCurveTo(-5, 15, -11, 10, -12, 1);
  context.lineTo(-13, -12);
  context.closePath();
  context.fill();
  context.stroke();

  context.strokeStyle = "#f2f2f2";
  context.lineWidth = 2;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(-6, 0);
  context.lineTo(-1, 5);
  context.lineTo(7, -5);
  context.stroke();
  context.restore();

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 8px Arial, sans-serif";
  context.fillStyle = "#dedede";
  context.fillText("AEGIS PRIVACY CORE", x, y + 88);
}

function drawService(
  context: CanvasRenderingContext2D,
  service: Service,
  time: number,
  reducedMotion: boolean,
) {
  const pulse = reducedMotion ? 0 : (Math.sin(time / 700 + service.x + service.y) + 1) * 0.5;
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 8px Arial, sans-serif";
  context.globalAlpha = 0.8 + pulse * 0.2;
  context.fillStyle = service.color;
  context.fillText(service.label, service.x, service.y);
  context.globalAlpha = 1;
  context.restore();
}

function rotateAroundCenter(point: Point, angle: number): Point {
  const dx = point[0] - CENTER[0];
  const dy = point[1] - CENTER[1];
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [CENTER[0] + dx * cos - dy * sin, CENTER[1] + dx * sin + dy * cos];
}

function drawParticles(context: CanvasRenderingContext2D, time: number, reducedMotion: boolean) {
  ROUTES.forEach((route, index) => {
    const progress = reducedMotion
      ? 0.58
      : (time / (route.duration * 1000) + index * 0.13) % 1;
    const [x, y] = getPointOnRoute(ROUTE_ARCS[index], progress);
    context.save();
    context.shadowColor = route.color;
    context.shadowBlur = 7;
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(x, y, 2.2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelRatio: number,
  time: number,
  reducedMotion: boolean,
) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width * pixelRatio, height * pixelRatio);
  const scale = Math.min(width / SCENE_SIZE, height / SCENE_SIZE);
  const offsetX = (width - SCENE_SIZE * scale) / 2;
  const offsetY = (height - SCENE_SIZE * scale) / 2;
  context.setTransform(
    pixelRatio * scale,
    0,
    0,
    pixelRatio * scale,
    pixelRatio * offsetX,
    pixelRatio * offsetY,
  );

  drawAtmosphere(context);
  const orbitRotation = reducedMotion ? 0 : time / 3400;
  context.save();
  context.translate(CENTER[0], CENTER[1]);
  context.rotate(orbitRotation);
  context.translate(-CENTER[0], -CENTER[1]);
  drawOrbit(context);
  drawRoutes(context);
  drawParticles(context, time, reducedMotion);
  context.restore();

  SERVICES.forEach((service) => {
    const [x, y] = rotateAroundCenter([service.x, service.y], orbitRotation);
    drawService(context, { ...service, x, y }, time, reducedMotion);
  });

  drawGlobe(context, time, reducedMotion);
}

export function ComplianceFlowVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d");

    if (!canvas || !container || !context) {
      console.error("Unable to initialize the privacy network canvas.");
      return;
    }

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference.matches;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;

    const draw = (time: number) => {
      drawScene(context, width, height, pixelRatio, time, reducedMotion);
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      draw(performance.now());
    };

    const animate = (time: number) => {
      draw(time);
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(animate);
    };

    const updateMotionPreference = () => {
      reducedMotion = motionPreference.matches;
      window.cancelAnimationFrame(animationFrame);
      draw(performance.now());
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    motionPreference.addEventListener("change", updateMotionPreference);
    resize();
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      motionPreference.removeEventListener("change", updateMotionPreference);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      aria-label="Privacy service network with clockwise-orbiting text-only service labels connected inward to a rotating Aegis globe. Services shown are consent, processors, risk assessments, data rights, retention, audit trail, incidents, and data mapping."
      className="compliance-scene relative mt-4 h-[310px] w-full max-w-[680px] overflow-hidden bg-transparent sm:mt-5 sm:h-[400px]"
      role="img"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full bg-transparent"
      >
        A detailed privacy globe with animated inward links to eight surrounding services.
      </canvas>
    </section>
  );
}
