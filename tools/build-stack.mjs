// Membangun assets/stack.svg — deretan ikon yang bergerak (marquee) tanpa henti.
// Jalankan: node tools/build-stack.mjs
//
// Ikon diambil dari Simple Icons (CC0). Path-nya ditanam langsung ke dalam SVG
// supaya README tidak bergantung pada layanan luar dan animasinya tetap jalan
// saat dibuka sebagai <img>.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// [slug simple-icons, warna merek]
const ICONS = [
  ["javascript", "#F7DF1E"],
  ["php", "#777BB4"],
  ["python", "#3776AB"],
  ["dart", "#0175C2"],
  ["flutter", "#02569B"],
  ["html5", "#E34F26"],
  ["css", "#1572B6"],
  ["mysql", "#4479A1"],
  ["sqlite", "#003B57"],
  ["postgresql", "#4169E1"],
  ["git", "#F05032"],
  ["github", "#E6EDF3"],
  ["linux", "#FCC624"],
  ["gnubash", "#4EAA25"],
  ["cloudflare", "#F38020"],
  ["docker", "#2496ED"],
  ["kubernetes", "#326CE5"],
  ["qt", "#41CD52"],
  ["cplusplus", "#00599C"],
  ["openjdk", "#F89820"],
  ["nodedotjs", "#5FA04E"],
  ["npm", "#CB3837"],
  ["android", "#3DDC84"],
  ["kotlin", "#7F52FF"],
  ["figma", "#F24E1E"],
  ["postman", "#FF6C37"],
  ["blender", "#E87D0D"],
  ["godotengine", "#478CBF"],
];

const SIZE = 44;
const GAP = 32;
const HEIGHT = 88;
const PADDING_Y = (HEIGHT - SIZE) / 2;

async function fetchIcon(slug) {
  const res = await fetch(`https://cdn.simpleicons.org/${slug}`, {
    headers: { "User-Agent": "secondlife-profile-builder" },
  });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const svg = await res.text();
  const d = svg.match(/<path[^>]*\sd="([^"]+)"/)?.[1];
  if (!d) throw new Error(`${slug}: path tidak ditemukan`);
  return d;
}

function icon(d, color, x) {
  return (
    `<svg x="${x}" y="${PADDING_Y}" width="${SIZE}" height="${SIZE}" viewBox="0 0 24 24">` +
    `<path d="${d}" fill="${color}"/></svg>`
  );
}

const stride = SIZE + GAP;
const contentWidth = ICONS.length * stride;
const duration = Math.round(contentWidth / 62); // ±62 px per detik

const paths = [];
for (const [slug] of ICONS) {
  paths.push(await fetchIcon(slug));
}

const row = ICONS.map(([, color], i) => icon(paths[i], color, i * stride)).join("\n      ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${HEIGHT}" viewBox="0 0 1200 ${HEIGHT}" role="img" aria-label="Yang sedang dipelajari: ${ICONS.map(([s]) => s).join(", ")}">
  <style>
    @keyframes sl-drift {
      from { transform: translateX(0px); }
      to   { transform: translateX(-${contentWidth}px); }
    }
    .sl-track { animation: sl-drift ${duration}s linear infinite; }
    @media (prefers-reduced-motion: reduce) {
      .sl-track { animation: none; }
    }
  </style>

  <g class="sl-track">
      ${row}
      ${row}
  </g>
</svg>
`;

await mkdir(join(ROOT, "assets"), { recursive: true });
await writeFile(join(ROOT, "assets", "stack.svg"), svg, "utf8");

console.log(
  `assets/stack.svg — ${ICONS.length} ikon, lebar konten ${contentWidth}px, durasi ${duration}s, ` +
    `${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`
);
