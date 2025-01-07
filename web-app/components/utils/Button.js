export default function Button({ 
    text = "Button", 
    bgColor = "bg-blue-600", 
    hoverColor = "hover:bg-blue-700", 
    textColor = "text-white",
    sizeY = 3,
    sizeX = 4,
    onClick 
}) {
    return (
        <button
            onClick={onClick}
            className={`px-${sizeX} py-${sizeY} ${bgColor} ${hoverColor} ${textColor} rounded-md mx-1 text-sm transition duration-300 ease-in-out shadow-sm hover:shadow-md`}
        >
            {text}
        </button>
    );
}