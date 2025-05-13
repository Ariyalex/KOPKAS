
interface UserDummy {
    id: string;
    name: string;
    photo: string;
    role: string;
}

interface MessagesItemDummy {
    userId: string;
    message?: string;
    sent?: string;
}

// Data pengguna dummy untuk chat
export const DummyUserContent: UserDummy[] = [
    {
        id: "admin-1",
        name: "Admin Kopkas",
        photo: "/dummy1.webp",
        role: "admin"
    },
    {
        id: "psikolog-1",
        name: "Psikolog Artoria",
        photo: "/dummy2.jpg",
        role: "psikolog"
    },
    {
        id: "user-1",
        name: "Vestia Zeta",
        photo: "/dummy.jpg",
        role: "user"
    }
];

//item dummy pesan
export const MessagesContentDummy: MessagesItemDummy[] = [
    {
        userId: "admin-1",
        message: "Laporan kamu sedang diproses, silahkan tunggu beberapa waktu",
        sent: "2 jam yang lalu"
    },
    {
        userId: "psikolog-1",
        message: "Halo Zeta, gimana kabarmu?",
        sent: "Kemarin"
    },
    {
        userId: "admin-1",
        message: "Mohon tunggu 1-2 hari kerja untuk proses verifikasi",
        sent: "1 jam yang lalu"
    },
    {
        userId: "psikolog-1",
        message: "Semoga kamu baik-baik saja. Jika kamu membutuhkan bantuan, jangan ragu untuk menghubungi saya",
        sent: "Kemarin"
    },
    {
        userId: "admin-1",
        message: "Terima kasih atas laporannya, kami akan menindaklanjuti",
        sent: "30 menit yang lalu"
    },
    {
        userId: "admin-1",
        message: "Terima kasih atas laporannya, kami akan menindaklanjuti",
        sent: "30 menit yang lalu"
    }
];


