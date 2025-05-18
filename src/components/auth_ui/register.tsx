'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Notification, useToaster } from "rsuite";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { AuthInput } from "../common/input";

export function Register() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const toaster = useToaster();
    const [isLoading, setIsLoading] = useState(false);

    interface AuthInputDataType {
        email: string;
        full_name: string;
        password: string;
        confirmPass: string;
        terms: boolean;
    }

    interface ValidationErrors {
        email?: string;
        full_name?: string;
        password?: string;
        confirmPass?: string;
        terms?: string;
    }

    const [authData, setAuthData] = useState<AuthInputDataType>({
        email: "",
        full_name: "",
        password: "",
        confirmPass: "",
        terms: false,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
        toaster.push(
            <Notification type={type} header={type === 'success' ? 'Berhasil' : 'Error'} closable duration={4500}>
                {message}
            </Notification>,
            { placement: 'topCenter' }
        );
    };

    const validateAll = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        if (!authData.email) {
            newErrors.email = 'Email tidak boleh kosong';
        } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!authData.full_name) {
            newErrors.full_name = 'Nama lengkap tidak boleh kosong';
        }

        if (!authData.password) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (authData.password.length < 6) {
            newErrors.password = 'Password harus minimal 6 karakter';
        }

        if (!authData.confirmPass) {
            newErrors.confirmPass = 'Konfirmasi password tidak boleh kosong';
        } else if (authData.password !== authData.confirmPass) {
            newErrors.confirmPass = 'Konfirmasi password tidak sesuai';
        }

        if (!authData.terms) {
            newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
        }

        setErrors(newErrors);
        return newErrors;
    };

    const isDisable = !authData.email || !authData.full_name || !authData.password ||
        !authData.confirmPass || !authData.terms || isLoading;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        try {
            const errorsFound = validateAll();
            const isValid = Object.keys(errorsFound).length === 0;

            if (!isValid) {
                // Update error state agar UI merender ulang dengan error baru
                setErrors(errorsFound);

                // Tampilkan hanya error pertama (termasuk error `terms`)
                const firstErrorMsg = Object.values(errorsFound).find(msg => msg);
                if (firstErrorMsg) {
                    showNotification('error', firstErrorMsg);
                }
                return;
            }

            // Registrasi Supabase
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: authData.email,
                password: authData.password,
                options: {
                    data: {
                        full_name: authData.full_name,
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (data?.user) {
                showNotification('success', 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');

                setAuthData({
                    email: "",
                    full_name: "",
                    password: "",
                    confirmPass: "",
                    terms: false,
                });

                setTimeout(() => {
                    router.push('/login');
                }, 500);
            }
        } catch (error: any) {
            let errorMessage = 'Terjadi kesalahan saat registrasi';

            if (error?.message?.includes('already registered')) {
                errorMessage = 'Email sudah terdaftar';
                setErrors(prev => ({ ...prev, email: 'Email sudah terdaftar' }));
            }

            showNotification('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card width="w-auto" height="h-auto" className="flex flex-col gap-4 px-10 py-5 justify-center items-center">
            <div className="flex flex-col gap-3 items-center">
                <Image src={"/logo.svg"} alt="logo" width={33} height={33} className="w-[33px] h-[33px]" />
                <h1 className="text-3xl font-semibold text-[#1F2937]">Daftar ke KOPKAS</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px]">
                <AuthInput
                    title="Email"
                    type="email"
                    placeholder="Masukkan email"
                    onChange={(event) => setAuthData({ ...authData, email: event.target.value })}
                    value={authData.email}
                    error={errors.email}
                />
                <AuthInput
                    title="Username"
                    type="text"
                    placeholder="Buat Username"
                    onChange={(event) => setAuthData({ ...authData, full_name: event.target.value })}
                    value={authData.full_name}
                    error={errors.full_name}
                />
                <AuthInput
                    title="Password"
                    type="password"
                    placeholder="Masukkan password"
                    onChange={(event) => setAuthData({ ...authData, password: event.target.value })}
                    value={authData.password}
                    error={errors.password}
                />
                <AuthInput
                    title="Konfirmasi Password"
                    type="password"
                    placeholder="Konfirmasi password"
                    onChange={(event) => setAuthData({ ...authData, confirmPass: event.target.value })}
                    value={authData.confirmPass}
                    error={errors.confirmPass}
                />

                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="terms-checkbox"
                            checked={authData.terms}
                            onChange={(e) => setAuthData({ ...authData, terms: e.target.checked })}
                            className="mt-1"
                        />
                        <label htmlFor="terms-checkbox" className="text-sm text-gray-700">
                            Saya setuju dengan <Link href="/register/terms" className="text-[#3CB371] hover:underline">Syarat dan Ketentuan</Link> KOPKAS
                        </label>
                    </div>

                    {errors.terms && (
                        <p className="text-red-500 text-sm ml-6">{errors.terms}</p>
                    )}
                </div>

                <FilledButton
                    type="submit"
                    className="font-medium flex justify-center items-center gap-2"
                    bgColor="bg-[#5C8D89]"
                    disabled={isDisable}
                >
                    <span>{isLoading ? 'Loading...' : 'Register'}</span>
                </FilledButton>
            </form>

            <div className="flex flex-col gap-3 justify-center items-center">
                <p className="font-medium">
                    Sudah memiliki akun? <Link href="/login" className="text-[#3CB371]">Login</Link>
                </p>
            </div>
        </Card>
    );
}
