import clsx from "clsx";

interface TagProps {
    color: string;
    bgColor: string;
    children: React.ReactNode
}

export function Tag({ color, bgColor, children }: TagProps) {
    return (
        <div className={clsx("py-0.5 px-2 w-fit h-fit text-sm rounded-full", color, bgColor)}>
            {children}
        </div>
    )
}

interface StatusTagProps {
    status: 'baru' | 'diproses' | 'selesai' | 'ditolak' | string;
}

export function StatusTag({ status }: StatusTagProps) {
    let color: string;
    let statusText: string;
    let bgColor: string;
    let priorityOrder: number;

    switch (status) {
        case 'baru':
            color = 'text-blue-700';
            statusText = 'Baru';
            bgColor = "bg-blue-100";
            priorityOrder = 1;
            break;
        case 'diproses':
            color = 'text-orange-700';
            statusText = 'Diproses';
            bgColor = "bg-orange-100";
            priorityOrder = 2;
            break;
        case 'selesai':
            color = 'text-[#047857]';
            statusText = 'Selesai';
            bgColor = "bg-[#D1FAE5]";
            priorityOrder = 3;
            break;
        case 'ditolak':
            color = 'text-red-700';
            statusText = 'Ditolak';
            bgColor = "bg-red-100";
            priorityOrder = 4;
            break;
        default:
            color = 'text-gray-700';
            bgColor = "bg-gray-100";
            statusText = 'Tidak diketahui';
            priorityOrder = 999;
    }

    return (
        <div className="flex items-center justify-center">
            <Tag color={color} bgColor={bgColor}>
                {statusText}
            </Tag>
        </div>
    );
}