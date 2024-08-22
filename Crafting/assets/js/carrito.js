let cartItems = [];

// Función para agregar un producto al carrito
function addToCart(product) {
    console.log('Añadiendo producto al carrito:', product); // Depuración

    // Verificar si el producto ya está en el carrito
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++; // Incrementar la cantidad si ya existe
    } else {
        cartItems.push({ ...product, quantity: 1 }); // Agregar nuevo producto al carrito
    }

    // Guardar el carrito en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Carrito actualizado en localStorage:', cartItems); // Depuración

    // Actualizar la visualización del carrito
    showCart();
}

// Función para mostrar el carrito
function showCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) {
        console.log('No se encontró el contenedor del carrito');
        return;
    }

    cartContainer.innerHTML = ''; // Limpiar contenido anterior del carrito

    // Iterar sobre los productos en el carrito y mostrar cada uno
    cartItems.forEach(item => {
        const productCard = document.createElement('div');
        productCard.classList.add('card', 'mb-3'); // Clases para diseño responsivo y margen

        // Estructura de la tarjeta utilizando Bootstrap
        productCard.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text"><small class="text-muted">Cantidad: ${item.quantity}</small></p>
                        <button class="btn btn-danger remove-from-cart" data-product-id="${item.id}" style="background-color:#A250E2;">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        cartContainer.appendChild(productCard);
    });

    // Agregar los botones de finalizar compra y vaciar carrito si hay items en el carrito
    if (cartItems.length > 0) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'botonesCarrito';
        buttonsContainer.classList.add('mt-3');
        buttonsContainer.innerHTML = `
            <button class="btn" type="button" id="botonFinalizar" style="background-color:#A250E2;">Finalizar compra</button>
            <button class="btn" type="button" id="botonVaciar" style="background-color:#A250E2;">Vaciar carrito</button>
        `;
        cartContainer.appendChild(buttonsContainer);

        // Añadir event listeners a los botones
        document.getElementById('botonFinalizar').addEventListener('click', finalizePurchase);
        document.getElementById('botonVaciar').addEventListener('click', clearCart);
    }

    // Event listener para los botones de eliminar producto
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    console.log('Eliminando producto del carrito:', productId); // Depuración

    // Filtrar el producto que se desea eliminar
    cartItems = cartItems.filter(item => item.id !== productId);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Carrito actualizado después de eliminar producto:', cartItems); // Depuración

    // Actualizar la visualización del carrito
    showCart();
}




function sendEmail() {
    const cartDetails = cartItems.map(item => 
        `${item.title} - ${item.description} - Cantidad: ${item.quantity}-Precio: $$$$$`
    ).join('\n');


    emailjs.send('sofisosa', 'template_kibmzst', {
        cart_details: cartDetails,
        user_email: 'craftingcreaideas@gmail.com' // Reemplaza con el correo del usuario
    }).then((response) => {
        console.log('Correo electrónico enviado exitosamente:', response.status, response.text);
    }).catch((error) => {
        console.error('Error al enviar el correo electrónico:', error);
    });
}

// Función para vaciar el carrito
function clearCart() {
    cartItems = [];
    localStorage.removeItem('cartItems');
    showCart();
    const cartContainer = document.getElementById('cartItems');
    const productCard = document.createElement('div');
    productCard.classList.add('card', 'mb-3'); // Clases para diseño responsivo y margen

    // Estructura de la tarjeta utilizando Bootstrap
    productCard.innerHTML = `
    <div class="container" id="cartItems">  
    <div style="background-color: white;" >
<img src="assets/img/carritoVacio.png" alt="" width="100px" style="text-align: center;" id="cartVacio">
<h4 style="text-align: center;  font-family: Cutive;color: grey;">Su carrito está vacio</h4>
  </div>
    `;
    cartContainer.appendChild(productCard);
  
}
// Función para finalizar la compra
function finalizePurchase() {
    sendEmail();
    clearCart();
    Swal.fire({
        title: "¡Compra finalizada exitosamente!",
        icon: "success"
    });

    
}


// Cargar el carrito desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
        console.log('Carrito cargado desde localStorage:', cartItems); // Depuración
        showCart();
    }

    // Event listener para el botón de añadir al carrito en el catálogo
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: button.getAttribute('data-product-id'),
                title: button.getAttribute('data-product-title'),
                description: button.getAttribute('data-product-description'),
                image: button.getAttribute('data-product-image')
            };
            console.log('Producto añadido al carrito:', product); // Depuración
            addToCart(product);
        });
    });
});

