export default function ResumeItem({ domainName, selectedCourse, onDelete, selectedStudent, exist }) {
  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div className={`flex w-32 flex-shrink-0 items-center justify-center ${exist ? "bg-nextcolor opacity-70" : "bg-nextcolor" } rounded-l-md text-sm font-medium text-white`}>{selectedStudent.name.split(',')}</div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a href="#" className="font-medium text-gray-900 hover:text-gray-600">{domainName}</a>
          <p className="text-gray-500">Courses: {selectedCourse.map((person) => person.name).join(', ')}</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button onClick={onDelete} type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span className="sr-only">Open options</span>
            X
          </button>
        </div>
      </div>
    </li>  
  )
}