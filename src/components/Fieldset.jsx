export default function Fieldset({ items }) {
  return (
    <div className="flex flex-1 flex-wrap">
      {items.map(item => (
        <div className="ml-3 text-sm leading-6 mb-2" key={item?.id}>
          <label htmlFor="comments" className="font-medium text-black">
            {item.name} <span className="text-gray-400">crs: {item.credit_value}</span>
          </label>
        </div>
      ))}                                
    </div>
  )
}
