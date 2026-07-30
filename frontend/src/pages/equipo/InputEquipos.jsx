


export const InputEquipos = ({ type, name, placeholder, value, onchange, label, className }) => {
    return (

        <div className={className}>

            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onchange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>


    )
}