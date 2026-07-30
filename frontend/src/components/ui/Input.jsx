

export const Input = ({ label, type, name, placeholder, value, onChange }) => {




    return (
        <div >

            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>
    )
}