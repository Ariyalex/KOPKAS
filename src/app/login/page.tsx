'use client'

import { Login } from "@/components/auth_ui/login"
import { TransitionFadeIn } from "@/components/animation/transition"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F9F4]">
      <TransitionFadeIn>
        <Login />
      </TransitionFadeIn>
    </main>
  )
}