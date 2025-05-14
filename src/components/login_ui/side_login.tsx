import Image from 'next/image'

export function SideLogin() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#74B49B] items-center justify-center p-12">
      <div className="text-white text-center">
        <Image 
          src="/logo.svg" 
          alt="Kopkas Logo" 
          width={300} 
          height={300}
          className="mx-auto"
        />
        <h2 className="text-3xl font-bold mt-6">Welcome Back!</h2>
        <p className="mt-2">Please login to access your account</p>
      </div>
    </div>
  )
}