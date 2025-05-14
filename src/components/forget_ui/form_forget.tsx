import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function FormForget() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Reset password attempted for:', email)
    // Add your password reset logic here
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#5C8D89] mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#74B49B]"
          placeholder="Enter your email"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#74B49B] text-white py-3 px-4 rounded-lg hover:bg-[#5C8D89] transition-colors duration-200"
      >
        Reset Password
      </button>
    </form>
  )
}