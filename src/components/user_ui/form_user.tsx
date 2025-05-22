'use client'

import React, { useState } from "react";
import { Notification, useToaster } from "rsuite";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { DateInput, Dropdown, FileInput, TextArea, TextField } from "../common/input";

// import keperluan backend
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface FormDataType {
    category_id: string;
    incident_date: Date | null;
    location: string;
    description: string;
    evidence_files: File | null;
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
        name: "incident_date",
        title: "Tanggal dan Waktu kejadian",
        placeholder: "ex: 05/05/2025 12:12",
        type: "datetime"
    },
    {
        name: "location",
        title: "Lokasi Kejadian",
        placeholder: "ex: Fakultas Saintek",
        type: "text"
    },
    {
        name: "category_id",
        title: "Jenis Kekerasan yang dialami",
        placeholder: "Pilih kekerasan yang dialami",
        type: "dropdown",
    },
    {
        name: "evidence_files",
        title: "Bukti Pendukung",
        placeholder: "Pilih file",
        type: "file"
    },
    {
        name: "description",
        title: "Kronologi Kejadian",
        placeholder: "Jelaskan kronologi kejadian",
        type: "textarea"
    },

]

const categories = [
    { id: "verbal", name: "Pelecehan verbal" },
    { id: "fisik", name: "Pelecehan fisik" },
    { id: "visual", name: "Pelecehan visual" },
    { id: "digital", name: "Pelecehan digital" },
    { id: "seksual", name: "Pemaksaan hubungan seksual" },
    { id: "lainnya", name: "Lainnya" }
];

function generateReportId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'R';
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

export function FormUser() {
    const supabase = createClientComponentClient<Database>()
    const router = useRouter()
    const toaster = useToaster();
    const [isLoading, setIsLoading] = useState(false)


    // controller form data
    const [formData, setFormData] = useState<FormDataType>({
        category_id: "",
        description: "",
        location: "",
        incident_date: null,
        evidence_files: null,
    });

    // reset form data
    const resetForm = () => {
        setFormData({
            category_id: "",
            description: "",
            location: "",
            incident_date: null,
            evidence_files: null,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toaster.push(
                    <Notification type="error" header="Error" closable>
                        Sesi login tidak ditemukan. Silahkan login ulang.
                    </Notification>
                )
                return
            }

            // Get category name for title
            const selectedCategory = categories.find(cat => cat.id === formData.category_id)
            if (!selectedCategory) {
                toaster.push(
                    <Notification type="error" header="Error" closable>
                        Kategori tidak ditemukan
                    </Notification>
                )
                return
            }

            // Generate title from category
            const title = `Laporan ${selectedCategory.name}`

            // Validate form
            if (!formData.category_id || !formData.description || !formData.incident_date || !formData.location) {
                toaster.push(
                    <Notification type="warning" header="Form belum lengkap" closable>
                        Harap isi tanggal kejadian, lokasi, kategori, dan kronologi kejadian
                    </Notification>
                )
                return
            }

            // Generate unique report ID
            const reportId = generateReportId();

            // Check if ID already exists
            const { data: existingReport } = await supabase
                .from('reports')
                .select('id')
                .eq('id', reportId)
                .single();

            if (existingReport) {
                // If ID exists, try submission again
                return handleSubmit(e);
            }

            // Upload evidence file if exists
            let evidence_url = null
            if (formData.evidence_files) {
                try {
                    const file = formData.evidence_files
                    
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        toaster.push(
                            <Notification type="error" header="Error" closable>
                                Ukuran file terlalu besar (maksimal 5MB)
                            </Notification>
                        )
                        return
                    }

                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
                    if (!allowedTypes.includes(file.type)) {
                        toaster.push(
                            <Notification type="error" header="Error" closable>
                                Tipe file tidak didukung (JPG, PNG, atau PDF)
                            </Notification>
                        )
                        return
                    }

                    const fileExt = file.name.split('.').pop()
                    // Generate unique filename
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
                    const filePath = `${session.user.id}/${fileName}`

                    // Upload file dengan menggunakan upsert
                    const { error: uploadError, data } = await supabase.storage
                        .from('evidences')
                        .upload(filePath, file, {
                            cacheControl: '3600',
                            upsert: false
                        })

                    if (uploadError) {
                        console.error('Upload error:', uploadError)
                        throw uploadError
                    }

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('evidences')
                        .getPublicUrl(filePath)

                    evidence_url = publicUrl

                } catch (uploadError: any) {
                    console.error('File upload error:', uploadError)
                    toaster.push(
                        <Notification type="error" header="Error" closable>
                            Gagal mengunggah file: {uploadError.message || 'Unknown error'}
                        </Notification>
                    )
                    return
                }
            }

            // Create report with custom ID
            const { data, error: reportError } = await supabase
                .from('reports')
                .insert({
                    id: reportId,
                    reporter_id: session.user.id,
                    title: title,
                    description: formData.description,
                    location: formData.location,
                    incident_date: formData.incident_date?.toISOString(),
                    category_id: formData.category_id,
                    evidence_files: evidence_url ? [evidence_url] : null,
                    status: 'new'
                })
                .select()
                .single()

            if (reportError) {
                console.error('Report submission error:', reportError)
                throw reportError
            }

            // Show success notification
            toaster.push(
                <Notification type="success" header="Laporan Terkirim" closable>
                    Laporan Anda telah berhasil dikirim dengan ID: {reportId}
                </Notification>
            )

            // Reset form and redirect
            resetForm()
            router.push('/user')

        } catch (error: any) {
            console.error('Error details:', error)
            toaster.push(
                <Notification type="error" header="Error" closable>
                    {error.message || 'Terjadi kesalahan saat mengirim laporan'}
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
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
                                    data={categories.map(cat => ({ 
                                        label: cat.name, 
                                        value: cat.id 
                                    }))}
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
                <div className="w-fit">
                    <FilledButton type="submit">
                        Kirim
                    </FilledButton>
                </div>
            </form>
        </Card >
    )
}