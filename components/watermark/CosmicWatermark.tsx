"use client";

import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────
   ORBITAL — Home / Access pages
   Orrery of concentric orbits with @brahmexa text on the outer ring.
   Outer ring + text rotate at 250 s/rev; inner tilted ellipse drifts
   counter-clockwise at 320 s/rev.
   ───────────────────────────────────────────────────────────────────── */
function OrbitalSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.09 }}
    >
      <defs>
        {/* Full-circle path for text placement — outer orbit r=372 */}
        <path
          id="wm-orbit-path"
          d="M 348,450 A 372,372 0 1,1 1092,450 A 372,372 0 1,1 348,450"
        />
      </defs>

      {/* ── Rotating outer ring + @brahmexa label ── */}
      <g className="wm-rotate">
        <circle cx={720} cy={450} r={372} stroke="currentColor" strokeWidth={0.8} />
        {/* Small tick marks at 8 compass bearings on the outer ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const xi = 720 + 366 * Math.cos(rad);
          const yi = 450 + 366 * Math.sin(rad);
          const xo = 720 + 382 * Math.cos(rad);
          const yo = 450 + 382 * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={xi} y1={yi} x2={xo} y2={yo}
              stroke="currentColor"
              strokeWidth={deg % 90 === 0 ? 0.9 : 0.65}
            />
          );
        })}
        {/* @brahmexa inscription along the orbit */}
        <text fontSize={13} letterSpacing={3} fill="currentColor">
          <textPath href="#wm-orbit-path" startOffset="6%">
            @brahmexa · brahmando · universe of intelligence · @brahmexa · brahmando · universe of intelligence ·
          </textPath>
        </text>
      </g>

      {/* ── Counter-rotating tilted ellipse (inner orbital plane) ── */}
      <g className="wm-rotate-r">
        <ellipse
          cx={720} cy={450}
          rx={300} ry={128}
          stroke="currentColor"
          strokeWidth={0.7}
          transform="rotate(-28 720 450)"
        />
      </g>

      {/* ── Static inner structure ── */}
      {/* Middle orbit */}
      <circle cx={720} cy={450} r={240} stroke="currentColor" strokeWidth={0.7} />
      {/* Inner orbit */}
      <circle cx={720} cy={450} r={130} stroke="currentColor" strokeWidth={0.65} />
      {/* Core ring */}
      <circle cx={720} cy={450} r={48} stroke="currentColor" strokeWidth={0.6} />
      {/* Center bindu */}
      <circle cx={720} cy={450} r={3.5} fill="currentColor" style={{ opacity: 0.55 }} />

      {/* 8 radial spokes — core ring to middle orbit */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={720 + 50 * Math.cos(rad)}
            y1={450 + 50 * Math.sin(rad)}
            x2={720 + 240 * Math.cos(rad)}
            y2={450 + 240 * Math.sin(rad)}
            stroke="currentColor"
            strokeWidth={0.55}
          />
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   YANTRA — Agents / MCP Servers / Docs pages
   Two interlocked equilateral triangles (hexagram / sri-yantra spirit)
   inscribed in a circle, with nested rings and @brahmexa along the
   inner orbit. Static — sacred, diagram-like.
   ───────────────────────────────────────────────────────────────────── */
function YantraSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.085 }}
    >
      <defs>
        <path
          id="wm-yantra-ring"
          d="M 570,450 A 150,150 0 1,1 870,450 A 150,150 0 1,1 570,450"
        />
      </defs>

      {/* Outer containing circle R=300 */}
      <circle cx={720} cy={450} r={300} stroke="currentColor" strokeWidth={0.8} />

      {/*
        Upward triangle inscribed in R=300:
          Top   → (720, 150)
          BR    → (720+260, 450+150) = (980, 600)
          BL    → (720-260, 450+150) = (460, 600)
      */}
      <polygon
        points="720,150 980,600 460,600"
        stroke="currentColor"
        strokeWidth={0.75}
      />

      {/*
        Downward triangle inscribed in R=300:
          Bottom → (720, 750)
          TR     → (720+260, 450-150) = (980, 300)
          TL     → (720-260, 450-150) = (460, 300)
      */}
      <polygon
        points="720,750 980,300 460,300"
        stroke="currentColor"
        strokeWidth={0.75}
      />

      {/* Middle ring (inscribed hexagon radius ≈ 260) */}
      <circle cx={720} cy={450} r={150} stroke="currentColor" strokeWidth={0.65} />
      {/* Inner core ring */}
      <circle cx={720} cy={450} r={50} stroke="currentColor" strokeWidth={0.6} />
      {/* Center bindu */}
      <circle cx={720} cy={450} r={3.5} fill="currentColor" style={{ opacity: 0.55 }} />

      {/* @brahmexa text along the inner ring */}
      <text fontSize={13} letterSpacing={3} fill="currentColor">
        <textPath href="#wm-yantra-ring" startOffset="8%">
          @brahmexa · brahmando · sovereign intelligence · @brahmexa ·
        </textPath>
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   WAVEFORM — Workflows page
   Expanding ellipses radiate from an off-center focal point (like
   interference patterns or field lines). Two crossing Bézier waves
   traverse the space. @brahmexa follows a gentle sine path.
   ───────────────────────────────────────────────────────────────────── */
function WaveformSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.085 }}
    >
      <defs>
        <path
          id="wm-wave-text"
          d="M 0,450 C 320,385 560,515 900,450 C 1080,418 1260,468 1440,448"
        />
      </defs>

      {/* Expanding ellipses — focal point (380, 450) */}
      <ellipse cx={380} cy={450} rx={90}  ry={56}  stroke="currentColor" strokeWidth={0.75} />
      <ellipse cx={380} cy={450} rx={220} ry={136} stroke="currentColor" strokeWidth={0.75} />
      <ellipse cx={380} cy={450} rx={420} ry={258} stroke="currentColor" strokeWidth={0.7} />
      <ellipse cx={380} cy={450} rx={680} ry={415} stroke="currentColor" strokeWidth={0.65} />
      <ellipse cx={380} cy={450} rx={980} ry={598} stroke="currentColor" strokeWidth={0.6} />

      {/* Crossing Bézier wave lines */}
      <path
        d="M 0,200 C 400,95 800,720 1440,350"
        stroke="currentColor"
        strokeWidth={0.75}
      />
      <path
        d="M 0,700 C 400,805 800,180 1440,555"
        stroke="currentColor"
        strokeWidth={0.7}
      />

      {/* Center bindu at focal point */}
      <circle cx={380} cy={450} r={3.5} fill="currentColor" style={{ opacity: 0.55 }} />

      {/* @brahmexa text along the gentle wave */}
      <text fontSize={13} letterSpacing={3} fill="currentColor">
        <textPath href="#wm-wave-text" startOffset="8%">
          @brahmexa · brahmando · intelligence flows · @brahmexa · brahmando ·
        </textPath>
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   ROOT COMPONENT
   ───────────────────────────────────────────────────────────────────── */
const VARIANT_MAP: Record<string, React.ComponentType> = {
  orbital:  OrbitalSVG,
  yantra:   YantraSVG,
  waveform: WaveformSVG,
};

export function CosmicWatermark() {
  const pathname = usePathname();

  const variantKey =
    pathname.startsWith("/workflows")
      ? "waveform"
      : pathname.startsWith("/agents") ||
        pathname.startsWith("/mcp") ||
        pathname.startsWith("/docs")
      ? "yantra"
      : "orbital";

  const WatermarkSVG = VARIANT_MAP[variantKey];

  return (
    <>
      {/* ── Ambient background color pulse (breathes lighter ↔ darker) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 select-none"
        style={{ zIndex: 0 }}
      >
        <div className="wm-ambient-1 absolute inset-0" />
        <div className="wm-ambient-2 absolute inset-0" />
        <div className="wm-ambient-3 absolute inset-0" />
      </div>

      {/* ── SVG watermark layer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <WatermarkSVG />
      </div>
    </>
  );
}
