// Resting moods — little emotion particles that drift out from under the compact
// island while nothing is going on.
//
// The compact island is glued to the top edge of the screen, so the canvas
// particles (which rise) would fly straight off-screen. These are plain DOM
// elements instead: they fall out of the bottom of the bar and fade, over the
// desktop, with the window's input shape keeping them click-through.

export type MoodKind = "love" | "proud" | "happy" | "wink" | "sleepy";

type ParticleShape = "heart" | "star" | "note" | "spark" | "z";

const SHAPE_FOR: Record<MoodKind, ParticleShape> = {
  love: "heart",
  proud: "star",
  happy: "note",
  wink: "spark",
  sleepy: "z",
};

/** Same palette as the canvas particles in engine.ts. */
const COLOR: Record<ParticleShape, string> = {
  heart: "#FF4D6D",
  star: "#F7B32B",
  note: "#9DD4FF",
  spark: "#FFFFFF",
  z: "rgb(209,219,235)",
};

const SVG_NS = "http://www.w3.org/2000/svg";

function heartSvg(size: number, color: string): SVGElement {
  const el = document.createElementNS(SVG_NS, "svg");
  el.setAttribute("viewBox", "0 0 24 24");
  el.setAttribute("width", String(size));
  el.setAttribute("height", String(size));
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    "M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z",
  );
  path.setAttribute("fill", color);
  el.append(path);
  return el;
}

function starSvg(size: number, color: string, inner: number): SVGElement {
  const el = document.createElementNS(SVG_NS, "svg");
  el.setAttribute("viewBox", "-12 -12 24 24");
  el.setAttribute("width", String(size));
  el.setAttribute("height", String(size));
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 11 : 11 * inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  const poly = document.createElementNS(SVG_NS, "polygon");
  poly.setAttribute("points", pts.join(" "));
  poly.setAttribute("fill", color);
  el.append(poly);
  return el;
}

function makeShape(shape: ParticleShape, size: number): Element {
  const color = COLOR[shape];
  switch (shape) {
    case "heart":
      return heartSvg(size, color);
    case "star":
      return starSvg(size, color, 0.45);
    case "spark":
      return starSvg(size, color, 0.2);
    case "note":
    case "z": {
      const span = document.createElement("span");
      span.textContent = shape === "note" ? (Math.random() < 0.5 ? "♪" : "♫") : "z";
      span.style.color = color;
      span.style.font = `700 ${size}px system-ui, sans-serif`;
      span.style.lineHeight = "1";
      return span;
    }
  }
}

export class MoodParticles {
  readonly el: HTMLElement;

  constructor() {
    this.el = document.createElement("div");
    this.el.id = "mood-layer";
  }

  /**
   * Releases `count` particles of the mood from (x, y) in island coordinates,
   * normally just under Mochi at the bottom edge of the bar.
   */
  burst(mood: MoodKind, x: number, y: number, count = 3) {
    const shape = SHAPE_FOR[mood];
    for (let i = 0; i < count; i++) {
      const size = shape === "z" ? 9 + i * 2 : 9 + Math.random() * 4;
      const wrap = document.createElement("div");
      wrap.className = "mood-p";
      wrap.append(makeShape(shape, size));
      // z's drift steadily to one side like a snore; the rest scatter.
      const dx = shape === "z" ? 14 + i * 8 : (Math.random() - 0.5) * 44;
      const dy = 22 + Math.random() * 18 + (shape === "z" ? i * 6 : 0);
      const rot = shape === "z" ? -12 : (Math.random() - 0.5) * 50;
      wrap.style.left = `${x - size / 2}px`;
      wrap.style.top = `${y}px`;
      wrap.style.setProperty("--dx", `${dx}px`);
      wrap.style.setProperty("--dy", `${dy}px`);
      wrap.style.setProperty("--rot", `${rot}deg`);
      wrap.style.animationDelay = `${i * (shape === "z" ? 380 : 140)}ms`;
      wrap.addEventListener("animationend", () => wrap.remove(), { once: true });
      this.el.append(wrap);
    }
  }

  clear() {
    this.el.replaceChildren();
  }
}

/** Picks the next resting mood. Sleepy wins once the user has been away. */
export function pickMood(awayMs: number, absenceMs: number): MoodKind {
  if (awayMs >= absenceMs) return "sleepy";
  const pool: MoodKind[] = ["love", "happy", "happy", "wink", "proud"];
  return pool[Math.floor(Math.random() * pool.length)];
}
