/* ==========================================
LUNABELLE - PRE-ENTREGA 08
Sincronización de DOM y LocalStorage
========================================== */

/* ==========================================

1. ARRAY DE LIBROS
   ========================================== */

const libros = [
{
    id: 1,
    titulo: "Harry Potter y la piedra filosofal",
    autor: "J.K. Rowling",
    genero: "Fantasía",
    precio: 33000,
    stock: 10
},

{
    id: 2,
    titulo: "Bridgerton: El vizconde que me amó",
    autor: "Julia Quinn",
    genero: "Romance",
    precio: 25000,
    stock: 8
},

{
    id: 3,
    titulo: "Saga Off Campus",
    autor: "Elle Kennedy",
    genero: "Romance",
    precio: 30000,
    stock: 3
},

{
    id: 4,
    titulo: "Crepúsculo",
    autor: "Stephenie Meyer",
    genero: "Fantasía",
    precio: 28000,
    stock: 5
},

{
    id: 5,
    titulo: "Las crónicas de Narnia",
    autor: "C.S. Lewis",
    genero: "Fantasía",
    precio: 32000,
    stock: 7
}
];

/* ==========================================
2. RECUPERAR CARRITO
========================================== */

const datosGuardados =
localStorage.getItem("carritoLunaBelle") ?? "[]";

let carrito = JSON.parse(datosGuardados);

/* ==========================================
3. ELEMENTOS DEL DOM
========================================== */

const listaLibros =
document.querySelector("#listaLibros");

const listaCarrito =
document.querySelector("#listaCarrito");

const contadorCarrito =
document.querySelector("#contadorCarrito");

const totalCarrito =
document.querySelector("#totalCarrito");

const vaciarCarrito =
document.querySelector("#vaciarCarrito");

const mensaje =
document.querySelector("#mensaje");

/* ==========================================
4. FORMATEAR PRECIOS
========================================== */

const formatearPrecio = (precio) => {
return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});
};

/* ==========================================
5. GUARDAR CARRITO
========================================== */

function guardarCarrito() {
localStorage.setItem(
    "carritoLunaBelle",
    JSON.stringify(carrito)
);
}

/* ==========================================
6. BORRAR CARRITO
========================================== */

function borrarCarritoStorage() {
localStorage.removeItem("carritoLunaBelle");
}

/* ==========================================
7. MOSTRAR MENSAJE
========================================== */

function mostrarMensaje(texto) {
mensaje.textContent = texto;

setTimeout(() => {

    mensaje.textContent = "";

}, 2000);
}

/* ==========================================
8. RENDERIZAR CATÁLOGO
========================================== */

function renderizarLibros() {
listaLibros.innerHTML = "";
libros.forEach((libro) => {
    const {
        id,
        titulo,
        autor,
        genero,
        precio,
        stock
    } = libro;

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add("libro");

    const disponibilidad =
        stock > 0
            ? "Disponible"
            : "Sin stock";


    tarjeta.innerHTML = `

        <h3>${titulo}</h3>

        <p>
            <strong>Autor:</strong>
            ${autor}
        </p>

        <p>
            <strong>Género:</strong>
            ${genero}
        </p>

        <p class="precio">
            ${formatearPrecio(precio)}
        </p>

        <p class="stock">
            ${disponibilidad}
            (${stock} unidades)
        </p>

        <button
            class="btn-agregar"
            data-id="${id}"
            type="button"
            ${stock === 0 ? "disabled" : ""}
        >
            🛒 Agregar al carrito
        </button>

    `;

    listaLibros.appendChild(tarjeta);

});
}

/* ==========================================
9. AGREGAR LIBRO AL CARRITO
========================================== */

function agregarAlCarrito(id) {
const libro =
    libros.find(
        (libro) => libro.id === id
    );

if (!libro?.id) {

    mostrarMensaje(
        "No se encontró el libro."
    );

    return;
}


const libroExistente =
    carrito.find(
        (item) => item.id === id
    );


if (libroExistente) {

    mostrarMensaje(
        "Este libro ya está en tu carrito."
    );

    return;
}
const {
    id: libroId,
    titulo,
    autor,
    precio
} = libro;
carrito.push({

    id: libroId,
    titulo,
    autor,
    precio,
    cantidad: 1

});

guardarCarrito();
renderizarCarrito();
mostrarMensaje(
    `"${titulo}" fue agregado al carrito.`
);
}

/* ==========================================
10. MODIFICAR CANTIDAD
========================================== */

function modificarCarrito(id, nuevaCantidad) {
const libro =
    carrito.find(
        (item) => item.id === id
    );


if (!libro) {

    mostrarMensaje(
        "No se encontró el libro."
    );

    return;
}
const libroCatalogo =
    libros.find(
        (item) => item.id === id
    );


if (!libroCatalogo) {

    mostrarMensaje(
        "No se encontró el libro en el catálogo."
    );

    return;
}


if (nuevaCantidad > libroCatalogo.stock) {

    mostrarMensaje(
        `Solo hay ${libroCatalogo.stock} unidades disponibles.`
    );

    return;
}


if (nuevaCantidad <= 0) {

    eliminarDelCarrito(id);

    return;
}


libro.cantidad = nuevaCantidad;

guardarCarrito();

renderizarCarrito();


mostrarMensaje(
    `"${libro.titulo}" ahora tiene ${nuevaCantidad} unidad(es).`
);
}

/* ==========================================
11. ELIMINAR DEL CARRITO
========================================== */

function eliminarDelCarrito(id) {
const libroEliminado =
    carrito.find(
        (libro) => libro.id === id
    );
carrito =
    carrito.filter(
        (libro) => libro.id !== id
    );

if (carrito.length === 0) {

    borrarCarritoStorage();

} else {

    guardarCarrito();

}
renderizarCarrito();
mostrarMensaje(
    `"${libroEliminado?.titulo ?? "Libro"}" fue eliminado.`
);
}

/* ==========================================
12. RENDERIZAR CARRITO
========================================== */

function renderizarCarrito() {
listaCarrito.innerHTML = "";
if (carrito.length === 0) {

    listaCarrito.innerHTML = `

        <p class="carrito-vacio">
            🛒 Tu carrito está vacío.
        </p>

    `;

} else {

    carrito.forEach((libro) => {
        const {
            id,
            titulo,
            autor,
            precio,
            cantidad = 1
        } = libro;


        const item =
            document.createElement("div");


        item.classList.add(
            "item-carrito"
        );


        item.innerHTML = `

            <div class="item-info">

                <h3>${titulo}</h3>

                <p>
                    Autor: ${autor}
                </p>

                <p>
                    Precio:
                    <strong>
                        ${formatearPrecio(precio)}
                    </strong>
                </p>

                <div class="control-cantidad">

                    <span>Cantidad:</span>

                    <button
                        class="btn-cantidad btn-restar"
                        data-id="${id}"
                        type="button"
                    >
                        ➖
                    </button>

                    <strong class="cantidad">
                        ${cantidad}
                    </strong>

                    <button
                        class="btn-cantidad btn-sumar"
                        data-id="${id}"
                        type="button"
                    >
                        ➕
                    </button>

                </div>

            </div>

            <button
                class="btn-eliminar"
                data-id="${id}"
                type="button"
            >
                🗑️ Eliminar
            </button>

        `;


        listaCarrito.appendChild(item);

    });

}

/* ==========================================
   CONTADOR DEL CARRITO
   ========================================== */

const cantidadTotal =
    carrito.reduce(
        (acumulador, libro) =>
            acumulador + (libro.cantidad ?? 1),
        0
    );

contadorCarrito.textContent =
    cantidadTotal === 1
        ? "1 libro"
        : `${cantidadTotal} libros`;


/* ==========================================
   CALCULAR TOTAL
   ========================================== */

const total =
    carrito.reduce(
        (acumulador, libro) =>
            acumulador +
            (
                libro.precio *
                (libro.cantidad ?? 1)
            ),
        0
    );


totalCarrito.textContent =
    formatearPrecio(total);
}

/* ==========================================
13. EVENTO PARA AGREGAR LIBROS
========================================== */

listaLibros.addEventListener(
"click",
(event) => {
    if (
        event.target.classList.contains(
            "btn-agregar"
        )
    ) {

        const id =
            Number(
                event.target.dataset.id
            );

        agregarAlCarrito(id);

    }

}
);

/* ==========================================
14. EVENTOS DEL CARRITO
========================================== */

listaCarrito.addEventListener(
"click",
(event) => {
    const boton =
        event.target.closest("button");


    if (!boton) return;


    const id =
        Number(boton.dataset.id);


    if (!id) return;
    /* ELIMINAR */

    if (
        boton.classList.contains(
            "btn-eliminar"
        )
    ) {

        eliminarDelCarrito(id);

        return;
    }


    const libro =
        carrito.find(
            (item) => item.id === id
        );


    if (!libro) return;


    /* SUMAR */

    if (
        boton.classList.contains(
            "btn-sumar"
        )
    ) {

        modificarCarrito(
            id,
            (libro.cantidad ?? 1) + 1
        );

        return;
    }


    /* RESTAR */

    if (
        boton.classList.contains(
            "btn-restar"
        )
    ) {

        modificarCarrito(
            id,
            (libro.cantidad ?? 1) - 1
        );

    }

}
);

/* ==========================================
15. VACIAR CARRITO
========================================== */

vaciarCarrito.addEventListener(
"click",
() => {

    if (carrito.length === 0) {

        mostrarMensaje(
            "El carrito ya está vacío."
        );

        return;
    }


    carrito = [];

    borrarCarritoStorage();
    renderizarCarrito();


    mostrarMensaje(
        "El carrito fue vaciado."
    );

}
);

/* ==========================================
16. RENDERIZADO INICIAL
========================================== */
renderizarLibros();

renderizarCarrito();