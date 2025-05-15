'use client'

import Image from "next/image";
import { Card } from "../common/card";
import { AuthInput } from "../common/input";
import { useState } from "react";
import { FilledButton } from "../common/button";
import Link from "next/link";

export function Login() {
    interface AuthInputDataType {
        email: string;
        password: string;
    }

    //controller
    const [authData, setAuthData] = useState<AuthInputDataType>({
        email: "",
        password: "",
    });

    const isDisable = !authData.email || !authData.password;


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("form data: ", authData);
    }

    return (
        <Card width="w-auto" height="h-auto" className="flex flex-col gap-6 p-10 justify-center items-center">
            <div className="flex flex-col gap-5 items-center">
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
                className="flex flex-col gap-6 w-[400px]"
            >
                <AuthInput
                    title="Email"
                    type="email"
                    placeholder="Masukkan email"
                    onChange={(event) => setAuthData({ ...authData, email: event.target.value })}
                    value={authData.email}
                />
                <AuthInput
                    title="Password"
                    type="password"
                    placeholder="Masukkan password"
                    onChange={(event) => setAuthData({ ...authData, password: event.target.value })}
                    value={authData.password}
                />
                <FilledButton
                    type="submit"
                    className="font-medium"
                    bgColor="bg-[#5C8D89]"
                    disabled={isDisable}
                >
                    Login
                </FilledButton>
            </form>
            <div className="flex flex-col gap-3 justify-center items-center">
                <p
                    className="font-medium"
                >
                    Belum memiliki akun? <Link href="/register" className="text-[#3CB371]">Register</Link></p>
                <Link href="login/forget" className="text-[#3CB371] font-medium">Lupa password?</Link>
            </div>
        </Card>
    );
}