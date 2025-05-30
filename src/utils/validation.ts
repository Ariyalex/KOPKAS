export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateFile = (file: File, maxSize: number = 5 * 1024 * 1024, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']): { isValid: boolean; error?: string } => {
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `Ukuran file terlalu besar (maksimal ${Math.floor(maxSize / (1024 * 1024))}MB)`
        };
    }
    
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Tipe file tidak didukung'
        };
    }
    
    return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
    return input.replace(/[^\w\s]/gi, '');
};

