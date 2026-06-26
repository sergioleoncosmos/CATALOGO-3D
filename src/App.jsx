import ProductCard from './components/ProductCard'
import { useState } from 'react';
import Navbar from './components/Navbar';
import { inventario } from './inventarioData';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState('defecto');
  const [vistaCatalogo, setVistaCatalogo] = useState(true);

  // Malla de filtrado y ordenamiento
  const productosFiltrados = inventario.filter((producto) => {
    return filtroActivo === 'Todos' || filtroActivo === producto.categoria;
  }).sort((a, b) => {
    switch (ordenPrecio) {
      case 'menor_mayor':
        return a.precio - b.precio;
      case 'mayor_menor':
        return b.precio - a.precio;
      default:
        return 0;
    }
  });

  // Cálculo del total general para mostrar en la interfaz del carrito
  const totalCarrito = carrito.reduce((acumulador, item) => {
    return acumulador + (item.precio * item.cantidad);
  }, 0);

  // Motor de envío a WhatsApp
  function enviarPedido(datos) {
    const productosAProcesar = Array.isArray(datos) ? datos : [datos];
    let dineroTotal = 0;
    let listaProductosTexto = "";
    productosAProcesar.forEach((item) => {
      const cantidadReal = item.cantidad !== undefined ? item.cantidad : 1;
      dineroTotal = dineroTotal + (cantidadReal * item.precio);
      listaProductosTexto += `- ${cantidadReal} x ${item.nombre} ($${(item.precio * cantidadReal).toLocaleString('es-CO')})\n`;
    });
    const mensajeCompleto = `¡Hola! Me interesa el siguiente pedido:\n${listaProductosTexto}\nTotal: $${dineroTotal.toLocaleString('es-CO')}`;
    
    console.log(mensajeCompleto); 
    const numeroWhatsapp = "573025825338";
    const textoCodificado = encodeURIComponent(mensajeCompleto);
    const urlFinal = `https://wa.me/${numeroWhatsapp}?text=${textoCodificado}`;
    window.open(urlFinal, '_blank');
  }

  // Lógica de Carrito
  function onAgregarCarrito(valores) {
    const indice = carrito.findIndex((item) => item.id === valores.id);
    if (indice === -1) {
      setCarrito([...carrito, { ...valores, cantidad: 1 }]);
    } else {
      const nuevoCarrito = carrito.map((item) => {
        return item.id === valores.id ? { ...item, cantidad: item.cantidad + 1 } : item;
      });
      setCarrito(nuevoCarrito);
    }
  }

  function eliminarProductoDelCarro(idEliminar) {
    const objetosActualesCarrito = carrito.filter((producto) => {
      return producto.id !== idEliminar;
    });
    setCarrito(objetosActualesCarrito);
  }

  function agregarQuitarCantidadCarro(idModificar, accion) {
    const nuevoCarrito = carrito.map((producto) => {
      if (producto.id === idModificar) {
        switch (accion) {
          case 'sumar':
            return { ...producto, cantidad: producto.cantidad + 1 };
          case 'restar':
            return { ...producto, cantidad: producto.cantidad - 1 };
          default:
            return producto;
        }
      }
      return producto;
    }).filter((producto) => {
      return producto.cantidad > 0;
    });
    setCarrito(nuevoCarrito);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      
      <Navbar 
        carrito={carrito} 
        onComprarTodo={enviarPedido} 
        onVista={(valor) => setVistaCatalogo(valor)} 
        vistaCatalogo={vistaCatalogo} 
      />
      
      
      
      {vistaCatalogo ? (
        <>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-slate-900 my-10 tracking-tight">
          Catálogo de Impresión 3D
          </h1>
          {/* BARRA DE HERRAMIENTAS / FILTROS */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 px-4">
            <select 
              value={filtroActivo} 
              onChange={(e) => setFiltroActivo(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all w-full md:w-auto"
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Personalizados">Crea tu funko pop</option>
              <option value="Llaveros">Llaveros</option>
              <option value="Sujetadores">Sujetadores de objetos</option>
              <option value="Figuras">Figuras</option>
              <option value="Porta_llaves">Sujetador de llaves</option>
              <option value="Maceta">Macetas/plantas</option>
            </select>
            
            <select 
              value={ordenPrecio} 
              onChange={(e) => setOrdenPrecio(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all w-full md:w-auto"
            >
              <option value="defecto">Por Defecto</option>
              <option value="menor_mayor">Precio menor a mayor</option>
              <option value="mayor_menor">Precio mayor a menor</option>
            </select>
          </div>

          {/* CUADRÍCULA DEL CATÁLOGO */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-7xl mx-auto'>
            {productosFiltrados.map((producto) => (
              <ProductCard 
                key={producto.id} 
                {...producto} 
                onAgregarCarrito={onAgregarCarrito} 
                onComprarDirecto={enviarPedido} 
              />
            ))}
          </div>
        </>
      ) : (
        
        /* INTERFAZ DEL CARRITO DE COMPRAS */
        <div className="max-w-4xl mx-auto p-6 md:p-8 mt-10 bg-white rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 border-b pb-4">Tu Carrito de Compras</h2>
          
          {carrito.map((objetos) => (
            <div key={objetos.id} className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-5 mb-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="font-bold text-lg">{objetos.nombre}</p>
                <p className="text-slate-500">Subtotal: ${(objetos.precio * objetos.cantidad).toLocaleString('es-CO')}</p>
              </div>

              <div className="flex gap-2 items-center">
                <button 
                  className="w-10 h-10 flex justify-center items-center bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => agregarQuitarCantidadCarro(objetos.id, 'restar')}
                > - </button>
                
                <span className="font-bold text-lg w-8 text-center">{objetos.cantidad}</span>
                
                <button 
                  className="w-10 h-10 flex justify-center items-center bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => agregarQuitarCantidadCarro(objetos.id, 'sumar')}
                > + </button>
                
                <button 
                  className="w-10 h-10 flex justify-center items-center bg-red-50 text-red-600 rounded-lg shadow-sm border border-red-100 hover:bg-red-100 hover:text-red-700 transition-colors ml-4"
                  onClick={() => eliminarProductoDelCarro(objetos.id)}
                > 🗑️ </button>
              </div>
            </div>
          ))}

          {/* SECCIÓN FINAL: TOTAL Y BOTÓN WHATSAPP */}
          {carrito.length > 0 ? (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-2xl font-extrabold text-slate-900 text-right mb-6">
                Total: ${totalCarrito.toLocaleString('es-CO')}
              </h3>
              <button 
                className="w-full bg-indigo-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                onClick={() => enviarPedido(carrito)}
              >
                Enviar Pedido por WhatsApp
              </button>
            </div>
          ) : (
            <h3 className="mt-10 text-center text-xl font-bold text-slate-500">
               CARRITO VACÍO. AGRÉGALE ALGO.
            </h3>
          )}

          {/* BOTÓN VOLVER AL CATÁLOGO */}
          <button 
            className="mt-4 w-full bg-white text-slate-600 font-bold py-4 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            onClick={() => setVistaCatalogo(true)}
          >
            Volver Al Catálogo
          </button>
        </div>
      )}

    </div>
  );
}

export default App;