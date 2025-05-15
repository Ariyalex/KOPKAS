// laporan_dummy.tsx
export interface LaporanData {
    id: number;
    pelapor: string;
    tanggal: Date;
    status: 'baru' | 'diproses' | 'selesai' | 'ditolak';
}

export const laporanDummyData: LaporanData[] = [
    {
        id: 1001,
        pelapor: 'Anisa Wijaya',
        tanggal: new Date('2025-03-15T10:30:00'),
        status: 'baru'
    },
    {
        id: 1002,
        pelapor: 'Budi Santoso',
        tanggal: new Date('2025-03-10T14:20:00'),
        status: 'diproses'
    },
    {
        id: 1003,
        pelapor: 'Citra Dewi',
        tanggal: new Date('2025-02-28T09:45:00'),
        status: 'selesai'
    },
    {
        id: 1004,
        pelapor: 'Dimas Pratama',
        tanggal: new Date('2025-04-05T16:15:00'),
        status: 'baru'
    },
    {
        id: 1005,
        pelapor: 'Eva Maharani',
        tanggal: new Date('2025-04-12T11:00:00'),
        status: 'diproses'
    },
    {
        id: 1006,
        pelapor: 'Fajar Nugroho',
        tanggal: new Date('2025-04-18T13:30:00'),
        status: 'baru'
    },
    {
        id: 1007,
        pelapor: 'Gita Purnama',
        tanggal: new Date('2025-03-22T10:00:00'),
        status: 'selesai'
    },
    {
        id: 1008,
        pelapor: 'Hadi Sulistyo',
        tanggal: new Date('2025-04-25T15:45:00'),
        status: 'ditolak'
    },
    {
        id: 1009,
        pelapor: 'Indah Permata',
        tanggal: new Date('2025-04-30T09:20:00'),
        status: 'diproses'
    },
    {
        id: 1010,
        pelapor: 'Joko Widodo',
        tanggal: new Date('2025-05-01T12:15:00'),
        status: 'ditolak'
    },
    {
        id: 1011,
        pelapor: 'Fufufafa',
        tanggal: new Date('2025-05-01T12:15:00'),
        status: 'ditolak'
    },
    {
        id: 1012,
        pelapor: 'Kartika Dewi',
        tanggal: new Date('2025-03-05T08:30:00'),
        status: 'selesai'
    },
    {
        id: 1013,
        pelapor: 'Lukman Hakim',
        tanggal: new Date('2025-04-02T13:45:00'),
        status: 'baru'
    },
    {
        id: 1014,
        pelapor: 'Merry Riana',
        tanggal: new Date('2025-03-20T09:15:00'),
        status: 'diproses'
    },
    {
        id: 1015,
        pelapor: 'Nanda Pratama',
        tanggal: new Date('2025-04-08T11:20:00'),
        status: 'selesai'
    },
    {
        id: 1016,
        pelapor: 'Oscar Permana',
        tanggal: new Date('2025-05-03T14:10:00'),
        status: 'baru'
    },
    {
        id: 1017,
        pelapor: 'Putri Rahayu',
        tanggal: new Date('2025-04-15T10:50:00'),
        status: 'diproses'
    },
    {
        id: 1018,
        pelapor: 'Qori Sandika',
        tanggal: new Date('2025-03-12T16:30:00'),
        status: 'ditolak'
    },
    {
        id: 1019,
        pelapor: 'Rudi Hartono',
        tanggal: new Date('2025-05-05T09:00:00'),
        status: 'baru'
    },
    {
        id: 1020,
        pelapor: 'Siti Nurhaliza',
        tanggal: new Date('2025-04-20T14:25:00'),
        status: 'selesai'
    },
    {
        id: 1021,
        pelapor: 'Tono Sudiro',
        tanggal: new Date('2025-03-25T11:45:00'),
        status: 'diproses'
    },
    {
        id: 1022,
        pelapor: 'Umar Bakri',
        tanggal: new Date('2025-05-08T15:20:00'),
        status: 'baru'
    },
    {
        id: 1023,
        pelapor: 'Vina Panduwinata',
        tanggal: new Date('2025-04-17T10:30:00'),
        status: 'ditolak'
    },
    {
        id: 1024,
        pelapor: 'Wahyu Agung',
        tanggal: new Date('2025-03-18T13:15:00'),
        status: 'selesai'
    },
    {
        id: 1025,
        pelapor: 'Xaverius Wijaya',
        tanggal: new Date('2025-05-10T09:45:00'),
        status: 'diproses'
    },
    {
        id: 1026,
        pelapor: 'Yanti Kusuma',
        tanggal: new Date('2025-04-22T11:10:00'),
        status: 'baru'
    },
    {
        id: 1027,
        pelapor: 'Zainudin Abdullah',
        tanggal: new Date('2025-03-30T16:00:00'),
        status: 'selesai'
    },
    {
        id: 1028,
        pelapor: 'Agus Santoso',
        tanggal: new Date('2025-05-12T10:15:00'),
        status: 'ditolak'
    },
    {
        id: 1029,
        pelapor: 'Bambang Suryo',
        tanggal: new Date('2025-04-24T14:40:00'),
        status: 'diproses'
    },
    {
        id: 1030,
        pelapor: 'Cindy Claudia',
        tanggal: new Date('2025-03-08T09:20:00'),
        status: 'baru'
    },
    {
        id: 1031,
        pelapor: 'Denny Sumargo',
        tanggal: new Date('2025-05-14T13:30:00'),
        status: 'selesai'
    },
    {
        id: 1032,
        pelapor: 'Erni Wijaya',
        tanggal: new Date('2025-04-27T15:50:00'),
        status: 'diproses'
    },
    {
        id: 1033,
        pelapor: 'Firman Utama',
        tanggal: new Date('2025-03-14T11:25:00'),
        status: 'ditolak'
    },
    {
        id: 1034,
        pelapor: 'Gunawan Prasetyo',
        tanggal: new Date('2025-05-02T10:40:00'),
        status: 'baru'
    },
    {
        id: 1035,
        pelapor: 'Hendra Setiawan',
        tanggal: new Date('2025-04-29T09:10:00'),
        status: 'selesai'
    },
    {
        id: 1036,
        pelapor: 'Intan Purnama',
        tanggal: new Date('2025-03-19T14:50:00'),
        status: 'diproses'
    },
    {
        id: 1037,
        pelapor: 'Joni Iskandar',
        tanggal: new Date('2025-05-07T11:35:00'),
        status: 'baru'
    },
    {
        id: 1038,
        pelapor: 'Kiki Amalia',
        tanggal: new Date('2025-04-11T16:20:00'),
        status: 'ditolak'
    },
    {
        id: 1039,
        pelapor: 'Lina Maryana',
        tanggal: new Date('2025-03-24T10:05:00'),
        status: 'selesai'
    },
    {
        id: 1040,
        pelapor: 'Maman Suherman',
        tanggal: new Date('2025-05-09T15:15:00'),
        status: 'diproses'
    },
    {
        id: 1041,
        pelapor: 'Nina Septiani',
        tanggal: new Date('2025-04-14T13:40:00'),
        status: 'baru'
    },
    {
        id: 1042,
        pelapor: 'Otong Surotong',
        tanggal: new Date('2025-03-29T09:30:00'),
        status: 'ditolak'
    },
    {
        id: 1043,
        pelapor: 'Prapti Antika',
        tanggal: new Date('2025-05-11T12:25:00'),
        status: 'selesai'
    },
    {
        id: 1044,
        pelapor: 'Rahmat Hidayat',
        tanggal: new Date('2025-04-19T14:15:00'),
        status: 'diproses'
    },
    {
        id: 1045,
        pelapor: 'Shinta Dewi',
        tanggal: new Date('2025-03-17T10:50:00'),
        status: 'baru'
    },
    {
        id: 1046,
        pelapor: 'Taufik Ismail',
        tanggal: new Date('2025-05-13T15:35:00'),
        status: 'selesai'
    },
    {
        id: 1047,
        pelapor: 'Uli Heriyanto',
        tanggal: new Date('2025-04-23T11:55:00'),
        status: 'diproses'
    },
    {
        id: 1048,
        pelapor: 'Vivi Adelia',
        tanggal: new Date('2025-03-27T16:10:00'),
        status: 'ditolak'
    },
    {
        id: 1049,
        pelapor: 'Wawan Setiawan',
        tanggal: new Date('2025-05-15T09:50:00'),
        status: 'baru'
    },
    {
        id: 1050,
        pelapor: 'Yulia Anggita',
        tanggal: new Date('2025-04-28T13:05:00'),
        status: 'selesai'
    }
];