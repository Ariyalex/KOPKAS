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
    status: 'new' | 'in_progress' | 'completed' | 'rejected';
}

export function StatusTag({ status }: StatusTagProps) {
    const getStatusConfig = (status: string): { label: string; className: string } => {
        const config = {
            'new': {
                label: 'Baru',
                className: 'bg-blue-100 text-blue-800'
            },
            'in_progress': {
                label: 'Diproses',
                className: 'bg-yellow-100 text-yellow-800'
            },
            'completed': {
                label: 'Selesai',
                className: 'bg-green-100 text-green-800'
            },
            'rejected': {
                label: 'Ditolak',
                className: 'bg-red-100 text-red-800'
            }
        }[status];

        return config || { label: 'Tidak diketahui', className: 'bg-gray-100 text-gray-800' };
    };

    const { label, className } = getStatusConfig(status);

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
            {label}
        </span>
    );
}