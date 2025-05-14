# KOPKAS - Kotak Pengaduan Kekerasan Seksual

KOPKAS (Kotak Pengaduan Kekerasan Seksual) adalah platform berbasis website yang dirancang untuk menampung aspirasi dan pengaduan terkait kekerasan seksual di lingkungan Kampus Putih UIN Sunan Kalijaga Yogyakarta. Platform ini berfungsi sebagai media penghubung antara penyintas dan pihak terkait, serta menyediakan kotak pengaduan yang anonim dan terintegrasi. Proyek KOPKAS dikembangkan menggunakan metode Scrumban oleh sebuah tim yang terdiri dari berbagai peran dan keahlian dalam proses pengembangannya.

## Fitur Utama
- Autentikasi pengguna (login, register)
- Dashboard pengguna untuk membuat dan melacak pengaduan
- Chat real-time antara pengguna dan admin
- Dashboard admin untuk mengelola pengaduan
- Status tracking (pending, in_progress, resolved)

## Jobdesk Scrumban
- **Scrum master**: Ariya Duta (@Ariyalex)  
- **Product owner**: Ariya Duta (@Ariyalex)  
- **Client**: Ahmad Zamroni Trikarta (@zaaammmmm)  

## Developer
- **Front End**: Ariya Duta (@Ariyalex)  
Mengimplementasikan interface web dari desain yang dibuat UI/UX menggunakan php dan tailwind css, membuat web menjadi interaktif menggunakan JS
- **Back End**: Ahmad Zamroni Trikarta (@zaaammmmm)  
Mengelola logika aplikasi, autentikasi, akses data MySQL, dan komunikasi real-time user-admin menggunakan Next JS serta mendukung kebutuhan frontend.
- **UI/UX**: Vina sopyamuliana (@Vinaspymlana)  
  Mendesain tampilan dan alur penggunaan web menggunakan Figma, memastikan tampilan user-friendly dan konsisten di setiap halaman.

## Teknologi yang Digunakan
- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js + Next.js (App Router)
- **Database**: Supabase Realtime Database

## Akses & Proteksi
- **User**: Hanya user login yang bisa akses keluhan dalam mengirim dan melihat keluhan
- **Admin**: Admin punya akses khusus hanya untuk melihat dan membalas keluhan

## Getting Started

#### Cloning repository  

```bash
git clone https://github.com/Ariyalex/KOPKAS.git  
cd kopkas
```

#### Install Depedensi  
```bash
npm install
```

#### Menjalankan program:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.
