'use client'

import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { HTMLInputTypeAttribute, useRef, useState } from "react";
import { DatePicker, SelectPicker, Stack } from "rsuite";
import { FilledButton } from "./button";
import { Card } from "./card";

interface TextFieldProps {
    title: string;
    placeholder?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextAreaProps {
    title: string;
    placeholder?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface DateInputProps {
    title: string;
    placeholder?: string;
    value: Date | null;
    onChange: (value: Date | null, event: React.SyntheticEvent<Element, Event>) => void;
}

interface DropdownProps {
    title: string;
    placeholder?: string;
    value: string;
    data: { label: string; value: string }[];
    onChange: (value: string | null, event?: React.SyntheticEvent<Element, Event>) => void;
}

interface FileInputProps {
    title: string;
    onChange: (file: File | null) => void;
}

export function TextField({ placeholder, title, value, onChange }: TextFieldProps) {
    return (
        <Card padding="p-3" width="w-full" className="flex flex-col gap-2 justify-between">
            <label className="font-bold text-lg text-[#5C8D89]">{title}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border-b-2 focus:border-[#74B49B] border-[#E5E7EB] px-2 py-1 outline-none"
            />
        </Card>
    );
}

export function DateInput({ title, placeholder, value, onChange }: DateInputProps) {
    return (
        <Card padding="p-3" width="w-full" className="flex flex-col gap-2 justify-between">
            <label className="font-bold text-lg text-[#5C8D89]">{title}</label>
            <Stack spacing={10} direction="column" alignItems="flex-start">
                <DatePicker
                    format="dd/MM/yyyy HH:mm"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </Stack>
        </Card>
    )
}

export function TextArea({ title, placeholder, value, onChange }: TextAreaProps) {
    return (
        <Card padding="p-3" width="w-full" className="flex flex-col gap-2 col-span-2 justify-between">
            <label className="font-bold text-lg text-[#5C8D89]">{title}</label>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border-2 resize-none rounded-md focus:border-[#74B49B] h-[150px] border-[#E5E7EB] px-2 py-1 outline-none"
            />
        </Card>
    )
}

export function Dropdown({ title, placeholder, value, data, onChange }: DropdownProps) {
    return (
        <Card padding="p-3" width="w-full" className="flex flex-col gap-2 justify-between">
            <label className="font-bold text-lg text-[#5C8D89]">{title}</label>
            <SelectPicker
                data={data}
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Select an option"}
                cleanable
                block
                className="w-full"
            />
        </Card>
    )
}

export function FileInput({ title, onChange }: FileInputProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to format file size
    const formatFileSize = (sizeInBytes: number): string => {
        if (sizeInBytes < 1024) {
            return `${sizeInBytes} bytes`;
        } else if (sizeInBytes < 1024 * 1024) {
            return `${(sizeInBytes / 1024).toFixed(2)} KB`;
        } else {
            return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setSelectedFile(file);
            setFileInfo({
                name: file.name,
                size: formatFileSize(file.size)
            });
        } else {
            setSelectedFile(null);
            setFileInfo(null);
        }
        onChange(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const resetFile = () => {
        setSelectedFile(null);
        setFileInfo(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }; return (
        <Card padding="p-3" width="w-full" className="flex flex-col gap-2 justify-between">
            <label className="font-bold text-lg text-[#5C8D89]">{title}</label>
            <div className="flex flex-row gap-2">
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <FilledButton type="button" onClick={handleButtonClick}>
                        Choose File
                    </FilledButton>
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={resetFile}
                            className="w-6 h-6 px-7 py-2 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                        >
                            <span className="text-gray-600 text-xs font-bold">clear</span>
                        </button>
                    )}
                </div>
                {fileInfo && (
                    <div className="mt-2 text-sm">
                        <p className="text-gray-700 truncate max-w-[300px]">File: <span className="font-medium">{fileInfo.name}</span></p>
                        <p className="text-gray-700">Size: <span className="font-medium">{fileInfo.size}</span></p>
                    </div>
                )}
            </div>
        </Card>
    )
}

interface AuthInputProps {
    title: string;
    type: HTMLInputTypeAttribute;
    placeholder?: string;
    bgColor?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    // menambahkan properti error untuk menampilkan pesan kesalahan
    error?: string;
}

export function AuthInput({ title, type, placeholder, value, bgColor, required = false, onChange }: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Only apply password toggling if the input is a password field
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-[#374151]">{title}</label>
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    required={required}
                    onChange={onChange}
                    className={clsx("border-[1px] h-[50px] w-full placeholder:font-medium rounded-md focus:border-[#74B49B]  border-[#3CB37133] px-2 py-1 outline-none", bgColor)}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 hover:text-green-800"
                    >
                        {showPassword ? (
                            <Eye />
                        ) : (
                            <EyeOff />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}