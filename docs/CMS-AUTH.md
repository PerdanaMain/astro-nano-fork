# cms-auth — Autentikasi CMS (Sveltia CMS Authenticator)

Dokumen ini berisi panduan deploy worker autentikasi. Kode worker-nya memakai
proyek resmi [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
(Cloudflare Worker, gratis) supaya selalu ikut update resminya — tidak
di-copy ke repo ini agar perbaikan keamanan upstream langsung bisa diikuti.

Worker ini menjembatani login GitHub untuk halaman admin `/admin/`
(Sveltia CMS). Alur lengkapnya ada di [CMS-SETUP.md](./CMS-SETUP.md).

## Langkah deploy (sekali saja, ±10 menit)

Prasyarat: akun Cloudflare (gratis) dan Node.js 20+ di komputer.

```bash
git clone https://github.com/sveltia/sveltia-cms-auth
cd sveltia-cms-auth
npx wrangler login
npx wrangler deploy
```

Catat URL worker yang muncul, contoh: `https://sveltia-cms-auth.<subdomain-anda>.workers.dev`

### 1. Daftarkan GitHub OAuth App

Buka <https://github.com/settings/developers> → **New OAuth App**:

| Field | Isi |
| :--- | :--- |
| Application name | `Sveltia CMS — profile-site` |
| Homepage URL | URL situs Anda (mis. `https://<project>.pages.dev`) |
| Authorization callback URL | `https://sveltia-cms-auth.<subdomain-anda>.workers.dev/callback` |

Klik **Register**, lalu salin **Client ID** dan buat **Client secret**.

### 2. Simpan kredensial ke Worker

```bash
npx wrangler secret put GITHUB_CLIENT_ID
# tempel Client ID, lalu Enter
npx wrangler secret put GITHUB_CLIENT_SECRET
# tempel Client secret, lalu Enter
```

### 3. (Disarankan) Batasi domain yang boleh login

Di dashboard Cloudflare → Workers & Pages → `sveltia-cms-auth` →
**Settings → Variables and Secrets**, tambahkan variabel:

| Nama | Isi |
| :--- | :--- |
| `ALLOWED_DOMAINS` | domain situs Anda, mis. `<project>.pages.dev` (tanpa `https://`) |

Tanpa variabel ini worker tetap jalan, tetapi hanya domain di daftar ini
yang menerima token login.

### 4. Sambungkan ke situs

Isi URL worker di `public/admin/config.yml`:

```yaml
backend:
  base_url: https://sveltia-cms-auth.<subdomain-anda>.workers.dev
```

Commit & push, tunggu Cloudflare Pages rebuild, lalu buka `/admin/`.
