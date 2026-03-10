let todosLosProductos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

$(document).ready(function() {
    cargarProductos();
    actualizarCarritoUI();

    // Filtros por botón
    $('.btn-nintendo-filter').click(function() {
        $('.btn-nintendo-filter').removeClass('active');
        $(this).addClass('active');
        
        const cat = $(this).data('cat');
        const filtrados = cat === 'todos' ? todosLosProductos : todosLosProductos.filter(p => p.categoria === cat);
        renderizarProductos(filtrados);
    });

    // Buscador
    $('#buscador').on('keyup', function() {
        const busqueda = $(this).val().toLowerCase();
        const filtrados = todosLosProductos.filter(p => p.nombre.toLowerCase().includes(busqueda));
        renderizarProductos(filtrados);
    });

    // Vaciar Carrito
    $('#vaciar-carrito').click(() => {
        carrito = [];
        actualizarCarritoUI();
    });
});

async function cargarProductos() {
    try {
        const res = await fetch('assets/js/productos.json');
        todosLosProductos = await res.json();
        renderizarProductos(todosLosProductos);
    } catch (e) { console.error("Error cargando JSON", e); }
}

function renderizarProductos(productos) {
    const container = $('#contenedor-productos').empty();
    
    productos.forEach(p => {
        container.append(`
            <div class="col">
                <div class="card card-producto h-100 shadow-sm">
                    <div class="img-container">
                        <img src="${p.img}" alt="${p.nombre}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-light text-dark align-self-start mb-2">${p.categoria}</span>
                        <h6 class="card-title fw-bold text-dark">${p.nombre}</h6>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="h5 mb-0 text-danger fw-bold">$${p.precio.toLocaleString()}</span>
                            <button class="btn btn-add-cart" onclick="agregarAlCarrito(${p.id})">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function agregarAlCarrito(id) {
    const item = todosLosProductos.find(p => p.id === id);
    carrito.push(item);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const lista = $('#lista-carrito').empty();
    let total = 0;

    carrito.forEach((p, index) => {
        total += p.precio;
        lista.append(`<li class="list-group-item d-flex justify-content-between">${p.nombre} <b>$${p.precio.toLocaleString()}</b></li>`);
    });

    $('#contador-carrito').text(carrito.length);
    $('#total-precio').text(total.toLocaleString());
    localStorage.setItem('carrito', JSON.stringify(carrito));
}