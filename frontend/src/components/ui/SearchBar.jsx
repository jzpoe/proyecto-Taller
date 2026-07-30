import { Search } from "lucide-react";

export const SearchBar = ({
    type = "text",
    placeholder,
    value,
    onChange,
}) => {
    return (
        <div className="flex items-center gap-3 w-full md:w-96 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500">

            <Search className="text-gray-500" size={20} />

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full outline-none"
            />

        </div>
    );
};