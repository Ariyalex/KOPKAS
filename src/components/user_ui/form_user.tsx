'use client';

import { useFormStore } from "@/stores/reportStoreUser";
import { useRouter } from "next/navigation";
import { Notification, useToaster } from "rsuite";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { DateInput, Dropdown, FileInput, TextArea, TextField } from "../common/input";

export function FormUser() {
    const router = useRouter()  // Memanggil useRouter di komponen
    const toaster = useToaster() // Memanggil useToaster di komponen
    const {
        formData,
        setFormData,
        resetForm,
        formContent,
        categories,
        isLoading,
        handleSubmit,
    } = useFormStore()

    const submitHandler = async (e: React.FormEvent) => {
        try {
            await handleSubmit(e) // Memanggil handleSubmit dari store
            toaster.push(
                <Notification type="success" header="Laporan Terkirim" closable>
                    Laporan Anda telah berhasil dikirim
                </Notification>
            )
            resetForm()
            router.push("/user") // Navigasi setelah pengiriman berhasil
        } catch (error: any) {
            toaster.push(
                <Notification type="error" header="Error" closable>
                    {error.message || "Terjadi kesalahan saat mengirim laporan"}
                </Notification>
            )
        }
    }

    return (
        <Card className="flex flex-5/6 h-full py-5 overflow-y-scroll flex-col">
            <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                <h1 className="text-[#5C8D89] font-bold text-2xl">Form Laporan</h1>
            </div>

            <form onSubmit={submitHandler}>
                <div className="py-4 md:grid md:grid-cols-2 flex flex-col h-auto gap-3">
                    {formContent.map(({ title, placeholder, type, name }, index) => {
                        if (type === "text") {
                            return (
                                <TextField
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as string}
                                    onChange={(e) => setFormData({ [name]: e.target.value })}
                                />
                            )
                        }
                        if (type === "datetime") {
                            return (
                                <DateInput
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as Date}
                                    onChange={(value) => setFormData({ [name]: value })}
                                />
                            )
                        }
                        if (type === "textarea") {
                            return (
                                <TextArea
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as string}
                                    onChange={(e) => setFormData({ [name]: e.target.value })}
                                />
                            )
                        }
                        if (type === "dropdown") {
                            return (
                                <Dropdown
                                    key={index}
                                    title={title}
                                    placeholder={placeholder}
                                    value={formData[name] as string}
                                    data={categories.map((cat) => ({
                                        label: cat.name,
                                        value: cat.id,
                                    }))}
                                    onChange={(value) => setFormData({ [name]: value || "" })}
                                />
                            )
                        }
                        if (type === "file") {
                            return (
                                <FileInput
                                    key={index}
                                    title={title}
                                    onChange={(file) => setFormData({ [name]: file })}
                                />
                            )
                        }
                        return null
                    })}
                </div>
                <div className="w-fit">
                    <FilledButton type="submit" disabled={isLoading}>
                        {isLoading ? "Mengirim..." : "Kirim"}
                    </FilledButton>
                </div>
            </form>
        </Card>
    )
}
