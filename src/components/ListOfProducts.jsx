import React, { useEffect, useState } from "react";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export default function ListOfProducts({ allProducts, setAllProducts }) {
  const [cartDate, setCartDate] = useState("");

  const totalPrice = allProducts.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0).toFixed(2);

  const productQuantity = allProducts.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const getCurrentDate = () =>
    new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const showToast = (message, type) => {
    Toastify({
      text: message,  // Mensaje del toast
      duration: 3000,                          // Duración del toast en milisegundos
      close: false,                             // Habilitar el botón de cerrar
      gravity: "bottom",                          // Posición en la pantalla (top/bottom)
      position: "right",                       // Posición en la pantalla (left/right)
      backgroundColor: type === 'empty' ? '#ef4444' : 'linear-gradient(to right, #ef4444, #FDBA74)',
      textColor: "black" , // Color de fondo
    }).showToast();  // Esto mostrará el toast
  };

  //Cargar fecha del carrito en el localstorage al iniciar
  useEffect(() => {
    const storedDate = localStorage.getItem('cart-date');
    if (storedDate) {
      setCartDate(storedDate);
    }
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && !cartDate) {
      const date = getCurrentDate();
      setCartDate(date);
      localStorage.setItem('cart-date', date);
    }
    else if (allProducts.length === 0 && cartDate) {
      setCartDate("");
      localStorage.removeItem('cart-date');
    }
  }, [allProducts, cartDate])

  const deleteProduct = (product) => {
    const updatedProducts = allProducts.filter(item => item.title !== product.title);
    setAllProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    showToast('Producto eliminado', 'delete');
  }

  const handleEmptyCart = () => {
    setAllProducts([]);
    localStorage.removeItem("products");
    showToast('Carrito vaciado', 'empty')
  }



  return (
    <section className="p-4 min-w-[445px] bg-white overflow-auto mt-8 rounded-md shadow-md shadow-zinc-800 border border-black">
      {
        allProducts.length > 0 ?
          (
            <>
              <div className="flex items-center justify-between p-4">
                <p className="text-xl">Tú carrito ({productQuantity}) - Iniciado el {cartDate}</p>

                <button onClick={handleEmptyCart} className="flex bg-red-500 text-white px-4 py-2 rounded-full gap-x-1 hover:bg-red-800  hover:scale-95 transition-all">Vaciar carrito
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#fff" fill="none">
                    <path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M6 6H8M22 6H18.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M10.5 3L13.5 6M13.5 6L16.5 9M13.5 6L10.5 9M13.5 6L16.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <circle cx="6" cy="20" r="2" stroke="currentColor" stroke-width="1.5" />
                    <circle cx="17" cy="20" r="2" stroke="currentColor" stroke-width="1.5" />
                    <path d="M8 20L15 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </button>



              </div>

              <ul className="flex flex-col gap-y-4 max-h-[400px] overflow-y-auto">
                {allProducts.map((product) =>
                  <React.Fragment key={`product-${product.id}`}>
                    <li className="flex items-center justify-between gap-x-8 min-h-[100px] max-h-[100px] px-4 py-4">
                      <div className="min-w-24 hover:cursor-pointer group" title="Ver detalles del producto">
                        <img src={product.image} alt={product.title} className="max-w-20 max-h-20 rounded-md mx-auto group-hover:scale-125 transition-transform" />
                      </div>
                      <div className="w-full">
                        <p className="mb-1 font-semibold">{product.title}</p>
                        <p className="inline-block text-sm text-[#0d99ff] me-3 font-semibold">{product.quantity}x</p>
                        <p className="inline-block text-sm text-gray-500 me-3"><span className="text-xs">@</span>${product.price}</p>
                        <p className="inline-block text-sm text-gray-700 font-semibold">${product.price * product.quantity}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => deleteProduct(product)}
                          className="float-end border border-slate-400 rounded-full p-1 group hover:bg-red-500  hover:border-red-500 transition-colors">
                          <svg
                            className="fill-slate-400 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"></path></svg>
                        </button>
                      </div>
                    </li>
                    <hr className="w-[calc(100%-2rem)] mx-auto" />
                  </React.Fragment>
                )}
              </ul>
              <div className="px-4 pt-4 flex gap-x-4 justify-end">
                <p>Precio Total: <span className="text-2xl font-bold ms-1 text-yellow-400">${totalPrice}</span></p>
              </div>
            </>
          ) : (
            <>
              <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" color="#000000" fill="none">
                <path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6 6H8.5M22 6H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M11 8.5C11.4915 9.0057 12.7998 11 13.5 11M16 8.5C15.5085 9.0057 14.2002 11 13.5 11M13.5 11V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="6" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 20L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-center text-sm pt-2 text-[#008080]">Tú carrito esta vacio, intenta agregar algun producto!</p>
            </>
          )}

          <dialog></dialog>
    </section>
  )
}
