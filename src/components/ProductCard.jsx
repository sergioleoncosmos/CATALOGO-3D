import { useState } from "react";

function ProductCard({ id, nombre, precio, imagenEstatica, imagenAnimada, onAgregarCarrito, onComprarDirecto }) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div 
            className='border rounded-xl flex flex-col bg-white shadow-md overflow-hidden transition-all hover:shadow-lg' 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. Zona de Imagen */}
            {isHovered ? (
                <img className="w-full h-48 object-contain" src={imagenAnimada} alt={`Animación de ${nombre}`} />
            ) : (
                <img className="w-full h-48 object-contain" src={imagenEstatica} alt={`Vista de ${nombre}`} />
            )}

            {/* 2. Zona de Información (El SKU va aquí, pequeño y sutil) */}
            <div className="p-4 flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-mono">SKU: {id}</span>
                <h3 className="font-bold text-lg text-gray-800">{nombre}</h3>
                <span className="text-xl font-black text-indigo-600">${precio.toLocaleString('es-CO')}</span>
            </div>

            {/* 3. Zona de Botones */}
            <div className="p-4 pt-0 flex gap-2 mt-auto">
                <button 
                    className="flex-1 bg-cyan-100 text-cyan-800 font-semibold py-2 px-4 rounded-lg hover:bg-cyan-200 transition-colors" 
                    onClick={() => onAgregarCarrito({ id, nombre, precio })}
                >
                    + Carrito
                </button>
                <button 
                    className="flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md" 
                    onClick={() => onComprarDirecto({ id, nombre, precio })}
                >
                    Comprar
                </button>
            </div>
        </div>
    );
}

export default ProductCard;