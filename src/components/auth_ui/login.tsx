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
import { SpinnerLoader } from "../common/loading";

export function Login() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const toaster = useToaster();
    const [isLoading, setIsLoading] = useState(false);

    interface AuthInputDataType {
        email: string;
        password: string;
    }

    interface ValidationErrors {
        email?: string;
        password?: string;
    }

    const [authData, setAuthData] = useState<AuthInputDataType>({
        email: "",
        password: "",
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

        if (!authData.password) {
            newErrors.password = 'Password tidak boleh kosong';
        }

        setErrors(newErrors);
        return newErrors;
    };

    const isDisable = !authData.email || !authData.password || isLoading;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        try {
            const errorsFound = validateAll();
            const isValid = Object.keys(errorsFound).length === 0;

            if (!isValid) {
                Object.values(errorsFound).forEach(msg => {
                    if (msg) {
                        showNotification('error', msg);
                    }
                });
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authData.email,
                password: authData.password,
            });

            if (error) throw error;


            if (data?.user) {
                // Get user role from public.users table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (userError) throw userError;

                //menyimpan session
                if (data.session) {
                    await supabase.auth.setSession({
                        access_token: data.session.access_token,
                        refresh_token: data.session.refresh_token,
                    });
                }

                // Redirect based on role
                if (userData?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/user');
                }
            }
        } catch (error: any) {
            let errorMessage = 'Login gagal';

            if (error?.message?.includes('Invalid login credentials')) {
                errorMessage = 'Email atau password salah';
            } else if (error?.message?.includes('Email not confirmed')) {
                errorMessage = 'Email belum diverifikasi. Silakan cek email Anda';
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
                <h1 className="text-3xl font-semibold text-[#1F2937]">Login ke KOPKAS</h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 w-[400px]"
            >
                <AuthInput
                    title="Email"
                    type="email"
                    placeholder="Masukkan email"
                    onChange={(event) => {
                        setAuthData({ ...authData, email: event.target.value });
                        setErrors({ ...errors, email: undefined });
                    }}
                    value={authData.email}
                    error={errors.email}
                />
                <AuthInput
                    title="Password"
                    type="password"
                    placeholder="Masukkan password"
                    onChange={(event) => {
                        setAuthData({ ...authData, password: event.target.value });
                        setErrors({ ...errors, password: undefined });
                    }}
                    value={authData.password}
                    error={errors.password}
                />
                <FilledButton
                    type="submit"
                    width="w-full"
                    className="font-medium flex justify-center items-center gap-2"
                    bgColor="bg-[#5C8D89]"
                    disabled={isDisable}
                >
                    <div className='flex justify-center items-center'>
                        {isLoading ? <SpinnerLoader /> : <p>Login</p>}
                    </div>
                </FilledButton>
            </form>
            <div className="flex flex-col gap-3 justify-center items-center">
                <p
                    className="font-medium"
                >
                    Belum memiliki akun?
                    <Link href="/register" className="text-[#3CB371]">Register</Link>
                </p>
                <Link href="login/forget" className="text-[#3CB371] font-medium">Lupa password?</Link>
            </div>
        </Card>
    );
}