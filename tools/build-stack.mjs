// Membangun assets/tech-marquee.svg — deretan ikon yang melayang dan bergerak
// ke samping tanpa henti (marquee mulus: tanpa ujung, tanpa layar kosong).
// Jalankan: node tools/build-stack.mjs
//
// Ikon diambil dari Simple Icons (CC0). Path-nya ditanam langsung ke dalam SVG
// supaya README tidak bergantung pada layanan luar dan animasinya tetap jalan
// saat dibuka sebagai <img>.
//
// Kunci loop mulus: baris ikon digambar DUA kali, salinan kedua digeser tepat
// selebar satu baris (contentWidth), lalu seluruh jalur digeser -contentWidth.
// Ujung salinan pertama bersambung langsung ke awal salinan kedua dengan jarak
// yang sama dengan GAP, jadi saat animasi kembali ke 0 tidak ada lompatan dan
// tidak pernah ada ruang kosong.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// [slug simple-icons, warna merek]
const ICONS = [
  // bahasa & framework
  ["javascript", "#F7DF1E"],
  ["typescript", "#3178C6"],
  ["php", "#777BB4"],
  ["python", "#3776AB"],
  ["dart", "#0175C2"],
  ["flutter", "#02569B"],
  ["html5", "#E34F26"],
  ["css", "#1572B6"],
  ["react", "#61DAFB"],
  ["vite", "#646CFF"],
  ["nodedotjs", "#5FA04E"],
  ["npm", "#CB3837"],
  ["laravel", "#FF2D20"],
  ["bootstrap", "#7952B3"],
  ["tailwindcss", "#06B6D4"],
  // database
  ["mysql", "#4479A1"],
  ["mariadb", "#003545"],
  ["sqlite", "#003B57"],
  ["postgresql", "#4169E1"],
  ["mongodb", "#47A248"],
  ["redis", "#FF4438"],
  ["firebase", "#FFCA28"],
  ["supabase", "#3FCF8E"],
  // version control & sistem
  ["git", "#F05032"],
  ["github", "#E6EDF3"],
  ["gitlab", "#FC6D26"],
  ["linux", "#FCC624"],
  ["gnubash", "#4EAA25"],
  ["vim", "#019733"],
  // server, cloud, container
  ["cloudflare", "#F38020"],
  ["docker", "#2496ED"],
  ["kubernetes", "#326CE5"],
  ["apache", "#D22128"],
  ["nginx", "#009639"],
  // aplikasi desktop & toolchain
  ["qt", "#41CD52"],
  ["cplusplus", "#00599C"],
  ["openjdk", "#F89820"],
  ["cmake", "#064F8C"],
  ["android", "#3DDC84"],
  ["androidstudio", "#3DDC84"],
  ["kotlin", "#7F52FF"],
  ["arduino", "#00979D"],
  ["raspberrypi", "#A22846"],
  ["jupyter", "#F37626"],
  ["figma", "#F24E1E"],
  ["postman", "#FF6C37"],
  ["blender", "#E87D0D"],
  ["godotengine", "#478CBF"],
];

const SIZE = 44;
const GAP = 32;
const HEIGHT = 88;
const PADDING_Y = (HEIGHT - SIZE) / 2;
const STRIDE = SIZE + GAP;

// --- warna: pastikan tetap terbaca di latar gelap -------------------------
// Merek seperti SQLite / C++ / MariaDB hampir hitam; di latar gelap ikonnya
// hilang. Campur ke arah putih sampai luminansinya cukup — hue tetap sama.
function luma(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function readable(hex, min = 0.16) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const mixed = rgb.map((c) => Math.round(c + (255 - c) * t));
    const out = "#" + mixed.map((c) => c.toString(16).padStart(2, "0")).join("");
    if (luma(out) >= min) return out;
  }
  return "#ffffff";
}

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

// satu ikon: <g> untuk naik-turun (efek melayang), <svg> untuk skala 24→44.
// Fase melayang ditentukan indeks ikon supaya salinan kedua identik fasenya,
// jadi sambungan loop tetap mulus.
function icon(d, color, x, i) {
  const delay = (-((i % 9) * 0.53)).toFixed(2);
  return (
    `<g class="sl-ico" style="animation-delay:${delay}s">` +
    `<svg x="${x}" y="${PADDING_Y}" width="${SIZE}" height="${SIZE}" viewBox="0 0 24 24">` +
    `<path d="${d}" fill="${color}"/></svg></g>`
  );
}

const paths = [];
for (const [slug] of ICONS) paths.push(await fetchIcon(slug));

const colors = ICONS.map(([, color]) => readable(color));
const buildRow = (offsetX) =>
  ICONS.map((_, i) => icon(paths[i], colors[i], offsetX + i * STRIDE, i)).join("\n      ");

const contentWidth = ICONS.length * STRIDE;
const duration = Math.round(contentWidth / 62); // ±62 px per detik

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${HEIGHT}" viewBox="0 0 1200 ${HEIGHT}" role="img" aria-label="Yang sedang dipelajari: ${ICONS.map(([s]) => s).join(", ")}">
  <style>
    @keyframes sl-drift {
      from { transform: translateX(0px); }
      to   { transform: translateX(-${contentWidth}px); }
    }
    @keyframes sl-bob {
      from { transform: translateY(-2.5px); }
      to   { transform: translateY(2.5px); }
    }
    .sl-track { animation: sl-drift ${duration}s linear infinite; }
    .sl-ico   { animation: sl-bob 3.6s ease-in-out infinite alternate; }
    @media (prefers-reduced-motion: reduce) {
      .sl-track, .sl-ico { animation: none; }
    }
  </style>

  <g class="sl-track">
      ${buildRow(0)}
      ${buildRow(contentWidth)}
  </g>
</svg>
`;

await mkdir(join(ROOT, "assets"), { recursive: true });
await writeFile(join(ROOT, "assets", "tech-marquee.svg"), svg, "utf8");

console.log(
  `assets/tech-marquee.svg — ${ICONS.length} ikon (${ICONS.length * 2} digambar), ` +
    `satu baris ${contentWidth}px, durasi ${duration}s, ` +
    `${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`
);
