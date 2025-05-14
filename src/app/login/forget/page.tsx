'use client'

import { FormForget } from '@/components/forget_ui/form_forget'
import { SideForget } from '@/components/forget_ui/side_forget'

export default function ForgetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
      <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        <SideForget />
        
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#5C8D89] mb-6">Forgot Password</h1>
            <p className="text-gray-600 mb-8">
              Don't worry! Enter your email and we'll send you a reset link.
            </p>
            <FormForget />
            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <a href="/login" className="text-[#74B49B] hover:underline">
                Back to login
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}