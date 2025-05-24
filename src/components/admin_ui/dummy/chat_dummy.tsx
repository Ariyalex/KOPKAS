// filepath: d:\CODING-EXERCISE\next\kopkas\src\components\admin_ui\dummy\chat_dummy.tsx

interface UserDummy {
    id: string;
    name: string;
    photo: string;
    role: string;
}

interface ChatDummy {
    id: string;
    userId: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
}

interface MessageDummy {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    timestamp: string;
    read: boolean;
}

// Data pengguna dummy
export const DummyUsers: UserDummy[] = [
    {
        id: "admin-1",
        name: "Admin Kopkas",
        photo: "/dummy1.webp",
        role: "admin"
    },
    {
        id: "user-1",
        name: "Vestia Zeta",
        photo: "/dummy.jpg",
        role: "user"
    },
    {
        id: "user-2",
        name: "Artoria",
        photo: "/dummy2.jpg",
        role: "user"
    },
    {
        id: "user-3",
        name: "Altria",
        photo: "/dummy1.webp",
        role: "user"
    },
    {
        id: "user-4",
        name: "Zeta",
        photo: "/dummy.jpg",
        role: "user"
    },

];

// Data chat dummy untuk admin
export const AdminChatsDummy: ChatDummy[] = [
    {
        id: "chat-1",
        userId: "user-1", // Vestia Zeta
        lastMessage: "Terima kasih atas informasinya",
        timestamp: "10:45 AM",
        unread: 0
    },
    {
        id: "chat-2",
        userId: "user-2", // Artoria
        lastMessage: "Bagaimana dengan pengajuan saya sebelumnya?",
        timestamp: "Kemarin",
        unread: 2
    },
    {
        id: "chat-3",
        userId: "user-3", // Altria
        lastMessage: "Saya masih menunggu verifikasi dokumen",
        timestamp: "2 hari lalu",
        unread: 0
    },
    {
        id: "chat-4",
        userId: "user-4", // Artoria
        lastMessage: "when yah?",
        timestamp: "Kemarin",
        unread: 1
    },
];

// Data pesan dalam chat
export const ChatMessagesDummy: Record<string, MessageDummy[]> = {
    "chat-1": [
        {
            id: "msg-1",
            chatId: "chat-1",
            senderId: "user-1",
            content: "Halo admin, saya ingin menanyakan tentang status pengajuan pinjaman saya",
            timestamp: "10:30 AM",
            read: true
        },
        {
            id: "msg-2",
            chatId: "chat-1",
            senderId: "admin-1",
            content: "Selamat pagi Vestia Zeta, pengajuan pinjaman Anda sedang dalam proses verifikasi. Mohon tunggu 1-2 hari kerja",
            timestamp: "10:35 AM",
            read: true
        },
        {
            id: "msg-3",
            chatId: "chat-1",
            senderId: "user-1",
            content: "Baik, berapa lama biasanya proses verifikasi membutuhkan waktu?",
            timestamp: "10:40 AM",
            read: true
        },
        {
            id: "msg-4",
            chatId: "chat-1",
            senderId: "admin-1",
            content: "Proses verifikasi biasanya membutuhkan waktu 2-3 hari kerja. Jika ada dokumen yang perlu dilengkapi, kami akan menghubungi Anda kembali",
            timestamp: "10:42 AM",
            read: true
        },
        {
            id: "msg-5",
            chatId: "chat-1",
            senderId: "user-1",
            content: "Terima kasih atas informasinya",
            timestamp: "10:45 AM",
            read: false
        },
        {
            id: "msg-5",
            chatId: "chat-1",
            senderId: "user-1",
            content: "Terima kasih atas informasinya",
            timestamp: "10:45 AM",
            read: false
        }
    ],
    "chat-2": [
        {
            id: "msg-6",
            chatId: "chat-2",
            senderId: "user-2",
            content: "Selamat siang admin, saya Kaela Kovalskia. Saya sudah melengkapi semua dokumen yang diminta",
            timestamp: "Kemarin, 13:15 PM",
            read: true
        },
        {
            id: "msg-7",
            chatId: "chat-2",
            senderId: "admin-1",
            content: "Terima kasih Kaela. Kami akan segera memeriksa dokumen yang telah Anda kirimkan",
            timestamp: "Kemarin, 13:30 PM",
            read: true
        },
        {
            id: "msg-8",
            chatId: "chat-2",
            senderId: "user-2",
            content: "Bagaimana dengan pengajuan saya sebelumnya?",
            timestamp: "Kemarin, 15:45 PM",
            read: false
        },
        {
            id: "msg-9",
            chatId: "chat-2",
            senderId: "user-2",
            content: "Mohon info terkait status pengajuan sebelumnya juga",
            timestamp: "Kemarin, 16:00 PM",
            read: false
        }
    ],
    "chat-3": [
        {
            id: "msg-10",
            chatId: "chat-3",
            senderId: "user-3",
            content: "Halo admin, saya sudah mengirimkan semua dokumen 3 hari lalu",
            timestamp: "2 hari lalu, 09:20 AM",
            read: true
        },
        {
            id: "msg-11",
            chatId: "chat-3",
            senderId: "admin-1",
            content: "Selamat pagi Kobo, terima kasih telah mengirimkan dokumennya. Kami sedang melakukan verifikasi",
            timestamp: "2 hari lalu, 09:45 AM",
            read: true
        },
        {
            id: "msg-12",
            chatId: "chat-3",
            senderId: "user-3",
            content: "Baik, berapa lama proses verifikasinya?",
            timestamp: "2 hari lalu, 10:00 AM",
            read: true
        },
        {
            id: "msg-13",
            chatId: "chat-3",
            senderId: "admin-1",
            content: "Proses verifikasi membutuhkan waktu sekitar 2-3 hari kerja",
            timestamp: "2 hari lalu, 10:10 AM",
            read: true
        },
        {
            id: "msg-14",
            chatId: "chat-3",
            senderId: "user-3",
            content: "Saya masih menunggu verifikasi dokumen",
            timestamp: "2 hari lalu, 14:30 PM",
            read: true
        }
    ],
    "chat-4": [
        {
            id: "msg-1",
            chatId: "chat-4",
            senderId: "user-4",
            content: "Halo admin, saya ingin menanyakan tentang status pengajuan pinjaman saya",
            timestamp: "10:30 AM",
            read: true
        },
        {
            id: "msg-2",
            chatId: "chat-4",
            senderId: "admin-1",
            content: "Selamat pagi Vestia Zeta, pengajuan pinjaman Anda sedang dalam proses verifikasi. Mohon tunggu 4-2 hari kerja",
            timestamp: "10:35 AM",
            read: true
        },
        {
            id: "msg-3",
            chatId: "chat-4",
            senderId: "user-4",
            content: "Baik, berapa lama biasanya proses verifikasi membutuhkan waktu?",
            timestamp: "10:40 AM",
            read: true
        },
        {
            id: "msg-4",
            chatId: "chat-4",
            senderId: "admin-1",
            content: "Proses verifikasi biasanya membutuhkan waktu 2-3 hari kerja. Jika ada dokumen yang perlu dilengkapi, kami akan menghubungi Anda kembali",
            timestamp: "10:42 AM",
            read: true
        },
        {
            id: "msg-5",
            chatId: "chat-4",
            senderId: "user-4",
            content: "Terima kasih atas informasinya",
            timestamp: "10:45 AM",
            read: false
        }
    ],
};

