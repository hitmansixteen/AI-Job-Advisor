export default function Button({ 
    text = "Button", 
    bgColor = "bg-blue-600", 
    hoverColor = "hover:bg-blue-700", 
    textColor = "text-white",
    onClick 
}) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2 ${bgColor} ${hoverColor} ${textColor} rounded-md mx-1 text transition duration-300 ease-in-out shadow-sm hover:shadow-md`}
        >
            {text}
        </button>
    );
}
