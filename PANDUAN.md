# Panduan: profil GitHub yang rapi

Aturan mainnya cuma satu: **repo publik dengan nama sama persis seperti username**. Kalau username `Muh-Musyawir`, repo-nya harus `Muh-Musyawir`. Isi `README.md` di root repo itu otomatis tampil di halaman profil.

## 1. Buat repo profil

```powershell
cd "D:\Downloads -Brave\APP V PROGRAM\github-profile"
git init -b main
git add .
git commit -m "chore: profil GitHub"
gh repo create Muh-Musyawir --public --source=. --remote=origin --push
```

Harus **public**. Kalau private, README tidak muncul dan gambar dari `raw.githubusercontent.com` juga tidak bisa diakses orang lain.

## 2. Nyalakan dua workflow

Setelah push, buka tab **Actions** di repo, lalu jalankan manual sekali:

- **Profile Cards** → tombol *Run workflow*. Ini membuat 5 kartu statistik di folder `profile-summary-card-output/tokyonight/`.
- **Snake** → tombol *Run workflow*. Ini membuat branch `output` berisi animasi ular kontribusi.

Kartu statistik akan tampil kosong/404 sebelum workflow pertama selesai — itu normal, tunggu ±1 menit lalu refresh.

## 3. Lengkapi halaman profil (bukan di README)

Buka https://github.com/settings/profile:

| Field | Saran |
|---|---|
| **Profile picture** | foto wajah jelas, latar polos. Ini yang paling menaikkan kesan "rapi". |
| **Bio** | sekarang isinya `∞` saja. Ganti: `Mahasiswa · Web & Mobile Dev · Makassar` (±60 karakter). |
| **Location** | `Makassar, Indonesia` |
| **Website** | link portfolio/LinkedIn kalau ada |
| **Social accounts** | tambahkan LinkedIn/Instagram |

Lalu **pin repository** (maks 6) di halaman profil: tombol *Customize your pins* → centang repo yang paling ingin ditonjolkan. Repo kosong seperti `Muh-Musyawir.github.io` sebaiknya tidak dipin.

## 4. Kenapa statistik masih sepi

Akun ini baru dibuat 29 Oktober 2026, dan commit-nya sebagian besar ada di repo **private** — yang tidak dihitung layanan statistik publik. Jadi kartu kontribusi akan terlihat kosong untuk sementara. Yang memperbaiki:

- Mulai commit ke repo publik (tugas kuliah, latihan, eksperimen kecil).
- Atau jadikan `secondlife-Eki` publik kalau tidak masalah dilihat orang.

Tidak perlu dipaksakan. Profil yang isinya 2–3 repo berkualitas lebih baik daripada 20 repo kosong.

## 5. Kalau ada gambar yang rusak

Layanan kartu statistik pihak ketiga sering kena limit. Yang dipakai di README ini:

| Gambar | Sumber | Status |
|---|---|---|
| Header & footer wave | capsule-render | stabil |
| Teks mengetik | readme-typing-svg | stabil |
| Badge & views | shields.io, komarev | stabil |
| Ikon stack | skillicons.dev | stabil |
| Kartu statistik | **dibuat sendiri via Actions** | selalu tersedia |
| Ular kontribusi | **dibuat sendiri via Actions** | selalu tersedia |

Sengaja tidak memakai `github-readme-stats.vercel.app` — saat saya cek, instance publiknya membalas `503`, dan `github-profile-trophy` membalas `402` (sudah berbayar). Dua layanan itu yang paling sering bikin profil tampak rusak.

Kalau nanti mau kartu gaya `github-readme-stats`, deploy sendiri ke Vercel (gratis) lalu ganti URL-nya.

## 6. Update

```powershell
notepad README.md
git add . && git commit -m "update profil" && git push
```

Workflow berjalan otomatis setiap push dan setiap 12 jam, jadi angka statistik ikut segar sendiri.
