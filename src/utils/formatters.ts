export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    
    return new Date(date).toLocaleDateString('id-ID', options || defaultOptions);
};

export const formatDateTime = (date: string | Date) => {
    const dateObj = new Date(date);
    return {
        date: dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }),
        time: dateObj.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
};

export const getStatusLabel = (status: string): string => {
    const statusMap = {
        'new': 'Baru',
        'in_progress': 'Diproses',
        'completed': 'Selesai',
        'rejected': 'Ditolak'
    };
    
    return statusMap[status as keyof typeof statusMap] || 'Tidak diketahui';
};

export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
