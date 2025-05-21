// laporan_dummy.tsx

export interface LaporanData {
    id: number;
    pelapor: string;
    tanggal: Date;
    status: 'baru' | 'diproses' | 'selesai' | 'ditolak';
    lokasi?: string;
    kekerasan?: string;
    kronologi?: string;
    bukti?: string;
    datetime: Date;
}

// Create detailed data with all fields
const detailedDummyData: LaporanData[] = [
    {
        id: 1001,
        pelapor: 'Prabowo',
        datetime: new Date('2025-03-15T08:30:00'),
        lokasi: 'Gedung Fakultas Teknik, Lantai 3, Ruang 304',
        kekerasan: 'Pelecehan Verbal',
        kronologi: 'disaat ruang sepi, tiba tiba mayor Teddy mendorong saya ke tembok dan menyentuh bagian privat serta membuat saya berteriak "i am lion pizza chicken, oh shit"',
        bukti: '/dummy.jpg',
        tanggal: new Date('2025-03-15T10:30:00'),
        status: 'baru'
    },
    {
        id: 1002,
        pelapor: 'Budi Santoso',
        datetime: new Date('2025-03-09T16:45:00'),
        lokasi: 'Kantin Kampus, Area Belakang',
        kekerasan: 'Intimidasi',
        kronologi: 'Seorang senior dari organisasi kampus mengancam akan membuat masa studi saya sulit jika saya tidak mengikuti keinginannya untuk bergabung dengan kepanitiaan acara yang dia pimpin. Dia menghalangi jalan saya dan berbicara dengan nada mengintimidasi sambil sesekali mendorong bahu saya.',
        bukti: '/dummy1.webp',
        tanggal: new Date('2025-03-10T14:20:00'),
        status: 'diproses'
    },
    {
        id: 1003,
        pelapor: 'Citra Dewi',
        datetime: new Date('2025-02-25T19:15:00'),
        lokasi: 'Perpustakaan Pusat, Area Studi Individu',
        kekerasan: 'Pelecehan Seksual',
        kronologi: 'Saya sedang belajar sendirian di perpustakaan ketika seorang mahasiswa yang tidak saya kenal duduk di sebelah saya dan mulai menunjukkan gambar-gambar tidak pantas di ponselnya. Dia terus meminta kontak pribadi saya dan mencoba menyentuh tangan saya beberapa kali meskipun saya sudah jelas menolak.',
        bukti: '/dummy2.jpg',
        tanggal: new Date('2025-02-28T09:45:00'),
        status: 'selesai'
    },
    {
        id: 1004,
        pelapor: 'Dimas Pratama',
        datetime: new Date('2025-04-02T13:20:00'),
        lokasi: 'Laboratorium Komputer, Gedung B',
        kekerasan: 'Diskriminasi',
        kronologi: 'Asisten lab secara konsisten memberikan perlakuan berbeda kepada saya dan beberapa teman yang berasal dari daerah yang sama. Kami selalu ditempatkan di komputer yang rusak atau lambat, dan ketika meminta bantuan, kami sering diabaikan atau diberi respon yang tidak membantu dibandingkan mahasiswa lain.',
        bukti: '/dummy.jpg',
        tanggal: new Date('2025-04-05T16:15:00'),
        status: 'baru'
    },
    {
        id: 1005,
        pelapor: 'Elsa Puteri',
        datetime: new Date('2025-04-10T11:00:00'),
        lokasi: 'Ruang Seminar, Gedung Rektorat',
        kekerasan: 'Pelecehan Verbal',
        kronologi: 'Selama presentasi seminar, pembicara tamu membuat lelucon seksis dan komentar merendahkan tentang kemampuan perempuan dalam bidang teknik. Ketika saya mengajukan keberatan saat sesi tanya jawab, dia memotong saya dan membuat komentar tentang "wanita yang terlalu sensitif" yang membuat audiens tertawa.',
        bukti: '/dummy2.jpg',
        tanggal: new Date('2025-04-12T09:30:00'),
        status: 'diproses'
    },
    {
        id: 1006,
        pelapor: 'Farhan Ahmad',
        datetime: new Date('2025-03-20T14:30:00'),
        lokasi: 'Ruang Organisasi Mahasiswa',
        kekerasan: 'Bullying',
        kronologi: 'Anggota senior organisasi sering membuat lelucon dan ejekan tentang logat daerah saya. Saat rapat terakhir, mereka meniru cara bicara saya dengan berlebihan dan membuat semua orang tertawa. Saya merasa sangat tidak nyaman dan dipermalukan.',
        bukti: '/dummy.jpg',
        tanggal: new Date('2025-03-25T11:20:00'),
        status: 'selesai'
    },
    {
        id: 1007,
        pelapor: 'Gita Nirmala',
        datetime: new Date('2025-04-15T09:00:00'),
        lokasi: 'Koridor Gedung Administrasi',
        kekerasan: 'Intimidasi',
        kronologi: 'Staf administrasi menolak memproses berkas pendaftaran beasiswa saya dengan alasan yang tidak jelas. Ketika saya mencoba menjelaskan bahwa semua persyaratan sudah lengkap, dia menjadi kasar dan mengancam akan "mempersulit" urusan akademik saya di kampus.',
        bukti: '/dummy1.webp',
        tanggal: new Date('2025-04-15T13:45:00'),
        status: 'baru'
    },
    {
        id: 1008,
        pelapor: 'Hadi Kusuma',
        datetime: new Date('2025-03-18T16:00:00'),
        lokasi: 'Parkiran Kampus',
        kekerasan: 'Pelecehan Seksual',
        kronologi: 'Saat berjalan menuju tempat parkir di malam hari setelah kuliah malam, seseorang mengikuti saya dari belakang dan berkali-kali mencoba menyentuh bagian tubuh pribadi saya. Ketika saya berbalik, orang tersebut berlari menjauh.',
        bukti: '/dummy2.jpg',
        tanggal: new Date('2025-03-19T08:30:00'),
        status: 'selesai'
    },
    {
        id: 1009,
        pelapor: 'Indah Permata',
        datetime: new Date('2025-04-22T10:15:00'),
        lokasi: 'Kelas B204, Gedung Perkuliahan',
        kekerasan: 'Pelecehan Verbal',
        kronologi: 'Dosen memberikan komentar merendahkan tentang kemampuan akademis saya di depan seluruh kelas, menyatakan bahwa saya "terlalu bodoh untuk jurusan ini" ketika saya tidak bisa menjawab pertanyaan dengan benar.',
        bukti: '/dummy.jpg',
        tanggal: new Date('2025-04-22T15:40:00'),
        status: 'diproses'
    },
    {
        id: 1010,
        pelapor: 'Joko Widodo',
        datetime: new Date('2025-04-05T13:30:00'),
        lokasi: 'Asrama Mahasiswa, Blok C',
        kekerasan: 'Kekerasan Fisik',
        kronologi: 'Senior asrama memaksa saya dan beberapa mahasiswa baru untuk melakukan push-up selama 30 menit tanpa henti sebagai "tradisi" penyambutan. Ketika saya tidak kuat melanjutkan, dia mendorong dan menendang kaki saya.',
        bukti: '/dummy1.webp',
        tanggal: new Date('2025-04-07T09:15:00'),
        status: 'baru'
    },
    {
        id: 1011,
        pelapor: 'Kartika Sari',
        datetime: new Date('2025-03-28T11:20:00'),
        lokasi: 'Kantin Utama Kampus',
        kekerasan: 'Diskriminasi',
        kronologi: 'Petugas kantin selalu melayani saya terakhir dan memberikan porsi yang lebih sedikit dibandingkan mahasiswa lain karena latar belakang etnis saya.',
        bukti: '/dummy.jpg',
        tanggal: new Date('2025-03-30T14:25:00'),
        status: 'diproses'
    },
    {
        id: 1012,
        pelapor: 'Lukman Hakim',
        datetime: new Date('2025-04-17T15:45:00'),
        lokasi: 'Laboratorium Kimia',
        kekerasan: 'Pelecehan Verbal',
        kronologi: 'Asisten laboratorium secara sengaja membuat lelucon tidak pantas tentang agama yang saya anut di depan seluruh kelas praktikum.',
        bukti: '/dummy2.jpg',
        tanggal: new Date('2025-04-18T10:30:00'),
        status: 'ditolak'
    },
    {
        id: 1013,
        pelapor: 'Mira Lestari',
        datetime: new Date('2025-03-05T09:30:00'),
        lokasi: 'Ruang Konseling',
        kekerasan: 'Pelecehan Seksual',
        kronologi: 'Konselor kampus membuat gerakan tidak pantas dan menyentuh pundak serta lutut saya berkali-kali selama sesi konseling pribadi.',
        bukti: '/dummy.jpg',
        tanggal: new Date('2025-03-06T13:20:00'),
        status: 'selesai'
    },
    {
        id: 1014,
        pelapor: 'Nadia Putri',
        datetime: new Date('2025-04-25T14:00:00'),
        lokasi: 'Gedung Olahraga, Ruang Ganti',
        kekerasan: 'Pelanggaran Privasi',
        kronologi: 'Seseorang memasang kamera tersembunyi di ruang ganti wanita dan menyebarkan rekaman tersebut di grup chat kampus.',
        bukti: '/dummy1.webp',
        tanggal: new Date('2025-04-26T09:10:00'),
        status: 'diproses'
    },
    {
        id: 1015,
        pelapor: 'Oscar Firmansyah',
        datetime: new Date('2025-03-22T16:30:00'),
        lokasi: 'Ruang Diskusi Perpustakaan',
        kekerasan: 'Intimidasi',
        kronologi: 'Sekelompok mahasiswa secara konsisten mengeluarkan saya dari kelompok diskusi dan mengancam akan melaporkan kontribusi saya sebagai tidak ada jika saya mencoba bergabung.',
        bukti: '/dummy2.jpg',
        tanggal: new Date('2025-03-24T11:45:00'),
        status: 'baru'
    }
];

// Adding remaining entries manually to complete 25 entries
detailedDummyData.push({
    id: 1016,
    pelapor: 'Rina Sulistiawati',
    datetime: new Date('2025-01-15T13:30:00'),
    lokasi: 'Gedung Fakultas Ekonomi, Ruang 201',
    kekerasan: 'Pelecehan Verbal',
    kronologi: 'Saat presentasi, dosen sengaja membuat komentar merendahkan tentang jenis kelamin yang saya pilih dan mempermalukan saya di depan semua mahasiswa.',
    bukti: '/dummy.jpg',
    tanggal: new Date('2025-01-17T09:15:00'),
    status: 'diproses'
});

detailedDummyData.push({
    id: 1017,
    pelapor: 'Bima Ardiansyah',
    datetime: new Date('2025-02-03T10:45:00'),
    lokasi: 'Perpustakaan Pusat, Area Diskusi',
    kekerasan: 'Diskriminasi',
    kronologi: 'Petugas perpustakaan secara terang-terangan menolak membantu saya menemukan bahan referensi dengan alasan saya tidak terlihat seperti mahasiswa yang serius.',
    bukti: '/dummy2.jpg',
    tanggal: new Date('2025-02-04T14:20:00'),
    status: 'selesai'
});

detailedDummyData.push({
    id: 1018,
    pelapor: 'Devi Kusuma',
    datetime: new Date('2025-02-18T16:30:00'),
    lokasi: 'Laboratorium Komputer, Ruang 305',
    kekerasan: 'Intimidasi',
    kronologi: 'Asisten lab mengancam akan memberikan nilai buruk jika saya tidak mau membantunya mengerjakan proyek pribadi di luar jam kuliah.',
    bukti: '/dummy1.webp',
    tanggal: new Date('2025-02-19T08:45:00'),
    status: 'baru'
});

detailedDummyData.push({
    id: 1019,
    pelapor: 'Fahri Ramadhan',
    datetime: new Date('2025-03-12T09:00:00'),
    lokasi: 'Kantin Kampus, Area Outdoor',
    kekerasan: 'Bullying',
    kronologi: 'Sekelompok mahasiswa senior melempar makanan ke arah saya dan teman-teman saya sambil mengejek daerah asal kami.',
    bukti: '/dummy.jpg',
    tanggal: new Date('2025-03-14T11:30:00'),
    status: 'ditolak'
});

detailedDummyData.push({
    id: 1020,
    pelapor: 'Gita Lestari',
    datetime: new Date('2025-03-26T14:15:00'),
    lokasi: 'Gedung Rektorat, Ruang Administrasi',
    kekerasan: 'Pelecehan Seksual',
    kronologi: 'Staf administrasi memegang tangan saya terlalu lama dan membuat komentar tidak pantas tentang penampilan fisik saya saat saya mengurus berkas pendaftaran beasiswa.',
    bukti: '/dummy2.jpg',
    tanggal: new Date('2025-03-28T10:00:00'),
    status: 'diproses'
});

detailedDummyData.push({
    id: 1021,
    pelapor: 'Hendra Gunawan',
    datetime: new Date('2025-04-03T11:45:00'),
    lokasi: 'Asrama Mahasiswa, Kamar 204',
    kekerasan: 'Kekerasan Fisik',
    kronologi: 'Teman sekamar saya memukul saya karena masalah sepele terkait penggunaan kamar mandi. Ini bukan kejadian pertama kalinya dia bertindak agresif.',
    bukti: '/dummy1.webp',
    tanggal: new Date('2025-04-05T16:30:00'),
    status: 'baru'
});

detailedDummyData.push({
    id: 1022,
    pelapor: 'Indira Sari',
    datetime: new Date('2025-04-10T08:30:00'),
    lokasi: 'Lapangan Olahraga, Area Basket',
    kekerasan: 'Diskriminasi',
    kronologi: 'Pelatih tim basket kampus menolak memberi saya kesempatan untuk bergabung dengan tim dengan alasan perempuan tidak cocok bermain basket, meskipun saya telah menunjukkan kemampuan yang setara.',
    bukti: '/dummy.jpg',
    tanggal: new Date('2025-04-12T13:45:00'),
    status: 'diproses'
});

detailedDummyData.push({
    id: 1023,
    pelapor: 'Joni Setiawan',
    datetime: new Date('2025-04-19T15:00:00'),
    lokasi: 'Ruang Seminar, Gedung Fakultas Hukum',
    kekerasan: 'Pelecehan Verbal',
    kronologi: 'Pembicara seminar membuat lelucon rasis tentang suku saya di depan seluruh peserta seminar. Beberapa mahasiswa tertawa, dan saya merasa sangat terhina.',
    bukti: '/dummy2.jpg',
    tanggal: new Date('2025-04-21T09:20:00'),
    status: 'selesai'
});

detailedDummyData.push({
    id: 1024,
    pelapor: 'Karina Maharani',
    datetime: new Date('2025-04-30T13:15:00'),
    lokasi: 'Gedung Fakultas Kedokteran, Laboratorium Biokimia',
    kekerasan: 'Pelanggaran Privasi',
    kronologi: 'Seorang mahasiswa mengambil foto saya secara diam-diam saat praktikum dan menyebarkannya di grup media sosial dengan komentar merendahkan.',
    bukti: '/dummy1.webp',
    tanggal: new Date('2025-05-02T10:30:00'),
    status: 'baru'
});

detailedDummyData.push({
    id: 1025,
    pelapor: 'Leo Hartono',
    datetime: new Date('2025-05-05T11:00:00'),
    lokasi: 'Ruang Organisasi Mahasiswa, Lantai 2',
    kekerasan: 'Intimidasi',
    kronologi: 'Ketua organisasi mahasiswa mengancam akan mencabut keanggotaan saya jika saya tidak mengikuti keputusan pribadi yang menguntungkan dirinya sendiri.',
    bukti: '/dummy.jpg',
    tanggal: new Date('2025-05-07T15:45:00'),
    status: 'diproses'
});

// Export the final data
export const laporanDummyData = detailedDummyData;