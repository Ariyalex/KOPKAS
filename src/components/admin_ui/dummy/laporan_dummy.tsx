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
    }
];