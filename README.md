# TemanUsaha — Asisten AI untuk UMKM

Next.js 16 · Firebase (Auth + Firestore) · Claude API · Vercel

## Cara upload ke GitHub lewat browser

1. Buka https://github.com/new, beri nama repository `temanusaha`, pilih **Private**, klik **Create repository**.
2. Klik tautan **uploading an existing file**.
3. Seret SEMUA isi folder ini (folder `src` dan semua file di sampingnya) ke halaman tersebut.
   Yang diseret adalah isinya, bukan folder `1-UPLOAD-KE-GITHUB` itu sendiri.
4. Klik **Commit changes**.

Pastikan di GitHub terlihat: `src/`, `package.json`, `package-lock.json`, `tsconfig.json`,
`next.config.ts`, `postcss.config.mjs`.

File `.gitignore` tersembunyi di beberapa komputer. Jika tidak ikut ter-upload, tidak masalah.

## Lalu ke Vercel

1. https://vercel.com → **Add New → Project** → pilih `temanusaha` → **Import**.
2. Framework otomatis terdeteksi sebagai **Next.js**. Tidak perlu mengubah apa pun.
3. Buka **Environment Variables** dan isi sesuai folder `3-ISI-DI-VERCEL`.
4. Klik **Deploy**.

## Mengubah harga atau paket

Edit `src/lib/plans.ts` langsung di GitHub (ikon pensil), lalu Commit.
Vercel otomatis deploy ulang dalam 1–2 menit.
