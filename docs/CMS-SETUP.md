# Setup CMS & Deployment ke Cloudflare

Panduan ini menjelaskan cara membuat konten situs bisa diedit **tanpa coding**
melalui CMS (Sveltia CMS) di halaman `/admin/`, dan cara deploy situs ke
**Cloudflare Pages**.

## Ringkasan cara kerja

```
Anda edit konten di https://situs-anda.com/admin/
        │  (login GitHub via Cloudflare Worker)
        ▼
CMS commit perubahan ke GitHub (file Markdown/JSON di repo ini)
        │
        ▼
Cloudflare Pages mendeteksi commit → auto rebuild (~1–2 menit)
        │
        ▼
Situs live dengan konten terbaru
```

- Situs tetap **100% statis** — tidak ada server CMS, tidak ada database, gratis.
- Konten tersimpan di `src/content/` (Markdown) dan `src/content/settings/site.json`
  (profil situs). UI/layout/behavior situs tidak berubah.
- Komponen:
  - **Sveltia CMS** — halaman admin di `/admin/` (`public/admin/`), di-host
    bersama situs di Cloudflare Pages.
  - **Sveltia CMS Authenticator** — Cloudflare Worker kecil (gratis) untuk login
    GitHub. Lihat [cms-auth/README.md](../cms-auth/README.md).

## A. Deploy situs ke Cloudflare Pages

1. Login ke [dash.cloudflare.com](https://dash.cloudflare.com) →
   **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pilih repo `PerdanaMain/astro-nano-fork` (authorize GitHub bila diminta).
3. Isi konfigurasi build:
   - **Project name**: pilih nama, mis. `profile-site` (menentukan URL
     `<nama>.pages.dev`).
   - **Production branch**: `main`
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. (Opsional) Tambah environment variable `NODE_VERSION` = `20` di
   *Settings → Environment variables* — file `.node-version` di repo sudah
   mengatur ini, jadi biasanya tidak perlu.
5. Klik **Save and Deploy**. Tunggu build pertama selesai.

> Catatan: hanya push/merge ke branch `main` yang menghasilkan deploy
> produksi. Branch lain otomatis mendapat *preview URL*.

## B. Deploy worker autentikasi (login GitHub)

Ikuti langkah di [cms-auth/README.md](../cms-auth/README.md): clone
`sveltia/sveltia-cms-auth`, deploy dengan `wrangler`, daftarkan GitHub OAuth
App (callback `<url-worker>/callback`), lalu simpan `GITHUB_CLIENT_ID` dan
`GITHUB_CLIENT_SECRET` sebagai secret worker. Gratis (free tier Workers).

## C. Sambungkan CMS ke Cloudflare

Setelah situs dan worker live, edit dua file lalu push ke `main`:

1. **`public/admin/config.yml`** — ganti placeholder:
   ```yaml
   backend:
     base_url: https://sveltia-cms-auth.<subdomain>.workers.dev   # URL worker Anda
   site_url: https://<nama-project>.pages.dev                     # URL situs Anda
   ```
2. **`astro.config.mjs`** — ganti `site` dengan URL produksi
   (mempengaruhi sitemap, RSS, dan meta OG, bukan tampilan):
   ```js
   site: "https://<nama-project>.pages.dev",
   ```

Selesai! Buka `https://situs-anda.com/admin/`, login dengan GitHub, dan
mulai mengedit konten.

## D. Mengedit konten sehari-hari

| Yang diedit | Lokasi di CMS | Catatan |
| :--- | :--- | :--- |
| Project (baru/ubah) | **Projects** | Termasuk link demo/repo/docs, tools, tanggal |
| Blog post | **Blog** | Centang **Draft** untuk menyembunyikan dari situs |
| Riwayat kerja | **Work** | End date: tanggal `MM/DD/YYYY` atau tulis `Present` |
| Nama, email, jumlah item homepage | **Site Settings → Site** | |
| Sapaan & bio homepage | **Site Settings → Home Page** | |
| Judul & meta description tiap halaman | **Site Settings** | |
| Link sosial media | **Site Settings → Socials** | |

Tips:

- **Gambar/screenshot**: saat mengedit konten, gunakan tombol upload/tarik-lepas
  di editor. File masuk ke `public/uploads/` dan otomatis ditulis path-nya di
  Markdown. Gambar lama di `public/projects/` tetap bisa dipakai lewat path
  `/projects/nama-file.png`.
- **Tampilan postingan kaya HTML** (grid ikon teknologi, badge warna) disimpan
  apa adanya — gunakan mode Markdown di editor untuk mengedit blok HTML.
- **Konten baru tidak langsung muncul**: setelah Save, CMS commit ke GitHub dan
  Cloudflare Pages rebuild ±1–2 menit. Cek statusnya di dashboard Cloudflare.
- Apapun yang Anda lakukan di CMS hanyalah commit Git — riwayat perubahan bisa
  dilihat/dikembalikan lewat history repo GitHub.

## E. Menjalankan CMS di lokal (opsional)

```bash
npm run dev
```

Buka `http://localhost:4321/admin/index.html` (saat lokal, URL
`/admin/` tanpa `index.html` belum di-resolve oleh dev server; di
produksi Cloudflare Pages `/admin/` berfungsi normal). Konfigurasi sudah
berisi `local_backend: true`, jadi untuk mencoba edit tanpa login GitHub:

```bash
npx decap-server   # di terminal terpisah
```

Catatan: mode lokal menulis langsung ke file di repo (belum tentu identik
dengan mode GitHub), dan diabaikan sepenuhnya saat produksi.

## F. Troubleshooting

| Masalah | Kemungkinan sebab & solusi |
| :--- | :--- |
| Login gagal / `redirect_uri_mismatch` | Callback URL di GitHub OAuth App harus persis `<url-worker>/callback` |
| Popup login menutup tanpa masuk | `base_url` di `config.yml` belum diisi/di-deploy; cek URL worker |
| `NOT_FOUND` saat buka `/admin/` | Belum push ke `main`, atau Cloudflare Pages belum selesai rebuild |
| Perubahan tidak muncul di situs | Build masih berjalan (cek dashboard) atau Anda melihat cache browser (Ctrl+Shift+R) |
| Error validasi saat build (konten gagal) | Field konten tidak sesuai schema di `src/content/config.ts`; periksa pesan error build di dashboard Cloudflare |
