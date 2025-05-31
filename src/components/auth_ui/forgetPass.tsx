'use client'

import { Card } from "../common/card";
import { AuthInput } from "../common/input";
import { useState } from "react";
import { FilledButton } from "../common/button";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { SpinnerLoader } from "../common/loading";

export function ForgetPass() {
    const [isLoading, setIsLoading] = useState(false);

    interface AuthInputDataType {
        email: string;
    }

    //controller
    const [authData, setAuthData] = useState<AuthInputDataType>({
        email: "",
    });

    const isDisable = isLoading;

    //post
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        //supabase
        console.log("form data: ", authData);

        //udah selesai langsung loading false
        setIsLoading(false);
    }

    return (
        <Card width="w-auto" height="h-auto" bgColor="bg-[#E6FFFA]" className="flex flex-col gap-6 py-10 px-5 sm:px-10 justify-center items-center">
            <div className="flex flex-col w-auto h-auto gap-5 items-center">
                <KeyRound width={36} height={36} color="#3CB371" />
                <h1 className="text-3xl font-semibold text-[#1F2937]">
                    Pulihkan Password
                </h1>
                <p className="sm:w-[346px] w-[290px] text-center text-[#4B5563]">Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 sm:w-[400px] w-[290px]"
            >
                <AuthInput
                    title="Email"
                    type="email"
                    required={true}
                    placeholder="nama@email.com"
                    bgColor="bg-white"
                    onChange={(event) => setAuthData({ ...authData, email: event.target.value })}
                    value={authData.email}
                />
                <FilledButton
                    type="submit"
                    width="w-full"
                    className="font-medium"
                    bgColor="bg-[#5C8D89]"
                    disabled={isDisable}
                >
                    <div className='flex justify-center items-center'>
                        {isLoading ? <SpinnerLoader /> : <p>Reset Password</p>}
                    </div>
                </FilledButton>
            </form>
            <div >
                <Link href="/login" className="text-[#3CB371] font-medium flex flex-row justify-center items-center text-center"><ArrowLeft />  Kembali ke Login</Link>
            </div>
        </Card>
    );
}