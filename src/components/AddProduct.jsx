import { useState, useEffect } from "react";
import ListOfProducts from "./ListOfProducts";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export default function AddProduct() {
  const [allProducts, setAllProducts] = useState([]);

  // Cargar productos del localStorage al iniciar
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (storedProducts) {
      setAllProducts(storedProducts);
    }
  }, []);

  const showToast = (message, type) => {
    Toastify({
      text: message,  
      duration: 3000,                         
      close: false,                             
      gravity: "bottom",                          
      position: "right",                       
      backgroundColor: type === 'add' ? '#3b82f6' : 'linear-gradient(to left, #3b82f6, #123e87)',
      textColor: "black",   
    }).showToast();  
  };

  const handleProduct = (e) => {
    //Prevenimos la recarga de la página
    e.preventDefault();

    //Capturamos los datos del form
    const formData = new FormData(e.target);
    const productQuantity = parseInt(formData.get("product-quantity"));
    const productId = parseInt(formData.get("product-id"));

    //Llamamos a la api con el id del producto que el usuario seleccionó
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => res.json())
      //Guardamos el producto
      .then(json => {
        const productExists = allProducts.some(product => product.id === json.id);

        if (!productExists) {
          const newProducts = [...allProducts, { ...json, quantity: productQuantity || 1 }];
          setAllProducts(newProducts);

          // Guardamos los productos actualizados en localStorage
          localStorage.setItem('products', JSON.stringify(newProducts));

          showToast('Producto agregado al carrito', 'add');
        } else if (productExists) {
          // Incrementar cantidad si el producto ya existe
          const updatedProducts = allProducts.map(product =>
            product.id === json.id
              ? { ...product, quantity: product.quantity + (productQuantity || 1) }
              : product
          );
          setAllProducts(updatedProducts);

          // Guardamos los productos actualizados en localStorage
          localStorage.setItem('products', JSON.stringify(updatedProducts));
          showToast('Producto actualizado', 'update');
        }
      })
    e.target.reset();  // Esto limpia todos los campos del formulario
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-x-4 gap-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#964B00]">Tienda - El Topo </h1>
        <svg className="h-[70px] w-[70px] sm:h-[100px] sm:w-[100px] lg:h-[115px] lg:w-[115px]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 512 512" xmlSpace="preserve">
          <circle
            style={{ fill: "#7C665D" }}
            cx="256"
            cy="227.556"
            r="227.556"
          />

          <g>
            <path
              style={{ fill: "#6E5550" }}
              d="M155.937,284.85c-22.538-15.095-76.876-45.066-124.647-21.39   c11.77,74.236,59.431,136.517,124.647,168.51V284.85z"
            />
            <path
              style={{ fill: "#6E5550" }}
              d="M356.064,284.849v147.12c65.215-31.993,112.876-94.273,124.646-168.509   C432.939,239.785,378.602,269.754,356.064,284.849z"
            />

          </g>
          <path style={{ fill: "#957863" }}
            d="M494.764,401.064c-36.423-42.498-89.268-58.822-116.97-64.729c-0.155-3.844-0.487-7.641-0.989-11.386  c21.368,0.146,73.204,2.783,107.626,23.361c1.301,0.778,2.738,1.151,4.159,1.151c2.762,0,5.46-1.413,6.984-3.96  c2.302-3.849,1.047-8.841-2.81-11.143c-40.2-24.044-98.947-25.862-119.295-25.699c-14.282-51.458-61.461-89.23-117.468-89.23  s-103.186,37.772-117.469,89.23c-20.348-0.164-79.095,1.655-119.295,25.699c-3.857,2.302-5.111,7.294-2.81,11.143  c1.524,2.548,4.222,3.96,6.984,3.96c1.42,0,2.858-0.373,4.159-1.151c34.422-20.579,86.259-23.215,107.626-23.361  c-0.503,3.745-0.834,7.542-0.989,11.386c-27.702,5.907-80.547,22.231-116.97,64.729c-2.929,3.405-2.532,8.531,0.881,11.452  c1.532,1.318,3.412,1.961,5.286,1.961c2.286,0,4.563-0.96,6.166-2.841c31.719-36.995,78.613-52.514,104.924-58.61  c0.292,4.472,0.746,9.054,1.363,13.716c-24.153,11.038-61.553,33.79-86.914,76.06c-2.309,3.849-1.064,8.841,2.786,11.151  c1.309,0.785,2.754,1.159,4.174,1.159c2.762,0,5.452-1.405,6.976-3.945c21.675-36.122,53.735-56.862,75.843-67.657  C151.523,444.825,190.862,512,256,512s104.477-67.175,117.278-128.491c22.109,10.795,54.169,31.535,75.843,67.657  c1.524,2.54,4.214,3.945,6.976,3.945c1.42,0,2.865-0.373,4.174-1.159c3.849-2.309,5.096-7.302,2.786-11.151  c-25.361-42.27-62.761-65.022-86.914-76.06c0.618-4.661,1.072-9.243,1.363-13.716c26.311,6.096,73.205,21.615,104.924,58.61  c1.603,1.881,3.881,2.841,6.166,2.841c1.873,0,3.754-0.643,5.286-1.961C497.297,409.595,497.693,404.468,494.764,401.064z" />
          <ellipse style={{ fill: "#C09682" }}
            cx="256" cy="402.286" rx="65.016" ry="93.46" />
          <path style={{ fill: "#EBB4A0" }}
            d="M255.998,425.156c20.317,0,41.989-24.031,56.889,0s-17.26,70.589-56.889,70.589  s-71.788-46.557-56.888-70.589C214.009,401.125,235.681,425.156,255.998,425.156z" />
          <g>
            <circle style={{ fill: "#464655" }} cx="85.334" cy="260.064" r="16.254" />
            <circle style={{ fill: "#464655" }} cx="426.667" cy="260.064" r="16.254" />
          </g>
        </svg>
      </div>

      <form onSubmit={handleProduct} className="bg-white mx-auto mt-8 p-4 border border-zinc-400 shadow-lg w-full max-w-[345px] sm:max-w-[530px] text-center rounded-md">
        <p className="mb-4 text-left">Agrega los productos al carro de compra</p>

        <div className="flex items-center flex-wrap gap-y-6 gap-x-6 justify-center">

          <div className="relative w-full sm:w-[100px]">
            <input
              name="product-quantity"
              type="number"
              required
              min="1"
              max="99"
              className="block w-full rounded-md px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 border border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="product-quantity" className="pointer-events-none absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Cantidad</label>
          </div>

          <div className="relative w-full sm:w-[150px]">
            <input
              type="number"
              name="product-id"
              required
              min="1"
              max="20"
              className="block w-full rounded-md px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 border border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="product-id" className="pointer-events-none absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">ID del producto</label>
          </div>

          <button className="flex bg-blue-500 text-white px-4 py-2 gap-x-1 rounded-full hover:bg-blue-800  hover:scale-95 transition-all">Agregar producto
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
              <path d="M8 16H15.2632C19.7508 16 20.4333 13.1808 21.261 9.06904C21.4998 7.88308 21.6192 7.2901 21.3321 6.89503C21.1034 6.58036 20.7077 6.51633 20 6.5033" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 6.5H17M13 10.5V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 16L5.37873 3.51493C5.15615 2.62459 4.35618 2 3.43845 2H2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8.88 16H8.46857C7.10522 16 6 17.1513 6 18.5714C6 18.8081 6.1842 19 6.41143 19H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10.5" cy="20.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="17.5" cy="20.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

      </form>

      <ListOfProducts allProducts={allProducts} setAllProducts={setAllProducts} />
    </>
  )
}
