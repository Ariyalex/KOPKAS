'use client'

import { FormLogin } from "@/components/login_ui/form_login"
import { SideLogin } from "@/components/login_ui/side_login"


export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
      <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        {/* Left Side - Image */}
        <SideLogin />

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#5C8D89] mb-6">Login</h1>
            <FormLogin />
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-[#74B49B] hover:underline cursor-pointer">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}