export interface ReportsItemDummy {
    id: string;
    pelapor: string;
    tanggal_kejadian: Date;
    status: 'new' | 'in_progress' | 'completed' | 'rejected';
    lokasi?: string;
    kekerasan?: string;
    kronologi?: string;
    bukti?: string;
    submitted: Date;
}
//item dummy report
export const ReportContentDummy: ReportsItemDummy[] = [
    {
        id: "2025-001",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-18"),
        lokasi: "Kantin Sekolah",
        kekerasan: "Verbal",
        kronologi: "Terjadi pertengkaran antara dua siswa saat jam istirahat",
        bukti: "video-kejadian-001.mp4",
        submitted: new Date("2025-05-20"),
        status: "in_progress"
    },
    {
        id: "2025-002",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-04-25"),
        lokasi: "Lapangan Olahraga",
        kekerasan: "Fisik",
        kronologi: "Siswa terjatuh dan terluka saat bermain sepak bola tanpa pengawasan",
        bukti: "foto-kejadian-002.jpg",
        submitted: new Date("2025-04-30"),
        status: "completed"
    },
    {
        id: "2025-003",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-08-20"),
        lokasi: "Ruang Kelas 2B",
        kekerasan: "Psikis",
        kronologi: "Seorang siswa dipermalukan di depan kelas oleh temannya",
        bukti: "kesaksian-001.pdf",
        submitted: new Date("2025-08-24"),
        status: "completed"
    },
    {
        id: "2025-004",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-21"),
        lokasi: "Toilet Sekolah",
        kekerasan: "Verbal dan Fisik",
        kronologi: "Terjadi intimidasi oleh senior terhadap junior di area toilet",
        bukti: "rekaman-audio-001.mp3",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-005",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-20"),
        lokasi: "Halaman Sekolah",
        kekerasan: "Fisik",
        kronologi: "Perkelahian antar siswa dari kelas berbeda",
        bukti: "video-kejadian-002.mp4",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-006",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-19"),
        lokasi: "Perpustakaan",
        kekerasan: "Psikis",
        kronologi: "Pemalakan buku dan peralatan tulis siswa lain",
        bukti: "foto-kejadian-003.jpg",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-007",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-18"),
        lokasi: "Laboratorium Komputer",
        kekerasan: "Digital",
        kronologi: "Penyebaran foto pribadi tanpa izin melalui media sosial",
        bukti: "screenshot-001.png",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-008",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-17"),
        lokasi: "Koridor Lantai 2",
        kekerasan: "Verbal",
        kronologi: "Penghinaan berbau SARA terhadap siswa minoritas",
        bukti: "rekaman-audio-002.mp3",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-009",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-16"),
        lokasi: "Ruang BK",
        kekerasan: "Psikis",
        kronologi: "Intimidasi berkelanjutan yang menyebabkan trauma",
        bukti: "laporan-psikolog-001.pdf",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-010",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-15"),
        lokasi: "Asrama Putra",
        kekerasan: "Fisik dan Psikis",
        kronologi: "Perpeloncoan pada siswa baru yang menimbulkan luka dan trauma",
        bukti: "video-dan-foto-004.zip",
        submitted: new Date("2025-05-22"),
        status: "in_progress"
    },
    {
        id: "2025-011",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-18"),
        lokasi: "Kantin Sekolah",
        kekerasan: "Verbal",
        kronologi: "Terjadi pertengkaran antara dua siswa saat jam istirahat",
        bukti: "video-kejadian-001.mp4",
        submitted: new Date("2025-05-20"),
        status: "in_progress"
    },
    {
        id: "2025-012",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-18"),
        lokasi: "Kantin Sekolah",
        kekerasan: "Verbal",
        kronologi: "Terjadi pertengkaran antara dua siswa saat jam istirahat",
        bukti: "video-kejadian-001.mp4",
        submitted: new Date("2025-05-20"),
        status: "in_progress"
    },
    {
        id: "2025-013",
        pelapor: "John Doe",
        tanggal_kejadian: new Date("2025-05-18"),
        lokasi: "Kantin Sekolah",
        kekerasan: "Verbal",
        kronologi: "Terjadi pertengkaran antara dua siswa saat jam istirahat",
        bukti: "video-kejadian-001.mp4",
        submitted: new Date("2025-05-20"),
        status: "in_progress"
    },
];
