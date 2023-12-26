import Header from "../components/Header"

export default function LoginSuccess() {
  return(
    <div className="flex flex-col h-screen">
      <Header navItems={[]} />
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login successful, you can now close this tab
          </h2>
        </div>
      </div>
    </div>
  )
}