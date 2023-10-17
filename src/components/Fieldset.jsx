export default function Fieldset({ items }) {
  return (
    <div className="flex">
      {items.map(item => (
        <div className="ml-3 text-sm leading-6" key={item?.id}>
          <label htmlFor="comments" className="font-medium text-gray-900">
            {item.name} <span className="text-gray-400">crs: {item.credit_value}</span>
          </label>
        </div>
      ))}                                
    </div>
  )
}
