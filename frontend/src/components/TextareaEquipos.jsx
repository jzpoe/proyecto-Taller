export const TextareaEquipos = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    className = ""
}) => {

    return (

        <div className={className}>

            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>

            <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onchange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

    )

}