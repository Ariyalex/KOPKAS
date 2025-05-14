import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function FormRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registration attempted with:', formData)
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-[#5C8D89] mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#74B49B]"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#5C8D89] mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#74B49B]"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#5C8D89] mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#74B49B]"
          placeholder="Create a password"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5C8D89] mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#74B49B]"
          placeholder="Confirm your password"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 text-[#74B49B] focus:ring-[#74B49B] border-gray-300 rounded"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{' '}
          <a href="#" className="text-[#74B49B] hover:underline">Terms and Conditions</a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-[#74B49B] text-white py-3 px-4 rounded-lg hover:bg-[#5C8D89] transition-colors duration-200 cursor-pointer"
      >
        Create Account
      </button>
    </form>
  )
}