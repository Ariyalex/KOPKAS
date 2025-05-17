'use client'

import Image from "next/image";
import { Card } from "../common/card";
import { AuthInput } from "../common/input";
import { useState } from "react";
import { FilledButton } from "../common/button";
import Link from "next/link";
import { Notification, useToaster } from "rsuite";

export function Register() {
    const toaster = useToaster();

    const message = (
        <Notification
            type="warning"
            header="Password yang dimasukkan tidak sama!!" closable
        >
        </Notification>
    );

    interface AuthInputDataType {
        email: string;
        username: string;
        password: string;
        confirmPass: string;
        terms: boolean;
    };

    //controller
    const [authData, setAuthData] = useState<AuthInputDataType>({
        email: "",
        username: "",
        password: "",
        confirmPass: "",
        terms: false,
    });


    // Check if any required field is empty or terms not accepted
    const isDisable = !authData.email || !authData.password || !authData.confirmPass || !authData.terms;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (authData.password != authData.confirmPass) {
            toaster.push(message);
            return;
        } else {
            console.log("data user: ", authData);
        }
    }

    return (
        <Card width="w-auto" height="h-auto" className="flex flex-col gap-4 px-10 py-5 justify-center items-center">
            <div className="flex flex-col gap-3 items-center">
                <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={33}
                    height={33}
                    className="w-[33px] h-[33px]"
                />
                <h1 className="text-3xl font-semibold text-[#1F2937]">
                    Masuk ke KOPKAS
                </h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-[400px]"
            >
                <AuthInput
                    title="Email"
                    type="email"
                    placeholder="Masukkan email"
                    onChange={(event) => setAuthData({ ...authData, email: event.target.value })}
                    value={authData.email}
                />
                <AuthInput
                    title="Username"
                    type="text"
                    placeholder="Buat Username"
                    onChange={(event) => setAuthData({ ...authData, username: event.target.value })}
                    value={authData.username}
                />
                <AuthInput
                    title="Password"
                    type="password"
                    placeholder="Masukkan password"
                    onChange={(event) => setAuthData({ ...authData, password: event.target.value })}
                    value={authData.password}
                />
                <AuthInput
                    title="Konfirmasi Password"
                    type="password"
                    placeholder="Konfirmasi password" onChange={(event) => setAuthData({ ...authData, confirmPass: event.target.value })}
                    value={authData.confirmPass}
                />

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

                <FilledButton
                    type="submit"
                    className="font-medium flex justify-center items-center gap-2"
                    bgColor="bg-[#5C8D89]"
                    disabled={isDisable}
                >
                    <span>Register</span>
                </FilledButton>
            </form>
            <div className="flex flex-col gap-3 justify-center items-center">
                <p
                    className="font-medium"
                >
                    Belum memiliki akun? <Link href="/login" className="text-[#3CB371]">Login</Link></p>
            </div>
        </Card>
    );
}