'use client'

import { FormRegister } from "@/components/register_ui/form_register"
import { SideRegister } from "@/components/register_ui/side_register"


export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
      <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        <SideRegister />
        
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#5C8D89] mb-4">Register</h1>
            <FormRegister />
            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#74B49B] hover:underline cursor-pointer">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}