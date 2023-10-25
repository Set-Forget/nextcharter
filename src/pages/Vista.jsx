import SelectWithCheck from "../components/SelectWithCheck";

const student = [
  {
    domain: 'english',
    course: 'english1',
    incomplente: ["e1", "e2", "e3"],
    complente: ["e5", "e4"]
  }
]



export default function Vista() {
  return(
    <main className="flex-1 overflow-y-auto bg-gray-100 place-items-center pt-20 pr-8 pl-8">
      {/* <SelectWithCheck /> */}
      <div className="flex gap-2 justify-center mb-4">
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>

        <div className="w-24 h-24 bg-slate-400"></div>
        <div className="w-24 h-24 bg-slate-300"></div>
        
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>
        <div className="w-24 h-24 bg-blue-500"></div>

        <div className="w-24 h-24 bg-slate-400"></div>
        <div className="w-24 h-24 bg-slate-300"></div>
        
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-green-600"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
        <div className="w-24 h-24 bg-slate-200"></div>
      </div>
    </main>
  )
}