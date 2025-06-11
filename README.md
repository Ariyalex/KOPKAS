# KOPKAS - Kotak Pengaduan Kekerasan Seksual

<div>

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-In%20Development-orange)](https://github.com/Ariyalex/KOPKAS)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🎯 Tentang Projek

**KOPKAS** (Kotak Pengaduan Kekerasan Seksual) adalah platform berbasis web yang dirancang khusus untuk menampung aspirasi dan pengaduan terkait kekerasan seksual di lingkungan **Kampus Putih UIN Sunan Kalijaga Yogyakarta**. 

### 🎯 Tujuan Utama
- 🛡️ Menyediakan **saluran pelaporan yang aman** dan terlindungi
- 🤝 Menjadi **media penghubung** antara penyintas dan pihak terkait
- 📱 Memberikan **akses mudah** untuk melaporkan insiden
- 👥 Memfasilitasi **komunikasi real-time** dengan tim support

### 📈 Metodologi Pengembangan
Projek ini dikembangkan menggunakan **metodologi Scrumban**, yang menggabungkan fleksibilitas Kanban dengan struktur Scrum untuk pengembangan yang lebih adaptif dan efisien.

---

## ✨ Fitur Utama

<table>
<tr>
<td width="50%">

### 👤 Untuk Pengguna
- 🔐 **Autentikasi Aman** (Login/Register)
- 📝 **Buat Pengaduan** dengan form yang user-friendly
- 📊 **Dashboard Pribadi** untuk tracking status
- 💬 **Chat Real-time** dengan admin/konselor
- 🔍 **Pelacakan Status** pengaduan secara transparan

</td>
<td width="50%">

### 👨‍💼 Untuk Admin
- 🎛️ **Dashboard Admin** yang komprehensif
- 📋 **Manajemen Pengaduan** dengan sistem workflow
- 💬 **Respons Real-time** kepada pelapor
- 📈 **Analytics & Reporting** untuk monitoring
- 🔒 **Kontrol Akses** berlapis

</td>
</tr>
</table>

### 🔄 Status Tracking System
```
📝 NEW → 🔄 IN_PROGRESS → ✅ RESOLVED → ❌ RESOLVED 
```

---

## 🛠️ Teknologi

<div>

| Layer | Teknologi | Versi | Alasan Pemilihan |
|-------|-----------|-------|------------------|
| **Frontend** | Next.js + React | 14.x | SSR, SEO optimization, Developer Experience |
| **Styling** | Tailwind CSS | 3.x | Rapid development, Consistent design system |
| **Backend** | Next.js API Routes | 14.x | Full-stack integration, App Router |
| **Database** | Supabase | Latest | Real-time capabilities, Built-in auth |
| **Runtime** | Node.js | 18+ | JavaScript ecosystem, Performance |

</div>

---

## 👥 Tim Pengembang

<table>
<tr>
<td align="center" width="20%">
<img src="https://github.com/Ariyalex.png" width="100px"/><br>
<b>Ariya Duta</b><br>
<i>Scrum Master & Product Owner</i><br>
<i>Frontend Developer</i><br>
<a href="https://github.com/Ariyalex">@Ariyalex</a>
</td>
<td align="center" width="20%">
<img src="https://github.com/zaaammmmm.png" width="100px"/><br>
<b>Ahmad Zamroni Trikarta</b><br>
<i>Backend Developer</i><br>
<i>Database Architect</i><br>
<i>Client</i><br>
<a href="https://github.com/zaaammmmm">@zaaammmmm</a>
</td>
<td align="center" width="20%">
<img src="https://github.com/Vinaspymlana.png" width="100px"/><br>
<b>Vina Sopyamuliana</b><br>
<i>UI/UX Designer</i><br>
<i>Product Designer</i><br>
<a href="https://github.com/Vinaspymlana">@Vinaspymlana</a>
</td>
</tr>
</table>

### 📋 Pembagian Tugas

| Role | Tanggung Jawab |
|------|----------------|
| **🎯 Scrum Master** | Koordinasi tim, Sprint planning, Remove blockers |
| **📱 Frontend Developer** | UI Implementation, React components, User interactions |
| **⚙️ Backend Developer** | API development, Database design, Authentication, Real-time features |
| **🎨 UI/UX Designer** | User research, Wireframing, Prototyping dengan Figma |

---

## 🚀 Getting Started

### 📋 Prerequisites
Pastikan Anda telah menginstall:
- **Node.js** (v18 atau lebih baru)
- **npm**, **yarn**, **pnpm**, atau **bun**
- **Git**

### 🔧 Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/Ariyalex/KOPKAS.git
   cd KOPKAS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Isi variabel environment yang diperlukan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

5. **Akses Aplikasi**
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 🚀 Build untuk Production

```bash
npm run build
npm start
```

---

## 🔒 Keamanan & Privasi


> ⚠️ **PENTING**: Platform ini menangani data sensitif. Implementasi keamanan yang ketat adalah prioritas utama.


### 🛡️ Fitur Keamanan
- 🔐 **Autentikasi Multi-layer** dengan Supabase Auth
- 🔒 **Enkripsi Data** end-to-end untuk komunikasi sensitif
- 👤 **Anonimitas Terjamin** untuk pelapor
- 📝 **Audit Trail** untuk semua aktivitas sistem
- 🚫 **Data Minimization** - hanya mengumpulkan data yang diperlukan

### 🔐 Kontrol Akses

| User Type | Permissions |
|-----------|-------------|
| **Authenticated User** | ✅ Create reports, View own reports, Chat with admin |
| **Admin** | ✅ View all reports, Respond to reports, Manage status |
| **Super Admin** | ✅ Full system access, User management |

---

## 🏗️ Struktur Projek

```
KOPKAS/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 (auth)/            # Authentication routes
│   ├── 📁 dashboard/         # User dashboard
│   ├── 📁 admin/             # Admin panel
│   └── 📁 api/               # API routes
├── 📁 components/            # Reusable components
│   ├── 📁 ui/                # UI primitives
│   ├── 📁 forms/             # Form components
│   └── 📁 layout/            # Layout components
├── 📁 lib/                   # Utilities & configurations
│   ├── 📄 supabase.ts        # Supabase client
│   ├── 📄 auth.ts            # Authentication helpers
│   └── 📄 utils.ts           # Common utilities
├── 📁 public/                # Static assets
├── 📁 styles/                # Global styles
├── 📄 package.json           # Dependencies
├── 📄 tailwind.config.js     # Tailwind configuration
├── 📄 next.config.js         # Next.js configuration
└── 📄 README.md              # Documentation
```

---

## 📄 Lisensi

Projek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

```
MIT License

Copyright (c) 2024 KOPKAS Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

</div>
