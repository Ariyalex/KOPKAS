'use client'

import { ContentTerms } from '@/components/auth_ui/terms'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F4F9F4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#74B49B] py-6 px-8">
          <h1 className="text-3xl font-bold text-white">{ContentTerms.title}</h1>
          <p className="text-white mt-2">
            Mohon baca dengan seksama syarat dan ketentuan berikut
          </p>
        </div>

        <div className="p-8 space-y-8">
          {ContentTerms.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-semibold text-[#5C8D89]">
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="space-y-2 text-gray-600 list-disc pl-5">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">{section.content}</p>
              )}
            </div>
          ))}

          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link 
                href="/register"
                className="text-[#74B49B] hover:text-[#5C8D89] font-medium"
              >
                ← Kembali ke Pendaftaran
              </Link>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#74B49B] text-white rounded-lg hover:bg-[#5C8D89] transition-colors duration-200"
              >
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}