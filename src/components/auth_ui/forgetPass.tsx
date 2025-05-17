'use client'

import { Card } from "../common/card";
import { AuthInput } from "../common/input";
import { useState } from "react";
import { FilledButton } from "../common/button";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export function ForgetPass() {
    interface AuthInputDataType {
        email: string;
    }

    //controller
    const [authData, setAuthData] = useState<AuthInputDataType>({
        email: "",
    });

    const isDisable = !authData.email


    //post
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("form data: ", authData);
    }

    return (
        <Card width="w-auto" height="h-auto" bgColor="bg-[#E6FFFA]" className="flex flex-col gap-6 p-10 justify-center items-center">
            <div className="flex flex-col gap-5 items-center">
                <KeyRound width={36} height={36} color="#3CB371" />
                <h1 className="text-3xl font-semibold text-[#1F2937]">
                    Pulihkan Kata Sandi
                </h1>
                <p className="w-[346px] text-center text-[#4B5563]">Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 w-[400px]"
            >
                <AuthInput
                    title="Email"
                    type="email"
                    placeholder="nama@email.com"
                    bgColor="bg-white"
                    onChange={(event) => setAuthData({ ...authData, email: event.target.value })}
                    value={authData.email}
                />
                <FilledButton
                    type="submit"
                    className="font-medium"
                    bgColor="bg-[#5C8D89]"
                    disabled={isDisable}
                >
                    Reset Password
                </FilledButton>
            </form>
            <div className="flex flex-col gap-3 justify-center items-center">
                <Link href="/login" className="text-[#3CB371] font-medium flex flex-row justify-center items-center text-center"><ArrowLeft />  Kembali ke Login</Link>
            </div>
        </Card>
    );
}