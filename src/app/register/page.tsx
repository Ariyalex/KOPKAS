'use client'

import { Register } from "@/components/auth_ui/register"
import { TransitionFadeIn } from "@/components/animation/transition"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
      <TransitionFadeIn>
        <Register />
      </TransitionFadeIn>
    </main>
  )
}