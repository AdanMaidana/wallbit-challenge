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
      text: message,  
      duration: 3000,                         
      close: false,                             
      gravity: "bottom",                      
      position: "right",                      
      backgroundColor: type === 'empty' ? '#ef4444' : 'linear-gradient(to right, #ef4444, #FDBA74)',

    }).showToast();  // Esto mostrará el toast
  };

  //Cargar fecha del carrito en el localstorage al iniciar
  useEffect(() => {
    const storedDate = localStorage.getItem('cart-date');
    if (storedDate) {
      setCartDate(storedDate);
    }
  }, []);

  const handleIncrement = (product) => {
    const productExists = allProducts.some(p => p.id === product.id);

    if (productExists) {
      // Si el producto ya existe, incrementamos la cantidad en 1
      const updatedProducts = allProducts.map(p =>
        p.id === product.id
          ? { ...p, quantity: p.quantity + 1 }  // Aumentamos la cantidad
          : p  // Si no es el producto que queremos, lo dejamos igual
      );

      // Actualizamos el estado con los productos modificados
      setAllProducts(updatedProducts);

      // Guardamos los productos actualizados en localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  }

  const handleReduce = (product) => {
    const updatedProducts = allProducts.map(p => {
      if (p.id === product.id) {
        // Si la cantidad es mayor que 1, la reducimos en 1
        if (p.quantity > 1) {
          return { ...p, quantity: p.quantity - 1 };
        } else {
          // Si la cantidad es 1, eliminamos el producto
          return null; // Marcamos para eliminar
        }
      }
      return p;
    }).filter(p => p !== null); // Eliminamos los productos con null (que son los que tienen cantidad 1)

    // Actualizamos el estado con los productos modificados
    setAllProducts(updatedProducts);

    // Guardamos los productos actualizados en localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };


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
    <section className="p-4 w-full bg-white mt-8 rounded-md shadow-xl border border-black">
      {
        allProducts.length > 0 ?
          (
            <>
              <div className="flex flex-col items-start sm:items-center justify-between p-4 gap-y-2 mb-2 border-b sm:flex-row">
                <p className="text-base md:text-xl">Tú carrito ({productQuantity}) - Iniciado el {cartDate}</p>

                <button onClick={handleEmptyCart} className="flex items-center bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-base rounded-full gap-x-1 md:gap-x-2 hover:bg-red-800  hover:scale-95 transition-all">Vaciar carrito
                  <svg className="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#fff" fill="none">
                    <path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6 6H8M22 6H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10.5 3L13.5 6M13.5 6L16.5 9M13.5 6L10.5 9M13.5 6L16.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="6" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="17" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 20L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>



              </div>

              <ul className="flex flex-col gap-y-2 sm:gap-y-0 max-h-[400px] overflow-y-auto">
                {allProducts.map((product) =>
                  <React.Fragment key={`product-${product.id}`}>
                    <li className="flex items-center justify-between gap-x-8 min-h-[170px] max-h-[170px] sm:min-h-[125px] sm:max-h-[125px] px-4 py-4">
                      <div className="min-w-24">
                        <img src={product.image} alt={product.title} className="max-w-20 max-h-20 mx-auto" />
                      </div>
                      <div className="w-full">
                        <p className="mb-2 font-semibold">{product.title}</p>
                        <div className="flex items-center">
                          <div className="flex gap-x-2 me-3">
                            <button onClick={() => handleIncrement(product)} className="hover:cursor-pointer">
                              <svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path> </g></svg>
                            </button>

                            <p className="inline-block text-sm text-[#0d99ff] font-semibold">{product.quantity}</p>
                            <button onClick={() => handleReduce(product)} className="hover:cursor-pointer">
                              <svg width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>minus-circle</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-516.000000, -1087.000000)" fill="#000000"> <path d="M532,1117 C524.268,1117 518,1110.73 518,1103 C518,1095.27 524.268,1089 532,1089 C539.732,1089 546,1095.27 546,1103 C546,1110.73 539.732,1117 532,1117 L532,1117 Z M532,1087 C523.163,1087 516,1094.16 516,1103 C516,1111.84 523.163,1119 532,1119 C540.837,1119 548,1111.84 548,1103 C548,1094.16 540.837,1087 532,1087 L532,1087 Z M538,1102 L526,1102 C525.447,1102 525,1102.45 525,1103 C525,1103.55 525.447,1104 526,1104 L538,1104 C538.553,1104 539,1103.55 539,1103 C539,1102.45 538.553,1102 538,1102 L538,1102 Z" id="minus-circle" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>
                            </button>

                          </div>
                          <p className="inline-block text-sm text-gray-500 me-3"><span className="text-xs">@</span>${product.price}</p>
                          <p className="inline-block text-sm text-gray-700 font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
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
                    
                  </React.Fragment>
                )}
              </ul>
              <div className="px-4 pt-4 flex gap-x-4 justify-end text-end border-t">
                <p>Precio Total: <span className="text-xl font-bold ms-1 text-yellow-400">${totalPrice}</span></p>
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

    </section>
  )
}
