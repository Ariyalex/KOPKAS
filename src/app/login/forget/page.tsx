'use client'

import { ForgetPass } from '@/components/auth_ui/forgetPass'
import { TransitionFadeIn } from '@/components/animation/transition'

export default function ForgetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
      <TransitionFadeIn>
        <ForgetPass />
      </TransitionFadeIn>
    </main>
  )
}