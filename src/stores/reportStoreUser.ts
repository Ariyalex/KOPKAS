import { Database } from "@/lib/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { create } from "zustand"

export interface FormDataType {
  category_id: string
  incident_date: Date | null
  location: string
  description: string
  evidence_files: File | null
}

export interface FormItem {
  name: keyof FormDataType
  title: string
  placeholder?: string
  type: string
}

export interface Category {
  id: string
  name: string
}

interface Report {
    id: string
    title: string
    status: 'new' | 'in_progress' | 'completed' | 'rejected'
    created_at: string
    description: string
    location: string
    incident_date: string
    evidence_files: string[]
}

interface ReportStore {
    reports: Report[]
    currentReport: Report | null
    fetchReports: () => Promise<void>
    getReportById: (id: string) => Promise<void>
}

export const useReportStore = create<ReportStore>((set) => {
    const supabase = createClientComponentClient<Database>()

    return {
        reports: [],
        currentReport: null,
        fetchReports: async () => {
            const { data, error } = await supabase.from('reports').select('*')
            if (error) {
                console.error('Error fetching reports:', error)
            } else {
                set({ reports: data })
            }
        },
        getReportById: async (id: string) => {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching report by ID:', error)
            } else {
                set({ currentReport: data })
            }
        },
    }
})

interface FormStore {
  formData: FormDataType
  setFormData: (data: Partial<FormDataType>) => void
  resetForm: () => void
  formContent: FormItem[]
  categories: Category[]
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  generateReportId: () => string
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

export const useFormStore = create<FormStore>((set, get) => {
  const supabase = createClientComponentClient<Database>()

  return {
    formData: {
      category_id: "",
      incident_date: null,
      location: "",
      description: "",
      evidence_files: null,
    },
    setFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),
    resetForm: () =>
      set(() => ({
        formData: {
          category_id: "",
          incident_date: null,
          location: "",
          description: "",
          evidence_files: null,
        },
      })),
    formContent: [
      {
        name: "incident_date",
        title: "Tanggal dan Waktu kejadian",
        placeholder: "ex: 05/05/2025 12:12",
        type: "datetime",
      },
      {
        name: "location",
        title: "Lokasi Kejadian",
        placeholder: "ex: Fakultas Saintek",
        type: "text",
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
        type: "file",
      },
      {
        name: "description",
        title: "Kronologi Kejadian",
        placeholder: "Jelaskan kronologi kejadian",
        type: "textarea",
      },
    ],
    categories: [
      { id: "verbal", name: "Pelecehan verbal" },
      { id: "fisik", name: "Pelecehan fisik" },
      { id: "visual", name: "Pelecehan visual" },
      { id: "digital", name: "Pelecehan digital" },
      { id: "seksual", name: "Pemaksaan hubungan seksual" },
      { id: "lainnya", name: "Lainnya" },
    ],
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    generateReportId: () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let id = "R"
      for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return id
    },
    handleSubmit: async (e: React.FormEvent) => {
      e.preventDefault()
      set({ isLoading: true })
      const { formData, categories, resetForm, generateReportId } = get()

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          set({ isLoading: false })
          throw new Error("Sesi login tidak ditemukan. Silahkan login ulang.")
        }

        const selectedCategory = categories.find(
          (cat) => cat.id === formData.category_id
        )
        if (!selectedCategory) {
          set({ isLoading: false })
          throw new Error("Kategori tidak ditemukan")
        }

        if (
          !formData.category_id ||
          !formData.description ||
          !formData.incident_date ||
          !formData.location
        ) {
          set({ isLoading: false })
          throw new Error("Harap isi tanggal kejadian, lokasi, kategori, dan kronologi kejadian")
        }

        const reportId = generateReportId()

        const { data: existingReport } = await supabase
          .from("reports")
          .select("id")
          .eq("id", reportId)
          .single()

        if (existingReport) {
          set({ isLoading: false })
          return
        }

        let evidence_url = null
        if (formData.evidence_files) {
          const file = formData.evidence_files

          if (file.size > 5 * 1024 * 1024) {
            set({ isLoading: false })
            throw new Error("Ukuran file terlalu besar (maksimal 5MB)")
          }

          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
          ]
          if (!allowedTypes.includes(file.type)) {
            set({ isLoading: false })
            throw new Error("Tipe file tidak didukung (JPG, PNG, atau PDF)")
          }

          const fileExt = file.name.split(".").pop()
          const fileName = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`
          const filePath = `${session.user.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from("evidences")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            })

          if (uploadError) throw uploadError

          const {
            data: { publicUrl },
          } = supabase.storage.from("evidences").getPublicUrl(filePath)

          evidence_url = publicUrl
        }

        const { error: reportError } = await supabase
          .from("reports")
          .insert({
            id: reportId,
            reporter_id: session.user.id,
            title: `Laporan ${selectedCategory.name}`,
            description: formData.description,
            location: formData.location,
            incident_date: formData.incident_date?.toISOString(),
            category_id: formData.category_id,
            evidence_files: evidence_url ? [evidence_url] : null,
            status: "new",
          })
          .select()
          .single()

        if (reportError) throw reportError

        resetForm()
      } catch (error: any) {
        throw error
      } finally {
        set({ isLoading: false })
      }
    },
  }
})
