import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {

    if (!isOpen) return null;

    const modalSize = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl"
    }
    console.log(size);
    return (

        <div onClick={onClose} className="fixed inset-0 flex justify-center items-center bg-black/50 ">

            <div onClick={(e) => e.stopPropagation()} className={` bg-white rounded-lg shadow-xlw-11/12 ${modalSize[size]} max-h-[90vh] overflow-y-auto`}>

                <div className="flex justify-between items-center border-b pb-0 mb-0  p-4">
                    <h2 className="text-xl font-semibold">{title}</h2> <button onClick={onClose}> <X className=" text-red-800 size={18}  hover:bg-red-700" /> </button>
                </div>


                {children}
            </div>
        </div>


    )
}