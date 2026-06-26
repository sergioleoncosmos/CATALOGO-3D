function Navbar({ carrito, onComprarTodo, onVista, vistaCatalogo }) {
    // Cálculos matemáticos
    const total = carrito.reduce((acumulador, itemactual) => {
        return acumulador + itemactual.cantidad;
    }, 0);
    const precioTotal = carrito.reduce((acumulador, itemactual) => {
        return acumulador + (itemactual.precio * itemactual.cantidad);
    }, 0);

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-20 py-4 md:py-0 gap-4">
                    
                    {/* ZONA 1: Logo / Marca (Al hacer clic, te devuelve al catálogo) */}
                    <div 
                        className="flex-shrink-0 flex items-center cursor-pointer" 
                        onClick={() => onVista(true)}
                    >
                        <h2 className="text-2xl font-black text-indigo-600 tracking-tight">
                            Maker<span className="text-slate-800">3D</span>
                        </h2>
                    </div>

                    {/* ZONA 2: Controles e Indicadores */}
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        
                        {/* Insignia combinada: Cantidad y Precio */}
                        <div className="flex items-center bg-slate-50 rounded-full px-4 py-2 border border-slate-200 shadow-inner">
                            <span className="font-bold text-slate-600 mr-3 text-sm md:text-base">
                                🛒 {total} {total === 1 ? 'ítem' : 'ítems'}
                            </span>
                            <span className="font-black text-indigo-600 border-l border-slate-300 pl-3 text-sm md:text-base">
                                ${precioTotal.toLocaleString('es-CO')}
                            </span>
                        </div>

                        {/* Botón: Alternar Vista */}
                        <button 
                            onClick={() => onVista(!vistaCatalogo)}
                            className="bg-slate-800 text-white font-semibold py-2 px-5 rounded-full hover:bg-slate-700 transition-colors shadow-sm text-sm md:text-base"
                        >
                            {vistaCatalogo ? 'Ver Carrito' : 'Catálogo'}
                        </button>

                        {/* Botón: Comprar Rápido (Renderizado Condicional: Solo si hay ítems) */}
                        {carrito.length > 0 && (
                            <button 
                                onClick={() => onComprarTodo(carrito)}
                                className="bg-emerald-500 text-white font-bold py-2 px-5 rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-md text-sm md:text-base flex items-center"
                            >
                                Enviar Pedido
                            </button>
                        )}
                        
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;