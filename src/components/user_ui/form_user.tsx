'use client'

import React, { useState } from "react";
import { Card } from "../common/card";
import { DateInput, Dropdown, FileInput, TextArea, TextField } from "../common/input";
import { FilledButton } from "../common/button";
import { Notification, useToaster } from "rsuite";

interface FormDataType {
    datetime: Date | null;
    lokasi: string;
    kekerasan: string;
    kronologi: string;
    bukti: File | null;
}

interface FormItem {
    name: keyof FormDataType;
    title: string;
    placeholder?: string;
    type: string;
}

//nav item
const FormContent: FormItem[] = [
    {
        name: "datetime",
        title: "Tanggal dan Waktu kejadian",
        placeholder: "ex: 05/05/2025 12:12",
        type: "datetime"
    },
    {
        name: "lokasi",
        title: "Lokasi Kejadian",
        placeholder: "ex: Fakultas Saintek",
        type: "text"
    },
    {
        name: "kekerasan",
        title: "Jenis Kekerasan yang dialami",
        placeholder: "Pilih kekerasan yang dialami",
        type: "dropdown",
    },
    {
        name: "bukti",
        title: "Bukti Pendukung",
        placeholder: "Pilih file",
        type: "file"
    },
    {
        name: "kronologi",
        title: "Kronologi Kejadian",
        placeholder: "Jelaskan kronologi kejadian",
        type: "textarea"
    },

]

const JenisKekerasan = [
    "Pelecehan verbal", "Pelecehan fisik", "Pelecehan visual", "Pelecehan digital", "Pemaksaan hubungan seksual", "Lainnya"
];

export function FormUser() {
    const toaster = useToaster();
    const message = (
        <Notification
            type="warning"
            header="Form belum lengkap" closable
        >
            ada beberapa form yang harus diisi
        </Notification>
    )

    //controller
    const [formData, setFormData] = useState<FormDataType>({
        datetime: new Date(),
        lokasi: "",
        kekerasan: "",
        kronologi: "",
        bukti: null,
    });

    const resetForm = () => {
        setFormData({
            datetime: null,
            lokasi: "",
            kekerasan: "",
            kronologi: "",
            bukti: null,
        })
    }

    //handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.datetime || !formData.lokasi || !formData.kekerasan) {
            toaster.push(message);
            return;
        }
        console.log("form data: ", formData);
        resetForm();
    }



    return (
        <Card
            className="flex flex-5/6 h-full flex-col"
        >
            <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                <h1 className="text-[#5C8D89] font-bold text-2xl">Form Laporan</h1>
            </div>

            <form
                onSubmit={handleSubmit}

            >
                <div className="py-4 grid grid-cols-2 gap-3">
                    {FormContent.map(({ title, placeholder, type, name }, index) => {
                        if (type == "text") {
                            return (
                                <TextField
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as string}
                                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                                />
                            );
                        } else if (type == "datetime") {
                            return (
                                <DateInput
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as Date}
                                    onChange={(value) => setFormData({ ...formData, [name]: value })}
                                />
                            )
                        } else if (type == "textarea") {
                            return (
                                <TextArea
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as string}
                                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                                />
                            )
                        } else if (type == "dropdown") {
                            return (
                                <Dropdown
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as string}
                                    data={JenisKekerasan.map(item => ({ label: item, value: item }))}
                                    onChange={(value) => setFormData({ ...formData, [name]: value || "" })}
                                />
                            )
                        } else if (type == "file") {
                            return (
                                <FileInput
                                    key={index}
                                    title={title}
                                    onChange={(file) => setFormData({ ...formData, [name]: file })}
                                />
                            )
                        }

                    })}
                </div>
                <FilledButton type="submit">
                    Kirim
                </FilledButton>
            </form>
        </Card >
    )
}